#![allow(dead_code)]
use wz_reader::{WzNodeArc, WzNodeCast};

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

pub fn get_item_node_from_category(category_node: &WzNodeArc, item_id: &str) -> Option<WzNodeArc> {
    category_node
        .read()
        .unwrap()
        .at_path(&format!("{:0>8}.img", item_id))
}

pub fn get_item_info_node(item_node: &WzNodeArc) -> Option<WzNodeArc> {
    let image_node_read = item_node.read().unwrap();

    let image_node = image_node_read.try_as_image()?;

    image_node.at_path("info").ok()
}

pub fn get_is_cash_item(info_node: &WzNodeArc) -> bool {
    info_node
        .read()
        .unwrap()
        .at("cash")
        .and_then(|cash_node| cash_node.read().unwrap().try_as_int().map(|x| *x == 1))
        .unwrap_or(false)
}

pub fn get_is_colorvar(info_node: &WzNodeArc) -> bool {
    info_node.read().unwrap().at("colorvar").is_some()
}
