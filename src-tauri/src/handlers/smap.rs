use wz_reader::{property, WzNodeArc};

use super::path::SMAP_PATH;
use crate::{Error, Result};

pub fn get_smap(root: &WzNodeArc) -> Result<WzNodeArc> {
    let node = root.read().unwrap();

    let node = node.at(SMAP_PATH).ok_or(crate::Error::NodeNotFound)?;

    Ok(node)
}

pub fn resolve_smap(node: &WzNodeArc) -> Result<Vec<(String, String)>> {
    let node = node.read().unwrap();

    let mut result = Vec::with_capacity(node.children.len());

    for child in node.children.values() {
        let name = child.read().unwrap().name.to_string();
        let text = property::string::resolve_string_from_node(&child)
            .map_err(|_| Error::NodeTypeMismatch("string"))?;
        result.push((name, text));
    }

    Ok(result)
}
