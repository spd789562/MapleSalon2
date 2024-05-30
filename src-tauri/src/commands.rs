use crate::{models, utils, AppStore, Error, Result};
use serde_json::to_string;
use tauri::{command, AppHandle, Runtime, State, Window};
use wz_reader::{util::node_util, version::WzMapleVersion};

#[command]
pub(crate) async fn get_server_url<R: Runtime>(
    _app: AppHandle<R>,
    _window: Window<R>,
    state: State<'_, AppStore>,
) -> Result<String> {
    Ok(format!("http://localhost:{}", state.port))
}

#[command]
pub(crate) async fn init<R: Runtime>(
    _app: AppHandle<R>,
    _window: Window<R>,
    state: State<'_, AppStore>,
    path: String,
    version: Option<String>,
) -> Result<()> {
    let version = version.map(|s| match s.as_str() {
        "GMS" => WzMapleVersion::GMS,
        "EMS" => WzMapleVersion::EMS,
        "BMS" => WzMapleVersion::BMS,
        _ => WzMapleVersion::UNKNOWN,
    });

    let base_node = utils::resolve_base(&path, version)
        .await
        .map_err(|_| crate::Error::InitWzFailed)?;

    state.replace_root(&base_node);

    Ok(())
}

#[command]
pub(crate) async fn parse_node<R: Runtime>(
    _app: AppHandle<R>,
    _window: Window<R>,
    state: State<'_, AppStore>,
    path: String,
) -> Result<()> {
    let node_read = state.node.read().unwrap();

    let _ = node_read
        .at_path(&path)
        .map(|n| node_util::parse_node(&n))
        .ok_or(Error::NodeNotFound)?;

    Ok(())
}

#[command]
pub(crate) async fn unparse_node<R: Runtime>(
    _app: AppHandle<R>,
    _window: Window<R>,
    state: State<'_, AppStore>,
    path: String,
) -> Result<()> {
    let node = state.node.read().unwrap();

    node.at_path(&path)
        .map(|n| n.write().unwrap().unparse())
        .ok_or(Error::NodeNotFound)?;

    Ok(())
}

#[command]
pub(crate) async fn get_node_info<R: Runtime>(
    _app: AppHandle<R>,
    _window: Window<R>,
    state: State<'_, AppStore>,
    path: String,
) -> Result<models::NodeInfo> {
    let node = if path.is_empty() {
        state.node.clone()
    } else {
        state
            .node
            .read()
            .unwrap()
            .at_path(&path)
            .ok_or(Error::NodeNotFound)?
    };

    let node_read = node.read().unwrap();

    Ok(models::NodeInfo {
        name: node_read.name.to_string(),
        _type: to_string(&node_read.object_type)?,
        has_child: !node_read.children.is_empty(),
    })
}

#[command]
pub(crate) async fn get_childs_info<R: Runtime>(
    _app: AppHandle<R>,
    _window: Window<R>,
    state: State<'_, AppStore>,
    path: String,
) -> Result<Vec<models::NodeInfo>> {
    let node = if path.is_empty() {
        state.node.clone()
    } else {
        state
            .node
            .read()
            .unwrap()
            .at_path(&path)
            .ok_or(Error::NodeNotFound)?
    };

    let node_read = node.read().unwrap();

    Ok(node_read
        .children
        .values()
        .map(|node| {
            let node_read = node.read().unwrap();
            models::NodeInfo {
                name: node_read.name.to_string(),
                _type: to_string(&node_read.object_type).unwrap(),
                has_child: !node_read.children.is_empty(),
            }
        })
        .collect())
}
