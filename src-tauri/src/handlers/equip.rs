use std::collections::HashMap;
use wz_reader::{util::node_util, WzNodeArc, WzNodeCast};

use super::path::EQUIP_SET_EFFECT_PATH;

use crate::Result;

pub fn get_set_effect_map(root: &WzNodeArc) -> Result<HashMap<String, String>> {
    let mut set_effect_map = HashMap::new();
    let root_read = root.read().unwrap();
    let set_effect_node = root_read.at_path(EQUIP_SET_EFFECT_PATH);

    if set_effect_node.is_none() {
        return Ok(set_effect_map);
    }

    let set_effect_node = set_effect_node.unwrap();

    node_util::parse_node(&set_effect_node)?;

    for (set_id, node) in set_effect_node.read().unwrap().children.iter() {
        let mut id = String::new();
        // only resolve the set only contain one equip
        if let Some(info_node) = node.read().unwrap().at("info") {
            let info_read = info_node.read().unwrap();
            if info_read.children.len() != 1 {
                continue;
            }
            let set_node = info_read.children.values().next().unwrap().clone();
            let set_node_read = set_node.read().unwrap();
            if let Some(int_id) = set_node_read
                .at("0")
                .and_then(|node| node.read().unwrap().try_as_int().cloned())
            {
                id = int_id.to_string();
            }
        }

        if id.is_empty() {
            continue;
        }

        set_effect_map.insert(id, set_id.to_string());
    }

    Ok(set_effect_map)
}
