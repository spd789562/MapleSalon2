use tauri::async_runtime::spawn_blocking;
use wz_reader::{util::node_util::parse_node, WzNodeArc};

use crate::{Error, Result};

pub async fn block_parse(node: &WzNodeArc) -> Result<()> {
    let node = node.clone();

    spawn_blocking(move || parse_node(&node))
        .await
        .map_err(|_| Error::InitWzFailed)?
        .map_err(Error::from)
}

pub async fn block_parse_with_parent(node: &WzNodeArc, parent: &WzNodeArc) -> Result<()> {
    let node = node.clone();
    let parent = parent.clone();

    spawn_blocking(move || node.write().unwrap().parse(&parent))
        .await
        .map_err(|_| Error::InitWzFailed)?
        .map_err(Error::from)
}
