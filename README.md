# ZPL Label Designer (zpl_label_designer)

A modern, interactive Web ZPL Label Designer (Proof of Concept) built with Nuxt 3 and Fabric.js (planning to transition to Konva.js).

## Features

- **Interactive Canvas**: Drag and drop elements to design ZPL labels.
- **Multi-Zone Support**: Define and design multiple zones within a single label.
- **Support for Essential Elements**:
  - **Native Text**: Using ZPL ^A0N scalable fonts.
  - **1D Barcode (Code-128)**: Configurable human-readable text position.
  - **2D Barcodes**: Native QR Code (^BQ) and Data Matrix (^BX).
  - **Graphic Text**: Convert any font (e.g., Chinese characters) to ZPL ^GF format.
  - **Image Support**: Upload JPG/PNG images and convert them to ZPL ^GF.
- **Live Preview**: Real-time rendering of designed ZPL to PNG using `zpl-renderer-js`.
- **Template Integration**: Load existing ZPL code as a background template for augmentation.
- **Flexible Dimensions**: Supports multiple label sizes (4x6", 4x6.75", 4x8", etc.).

## Tech Stack

- **Framework**: [Nuxt 3](https://nuxt.com/)
- **Canvas Library**: [Fabric.js](http://fabricjs.com/)
- **ZPL Utilities**:
  - [zpl-renderer-js](https://github.com/vibrance/zpl-renderer-js) for browser-side PNG rendering.
  - [bwip-js](https://github.com/metafloor/bwip-js) for barcode generation.
- **UI**: Vanilla CSS with modern aesthetics.

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or pnpm

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev
```

### Building for Production

```bash
# Generate production bundle
npm run build

# Preview locally
npm run preview
```

## License

MIT License.
