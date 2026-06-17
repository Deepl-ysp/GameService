mod commands;

use commands::{
    settings::{getSettings,setSettings},
    images::getImage,
    levels::{getLevelList,getLevel},
    audio::{playBgm, stopBgm, setBgmVolume,
            playDialogue, stopDialogue, setDialogueVolume,
            playSfx, stopAllSfx, setSfxVolume},
};

use std::sync::Mutex;
use std::thread;
use std::sync::mpsc::{self, Sender};

pub enum AudioCommand {
    // BGM
    PlayBgm(String),
    StopBgm,
    SetBgmVolume(f32),

    // Dialogue
    PlayDialogue(String),
    StopDialogue,
    SetDialogueVolume(f32),

    // SFX
    PlaySfx(String),
    StopAllSfx,
    SetSfxVolume(f32),
}

pub struct AppState {
    audio_tx: Mutex<Sender<AudioCommand>>,
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let (tx, rx) = mpsc::channel::<AudioCommand>();

    thread::spawn(move || {
        use rodio::{Decoder, OutputStream, Sink, Source};
        use std::fs::File;
        use std::io::BufReader;

        let (_stream, stream_handle) = OutputStream::try_default()
            .expect("Failed to initialize audio output");

        let mut bgm_sink: Option<Sink> = None;
        let mut dialogue_sink: Option<Sink> = None;
        let mut sfx_sinks: Vec<Sink> = Vec::new();
        let mut sfx_volume: f32 = 1.0;   // 全局音效音量

        fn create_looping_sink(stream_handle: &rodio::OutputStreamHandle, path: &str) -> Option<Sink> {
            let file = File::open(path).ok()?;
            let source = Decoder::new(BufReader::new(file)).ok()?;
            let sink = Sink::try_new(stream_handle).ok()?;
            sink.append(source.repeat_infinite());
            sink.play();
            Some(sink)
        }

        fn create_once_sink(stream_handle: &rodio::OutputStreamHandle, path: &str, volume: f32) -> Option<Sink> {
            let file = File::open(path).ok()?;
            let source = Decoder::new(BufReader::new(file)).ok()?;
            let sink = Sink::try_new(stream_handle).ok()?;
            sink.append(source);
            sink.set_volume(volume);
            sink.play();
            Some(sink)
        }

        while let Ok(cmd) = rx.recv() {
            match cmd {
                // BGM
                AudioCommand::PlayBgm(path) => {
                    if let Some(sink) = bgm_sink.take() {
                        sink.stop();
                    }
                    bgm_sink = create_looping_sink(&stream_handle, &path);
                }
                AudioCommand::StopBgm => {
                    if let Some(sink) = bgm_sink.take() {
                        sink.stop();
                    }
                }
                AudioCommand::SetBgmVolume(vol) => {
                    if let Some(sink) = &bgm_sink {
                        sink.set_volume(vol);
                    }
                }

                // Dialogue
                AudioCommand::PlayDialogue(path) => {
                    if let Some(sink) = dialogue_sink.take() {
                        sink.stop();
                    }
                    dialogue_sink = create_once_sink(&stream_handle, &path, 1.0); // 对话默认满音量，通过单独命令调节
                }
                AudioCommand::StopDialogue => {
                    if let Some(sink) = dialogue_sink.take() {
                        sink.stop();
                    }
                }
                AudioCommand::SetDialogueVolume(vol) => {
                    if let Some(sink) = &dialogue_sink {
                        sink.set_volume(vol);
                    }
                }

                // SFX
                AudioCommand::PlaySfx(path) => {
                    sfx_sinks.retain(|s| !s.empty());
                    if let Some(sink) = create_once_sink(&stream_handle, &path, sfx_volume) {
                        sfx_sinks.push(sink);
                    }
                }
                AudioCommand::StopAllSfx => {
                    for sink in sfx_sinks.drain(..) {
                        sink.stop();
                    }
                }
                AudioCommand::SetSfxVolume(vol) => {
                    sfx_volume = vol;
                    // 更新所有现有音效的音量
                    for sink in &sfx_sinks {
                        sink.set_volume(vol);
                    }
                }
            }
        }
    });

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_process::init())
        .manage(AppState {
            audio_tx: Mutex::new(tx),
        })
        .invoke_handler(tauri::generate_handler![
            getSettings,
            setSettings,
            getImage,
            getLevelList,
            getLevel,
            playBgm,
            stopBgm,
            setBgmVolume,
            playDialogue,
            stopDialogue,
            setDialogueVolume,
            playSfx,
            stopAllSfx,
            setSfxVolume,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}