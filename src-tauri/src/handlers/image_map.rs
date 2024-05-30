use wz_reader::{WzNodeArc, WzNodeCast};

/// get image nodes recursively
pub fn get_image_nodes(node: &WzNodeArc, nodes: &mut Vec<WzNodeArc>) {
    let node = node.read().unwrap();

    // we can't ganrantee the childs are images, so can't reserve the capacity
    // nodes.reserve(node.children.len());

    for child in node.children.values() {
        if child.read().unwrap().try_as_image().is_some() {
            nodes.push(child.clone());
        } else {
            get_image_nodes(child, nodes);
        }
    }
}
