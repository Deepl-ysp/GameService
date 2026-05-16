import { invoke } from "@tauri-apps/api/core"

export async function playBgm(path?:string): Promise<void> {
    if (path) {
        invoke('playBgm', { path: path });
        console.log("no path")
    } else  {
        invoke('playBgm', { path: "audios/bgm/theme_07.ogg" });
    }
}

/**
 * 音效播放器
 * - 支持多个音效同时播放
 * - 支持全局音量控制
 * - 支持停止所有音效
 */
export class SFXAudioPlayer {
    private static instance: SFXAudioPlayer;

    private constructor() {}

    public static getInstance(): SFXAudioPlayer {
        if (!SFXAudioPlayer.instance) {
            SFXAudioPlayer.instance = new SFXAudioPlayer();
        }
        return SFXAudioPlayer.instance;
    }

    /**
     * 播放一个音效（相对资源目录的路径）
     * @param path 例如 "audio/sfx/click.wav"
     * @returns Promise，成功时 resolved，失败时 rejected
     */
    public async play(path: string): Promise<void> {
        try {
            await invoke('playSfx', { path });
        } catch (error) {
            console.error(`Failed to play SFX "${path}":`, error);
            throw error;
        }
    }

    /**
     * 停止所有正在播放的音效
     */
    public async stopAll(): Promise<void> {
        try {
            await invoke('stopAllSfx');
        } catch (error) {
            console.error('Failed to stop all SFX:', error);
            throw error;
        }
    }

    /**
     * 设置全局音效音量
     * @param volume 音量值 0.0 ~ 1.0
     */
    public async setVolume(volume: number): Promise<void> {
        const clamped = Math.min(1.0, Math.max(0.0, volume));
        try {
            await invoke('setSfxVolume', { volume: clamped });
        } catch (error) {
            console.error('Failed to set SFX volume:', error);
            throw error;
        }
    }
}

/**
 * 对话音频播放器
 * - 一次只播放一个对话，新播放会自动停止旧对话
 * - 支持独立音量控制
 * - 支持停止当前对话
 */
export class DialogueAudioPlayer {
    private static instance: DialogueAudioPlayer;

    private constructor() {}

    public static getInstance(): DialogueAudioPlayer {
        if (!DialogueAudioPlayer.instance) {
            DialogueAudioPlayer.instance = new DialogueAudioPlayer();
        }
        return DialogueAudioPlayer.instance;
    }

    /**
     * 播放一段对话（相对资源目录的路径）
     * 如果已有对话正在播放，会自动停止并替换为新对话
     * @param path 例如 "audio/dialogue/line_01.wav"
     */
    public async play(path: string): Promise<void> {
        try {
            await invoke('playDialogue', { path });
        } catch (error) {
            console.error(`Failed to play dialogue "${path}":`, error);
            throw error;
        }
    }

    /**
     * 停止当前正在播放的对话（如果有）
     */
    public async stop(): Promise<void> {
        try {
            await invoke('stopDialogue');
        } catch (error) {
            console.error('Failed to stop dialogue:', error);
            throw error;
        }
    }

    /**
     * 设置对话音量
     * @param volume 音量值 0.0 ~ 1.0
     */
    public async setVolume(volume: number): Promise<void> {
        const clamped = Math.min(1.0, Math.max(0.0, volume));
        try {
            await invoke('setDialogueVolume', { volume: clamped });
        } catch (error) {
            console.error('Failed to set dialogue volume:', error);
            throw error;
        }
    }
}

/**
 * BGM 音频播放器
 * - 一次只播放一个 BGM，新播放会自动停止旧的 BGM
 * - 支持独立音量控制
 * - 支持停止当前 BGM
 */
export class BgmAudioPlayer {
    private static instance: BgmAudioPlayer;

    private constructor() {}

    public static getInstance(): BgmAudioPlayer {
        if (!BgmAudioPlayer.instance) {
            BgmAudioPlayer.instance = new BgmAudioPlayer();
        }
        return BgmAudioPlayer.instance;
    }

    /**
     * 播放一段 BGM（相对资源目录的路径）
     * 如果已有 BGM 正在播放，会自动停止并替换为新 BGM
     * @param path 例如 "audio/bgm/theme.mp3"
     */
    public async play(path: string): Promise<void> {
        try {
            await invoke('playBgm', { path });
        } catch (error) {
            console.error(`Failed to play BGM "${path}":`, error);
            throw error;
        }
    }

    /**
     * 停止当前正在播放的 BGM（如果有）
     */
    public async stop(): Promise<void> {
        try {
            await invoke('stopBgm');
        } catch (error) {
            console.error('Failed to stop BGM:', error);
            throw error;
        }
    }

    /**
     * 设置 BGM 音量
     * @param volume 音量值 0.0 ~ 1.0
     */
    public async setVolume(volume: number): Promise<void> {
        const clamped = Math.min(1.0, Math.max(0.0, volume));
        try {
            await invoke('setBgmVolume', { volume: clamped });
        } catch (error) {
            console.error('Failed to set BGM volume:', error);
            throw error;
        }
    }
}