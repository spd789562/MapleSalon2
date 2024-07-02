use wz_reader::{node, WzNodeArc, WzNodeCast};

use super::path::ZMAP_PATH;
use crate::Result;

pub fn get_zmap(root: &WzNodeArc) -> Result<WzNodeArc> {
    let node = root.read().unwrap();

    let node = node.at(ZMAP_PATH).ok_or(crate::Error::NodeNotFound)?;

    Ok(node)
}

pub fn resolve_zmap(node: &WzNodeArc) -> Result<Vec<String>> {
    let node = node.read().unwrap();

    let image = node.try_as_image().ok_or(crate::Error::NodeNotFound)?;

    let child = image.resolve_children(None).map_err(node::Error::from)?;

    Ok(child.0.iter().map(|(name, _)| name.to_string()).collect())
}
