use std::collections::HashMap;
use wz_reader::{property::resolve_string_from_node, util::node_util, WzNodeArc, WzNodeCast};

use super::mount_skill_id::MOUNT_SKILL_ID_MAP;
use super::path::{MOUNT_PATH, MOUNT_STRING_PATH, SKILL_STRING_PATH};

use crate::{Error, Result};

pub fn resolve_mount_string(root: &WzNodeArc) -> Result<Vec<(String, String)>> {
    let skill_id_map = HashMap::from(MOUNT_SKILL_ID_MAP);

    let root_read = root.read().unwrap();
    let mut result = vec![];
    let mount_folders_node = root_read.at_path(MOUNT_PATH).ok_or(Error::NodeNotFound)?;
    let string_node = root_read
        .at_path(MOUNT_STRING_PATH)
        .ok_or(Error::NodeNotFound)?;
    let skill_string_node = root_read
        .at_path(SKILL_STRING_PATH)
        .ok_or(Error::NodeNotFound)?;
    let empty_node_name = String::from("null");

    node_util::parse_node(&skill_string_node)?;

    for mount_id_key in mount_folders_node
        .read()
        .unwrap()
        .children
        .keys()
        .filter(|key| !key.starts_with("0191") && !key.starts_with("0198") && key.ends_with(".img"))
    {
        let mount_id = mount_id_key
            .trim_start_matches('0')
            .trim_end_matches(".img");

        let mut name = empty_node_name.clone();

        if let Some(string) = string_node
            .read()
            .unwrap()
            .at(mount_id)
            .and_then(|string| string.read().unwrap().at("name"))
            .and_then(|string| resolve_string_from_node(&string).ok())
        {
            name = string;
        }

        if let Some(skill_id) = skill_id_map.get(mount_id) {
            if let Some(string) = skill_string_node
                .read()
                .unwrap()
                .at(skill_id)
                .and_then(|string| string.read().unwrap().at("name"))
                .and_then(|string| resolve_string_from_node(&string).ok())
            {
                name = string;
            }
        }

        result.push((mount_id.to_string(), name));
    }

    result.sort_by(|a, b| a.0.cmp(&b.0));

    Ok(result)
}
