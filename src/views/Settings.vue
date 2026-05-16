<script lang="ts" setup>
import { ref, onMounted, watch } from "vue";
import { getSettings,setSettings,changeInitSettings } from "../utility/settings";
import { useGoToRouter } from "../utility/router";

const { back } = useGoToRouter();
const settings = ref<Awaited<ReturnType<typeof getSettings>> | null>(null);

const activeTab = ref("audio");
const tabs = [
  { key: "audio", label: "音频设置" },
  { key: "game", label: "游戏设置" },
  { key: "text", label: "文本设置" },
  { key: "window", label: "窗口设置" },
];

// 获取 AudioSettings 的所有键
type AudioSettingsType = NonNullable<typeof settings.value>["AudioSettings"];
type AudioSettingKey = keyof AudioSettingsType;

const audioItems = [
  {
    id: "bgmVolume",
    label: "音乐",
    volumeKey: "bgmVolume" as AudioSettingKey,
    enableKey: "isBgmOn" as AudioSettingKey,
  },
  {
    id: "sfxVolume",
    label: "音效",
    volumeKey: "sfxVolume" as AudioSettingKey,
    enableKey: "isSfxOn" as AudioSettingKey,
  },
  {
    id: "voiceVolume",
    label: "语音",
    volumeKey: "voiceVolume" as AudioSettingKey,
    enableKey: "isVoiceOn" as AudioSettingKey,
  },
];

const resolutionOptions = [
  { label: "1920x1080 (Full HD)", value: "1920,1080" },
  { label: "1600x900", value: "1600,900" },
  { label: "1366x768", value: "1366,768" },
  { label: "1280x720 (HD)", value: "1280,720" },
  { label: "1024x576", value: "1024,576" },
];

const selectedResolution = ref("");

const onResolutionChange = () => {
  if (!settings.value) return;
  const [width, height] = selectedResolution.value.split(",").map(Number);
  settings.value.WindowSettings.width = width;
  settings.value.WindowSettings.height = height;
};

watch(
  () => settings.value?.WindowSettings,
  (newWin) => {
    if (newWin) {
      const matched = resolutionOptions.find(
        (opt) => opt.value === `${newWin.width},${newWin.height}`,
      );
      selectedResolution.value = matched
        ? matched.value
        : resolutionOptions[0].value;
    }
  },
  { immediate: true, deep: true },
);

const logSettings = async () => {
  if (!settings.value) return;
  await setSettings(settings.value);
  changeInitSettings(false);
  back();
};

const toggleAudioSetting = (key: AudioSettingKey) => {
  if (!settings.value) return;
  const currentVal = settings.value.AudioSettings[key];
  if (typeof currentVal === "boolean") {
    (settings.value.AudioSettings as any)[key] = !currentVal;
  }
};

onMounted(async () => {
  try {
    settings.value = await getSettings();
  } catch (error) {
    console.error("加载配置失败:", error);
  }
});
</script>

<template>
  <div class="settings-container" v-if="settings">
    <div class="settings-panel">
      <!-- 左侧导航栏 -->
      <div class="sidebar">
        <div
          v-for="tab in tabs"
          :key="tab.key"
          class="tab-item"
          :class="{ active: activeTab === tab.key }"
          @click="activeTab = tab.key"
        >
          {{ tab.label }}
        </div>
      </div>

      <!-- 右侧内容区 -->
      <div class="main-content">
        <!-- 音频设置 -->
        <div v-if="activeTab === 'audio'" class="settings-section">
          <div class="section-title">音频设置</div>
          <div v-for="item in audioItems" :key="item.id" class="setting-row">
            <div class="setting-label">{{ item.label }}</div>
            <div class="setting-control">
              <div class="slider-wrapper">
                <input
                  type="range"
                  v-model.number="settings.AudioSettings[item.volumeKey]"
                  min="0"
                  max="100"
                />
                <span class="value"
                  >{{ settings.AudioSettings[item.volumeKey] }}%</span
                >
              </div>
              <div class="toggle-wrapper">
                <!-- 显示状态 -->
                <span class="status-text">{{
                  settings.AudioSettings[item.enableKey] ? "开启" : "关闭"
                }}</span>
                <!-- 修复：调用专门的切换函数 -->
                <button
                  :class="
                    settings.AudioSettings[item.enableKey]
                      ? 'toggle-btn on'
                      : 'toggle-btn off'
                  "
                  @click="toggleAudioSetting(item.enableKey)"
                ></button>
              </div>
            </div>
          </div>
        </div>

        <!-- 游戏设置 -->
        <div v-if="activeTab === 'game'" class="settings-section">
          <div class="section-title">游戏设置</div>
          <div class="setting-row">
            <div class="setting-label">自动下一句</div>
            <div class="setting-control">
              <div class="toggle-wrapper">
                <span class="status-text">{{
                  settings.GameSettings.isAutoNext ? "开启" : "关闭"
                }}</span>
                <button
                  :class="
                    settings.GameSettings.isAutoNext
                      ? 'toggle-btn on'
                      : 'toggle-btn off'
                  "
                  @click="
                    settings.GameSettings.isAutoNext =
                      !settings.GameSettings.isAutoNext
                  "
                ></button>
              </div>
            </div>
          </div>
          <div class="setting-row">
            <div class="setting-label">自动保存</div>
            <div class="setting-control">
              <div class="toggle-wrapper">
                <span class="status-text">{{
                  settings.GameSettings.isAutoSave ? "开启" : "关闭"
                }}</span>
                <button
                  :class="
                    settings.GameSettings.isAutoSave
                      ? 'toggle-btn on'
                      : 'toggle-btn off'
                  "
                  @click="
                    settings.GameSettings.isAutoSave =
                      !settings.GameSettings.isAutoSave
                  "
                ></button>
              </div>
            </div>
          </div>
        </div>

        <!-- 文本设置 -->
        <div v-if="activeTab === 'text'" class="settings-section">
          <div class="section-title">文本设置</div>
          <div class="setting-row">
            <div class="setting-label">文字速度</div>
            <div class="setting-control">
              <div class="slider-wrapper">
                <input
                  type="range"
                  v-model.number="settings.TextSettings.textSpeed"
                  min="1"
                  max="10"
                />
                <span class="value">{{ settings.TextSettings.textSpeed }}</span>
              </div>
            </div>
          </div>
          <div class="setting-row">
            <div class="setting-label">文字大小</div>
            <div class="setting-control">
              <div class="slider-wrapper">
                <input
                  type="range"
                  v-model.number="settings.TextSettings.textSize"
                  min="20"
                  max="70"
                  step="2"
                />
                <span class="value">{{ settings.TextSettings.textSize }}</span>
              </div>
            </div>
          </div>
          <div class="setting-row">
            <div class="setting-label">文字位置</div>
            <div class="setting-control">
              <select v-model="settings.TextSettings.textPosition">
                <option value="top">顶部</option>
                <option value="center">居中</option>
                <option value="bottom">底部</option>
              </select>
            </div>
          </div>
          <div class="setting-row">
            <div class="setting-label">文字对齐</div>
            <div class="setting-control">
              <select v-model="settings.TextSettings.textAlignment">
                <option value="left">左对齐</option>
                <option value="center">居中</option>
                <option value="right">右对齐</option>
              </select>
            </div>
          </div>
        </div>

        <!-- 窗口设置 -->
        <div v-if="activeTab === 'window'" class="settings-section">
          <div class="section-title">窗口设置</div>
          <div class="setting-row">
            <div class="setting-label">分辨率</div>
            <div class="setting-control">
              <select v-model="selectedResolution" @change="onResolutionChange">
                <option
                  v-for="res in resolutionOptions"
                  :key="res.value"
                  :value="res.value"
                >
                  {{ res.label }}
                </option>
              </select>
            </div>
          </div>
          <div class="setting-row">
            <div class="setting-label">全屏</div>
            <div class="setting-control">
              <div class="toggle-wrapper">
                <span class="status-text">{{
                  settings.WindowSettings.isFullscreen ? "开启" : "关闭"
                }}</span>
                <button
                  :class="
                    settings.WindowSettings.isFullscreen
                      ? 'toggle-btn on'
                      : 'toggle-btn off'
                  "
                  @click="
                    settings.WindowSettings.isFullscreen =
                      !settings.WindowSettings.isFullscreen
                  "
                ></button>
              </div>
            </div>
          </div>
        </div>

        <!-- 底部按钮区域 -->
        <div class="action-buttons">
          <button class="btn-apply" @click="logSettings">应用配置并返回</button>
          <button class="btn-done" @click="back">返回首页内容</button>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="loading">加载配置中...</div>
</template>

<style lang="scss" scoped>
/* 样式部分保持不变 */
.settings-container {
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  padding: 2rem;
  box-sizing: border-box;
}

.settings-panel {
  display: flex;
  width: 100%;
  max-width: 1200px;
  height: 100%;
  background: #0000004d;
  backdrop-filter: blur(12px);
  border-radius: 28px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 20px 35px rgba(0, 0, 0, 0.4);
}

/* 左侧导航栏 */
.sidebar {
  width: 220px;
  background: #0000004d;
  padding: 2rem 0;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  overflow: auto;
}

.tab-item {
  padding: 0.8rem 1.5rem;
  margin: 0 1rem;
  border-radius: 40px;
  color: #dddddd;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }

  &.active {
    background: #ffaa44;
    color: #1e1e1e;
    font-weight: 500;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  }
}

/* 右侧主内容 */
.main-content {
  flex: 1;
  padding: 2rem 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 3px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 3px;
  }
}

.settings-section {
  flex: 1;
}

.section-title {
  font-size: 1.6rem;
  font-weight: 500;
  color: #ffdd99;
  margin-bottom: 1.5rem;
  border-left: 4px solid #ffaa44;
  padding-left: 1rem;
}

.setting-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.8rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);

  .setting-label {
    flex: 0 0 140px;
    color: #e0e0e0;
    font-size: 0.95rem;
  }

  .setting-control {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 1.2rem;
  }
}

/* 滑块样式 */
.slider-wrapper {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  min-width: 200px;

  input[type="range"] {
    flex: 1;
    height: 4px;
    background: #3a4a5a;
    border-radius: 2px;

    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 14px;
      height: 14px;
      background: #ffaa44;
      border-radius: 50%;
      cursor: pointer;
      box-shadow: 0 0 2px white;
    }
  }

  .value {
    background: rgba(0, 0, 0, 0.5);
    padding: 2px 10px;
    border-radius: 20px;
    font-size: 0.8rem;
    color: #ffcc88;
    min-width: 48px;
    text-align: center;
  }
}

/* 开关按钮样式 */
.toggle-wrapper {
  display: flex;
  align-items: center;
  gap: 0.6rem;

  .status-text {
    font-size: 0.9rem;
    color: #ffd966;
  }
}

.toggle-btn {
  position: relative;
  width: 48px;
  height: 24px;
  border-radius: 24px;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;

  &::after {
    content: "";
    position: absolute;
    top: 2px;
    width: 20px;
    height: 20px;
    background-color: white;
    border-radius: 50%;
    transition:
      left 0.2s,
      right 0.2s;
  }

  &.on {
    background-color: #2c7a47;
    &::after {
      left: 2px;
      background-color: #b0ffd0;
    }
  }

  &.off {
    background-color: #5a3e2b;
    &::after {
      right: 2px;
      background-color: #d9d9d9;
    }
  }
}

/* 下拉框样式 */
select {
  background: #1e2a32;
  border: 1px solid #ffaa66;
  border-radius: 20px;
  padding: 6px 20px 6px 12px;
  color: #ffefcf;
  font-size: 0.85rem;
  outline: none;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%23ffaa66' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>");
  background-repeat: no-repeat;
  background-position: right 10px center;

  &:focus {
    border-color: #ffcc88;
    box-shadow: 0 0 0 2px rgba(255, 170, 68, 0.2);
  }
}

/* 底部按钮 */
.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.btn-apply,
.btn-done {
  padding: 8px 28px;
  border-radius: 40px;
  font-size: 0.9rem;
  font-weight: bold;
  cursor: pointer;
  transition:
    transform 0.1s,
    background 0.2s;
  border: none;
}

.btn-apply {
  background: #ffaa44;
  color: #2c1a0a;

  &:hover {
    background: #ffbb55;
    transform: scale(1.02);
  }
}

.btn-done {
  background: rgba(255, 255, 255, 0.2);
  color: #f0e6d2;
  backdrop-filter: blur(4px);

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.02);
  }
}

.loading {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffe0b5;
  background: transparent;
  font-size: 1.2rem;
}
</style>