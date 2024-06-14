use wz_reader::{WzNodeArc, WzNodeCast};

use super::path::EQUIP_STRING_PATH;

use serde::Serialize;

use crate::Result;

const EQUIP_CATEGORY_NEEDS: [&str; 14] = [
    "Cap",
    "Cape",
    "Coat",
    "Face",
    "Glove",
    "Hair",
    "Longcoat",
    "Pants",
    "Ring",
    "Shield",
    "Shoes",
    "Weapon",
    "Accessory",
    "Skin",
];

#[derive(Eq, PartialEq, Debug, Serialize, Clone)]
pub enum EquipCategory {
    Cap,
    Cape,
    Coat,
    Dragon,   // Evan's Dragon Equip
    Mechanic, // Mechanic's Equip
    Face,
    Glove,
    Hair,
    Longcoat,
    Pants,
    PetEquip,
    Ring,
    Shield,
    Shoes,
    Taming, // Taming Mob
    Weapon,
    Android,
    Accessory,
    Bit, // More Like Puzzle Pieces
    ArcaneForce,
    AuthenticForce,
    Skin,
    SkillSkin,
    Unknown,
}

impl std::fmt::Display for EquipCategory {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        let repr_number = match self {
            EquipCategory::Cap => 1,
            EquipCategory::Cape => 2,
            EquipCategory::Coat => 3,
            EquipCategory::Dragon => 4,
            EquipCategory::Mechanic => 5,
            EquipCategory::Face => 6,
            EquipCategory::Glove => 7,
            EquipCategory::Hair => 8,
            EquipCategory::Longcoat => 9,
            EquipCategory::Pants => 10,
            EquipCategory::PetEquip => 11,
            EquipCategory::Ring => 12,
            EquipCategory::Shield => 13,
            EquipCategory::Shoes => 14,
            EquipCategory::Taming => 15,
            EquipCategory::Weapon => 16,
            EquipCategory::Android => 17,
            EquipCategory::Accessory => 18,
            EquipCategory::Bit => 19,
            EquipCategory::ArcaneForce => 20,
            EquipCategory::AuthenticForce => 21,
            EquipCategory::Skin => 22,
            EquipCategory::SkillSkin => 23,
            EquipCategory::Unknown => 24,
        };

        write!(f, "{}", repr_number)
    }
}

pub fn get_equip_category_from_str(category: &str) -> EquipCategory {
    match category {
        "Cap" => EquipCategory::Cap,
        "Cape" => EquipCategory::Cape,
        "Coat" => EquipCategory::Coat,
        "Dragon" => EquipCategory::Dragon,
        "Mechanic" => EquipCategory::Mechanic,
        "Face" => EquipCategory::Face,
        "Glove" => EquipCategory::Glove,
        "Hair" => EquipCategory::Hair,
        "Longcoat" => EquipCategory::Longcoat,
        "Pants" => EquipCategory::Pants,
        "PetEquip" => EquipCategory::PetEquip,
        "Ring" => EquipCategory::Ring,
        "Shield" => EquipCategory::Shield,
        "Shoes" => EquipCategory::Shoes,
        "Taming" => EquipCategory::Taming,
        "Weapon" => EquipCategory::Weapon,
        "Android" => EquipCategory::Android,
        "Accessory" => EquipCategory::Accessory,
        "Bit" => EquipCategory::Bit,
        "ArcaneForce" => EquipCategory::ArcaneForce,
        "AuthenticForce" => EquipCategory::AuthenticForce,
        "Skin" => EquipCategory::Skin,
        "SkillSkin" => EquipCategory::SkillSkin,
        _ => EquipCategory::Unknown,
    }
}

pub fn get_equip_string(root: &WzNodeArc) -> Result<WzNodeArc> {
    let node = root.read().unwrap();

    let node = node
        .at_path(EQUIP_STRING_PATH)
        .ok_or(crate::Error::NodeNotFound)?;

    Ok(node)
}

pub fn resolve_equip_string(node: &WzNodeArc) -> Result<Vec<(EquipCategory, String, String)>> {
    let node = node.read().unwrap();

    let mut result = Vec::new();

    for category_node in EQUIP_CATEGORY_NEEDS.iter().filter_map(|x| node.at(x)) {
        let category_node_read = category_node.read().unwrap();

        let category_name = category_node_read.name.as_str();
        let category = get_equip_category_from_str(category_name);

        let mut category_result = Vec::with_capacity(category_node_read.children.len());

        for child in category_node_read.children.values() {
            let child_read = child.read().unwrap();
            let name = child_read.name.to_string();

            let text_node = if let Some(text_node) = child_read.at("name") {
                text_node
            } else {
                continue;
            };

            let text_node_read = text_node.read().unwrap();

            if let Some(string) = text_node_read.try_as_string() {
                let text = string.get_string()?;
                category_result.push((category.clone(), name, text));
            }
        }

        category_result.sort_by(|a, b| a.1.cmp(&b.1));

        result.extend(category_result);
    }

    Ok(result)
}
