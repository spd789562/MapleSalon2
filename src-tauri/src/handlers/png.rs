use crate::{Error, Result};

use image::DynamicImage;
use wz_reader::{property::string, util::node_util, WzNodeArc, WzNodeCast};

fn get_node_from_image_node(image_node: &WzNodeArc, path: &str) -> Option<WzNodeArc> {
    let image_read = image_node.read().unwrap();

    let image = image_read.try_as_image()?;

    let target = if image.is_parsed {
        image_read.at_path(path)
    } else {
        image.at_path(path).ok()
    };

    target
}

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

pub fn resolve_png_unparsed(
    image_node: &WzNodeArc,
    path: &str,
    root: Option<&WzNodeArc>,
) -> Result<DynamicImage> {
    let target = get_node_from_image_node(&image_node, &path).ok_or(Error::NodeNotFound)?;

    let node_read = target.read().unwrap();

    if let Some(uol_node) = node_read.try_as_uol() {
        let uol_path = uol_node.get_string()?;
        let target_path = node_util::get_resolved_uol_path(path, &uol_path);
        return resolve_png_unparsed(image_node, &target_path, root);
    }

    if let Some(png) = node_read.try_as_png() {
        let inlink = node_read
            .at("_inlink")
            .and_then(|node| string::resolve_string_from_node(&node).ok());

        if let Some(link) = inlink {
            return resolve_png_unparsed(image_node, &link, root);
        }

        let outlink = node_read
            .at("_outlink")
            .and_then(|node| string::resolve_string_from_node(&node).ok());

        if let (Some(root_node), Some(link)) = (root, outlink) {
            let (image_node, rest_path) =
                node_util::get_image_node_from_path(root_node, &link).ok_or(Error::NodeNotFound)?;

            return resolve_png_unparsed(&image_node, &rest_path, root);
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
