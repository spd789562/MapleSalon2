use crate::server::extractors::TargetNodeExtractor;
use crate::server::models::GetJsonParam;
use crate::{handlers, utils, Error, Result};

use std::io::{BufWriter, Cursor};

use axum::extract::{Path, Query};
use axum::{body::Body, extract::State, http::header, response::IntoResponse};
use image::ImageFormat;
use wz_reader::{util::node_util, WzNodeArc};

pub async fn get_image(
    State(root): State<WzNodeArc>,
    TargetNodeExtractor(node): TargetNodeExtractor,
) -> Result<impl IntoResponse> {
    let image = handlers::resolve_png(&node, Some(&root))?;

    let mut buf = BufWriter::new(Cursor::new(Vec::new()));
    // maybe use ImageFormat::Webp is better it quicker and smaller.
    image
        .write_to(&mut buf, ImageFormat::WebP)
        .map_err(|_| Error::ImageSendError)?;

    let body = Body::from(buf.into_inner().unwrap().into_inner());

    Ok((
        [
            (header::CONTENT_TYPE, "image/webp"),
            (header::CACHE_CONTROL, "max-age=3600"),
        ],
        body,
    ))
}

pub async fn get_image_unparsed(
    State(root): State<WzNodeArc>,
    Path(path): Path<String>,
) -> Result<impl IntoResponse> {
    println!("get_image_unparsed, {}", path);
    let (image_node, path) =
        node_util::get_image_node_from_path(&root, &path).ok_or(Error::NodeNotFound)?;

    let image = handlers::resolve_png_unparsed(&image_node, &path, Some(&root))?;

    let mut buf = BufWriter::new(Cursor::new(Vec::new()));
    // maybe use ImageFormat::Webp is better it quicker and smaller.
    image
        .write_to(&mut buf, ImageFormat::WebP)
        .map_err(|_| Error::ImageSendError)?;

    let body = Body::from(buf.into_inner().unwrap().into_inner());

    Ok((
        [
            (header::CONTENT_TYPE, "image/webp"),
            (header::CACHE_CONTROL, "max-age=3600"),
        ],
        body,
    ))
}

pub async fn get_json(
    Query(param): Query<GetJsonParam>,
    TargetNodeExtractor(node): TargetNodeExtractor,
) -> Result<impl IntoResponse> {
    let is_simple = param.simple.unwrap_or(false);
    let resolve_uol = param.resolve_uol.unwrap_or(false);
    let json = if resolve_uol {
        if is_simple {
            utils::simple_uol_json(&node)
        } else {
            utils::uol_json(&node)
        }?
    } else {
        if is_simple {
            node.read().unwrap().to_simple_json()
        } else {
            node.read().unwrap().to_json()
        }?
    };

    Ok((
        [
            (header::CONTENT_TYPE, "application/json"),
            (header::CACHE_CONTROL, "public, max-age=3600"),
        ],
        json.to_string(),
    ))
}
