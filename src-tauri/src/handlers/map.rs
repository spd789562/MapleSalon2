use super::path::{MAP_PATH, MAP_STRING_PATH};
use std::collections::HashMap;
use wz_reader::{property::resolve_string_from_node, util::node_util, WzNodeArc};

use crate::{Error, Result};

macro_rules! read_string_at_node {
    ($node:expr, $key:expr) => {
        $node
            .read()
            .unwrap()
            .at($key)
            .and_then(|string| resolve_string_from_node(&string).ok())
    };
}

pub fn resolve_map_id_map(root: &WzNodeArc) -> Result<HashMap<String, (String, String)>> {
    let root_read = root.read().unwrap();
    let map_string_node = root_read
        .at_path(MAP_STRING_PATH)
        .ok_or(Error::NodeNotFound)?;

    node_util::parse_node(&map_string_node)?;

    let empty_node_name = String::from("null");

    let mut result = HashMap::new();

    for folder_node in map_string_node.read().unwrap().children.values() {
        for (map_id, map_node) in folder_node.read().unwrap().children.iter() {
            let map_name =
                read_string_at_node!(map_node, "mapName").unwrap_or(empty_node_name.clone());
            let street_name =
                read_string_at_node!(map_node, "streetName").unwrap_or(empty_node_name.clone());
            result.insert(map_id.to_string(), (map_name, street_name));
        }
    }

    Ok(result)
}

pub fn resolve_map_string(root: &WzNodeArc) -> Result<Vec<(String, String, String)>> {
    // because the map structure is weird, not directly expose the id, need to collect the id first
    let id_map = resolve_map_id_map(root)?;

    let root_read = root.read().unwrap();
    let mut result = vec![];
    let folders_node = root_read.at_path(MAP_PATH).ok_or(Error::NodeNotFound)?;

    let empty_node_name = String::from("null");

    for (folder_name, folder_node) in folders_node.read().unwrap().children.iter() {
        // check it is Map0...Map9
        if !folder_name.starts_with("Map") && !folder_name.ends_with(".img") {
            continue;
        }
        for map_id_img in folder_node.read().unwrap().children.keys() {
            if !map_id_img.ends_with(".img") {
                continue;
            }
            let map_id = map_id_img.trim_end_matches(".img");
            let map_strings = id_map
                .get(map_id)
                .map(|(a, b)| (a.clone(), b.clone()))
                .unwrap_or((empty_node_name.clone(), empty_node_name.clone()));
            result.push((map_id.to_string(), map_strings.0, map_strings.1));
        }
    }

    result.sort_by(|a, b| a.0.cmp(&b.0));

    Ok(result)
}
