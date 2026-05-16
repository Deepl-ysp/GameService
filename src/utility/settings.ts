import { invoke } from "@tauri-apps/api/core";
import { setWindowSize } from "./window";
import {
  SFXAudioPlayer,
  DialogueAudioPlayer,
  BgmAudioPlayer,
} from "./audioPlayer";

export interface Settings {
  GameSettings: {
    isAutoNext: boolean;
    isAutoSave: boolean;
  };
  WindowSettings: {
    width: number;
    height: number;
    isFullscreen: boolean;
  };
  AudioSettings: {
    isBgmOn: boolean;
    isVoiceOn: boolean;
    isSfxOn: boolean;
    bgmVolume: number;
    voiceVolume: number;
    sfxVolume: number;
  };
  TextSettings: {
    textSpeed: number;
    textSize: number;
    textPosition: string;
    textAlignment: string;
  };
}

let isInitSettings: boolean = false;
export const bgmPlayer = BgmAudioPlayer.getInstance();
export const sfxPlayer = SFXAudioPlayer.getInstance();
export const dialoguePlayer = DialogueAudioPlayer.getInstance();

export function changeInitSettings(isInit: boolean): void {
  isInitSettings = isInit;
}

export async function initSettings(settings: Settings): Promise<void> {
  if (isInitSettings === true) {
    return;
  }
  if (settings.WindowSettings.isFullscreen === false) {
    await setWindowSize(
      settings.WindowSettings.width,
      settings.WindowSettings.height,
    );
  }
  if (settings.AudioSettings.isBgmOn) {
    await bgmPlayer.play("audios/bgm/theme_07.ogg");
    await bgmPlayer.setVolume(settings.AudioSettings.bgmVolume / 100);
  } else {
    await bgmPlayer.stop();
  }
  if (settings.AudioSettings.isVoiceOn) {
    await dialoguePlayer.setVolume(settings.AudioSettings.voiceVolume / 100);
  }
  if (settings.AudioSettings.isSfxOn) {
    await sfxPlayer.setVolume(settings.AudioSettings.sfxVolume / 100);
  }
  document.documentElement.style.setProperty(
    "--font-size",
    `${settings.TextSettings.textSize / 3}px`,
  );
  isInitSettings = true;
}

/**
 * 获取设置
 * @returns {Promise<Settings>} 包含游戏设置、窗口设置、音频设置和文本设置的对象
 */
export async function getSettings(): Promise<Settings> {
  const jsonString = await invoke<string>("getSettings");
  if (typeof jsonString === "string") {
    return JSON.parse(jsonString) as Settings;
  }
  return jsonString as unknown as Settings;
}

/**
 * 设置设置
 * @param settings 要保存的设置对象
 * @returns {Promise<void>} 无返回值
 */
export async function setSettings(settings: Settings): Promise<void> {
  const jsonString = JSON.stringify(settings);
  await invoke("setSettings", { settings: jsonString });
}
