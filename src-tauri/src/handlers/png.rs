use crate::{Error, Result};

use image::DynamicImage;
use wz_reader::{property::string, util::node_util, WzNodeArc, WzNodeCast};

pub fn resolve_png(node: &WzNodeArc, root: Option<&WzNodeArc>) -> Result<DynamicImage> {
    let node_read = node.read().unwrap();

    if let Some(png) = node_read.try_as_png() {
        let inlink_target = node_read
            .at("_inlink")
            .and_then(|node| string::resolve_string_from_node(&node).ok())
            .and_then(|link| node_util::resolve_inlink(&link, node));

        if let Some(target) = inlink_target {
            return resolve_png(&target, root);
        }

        let outlink_target = node_read
            .at("_outlink")
            .and_then(|node| string::resolve_string_from_node(&node).ok())
            .and_then(|link| {
                if let Some(root) = root {
                    node_util::get_node_without_parse(root, &link)
                } else {
                    node_util::resolve_outlink(&link, node, true)
                }
            });

        if let Some(target) = outlink_target {
            return resolve_png(&target, root);
        }

        png.extract_png().map_err(Error::from)
    } else {
        Err(Error::NodeTypeMismatch("png"))
    }
}

pub fn resolve_png_form_root(root: &WzNodeArc, path: &str) -> Result<DynamicImage> {
    let target = node_util::get_node_without_parse(root, path).ok_or(Error::NodeNotFound)?;

    resolve_png(&target, Some(root))
}
