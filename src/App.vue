<script lang="ts" setup>
import { onMounted } from "vue";
import { RouterView } from "vue-router";
import { setBack } from "./utility/setBack";

onMounted(async () => {
  await setBack(document.getElementById("TopBack")!);
});
</script>

<template>
  <div id="TopBack">
    <div data-tauri-drag-region id="MoveHeaders"></div>
    <RouterView />
  </div>
</template>

<style lang="scss">

#MoveHeaders {
  width: 100%;
  height: 10px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  cursor: move;
}
#TopBack {
  height: 100vh;
  width: 100vw;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center;
}
</style>
