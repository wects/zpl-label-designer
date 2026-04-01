# 产品需求文档 (PRD) - ZPL Label Designer (zpl_label_designer)

## 1. 项目背景与目标 (Background & Objectives)
### 1.1 项目背景
在物流、仓储及零售行业中，Zebra 打印机使用的 ZPL (Zebra Programming Language) 是事实上的行业标准。然而，直接编写 ZPL 代码门槛高且不直观。现有的开源 ZPL 设计器往往功能单一或界面过时。

### 1.2 项目目标
本项目旨在开发一个现代化的、交互式的 Web 标签设计器（Proof of Concept），允许用户通过拖拽和可视化界面设计 ZPL 标签，支持模板加载、实时预览以及多种图形/条码元素的生成。

---

## 2. 技术栈 (Technology Stack)
*   **前端框架**: [Nuxt 3](https://nuxt.com/) (Vue 3, Vite, TypeScript)
*   **画布引擎**: [Fabric.js](http://fabricjs.com/) (当前版本) / 规划迁移至 [Konva.js](https://konvajs.org/)
*   **ZPL 渲染**: [zpl-renderer-js](https://github.com/vibrance/zpl-renderer-js) (用于实时生成 PNG 预览)
*   **条码生成**: [bwip-js](https://github.com/metafloor/bwip-js) (用于画布可视化及 Codabar 等复杂条码的 Polyfill)
*   **UI 风格**: 原生 CSS 定制，采用现代暗色调与玻璃拟态 (Glassmorphism) 设计。

---

## 3. 功能需求 (Functional Requirements)

### 3.1 画布编辑功能
*   **多区域支持 (Multi-Zone)**: 支持定义多个设计区域（如区域 1、区域 2），每个区域可独立设置高度和垂直偏移。
*   **元素添加**:
    *   **Native Text**: 支持 ZPL 原生字体（^A0N）的文本添加。
    *   **Native Barcode**: 支持 Code 128 条码设计，可配置是否显示人力可读文本 (Human Readable) 及其位置。
    *   **2D Barcode**: 支持 QR Code 和 DataMatrix 原生指令。
    *   **Graphic Text**: 支持渲染任意字体（如中文字体）并转换为 ZPL 图形指令（^GFA）。
    *   **Image Support**: 支持上传 JPG/PNG 图片并自动转换为 ZPL 的十六进制图形数据。
*   **元素操作**: 支持点击选择、拖拽移动、删除（自带删除图标小部件）、数值微调（位置、Mag、值）。

### 3.2 模板管理
*   **ZPL 加载**: 用户可粘贴原始 ZPL 代码，系统将自动解析并提取单个标签。
*   **背景参考**: 支持将现有 ZPL 标签作为背景载入，用户可在现有标签基础上进行叠加设计。

### 3.3 布局配置
*   **标签尺寸**: 预设多种常用尺寸（4x6", 4x6.75", 4x8", 4x9"）。
*   **区域拖拽**: 提供迷你预览图，支持通过拖拽手柄直观调整设计区域的位置和大小。

### 3.4 预览与输出
*   **实时预览**: 自动将设计内容渲染为 PNG 图像。
*   **ZPL 生成**: 
    *   **完整模式**: 包含背景模板与设计增量的完整代码。
    *   **纯设计模式**: 仅包含当前设计器产出的指令。
*   **导出功能**: 支持一键复制 ZPL 代码或下载 `.ZPL` 文件。

---

## 4. 非功能需求 (Non-functional Requirements)
*   **易用性**: 界面简洁直观，无需深厚的 ZPL 知识即可完成设计。
*   **响应式**: 适配桌面端操作，具备流畅的拖放体验。
*   **准确性**: 产出的 ZPL 代码需符合 Zebra 标准，确保在物理打印机上效果与预览一致。

---

## 5. 路线图 (Roadmap / Future Tasks)
1.  **引擎迁移**: 完成从 Fabric.js 到 Konva.js 的全面迁移，以提升性能和架构清晰度。
2.  **条码加强**: 增加更多 ZPL 原生条码支持（如 PDF417, EAN-13）。
3.  **对齐辅助**: 增加吸附网格、参考线及元素间对齐工具。
4.  **云端存储**: 增加设计草稿和模板的云端保存与分享功能。
