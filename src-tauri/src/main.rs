// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::sync::Arc;
use tauri::async_runtime;
use wz_reader::WzNode;

mod commands;
mod error;
mod server;
mod store;

pub mod handlers;
pub mod models;
pub mod utils;

pub use store::{AppStore, StringDict};

pub use error::{Error, Result};

fn main() {
    let port = if portpicker::is_free_tcp(14878) {
        14878
    } else {
        portpicker::pick_unused_port().expect("no available port for wz server")
    };

    let string_dict = StringDict::default();

    let root_node = WzNode::empty().into_lock();

    async_runtime::spawn(server::app(
        Arc::clone(&root_node),
        Arc::clone(&string_dict),
        port,
    ));

    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(
            tauri_plugin_window_state::Builder::new()
                .with_filename("window-state.bin")
                .build(),
        )
        .manage(AppStore {
            node: root_node,
            string: string_dict,
            port,
        })
        .invoke_handler(tauri::generate_handler![
            commands::get_server_url,
            commands::init,
            commands::parse_node,
            commands::unparse_node,
            commands::get_node_info,
            commands::get_childs_info,
            commands::search_by_equip_name
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
