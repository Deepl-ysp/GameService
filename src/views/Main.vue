<script lang="ts" setup>
import { ref, onMounted, watch } from "vue";
import { exit } from "@tauri-apps/plugin-process";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { toggleFullscreen } from "../utility/window";
import { useGoToRouter } from "../utility/router";
import { getSettings, initSettings, setSettings } from "../utility/settings";

const { goToRouter } = useGoToRouter();
const isCurrentWindow = ref<boolean>(false);
const settings = ref<Awaited<ReturnType<typeof getSettings>> | null>(null);

watch(isCurrentWindow, (newValue) => {
  toggleFullscreen(newValue);
});

onMounted(async () => {
  settings.value = await getSettings();
  if (settings.value) {
    const shouldBeFullscreen = settings.value.WindowSettings.isFullscreen;
    const appWindow = getCurrentWindow();
    const currentFullscreen = await appWindow.isFullscreen();
    
    if (currentFullscreen !== shouldBeFullscreen) {
      await appWindow.setFullscreen(shouldBeFullscreen);
    }
    isCurrentWindow.value = await appWindow.isFullscreen();
    initSettings(settings.value);
    changeFull(shouldBeFullscreen);
  }
});

const emit = defineEmits(['FullScreen']);
const changeFull = (is: boolean) => {
  emit('FullScreen', is);
};

async function quitApp(): Promise<void> {
  try {
    await getCurrentWindow().close();
    setTimeout(() => {
      exit(0);
    }, 100);
  } catch (error) {
    console.error("Failed to quit app:", error);
  }
}

/**
 * @description 切换全屏
 */
async function changeFullscreen() {
  isCurrentWindow.value = !isCurrentWindow.value;
  changeFull(isCurrentWindow.value);
  if (settings.value) {
    settings.value.WindowSettings.isFullscreen = isCurrentWindow.value;
    await setSettings(settings.value);
    initSettings(settings.value);
  } else {
    console.error("Settings is null");
  }
}
</script>

<template>
  <div id="backImage">
    <div id="FunctionMenu">
      <button class="menu-btn primary" @click="goToRouter('/levelSelect')">
        <span class="btn-text">开始游戏</span>
      </button>

      <button class="menu-btn" @click="goToRouter('/settings')">
        <span class="btn-text">游戏设置</span>
      </button>

      <button class="menu-btn" @click="changeFullscreen">
        <span class="btn-text">{{
          isCurrentWindow ? "退出全屏" : "全屏模式"
        }}</span>
      </button>

      <button class="menu-btn" @click="goToRouter('/about')">
        <span class="btn-text">关于我们</span>
      </button>

      <button class="menu-btn danger" @click="quitApp">
        <span class="btn-text">退出游戏</span>
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
#backImage {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url("@/assets/background.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    z-index: 0;
  }

  #FunctionMenu {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    width: 300px;
    padding: 2rem 1.5rem;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-radius: 28px;
    border: 1px solid rgba(255, 255, 255, 0.15);
    box-shadow: 0 20px 35px rgba(0, 0, 0, 0.4);
    transition: all 0.3s ease;
    .menu-btn {
      width: 100%;
      padding: 0.75rem 1rem;
      border-radius: 40px;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      border: none;
      background: rgba(255, 255, 255, 0.08);
      color: #f0f0f0;
      position: relative;
      overflow: hidden;
      .btn-text {
        position: relative;
        z-index: 1;
      }

      &:hover {
        background: rgba(255, 255, 255, 0.2);
        transform: scale(1.02);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
      }

      &:active {
        transform: scale(0.98);
      }

      &.primary {
        background: linear-gradient(135deg, #ffbb55, #4338ca);
        color: white;
        font-weight: 600;

        &:hover {
          background: linear-gradient(135deg, #6366f1, #ffbb55);
          box-shadow: 0 0 12px rgba(79, 70, 229, 0.5);
        }
      }

      &.danger {
        background: rgba(239, 68, 68, 0.2);
        border: 1px solid rgba(239, 68, 68, 0.4);
        color: #fca5a5;

        &:hover {
          background: rgba(239, 68, 68, 0.4);
          border-color: #ef4444;
          color: white;
          box-shadow: 0 0 10px rgba(239, 68, 68, 0.3);
        }
      }
    }
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

#FunctionMenu {
  animation: fadeInUp 0.4s ease-out;
}
</style>
