export type OutputMode = 'ascii' | 'emoji' | 'colored-ascii' | 'colored-emoji' | 'block' | 'braille' | 'custom';

export type ColorMode = 'grayscale' | 'color' | 'gradient';

export type DitheringMode = 'none' | 'threshold' | 'ordered' | 'floyd-steinberg';

export type BackgroundMode = 'dark' | 'light' | 'transparent' | 'custom';

export type MediaMode = 'image' | 'webcam' | 'video' | 'audio' | 'url';

export type VisualEffect = 'none' | 'matrix' | 'glitch' | 'crt' | 'neon' | 'parallax';

export type InputMode = 'upload' | 'preview' | 'controls' | 'export' | 'media' | 'effects' | 'gallery';

export interface AsciiSettings {
  outputMode: OutputMode;
  charsetPreset: string;
  customCharset: string;
  emojiPreset: string;
  customEmojiSet: string;
  outputWidth: number;
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
  brightness: number;
  contrast: number;
  saturation: number;
  gamma: number;
  invert: boolean;
  flipHorizontal: boolean;
  flipVertical: boolean;
  colorMode: ColorMode;
  backgroundColor: BackgroundMode;
  customBgColor: string;
  ditheringMode: DitheringMode;
  edgeMode: boolean;
  aspectCorrection: boolean;
  transparentBackground: boolean;
  zoomLevel: number;
  reverseChars: boolean;
  charDensity: number;
  // V2 fields
  visualEffect: VisualEffect;
  effectIntensity: number;
  mirrorWebcam: boolean;
  audioSensitivity: number;
  webcamFps: number;
}

export interface ImageData {
  file: File | null;
  url: string;
  width: number;
  height: number;
  name: string;
  size: number;
}

export interface Preset {
  id: string;
  name: string;
  settings: Partial<AsciiSettings>;
  isCustom?: boolean;
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}
