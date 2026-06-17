import { invoke } from "@tauri-apps/api/core";

export interface Character {
    name:string;
    nameCN?:string;
    college?:string;
    club?:Array<string> | string;
    position?:Array<string> | string;
    standingIllustration?:Array<string>;
}

export async function getCharacterList(): Promise<Character[]>{
    const data:string = await invoke("getLevel",{levelFile:"levels/character.json"});
    return JSON.parse(data);
}
