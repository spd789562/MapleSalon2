use serde_json::{to_value, Map, Value};
use wz_reader::{property::WzSubProperty, WzNode, WzObjectType};

pub fn to_simple_json(node: &WzNode) -> Result<serde_json::Value, serde_json::Error> {
    if node.children.is_empty() {
        match &node.object_type {
            WzObjectType::Value(value_type) => return Ok(value_type.clone().into()),
            WzObjectType::Property(WzSubProperty::PNG(inner)) => return to_value(inner),
            WzObjectType::Property(WzSubProperty::Sound(inner)) => return to_value(inner),
            _ => return Ok(Value::Null),
        }
    }

    let mut json = Map::new();
    let mut generate_extra_path = false;

    match &node.object_type {
        WzObjectType::Property(WzSubProperty::PNG(inner)) => {
            let dict = to_value(inner)?;
            generate_extra_path = true;

            if let Value::Object(dict) = dict {
                for (name, value) in dict {
                    json.insert(name, value);
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

    for (name, value) in node.children.iter() {
        let child = value.read().unwrap();
        json.insert(name.to_string(), to_simple_json(&child)?);
    }

    if generate_extra_path && !json.contains_key("_outlink") {
        json.insert("path".to_string(), Value::String(node.get_full_path()));
    }

    Ok(Value::Object(json))
}
