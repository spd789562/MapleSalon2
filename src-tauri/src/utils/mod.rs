pub mod resolver;
pub use resolver::*;

pub mod block_parse;
pub use block_parse::*;

pub mod node;

pub fn swap_node(node1: &wz_reader::WzNodeArc, node2: &wz_reader::WzNodeArc) {
    std::mem::swap(&mut *node1.write().unwrap(), &mut *node2.write().unwrap());
}
