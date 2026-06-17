
# GameService - 视觉小说引擎 / Visual Novel Engine

# 目前还在开发中敬请期待 / Currently under development, stay tuned

---

## 项目简介 / Project Introduction

Gs 是一个基于 Tauri v2、Vue 3 和 TypeScript 构建的现代化轻量级视觉小说引擎。它利用 Rust 的高性能和安全性处理后端逻辑，同时使用 Vue 3 组合式 API 提供流畅的响应式用户界面，支持视觉小说剧情展示、关卡选择、游戏设置、角色立绘和音频播放等功能。

Gs is a modern, lightweight visual novel engine built with Tauri v2, Vue 3, and TypeScript. It leverages the high performance and security of Rust for backend logic, while using Vue 3 Composition API to provide a smooth, responsive user interface. It supports visual novel story presentation, level selection, game settings, character sprites, and audio playback features.

---

## 技术栈与依赖 / Tech Stack &amp; Dependencies

### 前端 / Frontend
- **Vue.js** (^3.5.13): 渐进式 JavaScript 框架，使用组合式 API / Progressive JavaScript framework using Composition API
- **TypeScript** (~5.6.2): 类型安全的 JavaScript 超集 / Type-safe superset of JavaScript
- **Vue Router** (^5.0.6): Vue.js 官方路由管理器 / Official router manager for Vue.js
- **Vite** (^6.0.3): 下一代前端开发与构建工具 / Next-generation frontend development and build tool
- **Sass** (^1.99.0): CSS 预处理器 / CSS preprocessor

### 后端 (Rust) / Backend (Rust)
- **Tauri** (v2): 用于构建微小、快速且安全的桌面应用框架 / Framework for building tiny, fast, and secure desktop apps
- **Serde** (v1): Rust 序列化框架 / Rust serialization framework
- **Serde JSON** (v1): JSON 数据处理库 / JSON data processing library
- **Rodio** (0.19): 音频播放库 / Audio playback library
- **Base64** (0.22.1): Base64 编码/解码库 / Base64 encoding/decoding library

### Tauri 插件 / Tauri Plugins
- **plugin-opener** (^2): 用于打开 URL 和本地文件 / For opening URLs and local files
- **plugin-fs** (2.5.1): 提供文件系统访问能力 / Provides file system access
- **plugin-process** (2.3.1): 提供进程相关信息和管理能力 / Provides process information and management capabilities

---

## 项目结构 / Project Structure

```
c:\GameProjects\Gs\
├── src/                      # 前端源代码目录 / Frontend source code directory
│   ├── component/            # Vue 组件 / Vue components
│   │   └── CharacterPosition.vue  # 角色立绘显示组件 / Character sprite display component
│   ├── icon/                 # 图标资源 / Icon resources
│   ├── router/               # 路由配置 / Router configuration
│   │   └── index.ts
│   ├── styles/               # 全局样式 / Global styles
│   │   └── styles.css
│   ├── utility/              # 工具函数 / Utility functions
│   │   ├── audioPlayer.ts    # 音频播放器 / Audio player
│   │   ├── character.ts      # 角色管理 / Character management
│   │   ├── image.ts          # 图像处理 / Image processing
│   │   ├── level.ts          # 关卡管理 / Level management
│   │   ├── router.ts         # 路由工具 / Router utilities
│   │   ├── setBack.ts        # 背景设置 / Background settings
│   │   ├── settings.ts       # 设置管理 / Settings management
│   │   └── window.ts         # 窗口管理 / Window management
│   ├── views/                # 页面视图 / Page views
│   │   ├── About.vue         # 关于页面 / About page
│   │   ├── LevelSelect.vue   # 关卡选择页面 / Level selection page
│   │   ├── Levels.vue        # 剧情播放页面 / Story playback page
│   │   ├── Main.vue          # 主菜单页面 / Main menu page
│   │   └── Settings.vue      # 设置页面 / Settings page
│   ├── App.vue               # 根组件 / Root component
│   ├── main.ts               # 应用入口 / Application entry point
│   └── vite-env.d.ts
├── src-tauri/                # Tauri 后端源代码目录 / Tauri backend source code directory
│   ├── capabilities/         # Tauri 权限配置 / Tauri permission configuration
│   ├── gen/                  # 生成的代码（包括 Android 项目） / Generated code (including Android project)
│   ├── icons/                # 应用图标 / Application icons
│   ├── levels/               # 关卡数据 / Level data
│   │   ├── LevelList.json    # 关卡列表 / Level list
│   │   └── level_1.json      # 关卡示例 / Level example
│   ├── src/                  # Rust 源代码 / Rust source code
│   │   ├── commands/         # Tauri 命令 / Tauri commands
│   │   │   ├── audio.rs      # 音频命令 / Audio commands
│   │   │   ├── images.rs     # 图片命令 / Image commands
│   │   │   ├── levels.rs     # 关卡命令 / Level commands
│   │   │   ├── mod.rs
│   │   │   └── settings.rs   # 设置命令 / Settings commands
│   │   ├── lib.rs            # 库入口 / Library entry point
│   │   └── main.rs           # 主入口 / Main entry point
│   ├── user/                 # 用户数据 / User data
│   │   └── Settings.json     # 用户设置 / User settings
│   ├── Cargo.lock
│   ├── Cargo.toml
│   ├── build.rs
│   ├── schema.config.json
│   └── tauri.conf.json       # Tauri 配置 / Tauri configuration
├── public/                   # 公共资源 / Public resources
├── package.json
├── tsconfig.json
├── vite.config.ts
└── LICENSE.md
```

---

## 主要功能 / Main Features

1. **视觉小说剧情展示 / Visual Novel Story Presentation**
   - 支持自定义背景图片切换 / Supports custom background image switching
   - 支持角色立绘显示和位置调整 / Supports character sprite display and position adjustment
   - 支持对话系统 / Supports dialogue system

2. **关卡系统 / Level System**
   - JSON 格式的关卡数据 / JSON-formatted level data
   - 关卡选择界面 / Level selection interface
   - 分支剧情支持 / Branching story support

3. **音频系统 / Audio System**
   - 背景音乐（BGM）循环播放 / Background music (BGM) loop playback
   - 对话语音播放 / Dialogue voice playback
   - 音效（SFX）播放 / Sound effect (SFX) playback
   - 音量控制 / Volume control

4. **设置系统 / Settings System**
   - 窗口设置（大小、全屏） / Window settings (size, fullscreen)
   - 游戏设置（自动播放、自动保存） / Game settings (auto-play, auto-save)
   - 音频设置（音量、开关） / Audio settings (volume, toggles)
   - 文本设置（速度、大小、位置、对齐） / Text settings (speed, size, position, alignment)

5. **用户界面 / User Interface**
   - 现代化的主菜单 / Modern main menu
   - 响应式设计 / Responsive design
   - 流畅的动画效果 / Smooth animation effects

---

## 关卡数据格式 / Level Data Format

关卡数据使用 JSON 格式存储，支持以下类型：

Level data is stored in JSON format and supports the following types:

### 关卡列表 (LevelList.json)
```json
[
  {
    "levelID": "1",
    "levelName": "Level 1",
    "levelTitle": "Abydos Council Room",
    "levelBgm": "audio/bgm/theme_06.ogg",
    "levelBack": "images/background/bg_abydoscouncilroom.jpg",
    "levelStandingIllustration": "images/Character/Abydos/CountermeasuresCommittee/ShirokoSunaookami/01.webp",
    "levelFile": "levels/level_1.json"
  }
]
```

### 关卡剧情 (level_1.json)
```json
[
  {
    "type": "SetBack",
    "id": 1,
    "next": 2,
    "back": "images/background/example.jpg"
  },
  {
    "type": "SetCharacter",
    "id": 2,
    "next": 3,
    "character": "HoshinoTakanashi",
    "position": [1, 0, 0],
    "illustrationNumber": 1
  },
  {
    "type": "PlayBgm",
    "id": 3,
    "next": 4,
    "src": "audio/bgm/theme_01.ogg",
    "volume": 0.8
  },
  {
    "type": "Dialogue",
    "id": 4,
    "next": 5,
    "text": "这是一句对话。",
    "character": "HoshinoTakanashi",
    "vocSrc": "audio/voice/example.ogg"
  }
]
```

---

## 推荐 IDE 设置 / Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/)
- [Vue - Official](https://marketplace.visualstudio.com/items?itemName=Vue.volar)
- [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode)
- [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

---

## 快速开始 / Quick Start

### 前置要求 / Prerequisites

- **Node.js** (版本 18 或更高 / Version 18 or higher)
- **Rust** (使用 rustup 安装 / Install using rustup)
- **Tauri CLI** (通过 npm 安装 / Install via npm)

### 安装与运行 / Installation &amp; Running

1. 安装前端依赖 / Install frontend dependencies：
```bash
npm install
```

2. 启动开发服务器 / Start development server：
```bash
npm run tauri dev
```

3. 构建发行版 / Build release version：
```bash
npm run tauri build
```

### 其他命令 / Other Commands

- 只启动前端开发服务器 / Start only frontend dev server：
```bash
npm run dev
```

- 构建前端 / Build frontend：
```bash
npm run build
```

---

## 贡献说明 / Contribution Notice

由于本项目采用私有协议，如需对项目进行贡献，请先联系原作者获取书面许可。

Due to the private license of this project, please contact the original author for written permission before making any contributions.

未经授权，不得 / Unauthorized, you may not：
- 公开发布修改后的版本 / Publicly release modified versions
- 以自己名义分享本项目的任何衍生作品 / Share any derivative works of this project under your own name

---

## 许可证 / License

本项目采用**仅供学习使用协议**（Non-Commercial &amp; No-Redistribution License）。

This project uses the **Non-Commercial &amp; No-Redistribution License**.

### 许可证要点 / Key License Points

- **仅用于个人学习、研究或教学目的** / For personal learning, research, or educational purposes only
- **严禁商业使用** / Commercial use strictly prohibited
- **严禁再分发** / Redistribution strictly prohibited
- **严禁修改后公开发布** / Public release of modified versions strictly prohibited

详见完整的 [LICENSE.md](file:///c:/GameProjects/Gs/LICENSE.md) 文件。

See the complete [LICENSE.md](file:///c:/GameProjects/Gs/LICENSE.md) file for details.
