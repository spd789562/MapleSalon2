use std::collections::HashMap;
use wz_reader::{property::resolve_string_from_node, util::node_util, WzNodeArc, WzNodeCast};

use super::mount_skill_id::MOUNT_SKILL_ID_MAP;
use super::path::{MOUNT_PATH, MOUNT_SKILL_PATH, MOUNT_STRING_PATH, SKILL_STRING_PATH};

use crate::{Error, Result};

fn resolve_mount_id_map(root: &WzNodeArc) -> HashMap<String, String> {
    let mut mount_id_map = HashMap::from_iter(
        MOUNT_SKILL_ID_MAP
            .iter()
            .map(|(k, v)| (k.to_string(), v.to_string())),
    );

    let root_read = root.read().unwrap();
    let mount_mapping = root_read.at_path(MOUNT_SKILL_PATH);

    if mount_mapping.is_none() {
        return mount_id_map;
    }
    let mount_mapping = mount_mapping.unwrap();

    let _ = node_util::parse_node(&mount_mapping);

    for (skill_id, node) in mount_mapping.read().unwrap().children.iter() {
        let vehicle_id = node.read().unwrap().at("vehicleID");
        if vehicle_id.is_none() {
            continue;
        }
        let vehicle_id = vehicle_id.unwrap();
        let read = vehicle_id.read().unwrap();
        if let Some(id) = read.try_as_int() {
            let id = id.to_string();
            mount_id_map.insert(id, skill_id.to_string());
        } else if let Some(id) = read.try_as_string() {
            let string = id.get_string().ok();
            if let Some(string) = string {
                mount_id_map.insert(string, skill_id.to_string());
            }
        }
    }

    mount_id_map
}

pub fn resolve_mount_string(root: &WzNodeArc) -> Result<Vec<(String, String)>> {
    let skill_id_map = resolve_mount_id_map(root);

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
