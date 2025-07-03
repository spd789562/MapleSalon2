// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::sync::Arc;
use tauri::{async_runtime, webview::PageLoadEvent, AppHandle, Manager};
use tauri_plugin_store::StoreExt;
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

    let default_lang = Arc::new(sys_locale::get_locale().unwrap_or_else(|| String::from("en-US")));

    async_runtime::spawn(server::app(
        Arc::clone(&root_node),
        Arc::clone(&string_dict),
        port,
    ));

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_single_instance::init(|app, _, _| {
            let _ = show_window(app);
        }))
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
            commands::encode_webp,
        ])
        .setup(move |app| {
            // ensure the store file is created
            let _ = app.store("setting.bin");

            // enable below code to debug download function in macos
            // also set tauri.config.json: app.windows[0].create = false
            // and import those
            // path::BaseDirectory,
            // utils::config::{Csp, CspDirectiveSources, WebviewUrl},
            // webview::{DownloadEvent, PageLoadEvent, WebviewWindowBuilder},

            // let handle = app.handle();
            // // `get(0)` assumes that we're talking about the first window in the tauri.conf.json window config array.
            // WebviewWindowBuilder::from_config(
            //     handle,
            //     &app.config().app.windows.get(0).unwrap().clone(),
            // )?
            // .on_download(|webview, event| {
            //     let download_path = webview
            //         .app_handle()
            //         .path()
            //         .download_dir()
            //         .unwrap_or_default();
            //     match event {
            //         DownloadEvent::Requested { url, destination } => {
            //             println!(
            //                 "downloading {} to {}",
            //                 url,
            //                 destination.clone().to_string_lossy()
            //             );
            //             *destination = download_path.join(&mut *destination);
            //         }
            //         _ => (),
            //     }
            //     // let the download start
            //     true
            // })
            // .build()?;

            Ok(())
        })
        .on_page_load(move |webview, payload| {
            if payload.event() == PageLoadEvent::Started {
                let setting = webview.app_handle().get_store("setting.bin");
                let setting_lang = setting
                    .map(|s| {
                        s.get("setting")
                            .and_then(|v| v.get("lang").and_then(|v| v.as_str().map(String::from)))
                    })
                    .flatten()
                    .unwrap_or(String::clone(&default_lang));

                let script = format!("window.__LANG__ = '{}'", setting_lang);
                let _ = webview.eval(&script);
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn show_window(app: &AppHandle) {
    let windows = app.webview_windows();

    windows
        .values()
        .next()
        .expect("Sorry, no window found")
        .set_focus()
        .expect("Can't Bring Window to Focus");
}
