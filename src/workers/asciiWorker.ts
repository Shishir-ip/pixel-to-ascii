// Web Worker for ASCII conversion - runs in background thread
// This prevents UI blocking during heavy image processing

interface WorkerMessage {
  type: 'convert';
  imageData: ImageData;
  settings: {
    outputWidth: number;
    outputHeight: number;
    charset: string;
    invert: boolean;
    charDensity: number;
  };
}

interface WorkerResponse {
  type: 'result';
  text: string;
  processingTime: number;
}

self.onmessage = (e: MessageEvent<WorkerMessage>) => {
  const startTime = performance.now();
  const { imageData, settings } = e.data;
  
  const { width, height, data } = imageData;
  const { outputWidth, outputHeight, charset, invert, charDensity } = settings;
  
  const chars = charset.split('');
  const charCount = chars.length;
  
  const scaleX = width / outputWidth;
  const scaleY = height / outputHeight;
  
  let result = '';
  
  for (let y = 0; y < outputHeight; y++) {
    for (let x = 0; x < outputWidth; x++) {
      const srcX = Math.floor(x * scaleX);
      const srcY = Math.floor(y * scaleY);
      
      const idx = (srcY * width + srcX) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      
      // Calculate brightness (luminance)
      let brightness = 0.299 * r + 0.587 * g + 0.114 * b;
      
      if (invert) {
        brightness = 255 - brightness;
      }
      
      brightness = Math.max(0, Math.min(255, brightness * charDensity));
      
      const charIdx = Math.floor((brightness / 255) * (charCount - 1));
      result += chars[charIdx];
    }
    result += '\n';
  }
  
  const processingTime = performance.now() - startTime;
  
  const response: WorkerResponse = {
    type: 'result',
    text: result,
    processingTime,
  };
  
  self.postMessage(response);
};

export {};
