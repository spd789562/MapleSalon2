use axum::{routing::get, Router};
use wz_reader::WzNodeArc;

type State = WzNodeArc;

pub mod mapping;
pub mod node;

pub fn mapping_router() -> Router<State> {
    Router::new()
        .route("/smap", get(mapping::get_smap))
        .route("/zmap", get(mapping::get_zmap))
        .route("/images", get(mapping::get_images))
}

pub fn node_router() -> Router<State> {
    Router::new()
        .route("/image/*path", get(node::get_image))
        .route("/image_unparsed/*path", get(node::get_image_unparsed))
        .route("/json/*path", get(node::get_json))
}
