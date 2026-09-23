import { AsciiSettings } from '../types';

export function downloadTextFile(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadHtmlFile(content: string, settings: AsciiSettings): void {
  const bgColor = settings.backgroundColor === 'dark' ? '#0a0a0a' : 
                  settings.backgroundColor === 'light' ? '#ffffff' : 
                  settings.transparentBackground ? 'transparent' : settings.customBgColor;
  
  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>ASCII Art - Pixel to ASCII</title>
<style>
body { 
  background: ${bgColor}; 
  display: flex; 
  justify-content: center; 
  align-items: center; 
  min-height: 100vh; 
  margin: 0; 
  padding: 20px;
}
pre { 
  font-family: 'JetBrains Mono', 'Courier New', monospace; 
  font-size: ${settings.fontSize}px; 
  line-height: ${settings.lineHeight}; 
  letter-spacing: ${settings.letterSpacing}px;
  color: #e4e4e7;
}
</style>
</head>
<body>
<pre>${content}</pre>
</body>
</html>`;
  
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'ascii-art.html';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function downloadPng(
  text: string,
  settings: AsciiSettings,
  scale: number = 2
): Promise<void> {
  try {
    const lines = text.split('\n').filter(l => l.length > 0);
    
    if (lines.length === 0) {
      throw new Error('No ASCII content to export');
    }
    
    // Wait for fonts to load
    await document.fonts.ready;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('Could not get canvas context');
    }
    
    const fontSize = settings.fontSize * scale;
    const lineHeight = settings.lineHeight * fontSize * 1.2;
    
    // Set font and measure
    ctx.font = `${fontSize}px "JetBrains Mono", monospace`;
    const charWidth = ctx.measureText('M').width;
    const maxLineWidth = Math.max(...lines.map(l => l.length * charWidth));
    
    canvas.width = Math.ceil(maxLineWidth) + 20;
    canvas.height = Math.ceil(lines.length * lineHeight) + 20;
    
    // Background
    if (!settings.transparentBackground) {
      const bgColor = settings.backgroundColor === 'dark' ? '#0a0a0a' : 
                      settings.backgroundColor === 'light' ? '#ffffff' : 
                      settings.customBgColor;
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    // Text
    ctx.font = `${fontSize}px "JetBrains Mono", monospace`;
    ctx.fillStyle = '#e4e4e7';
    ctx.textBaseline = 'top';
    
    lines.forEach((line, i) => {
      ctx.fillText(line, 10, 10 + i * lineHeight);
    });
    
    // Convert to blob
    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, 'image/png');
    });
    
    if (!blob) {
      throw new Error('Failed to create PNG blob');
    }
    
    // Download
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pixel-to-ascii-${scale}x.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    // Revoke after 1 second
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    
  } catch (error) {
    throw error;
  }
}

export async function downloadColoredPng(
  htmlContent: string,
  settings: AsciiSettings,
  scale: number = 2
): Promise<void> {
  try {
    const lines = htmlContent.split('\n').filter(l => l.length > 0);
    
    if (lines.length === 0) {
      throw new Error('No colored ASCII content to export');
    }
    
    // Wait for fonts to load
    await document.fonts.ready;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('Could not get canvas context');
    }
    
    const fontSize = settings.fontSize * scale;
    const lineHeight = settings.lineHeight * fontSize * 1.2;
    
    // Set font and measure
    ctx.font = `${fontSize}px "JetBrains Mono", monospace`;
    const charWidth = ctx.measureText('M').width;
    
    // Count max chars per line (parse HTML to get text length)
    const maxCharsPerLine = Math.max(...lines.map(l => {
      const temp = document.createElement('span');
      temp.innerHTML = l;
      return temp.textContent?.length || 0;
    }));
    
    canvas.width = Math.ceil(maxCharsPerLine * charWidth) + 20;
    canvas.height = Math.ceil(lines.length * lineHeight) + 20;
    
    // Background
    if (!settings.transparentBackground) {
      const bgColor = settings.backgroundColor === 'dark' ? '#0a0a0a' : 
                      settings.backgroundColor === 'light' ? '#ffffff' : 
                      settings.customBgColor;
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    // Render colored text
    ctx.font = `${fontSize}px "JetBrains Mono", monospace`;
    ctx.textBaseline = 'top';
    
    lines.forEach((line, lineIdx) => {
      const spanRegex = /<span style="color:rgb\((\d+),(\d+),(\d+)\)">(.+?)<\/span>/g;
      let match;
      let x = 10;
      
      while ((match = spanRegex.exec(line)) !== null) {
        const [, r, g, b, char] = match;
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        const displayChar = char === '&nbsp;' ? ' ' : char.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
        ctx.fillText(displayChar, x, 10 + lineIdx * lineHeight);
        x += charWidth;
      }
    });
    
    // Convert to blob
    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, 'image/png');
    });
    
    if (!blob) {
      throw new Error('Failed to create PNG blob');
    }
    
    // Download
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pixel-to-ascii-colored-${scale}x.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    // Revoke after 1 second
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    
  } catch (error) {
    throw error;
  }
}

export function downloadSvg(text: string, settings: AsciiSettings): void {
  const lines = text.split('\n').filter(l => l.length > 0);
  if (lines.length === 0) return;
  
  const fontSize = settings.fontSize;
  const lineHeight = settings.lineHeight * fontSize * 1.2;
  const charWidth = fontSize * 0.6;
  
  const maxCharsPerLine = Math.max(...lines.map(l => l.length));
  const width = maxCharsPerLine * charWidth + 20;
  const height = lines.length * lineHeight + 20;
  
  const bgColor = settings.backgroundColor === 'dark' ? '#0a0a0a' : 
                  settings.backgroundColor === 'light' ? '#ffffff' : 
                  settings.transparentBackground ? 'none' : settings.customBgColor;
  
  let textElements = '';
  lines.forEach((line, i) => {
    const escapedLine = line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    textElements += `<text x="10" y="${10 + (i + 1) * lineHeight}" font-family="monospace" font-size="${fontSize}" fill="#e4e4e7">${escapedLine}</text>\n`;
  });
  
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="100%" height="100%" fill="${bgColor}"/>
  ${textElements}
</svg>`;
  
  const blob = new Blob([svg], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'ascii-art.svg';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportSettings(settings: AsciiSettings): void {
  const json = JSON.stringify(settings, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'pixel-to-ascii-settings.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}

export function encodeSettingsToUrl(settings: AsciiSettings): string {
  const params = new URLSearchParams();
  Object.entries(settings).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.set(key, String(value));
    }
  });
  return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
}

export function decodeSettingsFromUrl(): Partial<AsciiSettings> | null {
  const params = new URLSearchParams(window.location.search);
  if (params.toString() === '') return null;
  
  const settings: Record<string, string | number | boolean> = {};
  params.forEach((value, key) => {
    if (value === 'true') settings[key] = true;
    else if (value === 'false') settings[key] = false;
    else if (!isNaN(Number(value))) settings[key] = Number(value);
    else settings[key] = value;
  });
  
  return settings as Partial<AsciiSettings>;
}
