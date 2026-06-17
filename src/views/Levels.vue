<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from "vue";
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
import DialogueBox from "../component/DialogueBox.vue";
import { setBack } from "../utility/setBack";
import { BgmAudioPlayer, DialogueAudioPlayer } from "../utility/audioPlayer";
import { useGoToRouter } from "../utility/router";
import { getSettings, Settings } from "../utility/settings";

const { goToRouter, back, reload } = useGoToRouter();
const route = useRoute();
const settings = ref<Settings>();
const Levels = ref<LevelSelect>();
const LevelData = ref<Level[]>();
const Plot = ref<PlotItem[]>();
const Container = ref<HTMLElement | null>();
const BgmPlayer = ref<BgmAudioPlayer>();
const DialoguePlayer = ref<DialogueAudioPlayer>();
const CharacterRef = ref();
const DialogBoxRef = ref();
const MainMenuRef = ref<HTMLElement | null>(null);
const isMainMenu = ref<boolean>(false);
let CurrentIndex: number = 0;
let TargetIndex: number = 0;
let debounceTimer: number | null = null;

onMounted(async () => {
  if (MainMenuRef.value) {
    MainMenuRef.value.classList.add("shrink");
    MainMenuRef.value.style.display = "none";
  }
  settings.value = await getSettings();

  window.addEventListener("keydown", handleEscKey);

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

onUnmounted(() => {
  if (debounceTimer) clearTimeout(debounceTimer);
  window.removeEventListener("keydown", handleEscKey);
});

function handleEscKey(event: KeyboardEvent) {
  if (event.key !== "Escape") return;
  event.preventDefault();

  if (debounceTimer) return;
  debounceTimer = window.setTimeout(() => {
    debounceTimer = null;
    toggleMenu();
  }, 300);
}
function toggleMenu() {
  if (!MainMenuRef.value) return;
  const isVisible = getComputedStyle(MainMenuRef.value).display !== "none";
  if (isVisible) {
    shrinkAndHide(MainMenuRef.value);
  } else {
    expandAndShow(MainMenuRef.value, "flex");
  }
}

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
        break;
      default:
        break;
    }
  });
  return res;
}

function next(): void {
  CurrentIndex++;
  TargetIndex++;
}

function SetBackGround(Plot: SetBack): PlotItem {
  if (Plot.container) {
    const H = document.querySelector(Plot.container) as HTMLElement;
    return {
      ret:() => {
        setBack(H, Plot.back);
      },
      id:Plot.id,
      next:Plot.next,
      type:"SetBack",
     };
  }
  return {
    ret:() => {
      setBack(Container.value!, Plot.back);
    },
    id:Plot.id,
    next:Plot.next,
    type:"SetBack",
   };
}


function SetBackGroundMethod(Plot: PlayBgm): PlotItem {
  if (!Plot.volume) {
    return {
      ret: () => {
        if (!BgmPlayer.value) {
          BgmPlayer.value = BgmAudioPlayer.getInstance();
        }
        BgmPlayer.value.play(Plot.src);
      },
      id: Plot.id,
      next: Plot.next,
      type: "PlayBgm",
    };
  } else {
    return {
      ret: () => {
        if (!BgmPlayer.value) {
          BgmPlayer.value = BgmAudioPlayer.getInstance();
        }
        BgmPlayer.value.play(Plot.src);
        BgmPlayer.value.setVolume(Plot.volume!);
      },
      id: Plot.id,
      next: Plot.next,
      type: "PlayBgm",
    };
  }
}

function SetDialogue(Plot: Dialogue): PlotItem {
  function ret(): void {
    DialogBoxRef.value?.setDiaLogs(Plot);
    if (DialoguePlayer.value)
      DialoguePlayer.value = DialogueAudioPlayer.getInstance();
    if (Plot.vocSrc && DialoguePlayer.value)
      DialoguePlayer.value.play(Plot.vocSrc);
    if (Plot.volume && DialoguePlayer.value)
      DialoguePlayer.value.setVolume(Plot.volume);
  }
  return { ret: ret, id: Plot.id, next: Plot.next, type: "Dialogue" };
}

function SetCharacters(Plot: SetCharacter): PlotItem {
  return {
    ret:() => {
      CharacterRef.value.renderCharacter(
        Plot.character,
        Plot.position,
        Plot.illustrationNumber,
      );
    },
    id:Plot.id,
    next:Plot.next,
    type:"SetCharacter",
  };
}

function shrinkAndHide(element: HTMLElement, callback?: () => void) {
  element.classList.add("shrink-transition");
  element.classList.add("shrink");
  element.offsetHeight;
  const onTransitionEnd = (e: TransitionEvent) => {
    if (e.target === element && e.propertyName === "transform") {
      element.style.display = "none";
      element.removeEventListener("transitionend", onTransitionEnd);
      callback?.();
    }
  };
  element.addEventListener("transitionend", onTransitionEnd);
  setTimeout(() => {
    if (getComputedStyle(element).display !== "none") {
      element.style.display = "none";
      callback?.();
    }
  }, 500);
}

function continueGame(event: Event): void {
  // 将 currentTarget 断言为 HTMLElement，并可选链访问 parentNode
  const parentDiv = (event.currentTarget as HTMLElement)?.parentNode
    ?.parentNode as HTMLElement | null;
  if (!parentDiv) return;

  const computedStyle = window.getComputedStyle(parentDiv);
  const width = computedStyle.getPropertyValue("width");
  const height = computedStyle.getPropertyValue("height");
  if (width !== "0px" || height !== "0px") {
    shrinkAndHide(parentDiv);
    isMainMenu.value = true;
  } else {
    isMainMenu.value = false;
  }
}

function expandAndShow(
  element: HTMLElement,
  displayStyle: string = "",
  callback?: () => void,
) {
  // 如果元素当前不可见，先设置为正确的显示方式
  if (getComputedStyle(element).display === "none") {
    element.style.display = displayStyle || "flex";
  }
  // 强制重绘，使 display 生效
  element.offsetHeight;

  // 添加过渡类（如果还没加）
  element.classList.add("shrink-transition");
  // 移除 shrink 类，触发从 scale(0) 到 scale(1) 的过渡
  element.classList.remove("shrink");

  const onTransitionEnd = (e: TransitionEvent) => {
    if (e.target === element && e.propertyName === "transform") {
      // 动画完成后清理过渡类，并清除可能的内联样式
      element.classList.remove("shrink-transition");
      element.style.transform = "";
      element.style.opacity = "";
      element.style.display = ""; // 恢复原始样式
      element.removeEventListener("transitionend", onTransitionEnd);
      callback?.();
    }
  };
  element.addEventListener("transitionend", onTransitionEnd);

  // 保底定时器
  setTimeout(() => {
    if (element.classList.contains("shrink-transition")) {
      element.classList.remove("shrink-transition");
      element.style.transform = "";
      element.style.opacity = "";
      callback?.();
    }
  }, 500);
}

function pauseGame(): void {
  if (!MainMenuRef.value) return;
  // 如果主菜单当前是隐藏状态，则展开
  if (getComputedStyle(MainMenuRef.value).display === "none") {
    expandAndShow(MainMenuRef.value, "flex", () => {
      isMainMenu.value = false; // 根据你的逻辑调整
    });
  } else {
    // 如果已经显示，可以再次收缩（根据需求决定）
    // shrinkAndHide(mainMenuRef.value);
  }
}
</script>

<template>
  <div id="PlotContainer">
    <CharacterPosition ref="CharacterRef" />
    <DialogueBox ref="DialogBoxRef" class="DialogueBox" />
  </div>
  <div id="MainMeun" ref="MainMenuRef">
    <div class="MainMeun">
      <h1>游戏暂停中</h1>
      <button @click="continueGame">继续游戏</button>
      <button @click="reload">重新开始</button>
      <button @click="goToRouter('/settings')">游戏设置</button>
      <button @click="back">退出本章</button>
    </div>
  </div>
  <div id="BottonMeun">
    <button><img src="../icon/back.ico" /></button>
    <button @click=""><img src="../icon/auto.ico" /></button>
    <button><img src="../icon/forward.ico" /></button>
    <button><img src="../icon/fastForward.ico" /></button>
    <button @click="DialogBoxRef.HideOrShow">
      <img src="../icon/hide.ico" />
    </button>
    <button @click="pauseGame"><img src="../icon/settings.ico" /></button>
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
  z-index: 998;
  button {
    background: none;
    border: none;
    color: white;
  }
  button:hover {
    background-color: rgba(255, 255, 255, 0.5);
  }
  img {
    filter: invert(1);
    mix-blend-mode: plus-lighter;
    width: 100%;
    height: 100%;
    padding: 0.2rem;
  }
}
#MainMeun {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-content: center;
  align-items: center;
  background-color: #000000aa;
  z-index: 999;
  .MainMeun {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-content: center;
    align-items: center;
    width: 80%;
    height: 80%;
    gap: 0.35rem;
  }
  h1 {
    font-size: 3rem;
    color: white;
  }
  button {
    font-size: 1.5rem;
    background: #00ffff55;
    color: white;
    width: 30%;
    height: 15%;
    border: none;
    border-radius: 50px;
    border: solid 3px #ffffff80;
    box-shadow: 0 0 20px white;
  }
}
.shrink-transition {
  transition:
    transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    opacity 0.3s ease;
  transform-origin: center center;
}
.shrink {
  transform: scale(0) !important;
  opacity: 0 !important;
}
</style>
