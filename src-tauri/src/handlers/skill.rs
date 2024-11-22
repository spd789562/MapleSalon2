use wz_reader::{property::resolve_string_from_node, util::node_util, WzNodeArc};

use super::path::{SKILL_PATH, SKILL_STRING_PATH};

use crate::{Error, Result};

// skill item is a tuple of (id, parentFolder, name)
// I think I still need parentFolder for group skill by jobs
// type SkillStringItem = (String, String, String);

pub fn resolve_skill_string(root: &WzNodeArc) -> Result<Vec<(String, String, String)>> {
    let mut result = vec![];
    let (skill_folder_node, string_node) = {
        let root_read = root.read().unwrap();
        let skill_folder_node = root_read.at_path(SKILL_PATH).ok_or(Error::NodeNotFound)?;
        let string_node = root_read
            .at_path(SKILL_STRING_PATH)
            .ok_or(Error::NodeNotFound)?;
        (skill_folder_node, string_node)
    };
    node_util::parse_node(&string_node)?;

    let string_read = string_node.read().unwrap();

    let empty_node_name = String::from("null");
    for (prefix_id, folder_node) in skill_folder_node.read().unwrap().children.iter() {
        let first_char = prefix_id.as_bytes()[0];
        if first_char < b'0' || first_char > b'7' {
            continue;
        }
        let parent_folder = prefix_id.to_string();
        node_util::parse_node(&folder_node)?;

        let skill_folder = folder_node.read().unwrap().at("skill");

        if skill_folder.is_none() {
            continue;
        }

        let skill_folder = skill_folder.unwrap();

        for (id, node) in skill_folder.read().unwrap().children.iter() {
            let read = node.read().unwrap();
            if read.at("effect").is_some() || read.at("keydown").is_some() {
                let name = string_read
                    .at(id)
                    .and_then(|string| string.read().unwrap().at("name"))
                    .and_then(|string| resolve_string_from_node(&string).ok())
                    .unwrap_or(empty_node_name.clone());

                result.push((id.to_string(), parent_folder.clone(), name));
            }
        }
    }

    result.sort_by(|a, b| a.0.cmp(&b.0));

    Ok(result)
}