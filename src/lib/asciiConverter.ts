import { AsciiSettings } from '../types';
import { CHAR_SETS, EMOJI_SETS } from './constants';

interface PixelData {
  r: number;
  g: number;
  b: number;
  a: number;
}

function getBrightness(pixel: PixelData): number {
  return 0.299 * pixel.r + 0.587 * pixel.g + 0.114 * pixel.b;
}

function applyAdjustments(
  brightness: number,
  contrast: number,
  saturation: number,
  gamma: number,
  pixel: PixelData
): PixelData {
  let { r, g, b } = pixel;

  // Apply gamma
  r = 255 * Math.pow(r / 255, 1 / gamma);
  g = 255 * Math.pow(g / 255, 1 / gamma);
  b = 255 * Math.pow(b / 255, 1 / gamma);

  // Apply brightness
  r += brightness * 2.55;
  g += brightness * 2.55;
  b += brightness * 2.55;

  // Apply contrast
  const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
  r = factor * (r - 128) + 128;
  g = factor * (g - 128) + 128;
  b = factor * (b - 128) + 128;

  // Apply saturation
  const gray = 0.299 * r + 0.587 * g + 0.114 * b;
  const satFactor = saturation / 100;
  r = gray + satFactor * (r - gray);
  g = gray + satFactor * (g - gray);
  b = gray + satFactor * (b - gray);

  return {
    r: Math.max(0, Math.min(255, r)),
    g: Math.max(0, Math.min(255, g)),
    b: Math.max(0, Math.min(255, b)),
    a: pixel.a,
  };
}

function applyEdgeDetection(imageData: ImageData, width: number, height: number): Uint8ClampedArray {
  const data = imageData.data;
  const result = new Uint8ClampedArray(data.length);
  
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = (y * width + x) * 4;
      
      // Sobel operator
      const gx = 
        -getBrightness({ r: data[((y-1)*width+(x-1))*4], g: data[((y-1)*width+(x-1))*4+1], b: data[((y-1)*width+(x-1))*4+2], a: 255 })
        + getBrightness({ r: data[((y-1)*width+(x+1))*4], g: data[((y-1)*width+(x+1))*4+1], b: data[((y-1)*width+(x+1))*4+2], a: 255 })
        - 2 * getBrightness({ r: data[(y*width+(x-1))*4], g: data[(y*width+(x-1))*4+1], b: data[(y*width+(x-1))*4+2], a: 255 })
        + 2 * getBrightness({ r: data[(y*width+(x+1))*4], g: data[(y*width+(x+1))*4+1], b: data[(y*width+(x+1))*4+2], a: 255 })
        - getBrightness({ r: data[((y+1)*width+(x-1))*4], g: data[((y+1)*width+(x-1))*4+1], b: data[((y+1)*width+(x-1))*4+2], a: 255 })
        + getBrightness({ r: data[((y+1)*width+(x+1))*4], g: data[((y+1)*width+(x+1))*4+1], b: data[((y+1)*width+(x+1))*4+2], a: 255 });
      
      const gy = 
        -getBrightness({ r: data[((y-1)*width+(x-1))*4], g: data[((y-1)*width+(x-1))*4+1], b: data[((y-1)*width+(x-1))*4+2], a: 255 })
        - 2 * getBrightness({ r: data[((y-1)*width+x)*4], g: data[((y-1)*width+x)*4+1], b: data[((y-1)*width+x)*4+2], a: 255 })
        - getBrightness({ r: data[((y-1)*width+(x+1))*4], g: data[((y-1)*width+(x+1))*4+1], b: data[((y-1)*width+(x+1))*4+2], a: 255 })
        + getBrightness({ r: data[((y+1)*width+(x-1))*4], g: data[((y+1)*width+(x-1))*4+1], b: data[((y+1)*width+(x-1))*4+2], a: 255 })
        + 2 * getBrightness({ r: data[((y+1)*width+x)*4], g: data[((y+1)*width+x)*4+1], b: data[((y+1)*width+x)*4+2], a: 255 })
        + getBrightness({ r: data[((y+1)*width+(x+1))*4], g: data[((y+1)*width+(x+1))*4+1], b: data[((y+1)*width+(x+1))*4+2], a: 255 });
      
      const magnitude = Math.min(255, Math.sqrt(gx * gx + gy * gy));
      
      result[idx] = magnitude;
      result[idx + 1] = magnitude;
      result[idx + 2] = magnitude;
      result[idx + 3] = 255;
    }
  }
  
  return result;
}

function applyFloydSteinberg(pixels: PixelData[][], width: number, height: number): PixelData[][] {
  const result = pixels.map(row => row.map(p => ({ ...p })));
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const oldPixel = result[y][x];
      const gray = getBrightness(oldPixel);
      const newGray = gray > 127 ? 255 : 0;
      const error = gray - newGray;
      
      result[y][x] = { r: newGray, g: newGray, b: newGray, a: oldPixel.a };
      
      if (x + 1 < width) {
        result[y][x + 1].r += error * 7 / 16;
        result[y][x + 1].g += error * 7 / 16;
        result[y][x + 1].b += error * 7 / 16;
      }
      if (y + 1 < height) {
        if (x - 1 >= 0) {
          result[y + 1][x - 1].r += error * 3 / 16;
          result[y + 1][x - 1].g += error * 3 / 16;
          result[y + 1][x - 1].b += error * 3 / 16;
        }
        result[y + 1][x].r += error * 5 / 16;
        result[y + 1][x].g += error * 5 / 16;
        result[y + 1][x].b += error * 5 / 16;
        if (x + 1 < width) {
          result[y + 1][x + 1].r += error * 1 / 16;
          result[y + 1][x + 1].g += error * 1 / 16;
          result[y + 1][x + 1].b += error * 1 / 16;
        }
      }
    }
  }
  
  return result;
}

export function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

export function getImagePixels(
  img: HTMLImageElement,
  settings: AsciiSettings
): { pixels: PixelData[][]; width: number; height: number } {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  
  const targetWidth = settings.outputWidth;
  const aspectRatio = img.height / img.width;
  const charAspect = settings.aspectCorrection ? 0.5 : 1;
  let targetHeight = Math.round(targetWidth * aspectRatio * charAspect);
  
  // Limit height for performance
  targetHeight = Math.min(targetHeight, 500);
  
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  
  // Draw with transformations
  ctx.save();
  
  if (settings.flipHorizontal || settings.flipVertical) {
    ctx.translate(
      settings.flipHorizontal ? targetWidth : 0,
      settings.flipVertical ? targetHeight : 0
    );
    ctx.scale(
      settings.flipHorizontal ? -1 : 1,
      settings.flipVertical ? -1 : 1
    );
  }
  
  // Fill background for transparent images
  if (!settings.transparentBackground) {
    ctx.fillStyle = settings.backgroundColor === 'light' ? '#ffffff' : '#000000';
    ctx.fillRect(0, 0, targetWidth, targetHeight);
  }
  
  ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
  ctx.restore();
  
  const imageData = ctx.getImageData(0, 0, targetWidth, targetHeight);
  
  // Apply edge detection if enabled
  let data: Uint8ClampedArray;
  if (settings.edgeMode) {
    data = applyEdgeDetection(imageData, targetWidth, targetHeight);
  } else {
    data = imageData.data;
  }
  
  // Convert to pixel array with adjustments
  let pixels: PixelData[][] = [];
  
  for (let y = 0; y < targetHeight; y++) {
    const row: PixelData[] = [];
    for (let x = 0; x < targetWidth; x++) {
      const idx = (y * targetWidth + x) * 4;
      let pixel: PixelData = {
        r: data[idx],
        g: data[idx + 1],
        b: data[idx + 2],
        a: data[idx + 3],
      };
      
      pixel = applyAdjustments(
        settings.brightness,
        settings.contrast,
        settings.saturation,
        settings.gamma,
        pixel
      );
      
      row.push(pixel);
    }
    pixels.push(row);
  }
  
  // Apply dithering
  if (settings.ditheringMode === 'floyd-steinberg') {
    pixels = applyFloydSteinberg(pixels, targetWidth, targetHeight);
  }
  
  return { pixels, width: targetWidth, height: targetHeight };
}

export function generateAscii(settings: AsciiSettings, img: HTMLImageElement): string {
  const { pixels, width, height } = getImagePixels(img, settings);
  
  let charset: string;
  if (settings.outputMode === 'custom' && settings.customCharset) {
    charset = settings.customCharset;
  } else if (settings.outputMode === 'block') {
    charset = CHAR_SETS.blocks;
  } else if (settings.outputMode === 'braille') {
    charset = CHAR_SETS.dots;
  } else {
    charset = CHAR_SETS[settings.charsetPreset] || CHAR_SETS.standard;
  }
  
  if (settings.reverseChars) {
    charset = charset.split('').reverse().join('');
  }
  
  const chars = charset.split('');
  const charCount = chars.length;
  
  let result = '';
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const pixel = pixels[y][x];
      
      if (settings.transparentBackground && pixel.a < 128) {
        result += ' ';
        continue;
      }
      
      let brightness = getBrightness(pixel);
      
      if (settings.invert) {
        brightness = 255 - brightness;
      }
      
      // Apply density
      brightness = brightness * settings.charDensity;
      brightness = Math.max(0, Math.min(255, brightness));
      
      const charIdx = Math.floor((brightness / 255) * (charCount - 1));
      result += chars[charIdx];
    }
    result += '\n';
  }
  
  return result;
}

export function generateColoredAscii(settings: AsciiSettings, img: HTMLImageElement): { text: string; html: string } {
  const { pixels, width, height } = getImagePixels(img, settings);
  
  let charset: string;
  if (settings.outputMode === 'block') {
    charset = CHAR_SETS.blocks;
  } else if (settings.outputMode === 'braille') {
    charset = CHAR_SETS.dots;
  } else {
    charset = CHAR_SETS[settings.charsetPreset] || CHAR_SETS.standard;
  }
  
  if (settings.reverseChars) {
    charset = charset.split('').reverse().join('');
  }
  
  const chars = charset.split('');
  const charCount = chars.length;
  
  let plainText = '';
  let html = '';
  
  for (let y = 0; y < height; y++) {
    let htmlLine = '';
    for (let x = 0; x < width; x++) {
      const pixel = pixels[y][x];
      
      if (settings.transparentBackground && pixel.a < 128) {
        plainText += ' ';
        htmlLine += ' ';
        continue;
      }
      
      let brightness = getBrightness(pixel);
      
      if (settings.invert) {
        brightness = 255 - brightness;
      }
      
      brightness = Math.max(0, Math.min(255, brightness * settings.charDensity));
      
      const charIdx = Math.floor((brightness / 255) * (charCount - 1));
      const char = chars[charIdx];
      
      plainText += char;
      
      const r = Math.round(pixel.r);
      const g = Math.round(pixel.g);
      const b = Math.round(pixel.b);
      htmlLine += `<span style="color:rgb(${r},${g},${b})">${char === ' ' ? '&nbsp;' : char.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</span>`;
    }
    plainText += '\n';
    html += htmlLine + '\n';
  }
  
  return { text: plainText, html };
}

export function generateEmoji(settings: AsciiSettings, img: HTMLImageElement): string {
  const { pixels, width, height } = getImagePixels(img, settings);
  
  let emojiSet: string;
  if (settings.outputMode === 'custom' && settings.customEmojiSet) {
    emojiSet = settings.customEmojiSet;
  } else {
    emojiSet = EMOJI_SETS[settings.emojiPreset] || EMOJI_SETS.circles;
  }
  
  // Handle emoji that are multiple code units (like flags)
  const emojis = [...emojiSet];
  const emojiCount = emojis.length;
  
  let result = '';
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const pixel = pixels[y][x];
      
      if (settings.transparentBackground && pixel.a < 128) {
        result += ' ';
        continue;
      }
      
      let brightness = getBrightness(pixel);
      
      if (settings.invert) {
        brightness = 255 - brightness;
      }
      
      brightness = Math.max(0, Math.min(255, brightness * settings.charDensity));
      
      const emojiIdx = Math.floor((brightness / 255) * (emojiCount - 1));
      result += emojis[emojiIdx];
    }
    result += '\n';
  }
  
  return result;
}

export function generateColoredEmoji(settings: AsciiSettings, img: HTMLImageElement): string {
  // For colored emoji, we use block characters with colors
  const { pixels, width, height } = getImagePixels(img, settings);
  
  let html = '';
  
  for (let y = 0; y < height; y++) {
    let line = '';
    for (let x = 0; x < width; x++) {
      const pixel = pixels[y][x];
      
      if (settings.transparentBackground && pixel.a < 128) {
        line += ' ';
        continue;
      }
      
      const r = Math.round(pixel.r);
      const g = Math.round(pixel.g);
      const b = Math.round(pixel.b);
      
      let brightness = getBrightness(pixel);
      if (settings.invert) brightness = 255 - brightness;
      
      let emoji: string;
      if (brightness < 64) emoji = '⬛';
      else if (brightness < 128) emoji = '🟫';
      else if (brightness < 192) emoji = '🟨';
      else emoji = '⬜';
      
      line += emoji;
    }
    html += line + '\n';
  }
  
  return html;
}
