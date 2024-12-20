use rayon::prelude::*;
use wz_reader::{property::WzString, WzNodeArc, WzNodeCast};

use super::item::{
    get_is_cash_item, get_is_chat_balloon, get_is_colorvar, get_is_name_tag, get_item_info_node,
    get_item_node_from_category,
};
use super::path::{CHARACTER_ITEM_PATH, EQUIP_EFFECT_PATH, EQUIP_STRING_PATH};

use serde::Serialize;

use crate::store::{StringDictInner, StringDictItem};
use crate::{Error, Result};

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

pub fn get_equip_node(root: &WzNodeArc) -> Result<WzNodeArc> {
    let node = root.read().unwrap();

    let node = node
        .at(CHARACTER_ITEM_PATH)
        .ok_or(crate::Error::NodeNotFound)?;

    Ok(node)
}

#[inline]
pub fn resolve_equip_string_by_category(category_string_node: &WzNodeArc) -> StringDictInner {
    let category_node_read = category_string_node.read().unwrap();

    let category_name = category_node_read.name.as_str();
    let category = get_equip_category_from_str(category_name);

    /* collect string nodes equipments */
    let category_result = category_node_read
        .children
        .values()
        .par_bridge()
        .fold_with(
            Vec::with_capacity(category_node_read.children.len()),
            |mut result, child| {
                let child_read = child.read().unwrap();
                let name = child_read.name.to_string();

                let text_node = child_read.at("name");

                if text_node.is_none() {
                    return result;
                }
                // duel blade should count as a shield
                let actual_category = if name.starts_with("134") {
                    EquipCategory::Shield
                } else {
                    category.clone()
                };

                let text_node = text_node.unwrap();

                let text_node_read = text_node.read().unwrap();
                let name_text = text_node_read.try_as_string().map(WzString::get_string);
                if let Some(Ok(text)) = name_text {
                    result.push((
                        actual_category,
                        name,
                        text,
                        false, // is cash
                        false, // has colorvar
                        false, // has effect
                        false, // is name tag
                        false, // is chat balloon
                    ));
                }

                result
            },
        )
        .reduce(
            || Vec::<StringDictItem>::new(),
            |mut r, next| {
                r.extend(next);
                r
            },
        );

    category_result
}

pub fn resolve_equip_string(
    root: &WzNodeArc,
    equip_node: &WzNodeArc,
    string_node: &WzNodeArc,
    extra_info: bool,
) -> Result<StringDictInner> {
    let string_node = string_node.read().unwrap();
    let equip_node = equip_node.read().unwrap();

    let mut result = Vec::new();

    for (category_string_node, category_equip_node) in EQUIP_CATEGORY_NEEDS
        .iter()
        .filter_map(|x| string_node.at(x).zip(equip_node.at(x)))
    {
        /* collect string nodes equipments */
        let mut category_result = resolve_equip_string_by_category(&category_string_node);
        /* collect the thing not in string node but in equipment node */
        let category_equip_node_read = category_equip_node.read().unwrap();
        let empty_node_name = String::from("null");

        let category_node_read = category_string_node.read().unwrap();

        let category_name = category_node_read.name.as_str();
        let category = get_equip_category_from_str(category_name);

        let extra_nodes = category_equip_node_read
            .children
            .keys()
            .par_bridge()
            .filter_map(|node_name| {
                if !node_name.contains(".img") {
                    return None;
                }
                let id = node_name.trim_end_matches(".img").trim_start_matches('0');
                if category_node_read.children.contains_key(id) {
                    return None;
                }
                let actual_category = if id.starts_with("134") {
                    EquipCategory::Shield
                } else {
                    category.clone()
                };
                Some((
                    actual_category,
                    id.to_string(),
                    empty_node_name.clone(),
                    false, // is cash
                    false, // has colorvar
                    false, // has effect
                    false, // is name tag
                    false, // is chat balloon
                ))
            })
            .collect::<Vec<_>>();

        category_result.extend(extra_nodes);

        if extra_info {
            let effect_node = root
                .read()
                .unwrap()
                .at_path(EQUIP_EFFECT_PATH)
                .ok_or(Error::NodeNotFound)?;

            category_result.par_iter_mut().for_each(|item| {
                let item_node = get_item_node_from_category(&category_equip_node, &item.1);
                if let Some(info_node) = item_node.and_then(|n| get_item_info_node(&n)) {
                    let info_node = info_node.read().unwrap();
                    item.3 = get_is_cash_item(&info_node);
                    item.4 = get_is_colorvar(&info_node);
                    item.6 = get_is_name_tag(&info_node);
                    item.7 = get_is_chat_balloon(&info_node);
                }
                // item has effect
                if effect_node.read().unwrap().at(&item.1).is_some() {
                    item.5 = true;
                }
            });
        }

        category_result.sort_by(|a, b| a.1.cmp(&b.1));

        result.extend(category_result);
    }

    if let Some(skin_string_node) = string_node.at("Skin") {
        let mut category_result = resolve_equip_string_by_category(&skin_string_node);
        category_result.sort_by(|a, b| a.1.cmp(&b.1));

        result.extend(category_result);
    }

    Ok(result)
}
