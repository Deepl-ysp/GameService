import { invoke } from "@tauri-apps/api/core";

/**
 * 获取图片的 Data URL (base64 编码)
 * @param path 图片相对路径，如 "images/test/01.png"（注意不要带 "./"）
 * @returns [string] 可以直接赋给 img.src
 */
export async function getImage(path: string): Promise<string> {
    const base64 = await invoke<string>("getImage", { path });
    const ext = path.split('.').pop()?.toLowerCase();
    let mimeType = 'image/png';
    if (ext === 'jpg' || ext === 'jpeg') mimeType = 'image/jpeg';
    else if (ext === 'png') mimeType = 'image/png';
    else if (ext === 'gif') mimeType = 'image/gif';
    else if (ext === 'webp') mimeType = 'image/webp';
    else if (ext === 'bmp') mimeType = 'image/bmp';
    const dataUrl = `data:${mimeType};base64,${base64}`;
    return dataUrl;
}