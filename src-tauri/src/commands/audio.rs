use tauri::{AppHandle, Manager};
use crate::AudioCommand;

// ===================== BGM =====================
#[allow(non_snake_case)]
#[tauri::command]
pub fn playBgm(app_handle: AppHandle, path: String) -> Result<(), String> {
    let state = app_handle.state::<crate::AppState>();
    let tx = state.audio_tx.lock().map_err(|_| "Failed to lock audio channel")?;

    let full_path = app_handle
        .path()
        .resolve(&path, tauri::path::BaseDirectory::Resource)
        .map_err(|e| format!("Path resolution error: {}", e))?;
    let path_str = full_path.to_string_lossy().to_string();

    tx.send(AudioCommand::PlayBgm(path_str))
        .map_err(|_| "Failed to send play BGM command")?;
    Ok(())
}

#[allow(non_snake_case)]
#[tauri::command]
pub fn stopBgm(app_handle: AppHandle) -> Result<(), String> {
    let state = app_handle.state::<crate::AppState>();
    let tx = state.audio_tx.lock().map_err(|_| "Failed to lock audio channel")?;

    tx.send(AudioCommand::StopBgm)
        .map_err(|_| "Failed to send stop BGM command")?;
    Ok(())
}

#[allow(non_snake_case)]
#[tauri::command]
pub fn setBgmVolume(app_handle: AppHandle, volume: f32) -> Result<(), String> {
    let state = app_handle.state::<crate::AppState>();
    let tx = state.audio_tx.lock().map_err(|_| "Failed to lock audio channel")?;

    let vol = volume.clamp(0.0, 1.0);
    tx.send(AudioCommand::SetBgmVolume(vol))
        .map_err(|_| "Failed to send set BGM volume command")?;
    Ok(())
}

// ===================== Dialogue =====================
#[allow(non_snake_case)]
#[tauri::command]
pub fn playDialogue(app_handle: AppHandle, path: String) -> Result<(), String> {
    let state = app_handle.state::<crate::AppState>();
    let tx = state.audio_tx.lock().map_err(|_| "Failed to lock audio channel")?;

    let full_path = app_handle
        .path()
        .resolve(&path, tauri::path::BaseDirectory::Resource)
        .map_err(|e| format!("Path resolution error: {}", e))?;
    let path_str = full_path.to_string_lossy().to_string();

    tx.send(AudioCommand::PlayDialogue(path_str))
        .map_err(|_| "Failed to send play dialogue command")?;
    Ok(())
}

#[allow(non_snake_case)]
#[tauri::command]
pub fn stopDialogue(app_handle: AppHandle) -> Result<(), String> {
    let state = app_handle.state::<crate::AppState>();
    let tx = state.audio_tx.lock().map_err(|_| "Failed to lock audio channel")?;

    tx.send(AudioCommand::StopDialogue)
        .map_err(|_| "Failed to send stop dialogue command")?;
    Ok(())
}

#[allow(non_snake_case)]
#[tauri::command]
pub fn setDialogueVolume(app_handle: AppHandle, volume: f32) -> Result<(), String> {
    let state = app_handle.state::<crate::AppState>();
    let tx = state.audio_tx.lock().map_err(|_| "Failed to lock audio channel")?;

    let vol = volume.clamp(0.0, 1.0);
    tx.send(AudioCommand::SetDialogueVolume(vol))
        .map_err(|_| "Failed to send set dialogue volume command")?;
    Ok(())
}

// ===================== SFX =====================
#[allow(non_snake_case)]
#[tauri::command]
pub fn playSfx(app_handle: AppHandle, path: String) -> Result<(), String> {
    let state = app_handle.state::<crate::AppState>();
    let tx = state.audio_tx.lock().map_err(|_| "Failed to lock audio channel")?;

    let full_path = app_handle
        .path()
        .resolve(&path, tauri::path::BaseDirectory::Resource)
        .map_err(|e| format!("Path resolution error: {}", e))?;
    let path_str = full_path.to_string_lossy().to_string();

    tx.send(AudioCommand::PlaySfx(path_str))
        .map_err(|_| "Failed to send play SFX command")?;
    Ok(())
}

#[allow(non_snake_case)]
#[tauri::command]
pub fn stopAllSfx(app_handle: AppHandle) -> Result<(), String> {
    let state = app_handle.state::<crate::AppState>();
    let tx = state.audio_tx.lock().map_err(|_| "Failed to lock audio channel")?;

    tx.send(AudioCommand::StopAllSfx)
        .map_err(|_| "Failed to send stop all SFX command")?;
    Ok(())
}

#[allow(non_snake_case)]
#[tauri::command]
pub fn setSfxVolume(app_handle: AppHandle, volume: f32) -> Result<(), String> {
    let state = app_handle.state::<crate::AppState>();
    let tx = state.audio_tx.lock().map_err(|_| "Failed to lock audio channel")?;

    let vol = volume.clamp(0.0, 1.0);
    tx.send(AudioCommand::SetSfxVolume(vol))
        .map_err(|_| "Failed to send set SFX volume command")?;
    Ok(())
}