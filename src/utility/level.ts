import { invoke } from "@tauri-apps/api/core";

export interface LevelSelect {
  levelID: number;
  levelName: string;
  levelTitle: string;
  levelBgm: string;
  levelBack: string;
  levelStandingIllustration: string;
  levelFile: string;
}


export type PlotItem = [Function|(()=>void)|(()=>Promise<void>), number,number]

export interface BaseLevel {
    type: string;
    id: number;
    next: number;
}

export interface SetBack extends BaseLevel {
    type:"SetBack";
    back: string;
    container?: string;
}

export interface SetCharacter extends BaseLevel {
    type:"SetCharacter";
    character: string;
    position: [number, number, number];
    illustrationNumber: number;
}

export interface PlayBgm extends BaseLevel {
    type:"PlayBgm";
    src: string;
    volume?: number;
}

export interface Dialogue extends BaseLevel {
    type:"Dialogue";
    text: string;
    character: string;
    vocSrc?: string;
    volume?: number;
}

export type Level = SetBack | SetCharacter | PlayBgm | Dialogue;

export async function getLevelList(): Promise<LevelSelect[]>{
    const data:string = await invoke("getLevelList");
    return JSON.parse(data);
}

export async function getLevel(path:string): Promise<Level[]>{
    const data:string = await invoke("getLevel",{levelFile:path});
    return JSON.parse(data);
}
