# Gs

## 项目简介 / Introduction

Gs 是一个基于 Tauri v2、Vue 3 和 TypeScript 构建的现代化轻量级桌面应用程序。
Gs is a modern, lightweight desktop application built with Tauri v2, Vue 3, and TypeScript.

它利用 Rust 的高性能和安全性处理后端逻辑。
It leverages the performance and security of Rust for backend operations.

同时使用 Vue 3 组合式 API 提供响应式用户界面。
It provides a responsive user interface using Vue 3's Composition API.

本项目支持本地文件系统访问、进程管理以及音频播放功能。
The application features local file system access, process management, and audio playback capabilities.

---

## 技术栈与依赖 / Tech Stack & Dependencies

### 前端 / Frontend

- **Vue.js** (^3.5.13): 渐进式 JavaScript 框架。
  - **[Vue.js](https://vuejs.org/)** (^3.5.13): The Progressive JavaScript Framework.

- **TypeScript** (~5.6.2): JavaScript 的超集，提供静态类型检查。
  - **[TypeScript](https://www.typescriptlang.org/)** (~5.6.2): Typed superset of JavaScript.

- **Vue Router** (^5.0.6): Vue.js 官方路由管理器。
  - **[Vue Router](https://router.vuejs.org/)** (^5.0.6): Official router for Vue.js.

- **Vite** (^6.0.3): 下一代前端开发与构建工具。
  - **[Vite](https://vitejs.dev/)** (^6.0.3): Next Generation Frontend Tooling.

- **Sass** (^1.99.0): CSS 预处理器。
  - **[Sass](https://sass-lang.com/)** (^1.99.0): CSS preprocessor.

### 后端 (Rust) / Backend (Rust)

- **Tauri** (v2): 用于构建微小、快速且安全的桌面应用框架。
  - **[Tauri](https://tauri.app/)** (v2): Build smaller, faster, and more secure desktop applications with a web frontend.

- **Serde** (v1): Rust 序列化框架。
  - **[Serde](https://serde.rs/)** (v1): Serialization framework for Rust.

- **Serde JSON** (v1): JSON 数据处理库。
  - **[Serde JSON](https://docs.rs/serde_json/)** (v1): JSON support for Serde.

- **Rodio** (0.19): 音频播放库。
  - **[Rodio](https://docs.rs/rodio/)** (0.19): Audio playback library.

- **Base64** (0.22.1): Base64 编码/解码库。
  - **[Base64](https://docs.rs/base64/)** (0.22.1): Base64 encoding/decoding.

### Tauri 插件 / Tauri Plugins

- **plugin-opener** (^2): 用于打开 URL 和本地文件。
  - **[@tauri-apps/plugin-opener](https://github.com/tauri-apps/plugins-workspace/tree/v2/plugins/opener)** (^2): Open URLs and files.

- **plugin-fs** (2.5.1): 提供文件系统访问能力。
  - **[@tauri-apps/plugin-fs](https://github.com/tauri-apps/plugins-workspace/tree/v2/plugins/fs)** (2.5.1): File system access.

- **plugin-process** (2.3.1): 提供进程相关信息和管理能力。
  - **[@tauri-apps/plugin-process](https://github.com/tauri-apps/plugins-workspace/tree/v2/plugins/process)** (2.3.1): Process information and management.

---

## 推荐 IDE 设置 / Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/)
- [Vue - Official](https://marketplace.visualstudio.com/items?itemName=Vue.volar)
- [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode)
- [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

---

## 快速开始 / Getting Started

1. **安装依赖:**
   **Install Dependencies:**
   ```bash
    npm install
    <!-- Run Tauri App -->
    npm run tauri dev
    <!-- Build Tauri App -->
    npm run tauri build
   ```