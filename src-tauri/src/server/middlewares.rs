use crate::Error;
use axum::{
    extract::{Query, Request, State},
    http::header,
    middleware::Next,
    response::{IntoResponse, Response},
};
use wz_reader::{property::WzValue, WzNodeArc, WzObjectType};

use super::models::GetJsonParam;

pub async fn root_check_middleware(
    State(root): State<WzNodeArc>,
    req: Request,
    next: Next,
) -> Response {
    {
        let root_read = root.read().unwrap();
        if matches!(root_read.object_type, WzObjectType::Value(WzValue::Null)) {
            return Error::NotInitialized.into_response();
        }
    }

    next.run(req).await
}

// Read cache value from query and apply in header
pub async fn cache_control_from_query_middleware(
    Query(query): Query<GetJsonParam>,
    req: Request,
    next: Next,
) -> Response {
    if query.cache.is_none() {
        return next.run(req).await;
    }
    let mut res = next.run(req).await;

    let cache_time = query.cache.unwrap_or(0);

    res.headers_mut().insert(
        header::CACHE_CONTROL,
        format!("public, max-age={}", cache_time).parse().unwrap(),
    );

    res
}
