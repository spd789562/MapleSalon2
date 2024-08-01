use futures::future::{BoxFuture, FutureExt};
use std::path::Path;
use std::sync::Arc;
use tokio::fs::{self, DirEntry};

use wz_reader::{version::WzMapleVersion, SharedWzMutableKey, WzNode, WzNodeArc, WzNodeCast};

use super::{block_parse, block_parse_with_parent};
use crate::{Error, Result};

pub async fn get_root_wz_file_path(dir: &DirEntry) -> Option<String> {
    let dir_name = dir.file_name();
    let mut inner_wz_name = dir_name.to_str().unwrap().to_string();
    inner_wz_name.push_str(".wz");
    let inner_wz_path = dir.path().join(inner_wz_name);

    if fs::try_exists(&inner_wz_path).await.unwrap() {
        return Some(inner_wz_path.to_str().unwrap().to_string());
    }

    None
}

pub fn resolve_root_wz_file_dir<'a>(
    dir: String,
    version: Option<WzMapleVersion>,
    patch_version: Option<i32>,
    parent: Option<WzNodeArc>,
    default_keys: Option<SharedWzMutableKey>,
) -> BoxFuture<'a, Result<WzNodeArc>> {
    async move {
        let root_node: WzNodeArc = WzNode::from_wz_file_full(
            &dir,
            version,
            patch_version,
            parent.as_ref(),
            default_keys.as_ref(),
        )?
        .into();
        let wz_dir = Path::new(&dir).parent().unwrap();

        block_parse(&root_node).await?;

        {
            let mut entries = fs::read_dir(wz_dir).await?;

            while let Some(entry) = entries.next_entry().await? {
                let file_type = entry.file_type().await?;
                let name = entry.file_name();

                let target_node = {
                    let root_node = root_node.read().unwrap();
                    root_node.at(name.to_str().unwrap())
                };

                if file_type.is_dir() && target_node.is_some() {
                    if let Some(file_path) = get_root_wz_file_path(&entry).await {
                        let dir_node = resolve_root_wz_file_dir(
                            file_path,
                            version,
                            patch_version,
                            Some(Arc::clone(&root_node)),
                            default_keys.clone(),
                        )
                        .await?;

                        /* replace the original one */
                        let mut root_node_write = root_node.write().unwrap();
                        root_node_write
                            .children
                            .insert(name.to_str().unwrap().into(), dir_node);
                    }
                } else if file_type.is_file() {
                    //  check is XXX_nnn.wz
                    let file_path = entry.path();
                    let file_name = file_path.file_stem().unwrap().to_str().unwrap();

                    let splited = file_name.split('_').collect::<Vec<&str>>();

                    if splited.len() < 2 {
                        continue;
                    }

                    if splited.last().unwrap().parse::<u16>().is_err() {
                        continue;
                    }

                    let node = WzNode::from_wz_file_full(
                        file_path.to_str().unwrap(),
                        version,
                        patch_version,
                        None,
                        default_keys.as_ref(),
                    )
                    .unwrap()
                    .into_lock();

                    if block_parse_with_parent(&node, &root_node).await.is_ok() {
                        let mut node_write = node.write().unwrap();
                        let mut root_node_write = root_node.write().unwrap();
                        root_node_write.children.reserve(node_write.children.len());
                        for (name, child) in node_write.children.drain() {
                            root_node_write.children.insert(name, child);
                        }
                    }
                }
            }
        }

        Ok(root_node)
    }
    .boxed()
}

pub async fn resolve_base(path: &str, version: Option<WzMapleVersion>) -> Result<WzNodeArc> {
    if !path.ends_with("Base.wz") {
        return Err(Error::Io(std::io::Error::new(
            std::io::ErrorKind::InvalidInput,
            "not a Base.wz",
        )));
    }

    let base_node = resolve_root_wz_file_dir(path.to_string(), version, None, None, None).await?;

    let (patch_version, keys) = {
        let node_read = base_node.read().unwrap();
        let file = node_read.try_as_file().unwrap();

        // reusing the keys from Base.wz
        (file.wz_file_meta.patch_version, file.reader.keys.clone())
    };

    {
        // let wz_root_path = Path::new(path).parent().unwrap().parent().unwrap();

        let first_parent = Path::new(path).parent().unwrap();

        let wz_root_path = if first_parent.file_stem().unwrap() == "Base" {
            first_parent.parent().unwrap()
        } else {
            first_parent
        };

        let mut entries = fs::read_dir(wz_root_path).await?;

        let mut set = tokio::task::JoinSet::new();

        while let Some(item) = entries.next_entry().await? {
            let path = item.path();
            let file_name = path.file_stem().unwrap();
            let is_wz_file = path
                .extension()
                .and_then(|ext| if ext == "wz" { Some(ext) } else { None })
                .is_some();
            let is_valid = path.is_dir() || is_wz_file;

            // let file_name = item.file_name();

            let has_dir = base_node
                .read()
                .unwrap()
                .at(file_name.to_str().unwrap())
                .is_some();

            if has_dir && is_valid {
                // let wz_path = get_root_wz_file_path(&item).await;
                let wz_path = if item.file_type().await?.is_dir() {
                    get_root_wz_file_path(&item).await
                } else {
                    Some(path.to_str().unwrap().to_string())
                };

                if let Some(file_path) = wz_path {
                    set.spawn(resolve_root_wz_file_dir(
                        file_path,
                        version,
                        Some(patch_version),
                        Some(Arc::clone(&base_node)),
                        Some(Arc::clone(&keys)),
                    ));
                }
            }
        }

        while let Some(result) = set.join_next().await {
            let node = result.unwrap()?;
            let name = {
                let node_read = node.read().unwrap();
                node_read.name.clone()
            };
            base_node.write().unwrap().children.insert(name, node);
        }
    }

    Ok(base_node)
}
