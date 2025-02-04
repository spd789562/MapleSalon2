use axum::{routing::get, Router};

use super::AppState;

pub mod mapping;
pub mod node;
pub mod string;

pub fn mapping_router() -> Router<AppState> {
    Router::new()
        .route("/smap", get(mapping::get_smap))
        .route("/zmap", get(mapping::get_zmap))
        .route("/images", get(mapping::get_images))
        .route("/seteffect", get(mapping::get_set_effect))
}

pub fn node_router() -> Router<AppState> {
    Router::new()
        .route("/image/*path", get(node::get_image))
        .route("/image_unparsed/*path", get(node::get_image_unparsed))
        .route("/json/*path", get(node::get_json))
        .route("/raw/*path", get(node::get_raw))
        .route("/parse/*path", get(node::parse))
        .route("/unparse/*path", get(node::unparse))
        .route("/load_extra_paths", get(node::load_extra_paths))
}

pub fn string_router() -> Router<AppState> {
    Router::new()
        .route("/equip", get(string::get_equip))
        .route("/equip/prepare", get(string::prepare_equip))
        .route("/chair", get(string::get_chairs))
        .route("/mount", get(string::get_mounts))
        .route("/skill", get(string::get_skills))
        .route("/map", get(string::get_maps))
}
