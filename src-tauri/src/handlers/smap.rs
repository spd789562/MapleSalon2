use wz_reader::{WzNodeArc, WzNodeCast};

use super::path::SMAP_PATH;
use crate::Result;

pub fn get_smap(root: &WzNodeArc) -> Result<WzNodeArc> {
    let node = root.read().unwrap();

    let node = node.at(SMAP_PATH).ok_or(crate::Error::NodeNotFound)?;

    Ok(node)
}

pub fn resolve_smap(node: &WzNodeArc) -> Result<Vec<(String, String)>> {
    let node = node.read().unwrap();

    let mut result = Vec::with_capacity(node.children.len());

    for child in node.children.values() {
        let child_read = child.read().unwrap();
        let name = child.read().unwrap().name.to_string();
        if let Some(string) = child_read.try_as_string() {
            let text = string.get_string()?;
            result.push((name, text));
        } else {
            result.push((name, String::new()));
        }
    }

    Ok(result)
}
