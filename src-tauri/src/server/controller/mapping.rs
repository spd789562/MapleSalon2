use axum::{extract::State, http::header, response::IntoResponse};
use serde_json::{map::Map, Value};
use wz_reader::{util::node_util, WzNodeArc};

use crate::{handlers, Result};

pub async fn get_smap(State(root): State<WzNodeArc>) -> Result<impl IntoResponse> {
    let smap = handlers::get_smap(&root)?;

    node_util::parse_node(&smap)?;

    let mut smap_vec = handlers::resolve_smap(&smap)?;

    let mut smap_map = Map::with_capacity(smap_vec.len());

    for (name, text) in smap_vec.drain(..) {
        smap_map.insert(name, Value::String(text));
    }

    Ok((
        [(header::CONTENT_TYPE, "application/json")],
        Value::Object(smap_map).to_string(),
    ))
}

pub async fn get_zmap(State(root): State<WzNodeArc>) -> Result<impl IntoResponse> {
    let zmap = handlers::get_zmap(&root)?;

    let mut zmap_vec = handlers::resolve_zmap(&zmap)?;

    let json_array: Value = zmap_vec.drain(..).map(Value::String).collect();

    Ok((
        [(header::CONTENT_TYPE, "application/json")],
        json_array.to_string(),
    ))
}

pub async fn get_images(State(root): State<WzNodeArc>) -> Result<impl IntoResponse> {
    let mut nodes = Vec::new();

    handlers::get_image_nodes(&root, &mut nodes);

    let json_array: Value = nodes
        .drain(..)
        .map(|node| Value::String(node.read().unwrap().get_full_path()))
        .collect();

    Ok((
        [(header::CONTENT_TYPE, "application/json")],
        json_array.to_string(),
    ))
}
