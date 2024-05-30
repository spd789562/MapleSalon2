use crate::server::extractors::TargetNodeExtractor;
use crate::server::models::GetJsonParam;
use crate::{handlers, utils, Error, Result};

use std::io::{BufWriter, Cursor};

use axum::extract::Query;
use axum::{body::Body, extract::State, http::header, response::IntoResponse};
use image::ImageFormat;
use wz_reader::WzNodeArc;

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

pub async fn get_json(
    Query(param): Query<GetJsonParam>,
    TargetNodeExtractor(node): TargetNodeExtractor,
) -> Result<impl IntoResponse> {
    let is_simple = param.simple.unwrap_or(false);
    let json = if is_simple {
        utils::simple_uol_json(&node)
    } else {
        utils::uol_json(&node)
    }?;

    Ok((
        [
            (header::CONTENT_TYPE, "application/json"),
            (header::CACHE_CONTROL, "public, max-age=3600"),
        ],
        json.to_string(),
    ))
}
