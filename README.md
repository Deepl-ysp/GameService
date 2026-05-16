
# GameService - 视觉小说引擎

## 项目简介

Gs 是一个基于 Tauri v2、Vue 3 和 TypeScript 构建的现代化轻量级视觉小说引擎。它利用 Rust 的高性能和安全性处理后端逻辑，同时使用 Vue 3 组合式 API 提供流畅的响应式用户界面，支持视觉小说剧情展示、关卡选择、游戏设置、角色立绘和音频播放等功能。

## 技术栈与依赖

### 前端
- **Vue.js** (^3.5.13): 渐进式 JavaScript 框架，使用组合式 API
- **TypeScript** (~5.6.2): 类型安全的 JavaScript 超集
- **Vue Router** (^5.0.6): Vue.js 官方路由管理器
- **Vite** (^6.0.3): 下一代前端开发与构建工具
- **Sass** (^1.99.0): CSS 预处理器

### 后端 (Rust)
- **Tauri** (v2): 用于构建微小、快速且安全的桌面应用框架
- **Serde** (v1): Rust 序列化框架
- **Serde JSON** (v1): JSON 数据处理库
- **Rodio** (0.19): 音频播放库
- **Base64** (0.22.1): Base64 编码/解码库

### Tauri 插件
- **plugin-opener** (^2): 用于打开 URL 和本地文件
- **plugin-fs** (2.5.1): 提供文件系统访问能力
- **plugin-process** (2.3.1): 提供进程相关信息和管理能力

## 项目结构

```
c:\GameProjects\Gs\
├── src/                      # 前端源代码目录
│   ├── component/            # Vue 组件
│   │   └── CharacterPosition.vue  # 角色立绘显示组件
│   ├── icon/                 # 图标资源
│   ├── router/               # 路由配置
│   │   └── index.ts
│   ├── styles/               # 全局样式
│   │   └── styles.css
│   ├── utility/              # 工具函数
│   │   ├── audioPlayer.ts    # 音频播放器
│   │   ├── character.ts      # 角色管理
│   │   ├── image.ts          # 图像处理
│   │   ├── level.ts          # 关卡管理
│   │   ├── router.ts         # 路由工具
│   │   ├── setBack.ts        # 背景设置
│   │   ├── settings.ts       # 设置管理
│   │   └── window.ts         # 窗口管理
│   ├── views/                # 页面视图
│   │   ├── About.vue         # 关于页面
│   │   ├── LevelSelect.vue   # 关卡选择页面
│   │   ├── Levels.vue        # 剧情播放页面
│   │   ├── Main.vue          # 主菜单页面
│   │   └── Settings.vue      # 设置页面
│   ├── App.vue               # 根组件
│   ├── main.ts               # 应用入口
│   └── vite-env.d.ts
├── src-tauri/                # Tauri 后端源代码目录
│   ├── capabilities/         # Tauri 权限配置
│   ├── gen/                  # 生成的代码（包括 Android 项目）
│   ├── icons/                # 应用图标
│   ├── levels/               # 关卡数据
│   │   ├── LevelList.json    # 关卡列表
│   │   └── level_1.json      # 关卡示例
│   ├── src/                  # Rust 源代码
│   │   ├── commands/         # Tauri 命令
│   │   │   ├── audio.rs      # 音频命令
│   │   │   ├── images.rs     # 图片命令
│   │   │   ├── levels.rs     # 关卡命令
│   │   │   ├── mod.rs
│   │   │   └── settings.rs   # 设置命令
│   │   ├── lib.rs            # 库入口
│   │   └── main.rs           # 主入口
│   ├── user/                 # 用户数据
│   │   └── Settings.json     # 用户设置
│   ├── Cargo.lock
│   ├── Cargo.toml
│   ├── build.rs
│   ├── schema.config.json
│   └── tauri.conf.json       # Tauri 配置
├── public/                   # 公共资源
├── package.json
├── tsconfig.json
├── vite.config.ts
└── LICENSE
```

## 主要功能

1. **视觉小说剧情展示**
   - 支持自定义背景图片切换
   - 支持角色立绘显示和位置调整
   - 支持对话系统

2. **关卡系统**
   - JSON 格式的关卡数据
   - 关卡选择界面
   - 分支剧情支持

3. **音频系统**
   - 背景音乐（BGM）循环播放
   - 对话语音播放
   - 音效（SFX）播放
   - 音量控制

4. **设置系统**
   - 窗口设置（大小、全屏）
   - 游戏设置（自动播放、自动保存）
   - 音频设置（音量、开关）
   - 文本设置（速度、大小、位置、对齐）

5. **用户界面**
   - 现代化的主菜单
   - 响应式设计
   - 流畅的动画效果

## 关卡数据格式

关卡数据使用 JSON 格式存储，支持以下类型：

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

## 推荐 IDE 设置

- [VS Code](https://code.visualstudio.com/)
- [Vue - Official](https://marketplace.visualstudio.com/items?itemName=Vue.volar)
- [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode)
- [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

## 快速开始

### 前置要求

- **Node.js** (版本 18 或更高)
- **Rust** (使用 rustup 安装)
- **Tauri CLI** (通过 npm 安装)

### 安装与运行

1. 安装前端依赖：
```bash
npm install
```

2. 启动开发服务器：
```bash
npm run tauri dev
```

3. 构建发行版：
```bash
npm run tauri build
```

### 其他命令

- 只启动前端开发服务器：
```bash
npm run dev
```

- 构建前端：
```bash
npm run build
```

## 贡献说明

由于本项目采用私有协议，如需对项目进行贡献，请先联系原作者获取书面许可。

未经授权，不得：
- 公开发布修改后的版本
- 以自己名义分享本项目的任何衍生作品

## 许可证

本项目采用**仅供学习使用协议**（Non-Commercial & No-Redistribution License）。

### 许可证要点

- **仅用于个人学习、研究或教学目的**
- **严禁商业使用**
- **严禁再分发**
- **严禁修改后公开发布**

详见完整的 [LICENSE.md](LICENSE.md) 文件。
