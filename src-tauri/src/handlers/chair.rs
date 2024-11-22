use wz_reader::{util::node_util, WzNodeArc, WzNodeCast};

use super::path::{
    CASH_CHAIR_PATH, CASH_CHAIR_STRING_PATH, CHAIR_PATH, CHAIR_STRING_OLD_PATH, CHAIR_STRING_PATH,
};

use crate::{Error, Result};

// chair item is a tuple of (id, parentFolder, name)
// type ChairStringItem = (String, String, String);

// different from equip, the chair is too many node need to use, so just use the root and grab the node we need
pub fn resolve_chair_string(root: &WzNodeArc) -> Result<Vec<(String, String, String)>> {
    let root_read = root.read().unwrap();
    let mut result = vec![];
    let chair_folders_node = root_read.at_path(CHAIR_PATH).ok_or(Error::NodeNotFound)?;

    let string_node = {
        let string_node = root_read.at_path(CHAIR_STRING_PATH);

        if let Some(string_node) = string_node {
            node_util::parse_node(&string_node)?;
            Some(string_node)
        } else {
            root_read.at_path_parsed(CHAIR_STRING_OLD_PATH).ok()
        }
    };

    let empty_node_name = String::from("null");

    // normal chair will first in 0301xx.img and 0302xx.img
    for (prefix_id, folder_node) in chair_folders_node.read().unwrap().children.iter() {
        if !(prefix_id.starts_with("0301") || prefix_id.starts_with("0302")) {
            continue;
        }
        let parent_folder = folder_node.read().unwrap().name.clone();
        node_util::parse_node(&folder_node)?;
        for id in folder_node.read().unwrap().children.keys() {
            let mut name = empty_node_name.clone();

            if let Some(string) = string_node
                .clone()
                .and_then(|string_node| string_node.read().unwrap().at(id.trim_start_matches('0')))
                .and_then(|string| string.read().unwrap().at("name"))
                .and_then(|string| {
                    string
                        .read()
                        .unwrap()
                        .try_as_string()
                        .and_then(|wz_string| wz_string.get_string().ok())
                })
            {
                name = string;
            }

            result.push((id.to_string(), parent_folder.to_string(), name));
        }
    }

    let cash_chair_folders_node = root_read.at_path(CASH_CHAIR_PATH);

    let cash_chair_string_node = root_read.at_path(CASH_CHAIR_STRING_PATH);

    if let Some(cash_chair_string_node) = cash_chair_string_node.clone() {
        node_util::parse_node(&cash_chair_string_node)?;
    }

    if let Some(cash_chair_folders_node) = cash_chair_folders_node {
        node_util::parse_node(&cash_chair_folders_node)?;

        let parent_folder = "0520.img";

        for id in cash_chair_folders_node
            .read()
            .unwrap()
            .children
            .keys()
            .filter(|id| id.starts_with("05204"))
        {
            let mut name = empty_node_name.clone();
            if let Some(string) = cash_chair_string_node
                .clone()
                .and_then(|string_node| string_node.read().unwrap().at(id.trim_start_matches('0')))
                .and_then(|string| string.read().unwrap().at("name"))
                .and_then(|string| {
                    string
                        .read()
                        .unwrap()
                        .try_as_string()
                        .and_then(|wz_string| wz_string.get_string().ok())
                })
            {
                name = string;
            }

            result.push((id.to_string(), parent_folder.to_string(), name));
        }
    }

    result.sort_by(|a, b| a.0.cmp(&b.0));

    Ok(result)
}
