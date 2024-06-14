use axum::{extract::State, http::header, response::IntoResponse};
use serde_json::Value;

use crate::{handlers, Error, Result};

use super::super::AppState;

pub async fn prepare_equip(
    State((root, string_dict)): State<AppState>,
) -> Result<impl IntoResponse> {
    let equip_node = handlers::get_equip_string(&root)?;

    let node = equip_node
        .read()
        .unwrap()
        .at("Eqp")
        .ok_or(Error::NodeNotFound)?;

    if let Ok(ref mut string_read) = string_dict.write() {
        if string_read.len() == 0 {
            string_read.extend(handlers::resolve_equip_string(&node)?);
        }
    }

    Ok(())
}

pub async fn get_equip(State((_, string_dict)): State<AppState>) -> Result<impl IntoResponse> {
    let string_list = string_dict
        .read()
        .unwrap()
        .iter()
        .map(|(category, id, name)| {
            Value::Array(vec![
                Value::String(category.to_string()),
                Value::String(id.to_string()),
                Value::String(name.to_string()),
            ])
        })
        .collect::<Value>();

    Ok((
        [(header::CONTENT_TYPE, "application/json")],
        string_list.to_string(),
    ))
}
