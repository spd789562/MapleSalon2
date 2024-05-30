use crate::{Error, Result};

use serde_json::{to_value, Map, Value};
use wz_reader::{
    property::{WzSubProperty, WzValue},
    WzNodeArc, WzNodeCast, WzObjectType,
};

pub fn uol_json(node: &WzNodeArc) -> Result<Value> {
    let node_read = node.read().unwrap();

    if node_read.children.is_empty() {
        if let Some(path) = node_read.try_as_uol() {
            let path = path.get_string()?;
            if let Some(target) = node_read.at_path_relative(&format!("../{}", path)) {
                return uol_json(&target);
            }
        }

        return node_read.to_json().map_err(Error::from);
    }

    let mut json = Map::new();

    for (name, value) in node_read.children.iter() {
        json.insert(name.to_string(), uol_json(value)?);
    }

    Ok(Value::Object(json))
}

pub fn simple_uol_json(node: &WzNodeArc) -> Result<Value> {
    let node_read = node.read().unwrap();

    if node_read.children.is_empty() {
        match &node_read.object_type {
            WzObjectType::Value(value_type) => {
                return {
                    if let WzValue::UOL(ref path) = value_type {
                        let path = path.get_string()?;
                        if let Some(target) = node_read.at_path_relative(&format!("../{}", path)) {
                            return simple_uol_json(&target);
                        }
                    }
                    Ok(value_type.clone().into())
                };
            }
            WzObjectType::Property(WzSubProperty::PNG(inner)) => {
                let mut dict = to_value(inner)?;

                if let Value::Object(ref mut dict) = dict {
                    let path = node_read.get_path_from_root();
                    dict.insert(String::from("path"), Value::from(path));
                }

                return Ok(dict);
            }
            WzObjectType::Property(WzSubProperty::Sound(inner)) => {
                return to_value(inner).map_err(Error::from)
            }
            _ => return Ok(Value::Null),
        }
    }

    let mut json = Map::new();

    match &node_read.object_type {
        WzObjectType::Property(WzSubProperty::PNG(inner)) => {
            let dict = to_value(inner)?;

            if let Value::Object(dict) = dict {
                for (name, value) in dict {
                    json.insert(name, value);
                }
                if node_read.children.get("_outlink").is_none() {
                    let path = node_read.get_path_from_root();
                    json.insert(String::from("path"), Value::from(path));
                }
            }
        }
        WzObjectType::Property(WzSubProperty::Sound(inner)) => {
            let dict = to_value(inner)?;

            if let Value::Object(dict) = dict {
                for (name, value) in dict {
                    json.insert(name, value);
                }
            }
        }
        _ => {}
    }

    for (name, value) in node_read.children.iter() {
        json.insert(name.to_string(), simple_uol_json(value)?);
    }

    Ok(Value::Object(json))
}
