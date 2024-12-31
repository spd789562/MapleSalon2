#![allow(dead_code)]
use wz_reader::{WzNode, WzNodeArc, WzNodeCast};

pub const CASH_ITEM_KEY: &'static str = "cash";
pub const COLORVAR_KEY: &'static str = "colorvar";
pub const NAME_TAG_KEY: &'static str = "nameTag";
pub const CHAT_BALLOON_KEY: &'static str = "chatBalloon";
pub const MEDAL_KEY: &'static str = "medalTag";
pub const NICKTAG_KEY: &'static str = "nickTag";

#[inline]
pub fn get_item_node(
    character_node: &WzNodeArc,
    category: &str,
    item_id: &str,
) -> Option<WzNodeArc> {
    character_node
        .read()
        .unwrap()
        .at_path(&format!("{}/{:0>8}.img", category, item_id))
}

#[inline]
pub fn get_item_node_from_category(category_node: &WzNodeArc, item_id: &str) -> Option<WzNodeArc> {
    category_node
        .read()
        .unwrap()
        .at_path(&format!("{:0>8}.img", item_id))
}

#[inline]
pub fn get_item_info_node(item_node: &WzNodeArc) -> Option<WzNodeArc> {
    let image_node_read = item_node.read().unwrap();

    let image_node = image_node_read.try_as_image()?;

    image_node.at_path("info").ok()
}

#[inline]
pub fn get_is_cash_item(info_node: &WzNode) -> bool {
    info_node
        .at(CASH_ITEM_KEY)
        .and_then(|cash_node| cash_node.read().unwrap().try_as_int().map(|x| *x == 1))
        .unwrap_or(false)
}

#[inline]
pub fn get_is_colorvar(info_node: &WzNode) -> bool {
    info_node.at(COLORVAR_KEY).is_some()
}

#[inline]
pub fn get_is_name_tag(info_node: &WzNode) -> bool {
    info_node.at(NAME_TAG_KEY).is_some()
}

#[inline]
pub fn get_is_chat_balloon(info_node: &WzNode) -> bool {
    info_node.at(CHAT_BALLOON_KEY).is_some()
}

#[inline]
pub fn get_is_medal(info_node: &WzNode) -> bool {
    info_node.at(MEDAL_KEY).is_some()
}

#[inline]
pub fn get_is_nick_tag(info_node: &WzNode) -> bool {
    info_node
        .at("info")
        .map_or(false, |node| node.read().unwrap().at(NICKTAG_KEY).is_some())
}
