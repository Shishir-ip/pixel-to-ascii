import { Preset, AsciiSettings } from '../types';

export const CHAR_SETS: Record<string, string> = {
  standard: '@%#*+=-:. ',
  detailed: '$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,"^`\'. ',
  minimal: '@#*:. ',
  blocks: '█▓▒░ ',
  binary: '01 ',
  dots: '⣿⣷⣯⣟⡿⢿⣻⣽⣾ ',
  simple: '#=-. ',
  gradient: '░▒▓█',
};

export const EMOJI_SETS: Record<string, string> = {
  circles: '⚫🌑🌒🌓🌔🌕⚪',
  squares: '⬛🟥🟧🟨🟩🟦🟪⬜',
  faces: '😡😠😐🙂😊😍',
  hearts: '🖤💜💙💚💛🧡❤️🤍',
  nature: '🌑🌿🌞✨',
  fire: '⬛🟥🟧🟨⬜',
  grayscale: '⬛⬜',
  blocks: '🟫🟨🟩🟦',
};

export const BUILT_IN_PRESETS: Preset[] = [
  {
    id: 'classic-ascii',
    name: 'Classic ASCII',
    settings: {
      outputMode: 'ascii',
      charsetPreset: 'standard',
      outputWidth: 120,
      brightness: 0,
      contrast: 0,
      colorMode: 'grayscale',
      backgroundColor: 'dark',
    },
  },
  {
    id: 'dark-terminal',
    name: 'Dark Terminal',
    settings: {
      outputMode: 'ascii',
      charsetPreset: 'detailed',
      outputWidth: 150,
      brightness: 10,
      contrast: 20,
      colorMode: 'grayscale',
      backgroundColor: 'dark',
    },
  },
  {
    id: 'colored-pixel',
    name: 'Colored Pixel Art',
    settings: {
      outputMode: 'colored-ascii',
      charsetPreset: 'blocks',
      outputWidth: 100,
      brightness: 0,
      contrast: 10,
      colorMode: 'color',
      backgroundColor: 'dark',
    },
  },
  {
    id: 'emoji-portrait',
    name: 'Emoji Portrait',
    settings: {
      outputMode: 'emoji',
      emojiPreset: 'circles',
      outputWidth: 60,
      brightness: 0,
      contrast: 10,
      colorMode: 'grayscale',
      backgroundColor: 'dark',
    },
  },
  {
    id: 'minimal-line-art',
    name: 'Minimal Line Art',
    settings: {
      outputMode: 'ascii',
      charsetPreset: 'minimal',
      outputWidth: 100,
      brightness: 0,
      contrast: 40,
      colorMode: 'grayscale',
      backgroundColor: 'dark',
      edgeMode: true,
    },
  },
  {
    id: 'high-contrast',
    name: 'High Contrast',
    settings: {
      outputMode: 'ascii',
      charsetPreset: 'binary',
      outputWidth: 120,
      brightness: 0,
      contrast: 60,
      colorMode: 'grayscale',
      backgroundColor: 'dark',
    },
  },
  {
    id: 'cyberpunk-glow',
    name: 'Cyberpunk Glow',
    settings: {
      outputMode: 'colored-ascii',
      charsetPreset: 'detailed',
      outputWidth: 130,
      brightness: 5,
      contrast: 30,
      saturation: 150,
      colorMode: 'color',
      backgroundColor: 'dark',
    },
  },
  {
    id: 'soft-gradient',
    name: 'Soft Gradient',
    settings: {
      outputMode: 'ascii',
      charsetPreset: 'gradient',
      outputWidth: 120,
      brightness: -10,
      contrast: -10,
      colorMode: 'grayscale',
      backgroundColor: 'light',
    },
  },
  {
    id: 'braille-art',
    name: 'Braille Art',
    settings: {
      outputMode: 'braille',
      outputWidth: 80,
      brightness: 0,
      contrast: 20,
      colorMode: 'grayscale',
      backgroundColor: 'dark',
    },
  },
];

export const DEFAULT_SETTINGS: AsciiSettings = {
  outputMode: 'ascii',
  charsetPreset: 'standard',
  customCharset: '',
  emojiPreset: 'circles',
  customEmojiSet: '',
  outputWidth: 120,
  fontSize: 8,
  lineHeight: 1.0,
  letterSpacing: 0,
  brightness: 0,
  contrast: 0,
  saturation: 100,
  gamma: 1.0,
  invert: false,
  flipHorizontal: false,
  flipVertical: false,
  colorMode: 'grayscale',
  backgroundColor: 'dark',
  customBgColor: '#000000',
  ditheringMode: 'none',
  edgeMode: false,
  aspectCorrection: true,
  transparentBackground: false,
  zoomLevel: 1,
  reverseChars: false,
  charDensity: 1.0,
  visualEffect: 'none',
  effectIntensity: 50,
  mirrorWebcam: true,
  audioSensitivity: 50,
  webcamFps: 30,
};

export const SAMPLE_IMAGES = [
  {
    name: 'Mountain',
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
  },
  {
    name: 'Portrait',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
  },
  {
    name: 'City',
    url: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=400&h=300&fit=crop',
  },
  {
    name: 'Nature',
    url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop',
  },
];

export const MAX_OUTPUT_WIDTH = 300;
export const MAX_OUTPUT_WIDTH_ADVANCED = 500;
export const EMOJI_MAX_WIDTH = 80;
