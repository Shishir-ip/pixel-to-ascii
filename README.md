# Pixel to ASCII ⚡

> Turn any image into stunning ASCII and emoji art. Private, instant, and fully customizable.

![Pixel to ASCII](https://img.shields.io/badge/React-18-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Tailwind](https://img.shields.io/badge/Tailwind-4-cyan) ![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

### Core
- **Multiple Output Modes**: ASCII, Colored ASCII, Emoji, Colored Emoji, Block Characters, Braille, Custom
- **Rich Character Sets**: Standard, Detailed, Minimal, Blocks, Binary, Dots, and more
- **Emoji Art**: Multiple emoji ramps (circles, squares, faces, hearts, nature, fire)
- **Live Preview**: Real-time conversion as you adjust settings
- **Image Adjustments**: Brightness, contrast, saturation, gamma, edge detection, dithering
- **Transform Options**: Flip, invert, aspect ratio correction
- **Export Options**: TXT, HTML, PNG (1x/2x/4x), SVG, JSON settings
- **Copy to Clipboard**: Plain text, colored HTML, shareable URLs
- **Preset System**: Built-in presets + save your own
- **100% Private**: All processing happens in your browser - no uploads
- **Responsive Design**: Works beautifully on mobile, tablet, and desktop

### V2 — Next-Level Features
- **🎥 Live Webcam to ASCII**: Stream your webcam and see it as live ASCII/Emoji art at 30fps
- **🎬 Video File Support**: Upload MP4/WebM files for frame-by-frame ASCII video
- **🎵 Audio-Reactive Mode**: Map audio frequencies to ASCII brightness (Labs)
- **🔗 URL Import**: Paste any image URL to convert (with CORS fallback)
- **⚡ Special Effects**: Matrix rain, Cyberpunk glitch, CRT monitor, Neon glow
- **🎨 3D Tilt Preview**: Interactive parallax tilt on the preview card
- **📊 FPS Monitor**: Real-time performance counter for live modes
- **🖼️ Gallery & Inspiration**: Pre-made presets with one-click "Remix"
- **💡 Pro Tips**: Contextual tooltips explaining advanced controls
- **🔧 Web Worker**: Background processing for buttery-smooth UI
- **✨ Shimmer Loading**: Animated ASCII character loading states

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🛠️ Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS 4** - Styling
- **Framer Motion** - Animations & micro-interactions
- **Zustand** - State management
- **Lucide React** - Icons
- **HTML5 Canvas API** - Image processing
- **Web Workers** - Background thread processing
- **Web Audio API** - Audio reactivity
- **MediaRecorder API** - Video export
- **getUserMedia** - Webcam streaming

## 📦 Deployment

### Vercel
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Deploy the dist/ folder
```

### Cloudflare Pages
```bash
npm run build
# Connect your repo and set build command to: npm run build
# Set output directory to: dist
```

## 📦 Deployment

### Vercel
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Deploy the dist/ folder
```

### Cloudflare Pages
```bash
npm run build
# Connect your repo and set build command to: npm run build
# Set output directory to: dist
```

## 🎨 Output Modes

| Mode | Description |
|------|-------------|
| ASCII | Classic character-based art |
| Colored ASCII | ASCII with original pixel colors |
| Emoji | Emoji mosaic based on brightness |
| Colored Emoji | Colored emoji blocks |
| Block | Unicode block characters (░▒▓█) |
| Braille | Braille character art |
| Custom | Your own character set |

## 🔒 Privacy

All image processing happens locally in your browser using the HTML5 Canvas API. No images are ever uploaded to any server. Your images stay completely private.

## 📄 License

MIT License - feel free to use this project however you'd like!
