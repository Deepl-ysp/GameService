<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import {
  getLevel,
  Level,
  LevelSelect,
  PlayBgm,
  PlotItem,
  SetBack,
  Dialogue,
  SetCharacter,
} from "../utility/level";
import CharacterPosition from "../component/CharacterPosition.vue";
import { setBack } from "../utility/setBack";
import { BgmAudioPlayer, DialogueAudioPlayer } from "../utility/audioPlayer";

const route = useRoute();
const Levels = ref<LevelSelect>();
const LevelData = ref<Level[]>();
const Plot = ref<PlotItem[]>();
const Container = ref<HTMLElement | null>();
const BgmPlayer = ref<BgmAudioPlayer>();
const DialoguePlayer = ref<DialogueAudioPlayer>();
const CharacterRef = ref()
let CurrentIndex: number = 0;
let TargetIndex: number = 0;

onMounted(async () => {
  const levelsQuery = route.query.data;
  BgmPlayer.value = BgmAudioPlayer.getInstance();
  DialoguePlayer.value = DialogueAudioPlayer.getInstance();
  Container.value = document.getElementById("PlotContainer");
  if (typeof levelsQuery !== "string") {
    console.warn("Levels 查询参数缺失或格式不正确");
    return;
  }
  try {
    Levels.value = JSON.parse(levelsQuery);
    if (Levels.value) {
      LevelData.value = await getLevel(Levels.value.levelFile);
      Plot.value = await Distributor(LevelData.value);
      next();
    }
  } catch (error) {
    console.error("解析 Levels 失败:", error);
  }
});

async function Distributor(Plot: Level[]): Promise<PlotItem[]> {
  const res: PlotItem[] = [];
  Plot.forEach((item) => {
    switch (item.type) {
      case "SetBack":
        res.push(SetBackGround(item));
        break;
      case "PlayBgm":
        res.push(SetBackGroundMethod(item));
        break;
      case "Dialogue":
        res.push(SetDialogue(item));
        break;
      case "SetCharacter":
        res.push(SetCharacters(item));
        console.log(item.character);
        break;
      default:
        break;
    }
  });
  console.log(res);
  return res;
}

function next(): void {
  CurrentIndex++;
  TargetIndex++;
}

function SetBackGround(item: SetBack): PlotItem {
  if (item.container) {
    const H = document.querySelector(item.container) as HTMLElement;
    return [
      () => {
        setBack(H, item.back);
      },
      item.id,
      item.next,
    ] as PlotItem;
  }
  return [
    () => {
      setBack(Container.value!, item.back);
    },
    item.id,
    item.next,
  ] as PlotItem;
}

function SetBackGroundMethod(Plot: PlayBgm): PlotItem {
  if (!Plot.volume) {
    return [
      () => {
        if (!BgmPlayer.value) {
          BgmPlayer.value = BgmAudioPlayer.getInstance();
        }
        BgmPlayer.value.play(Plot.src);
      },
      Plot.id,
      Plot.next,
    ];
  } else {
    return [
      () => {
        if (!BgmPlayer.value) {
          BgmPlayer.value = BgmAudioPlayer.getInstance();
        }
        BgmPlayer.value.play(Plot.src);
        BgmPlayer.value.setVolume(Plot.volume!);
      },
      Plot.id,
      Plot.next,
    ];
  }
}

function SetDialogue(Plot:Dialogue): PlotItem {
  function ret():void{
    if (DialoguePlayer.value) DialoguePlayer.value = DialogueAudioPlayer.getInstance();
    if (Plot.vocSrc && DialoguePlayer.value) DialoguePlayer.value.play(Plot.vocSrc);
    if (Plot.volume && DialoguePlayer.value) DialoguePlayer.value.setVolume(Plot.volume);

  }

  return [ret,Plot.id,Plot.next]
}

function SetCharacters(Plot:SetCharacter):PlotItem{
  CharacterRef.value.renderCharacter(Plot.character,Plot.position,Plot.illustrationNumber)
  return [
    ()=>{},Plot.id,Plot.next
  ]
}

</script>

<template>
  <div id="PlotContainer">
    <CharacterPosition ref="CharacterRef" />
  </div>
  <div id="BottonMeun">
    <button>上一句</button>
    <button>自动播放</button>
    <button>快进</button>
    <button>隐藏</button>
    <button><img src="../icon/settings.ico"></button>
  </div>
</template>

<style lang="scss" scoped>
#PlotContainer {
  width: 100%;
  height: 100%;
}
#BottonMeun {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 30%;
  height: 5%;
  display: flex;
  justify-content: space-evenly;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  button {
    background: none;
    border: none;
    color: white;
  }
  button:hover{
    background-color: rgba(255, 255, 255, 0.5);
  }
  img{
    filter: invert(1);
    mix-blend-mode: plus-lighter;
    width: 100%;
    height: 100%;
  }
}
</style>
