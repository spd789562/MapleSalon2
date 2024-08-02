use std::sync::{Arc, RwLock};

use wz_reader::util::resolve_base;
use wz_reader::version::WzMapleVersion;
use wz_reader::{property::WzValue, WzNodeArc, WzObjectType};

use crate::handlers::EquipCategory;

/* Category, Id, Name, isCash, isColor, hasEffect  */
pub type StringDictItem = (EquipCategory, String, String, bool, bool, bool);
pub type StringDictInner = Vec<StringDictItem>;
pub type StringDict = Arc<RwLock<StringDictInner>>;

pub struct AppStore {
    pub node: WzNodeArc,
    pub string: StringDict,
    pub port: u16,
}
impl AppStore {
    pub fn is_empty(&self) -> bool {
        matches!(
            self.node.read().unwrap().object_type,
            WzObjectType::Value(WzValue::Null)
        )
    }
    pub fn replace_root(&self, another: &WzNodeArc) {
        let mut node = self.node.write().unwrap();
        std::mem::swap(&mut *node, &mut *another.write().unwrap());
    }
    pub fn init_root(&self, path: &str, version: Option<WzMapleVersion>) -> crate::Result<()> {
        let root = resolve_base(path, version).map_err(|_| crate::Error::InitWzFailed)?;

        self.replace_root(&root);

        Ok(())
    }
}
