use serde::Serialize;

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct NodeInfo {
    #[serde(rename = "type")]
    pub _type: String,
    pub name: String,
    pub has_child: bool,
}
