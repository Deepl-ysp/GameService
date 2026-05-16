use std::fs;
use base64::engine::general_purpose::STANDARD;
use base64::Engine;
use tauri::path::BaseDirectory;
use tauri::Manager;

#[allow(non_snake_case)]
#[tauri::command]
pub fn getImage(app_handle: tauri::AppHandle, path: String) -> Result<String, String> {
    let resource_path = app_handle.path()
        .resolve(&path, BaseDirectory::Resource)
        .map_err(|e| format!("路径解析失败: {}", e))?;


    let image_data = fs::read(&resource_path)
        .map_err(|e| format!("文件读取失败: {}，路径: {:?}", e, resource_path))?;

    // Base64 编码
    let base64_image = STANDARD.encode(&image_data);
    Ok(base64_image)
}