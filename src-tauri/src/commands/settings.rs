use std::fs;
use tauri::Manager;
use tauri::path::BaseDirectory;

#[allow(non_snake_case)]
#[tauri::command]
pub fn getSettings(app_handle: tauri::AppHandle) -> String {
    // 使用 resolve 方法，指定资源目录基址
    let resource_path = app_handle.path()
        .resolve("user/Settings.json", BaseDirectory::Resource);

    match resource_path {
        Ok(path) => {
            // 读取文件
            match fs::read_to_string(path) {
                Ok(content) => content,
                Err(e) => format!("Error reading file: {}", e),
            }
        }
        Err(e) => format!("Error resolving path: {}", e),
    }
}

#[allow(non_snake_case)]
#[tauri::command]
pub fn setSettings(app_handle: tauri::AppHandle, settings: String) {
    // 使用 resolve 方法，指定资源目录基址
    let resource_path = app_handle.path()
        .resolve("user/Settings.json", BaseDirectory::Resource);

    match resource_path {
        Ok(path) => {
            // 写入文件
            match fs::write(path, settings) {
                Ok(_) => println!("File written successfully"),
                Err(e) => println!("Error writing file: {}", e),
            }
        }
        Err(e) => println!("Error resolving path: {}", e),
    }
}