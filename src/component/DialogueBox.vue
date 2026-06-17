<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { Dialogue } from "../utility/level";
import { getCharacterList, Character } from "../utility/character";
import { DialogueAudioPlayer } from "../utility/audioPlayer";
import { getSettings, Settings } from "../utility/settings";

interface DiaLogs {
  characterItem?: Character;
  Dialogue: Dialogue;
}

const diaLogs = ref<DiaLogs>();
const characterList = ref<Character[]>();
const Text = ref<string>("");
const settings = ref<Settings>();
const isInit = ref<boolean>(false);
const isShow = ref<boolean>(false);
const DialoguePlayer = DialogueAudioPlayer.getInstance();

onMounted(async () => {
  characterList.value = await getCharacterList();
  settings.value = await getSettings();
  isInit.value = true;
  console.log(settings.value);
});

function setDiaLogs(diaLog: Dialogue) {
  if (!isInit.value) return setTimeout(() => setDiaLogs(diaLog), 100);
  if (!isShow.value) HideOrShow();
  if (!diaLogs.value) {
    diaLogs.value = { Dialogue: diaLog };
  } else {
    diaLogs.value.Dialogue = diaLog;
  }
  if (!characterList.value) return;

  const matchedChar = characterList.value.find(
    (item) => item.name === diaLog.character,
  );

  const textArray = diaLog.text.split("");
  const Speed = [0, 200, 175, 150, 125, 100, 75 , 50, 25, 10, 0];

  textArray.forEach((_, index) => {
    setTimeout(() => {
      setText(textArray.slice(0, index + 1).join(""));
    }, index * Speed[settings.value!.TextSettings.textSpeed]);
  });

  if (matchedChar && diaLogs.value) {
    diaLogs.value.characterItem = matchedChar;
  } else if (diaLogs.value) {
    diaLogs.value.characterItem = undefined;
  }

  if (diaLog.vocSrc) {
    if (diaLogs.value.Dialogue.volume) {
      DialogueAudioPlayer.getInstance().setVolume(
        diaLogs.value.Dialogue.volume * settings.value!.AudioSettings.voiceVolume,
      );
    } else {
      DialogueAudioPlayer.getInstance().setVolume(
        settings.value!.AudioSettings.voiceVolume,
      );
    }
    DialoguePlayer.play(diaLog.vocSrc);
  }
}

function setText(text: string) {
  Text.value = text;
}


function HideOrShow() {
  isShow.value = !isShow.value;
}

defineExpose({ setDiaLogs, HideOrShow });
</script>

<template>
  <div class="dialogue-box" :style="{ opacity: isShow ? 1.0 : 0.0 }">
    <h1 class="nameCN">
      <span class="name">{{ diaLogs?.characterItem?.nameCN }} </span
      ><span class="club">{{ diaLogs?.characterItem?.club![0] }}</span>
    </h1>
    <hr />
    <p class="dialogue">{{ Text }}</p>
  </div>
</template>

<style lang="scss" scoped>
.dialogue-box {
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 998;
  width: 100%;
  height: 30%;
  background-color: #00000080;
  hr {
    border: none;
    border-top: 1px solid #ffffff;
    margin: 0.3rem;
  }
  .name {
    vertical-align: bottom;
    color: #ffffff;
    text-shadow: 0 0 5px #ffffff50;
    font-size: 1.5rem;
    margin-right: 0.5rem;
  }
  .club {
    vertical-align: bottom;
    color: #acbfff;
    text-shadow: 0 0 5px #ffffff50;
  }
  .dialogue {
    color: #ffffff;
    text-shadow: 0 0 5px #ffffff50;
    padding: 0.3rem;
  }
}
</style>
