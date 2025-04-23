use rayon::prelude::*;
use wz_reader::{
    property::{resolve_string_from_node, WzString},
    util::node_util,
    WzNodeArc, WzNodeCast,
};

use super::item::{
    get_is_cash_item, get_is_chat_balloon, get_is_colorvar, get_is_medal, get_is_name_tag,
    get_is_nick_tag, get_item_info_node, get_item_node_from_category,
};
use super::path::{
    CASH_EFFECT_PATH, CASH_EFFECT_STRING_PATH, CHARACTER_ITEM_PATH, EQUIP_EFFECT_PATH,
    EQUIP_STRING_PATH, NICKTAG_PATH, NICKTAG_STRING_PATH,
};

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
    RingEffect,
    NecklessEffect,
    BeltEffect,
    Medal,
    NickTag,
    NameTag,
    ChatBalloon,
    Effect, // for cash
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
            EquipCategory::Effect => 25,
            EquipCategory::RingEffect => 26,
            EquipCategory::NecklessEffect => 27,
            EquipCategory::Medal => 28,
            EquipCategory::NickTag => 29,
            EquipCategory::NameTag => 30,
            EquipCategory::ChatBalloon => 31,
            EquipCategory::BeltEffect => 32,
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

pub fn get_cash_effect_nodes(root: &WzNodeArc) -> Option<WzNodeArc> {
    let node = root.read().unwrap().at_path(CASH_EFFECT_PATH)?;
    node_util::parse_node(&node).ok()?;
    Some(node)
}

pub fn resolve_cash_effect_string(root: &WzNodeArc) -> Option<StringDictInner> {
    let mut result = Vec::new();
    let cash_effect_node = root.read().unwrap().at_path(CASH_EFFECT_PATH)?;
    let cash_string_node = root.read().unwrap().at_path(CASH_EFFECT_STRING_PATH)?;

    node_util::parse_node(&cash_effect_node).ok()?;
    node_util::parse_node(&cash_string_node).ok()?;

    let cash_string_read = cash_string_node.read().unwrap();
    for (full_id, effect_node) in cash_effect_node.read().unwrap().children.iter() {
        if effect_node.read().unwrap().at("effect").is_none() {
            continue;
        }

        let id = full_id.trim_start_matches('0');
        let name = cash_string_read
            .at_path(&format!("{}/name", id))
            .and_then(|node| resolve_string_from_node(&node).ok())
            .unwrap_or(String::from("null"));

        result.push((
            EquipCategory::Effect,
            id.to_string(),
            name,
            true,  // is cash
            false, // has colorvar
            true,  // has effect
        ));
    }

    result.sort_by(|a, b| a.1.cmp(&b.1));

    Some(result)
}

pub fn get_nicktag_node(root: &WzNodeArc) -> Option<WzNodeArc> {
    let node = root.read().unwrap().at_path(NICKTAG_PATH)?;
    node_util::parse_node(&node).ok()?;
    Some(node)
}

pub fn resolve_nicktag_string(root: &WzNodeArc) -> Option<StringDictInner> {
    let mut result = Vec::new();

    let nicktag_node = get_nicktag_node(root)?;
    let nicktag_string_node = root.read().unwrap().at_path(NICKTAG_STRING_PATH)?;

    node_util::parse_node(&nicktag_string_node).ok()?;

    let nicktag_string_read = nicktag_string_node.read().unwrap();

    for (full_id, nicktag_node) in nicktag_node.read().unwrap().children.iter() {
        if !get_is_nick_tag(&nicktag_node.read().unwrap()) {
            continue;
        }

        let id = full_id.trim_start_matches('0');
        let name = nicktag_string_read
            .at_path(&format!("{}/name", id))
            .and_then(|node| resolve_string_from_node(&node).ok())
            .unwrap_or(String::from("null"));

        result.push((
            EquipCategory::NickTag,
            id.to_string(),
            name,
            false,
            false,
            false,
        ));
    }

    result.sort_by(|a, b| a.1.cmp(&b.1));

    Some(result)
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
                    if get_is_name_tag(&info_node) {
                        item.0 = EquipCategory::NameTag;
                    }
                    if get_is_chat_balloon(&info_node) {
                        item.0 = EquipCategory::ChatBalloon;
                    }
                    if get_is_medal(&info_node) {
                        item.0 = EquipCategory::Medal;
                    }
                }
                // item has effect
                if effect_node
                    .read()
                    .unwrap()
                    .at(&item.1)
                    .and_then(|node| node.read().unwrap().at("effect"))
                    .is_some()
                {
                    item.5 = true;
                }
                if item.0 == EquipCategory::Ring && item.5 {
                    item.0 = EquipCategory::RingEffect;
                } else if item.0 == EquipCategory::Accessory && item.1.starts_with("112") && item.5
                {
                    item.0 = EquipCategory::NecklessEffect;
                } else if item.0 == EquipCategory::Accessory && item.1.starts_with("113") && item.5
                {
                    item.0 = EquipCategory::BeltEffect;
                }
            });
        }

        category_result.sort_by(|a, b| a.1.cmp(&b.1));

        result.extend(category_result);
    }
    // nicktag
    if let Some(list) = resolve_nicktag_string(root) {
        result.extend(list);
    }

    // skins
    if let Some(skin_string_node) = string_node.at("Skin") {
        let mut category_result = resolve_equip_string_by_category(&skin_string_node);
        category_result.sort_by(|a, b| a.1.cmp(&b.1));

        result.extend(category_result);
    }

    // cash effect
    if let Some(list) = resolve_cash_effect_string(root) {
        result.extend(list);
    }

    Ok(result)
}
