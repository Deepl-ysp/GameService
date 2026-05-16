use std::fs;
use tauri::Manager;
use tauri::path::BaseDirectory;

#[allow(non_snake_case)]
#[tauri::command]
pub fn getLevelList(app_handle: tauri::AppHandle) -> String {
    let resource_path = app_handle.path()
        .resolve("levels/LevelList.json", BaseDirectory::Resource);
    match resource_path {
        Ok(path) => {
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
pub fn getLevel(app_handle: tauri::AppHandle, levelFile: String) -> String { 
    let resource_path = app_handle.path()
        .resolve(&levelFile, BaseDirectory::Resource);
    match resource_path {
        Ok(path) => {
            match fs::read_to_string(path) {
                Ok(content) => content,
                Err(e) => format!("Error reading file: {}", e),
            }
        }
        Err(e) => format!("Error resolving path: {}", e),
    }
}