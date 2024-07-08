pub mod controller;
pub mod extractors;
pub mod middlewares;
pub mod models;

use crate::{store::StringDict, Error};

use axum::{
    http::{HeaderValue, Method, StatusCode},
    response::{IntoResponse, Response},
    routing::get,
    serve, Router,
};
use tower_http::cors::CorsLayer;
use wz_reader::WzNodeArc;

pub type AppState = (WzNodeArc, StringDict);

pub async fn app(node: WzNodeArc, string_dict: StringDict, port: u16) -> crate::Result<()> {
    let layer_state = node.clone();
    let app = Router::new()
        .route("/", get(hello))
        .nest("/mapping", controller::mapping_router())
        .nest("/node", controller::node_router())
        .nest("/string", controller::string_router())
        .route_layer(axum::middleware::from_fn_with_state(
            layer_state,
            middlewares::root_check_middleware,
        ))
        .route_layer(axum::middleware::from_fn(
            middlewares::cache_control_from_query_middleware,
        ))
        .route_layer(CorsLayer::new().allow_methods([Method::GET]).allow_origin([
            HeaderValue::from_static("http://localhost:1420"),
            HeaderValue::from_static("http://tauri.localhost"),
        ]))
        .with_state((node, string_dict));

    let host = format!("127.0.0.1:{port}");

    println!("You enable the axum-server feature, Listening on http://{host}");

    let listener = tokio::net::TcpListener::bind(host).await?;

    serve(listener, app).await.map_err(Error::from)
}

async fn hello() -> &'static str {
    "Hi"
}

impl IntoResponse for Error {
    fn into_response(self) -> Response {
        match self {
            Error::Io(_)
            | Error::JsonParseError(_)
            | Error::ImageParseError(_)
            | Error::SoundParseError(_)
            | Error::StringParseError(_)
            | Error::ImageSendError => {
                (StatusCode::INTERNAL_SERVER_ERROR, self.to_string()).into_response()
            }
            Error::InitWzFailed => (StatusCode::BAD_REQUEST, self.to_string()).into_response(),
            Error::NotInitialized => (StatusCode::FORBIDDEN, self.to_string()).into_response(),
            Error::NodeError(_) => (StatusCode::BAD_REQUEST, self.to_string()).into_response(),
            Error::NodeNotFound => (StatusCode::NOT_FOUND, self.to_string()).into_response(),
            Error::NodeTypeMismatch(_) => {
                (StatusCode::BAD_REQUEST, self.to_string()).into_response()
            }
        }
    }
}
