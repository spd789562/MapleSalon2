pub mod controller;
pub mod extractors;
pub mod middlewares;
pub mod models;

use crate::Error;

use axum::{
    http::StatusCode,
    response::{IntoResponse, Response},
    routing::get,
    serve, Router,
};
use wz_reader::WzNodeArc;

pub async fn app(node: WzNodeArc, port: u16) -> crate::Result<()> {
    let layer_state = node.clone();
    let app = Router::new()
        .route("/", get(hello))
        .nest("/mapping", controller::mapping_router())
        .nest("/node", controller::node_router())
        .route_layer(axum::middleware::from_fn_with_state(
            layer_state,
            middlewares::root_check_middleware,
        ))
        .route_layer(axum::middleware::from_fn(
            middlewares::cache_control_from_query_middleware,
        ))
        .with_state(node);

    let host = format!("127.0.0.1:{port}");

    println!("You enable the axum-server feature, Listening on http://{host}");

    let listener = tokio::net::TcpListener::bind(host).await?;

    serve(listener, app).await.map_err(Error::from)
}

async fn hello() -> &'static str {
    "Hello, World!"
}

impl IntoResponse for Error {
    fn into_response(self) -> Response {
        match self {
            Error::Io(_) => (StatusCode::INTERNAL_SERVER_ERROR, self.to_string()).into_response(),
            Error::ImageParseError(_) => {
                (StatusCode::INTERNAL_SERVER_ERROR, self.to_string()).into_response()
            }
            Error::SoundParseError(_) => {
                (StatusCode::INTERNAL_SERVER_ERROR, self.to_string()).into_response()
            }
            Error::ImageSendError => {
                (StatusCode::INTERNAL_SERVER_ERROR, self.to_string()).into_response()
            }
            Error::InitWzFailed => (StatusCode::BAD_REQUEST, self.to_string()).into_response(),
            Error::NotInitialized => (StatusCode::FORBIDDEN, self.to_string()).into_response(),
            Error::NodeError(_) => (StatusCode::BAD_REQUEST, self.to_string()).into_response(),
            Error::NodeNotFound => (StatusCode::NOT_FOUND, self.to_string()).into_response(),
            Error::NodeTypeMismatch(_) => {
                (StatusCode::BAD_REQUEST, self.to_string()).into_response()
            }
            Error::JsonParseError(_) => {
                (StatusCode::INTERNAL_SERVER_ERROR, self.to_string()).into_response()
            }
        }
    }
}
