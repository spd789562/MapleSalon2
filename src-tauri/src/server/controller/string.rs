use axum::{
    extract::{Query, State},
    http::header,
    response::IntoResponse,
};
use serde_json::Value;
use wz_reader::util::node_util;

use crate::{handlers, Error, Result};

use super::super::models::GetEquipListParam;
use super::super::AppState;

pub async fn prepare_equip(
    State((root, string_dict)): State<AppState>,
    Query(GetEquipListParam { extra }): Query<GetEquipListParam>,
) -> Result<impl IntoResponse> {
    let equip_string_node = handlers::get_equip_string(&root)?;
    let equip_node = handlers::get_equip_node(&root)?;
    let fetch_extra_info = extra.is_some();

    node_util::parse_node(&equip_string_node)?;

    if fetch_extra_info {
        let effect_node = root
            .read()
            .unwrap()
            .at_path(&handlers::path::EQUIP_EFFECT_PATH);
        if let Some(effect_node) = effect_node {
            node_util::parse_node(&effect_node)?;
        }
    }

    let string_node = equip_string_node
        .read()
        .unwrap()
        .at("Eqp")
        .ok_or(Error::NodeNotFound)?;

    if let Ok(ref mut string_read) = string_dict.write() {
        if string_read.len() == 0 {
            string_read.extend(handlers::resolve_equip_string(
                &root,
                &equip_node,
                &string_node,
                fetch_extra_info,
            )?);
        }
    }

    Ok(())
}

pub async fn get_equip(State((_, string_dict)): State<AppState>) -> Result<impl IntoResponse> {
    let string_list = string_dict
        .read()
        .unwrap()
        .iter()
        .map(|(category, id, name, cash, colorvar, effect)| {
            Value::Array(vec![
                Value::String(category.to_string()),
                Value::String(id.to_string()),
                Value::String(name.to_string()),
                Value::from(*cash),
                Value::from(*colorvar),
                Value::from(*effect),
            ])
        })
        .collect::<Value>();

    Ok((
        [(header::CONTENT_TYPE, "application/json")],
        string_list.to_string(),
    ))
}

pub async fn get_chairs(State((root, _)): State<AppState>) -> Result<impl IntoResponse> {
    let result = handlers::resolve_chair_string(&root)?;

    let result = result
        .iter()
        .map(|(id, parent_folder, name)| {
            Value::Array(vec![
                Value::String(id.to_string()),
                Value::String(parent_folder.to_string()),
                Value::String(name.to_string()),
            ])
        })
        .collect::<Value>();

    Ok((
        [(header::CONTENT_TYPE, "application/json")],
        result.to_string(),
    ))
}

pub async fn get_mounts(State((root, _)): State<AppState>) -> Result<impl IntoResponse> {
    let result = handlers::resolve_mount_string(&root)?;

    let result = result
        .iter()
        .map(|(id, name)| {
            Value::Array(vec![
                Value::String(id.to_string()),
                Value::String(name.to_string()),
            ])
        })
        .collect::<Value>();

    Ok((
        [(header::CONTENT_TYPE, "application/json")],
        result.to_string(),
    ))
}

pub async fn get_skills(State((root, _)): State<AppState>) -> Result<impl IntoResponse> {
    let result = handlers::resolve_skill_string(&root)?;

    let result = result
        .iter()
        .map(|(id, parent_folder, name)| {
            Value::Array(vec![
                Value::String(id.to_string()),
                Value::String(parent_folder.to_string()),
                Value::String(name.to_string()),
            ])
        })
        .collect::<Value>();

    Ok((
        [(header::CONTENT_TYPE, "application/json")],
        result.to_string(),
    ))
}

pub async fn get_maps(State((root, _)): State<AppState>) -> Result<impl IntoResponse> {
    let result = handlers::resolve_map_string(&root)?;

    let result = result
        .iter()
        .map(|(id, name, street_name)| {
            Value::Array(vec![
                Value::String(id.to_string()),
                Value::String(name.to_string()),
                Value::String(street_name.to_string()),
            ])
        })
        .collect::<Value>();

    Ok((
        [(header::CONTENT_TYPE, "application/json")],
        result.to_string(),
    ))
}
