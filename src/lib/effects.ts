// Visual Effects Library - Post-processing for ASCII output
// These effects are applied to the text output after conversion

export type EffectType = 'none' | 'matrix' | 'glitch' | 'crt' | 'neon';

// Matrix Rain Effect - randomly shifts characters while maintaining image shape
export function applyMatrixEffect(text: string, intensity: number = 50): string {
  const matrixChars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789';
  const lines = text.split('\n');
  const shiftChance = intensity / 1000; // 0-10% chance per character
  
  return lines.map(line => {
    return line.split('').map(char => {
      if (char === ' ' || char === '\n') return char;
      if (Math.random() < shiftChance) {
        return matrixChars[Math.floor(Math.random() * matrixChars.length)];
      }
      return char;
    }).join('');
  }).join('\n');
}

// Glitch Effect - randomly offsets characters and injects noise
export function applyGlitchEffect(text: string, intensity: number = 50): string {
  const noiseChars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`';
  const lines = text.split('\n');
  const glitchChance = intensity / 500; // 0-20% chance
  
  return lines.map((line, lineIdx) => {
    // Randomly offset entire line horizontally
    if (Math.random() < glitchChance * 0.3) {
      const offset = Math.floor(Math.random() * 5) - 2;
      if (offset > 0) {
        line = ' '.repeat(offset) + line.slice(0, -offset);
      } else if (offset < 0) {
        line = line.slice(-offset) + ' '.repeat(-offset);
      }
    }
    
    // Inject random noise characters
    if (Math.random() < glitchChance * 0.5) {
      const pos = Math.floor(Math.random() * line.length);
      const noise = noiseChars[Math.floor(Math.random() * noiseChars.length)];
      line = line.slice(0, pos) + noise + line.slice(pos + 1);
    }
    
    return line;
  }).join('\n');
}

// CRT Effect - adds scanlines and slight distortion (CSS-based, returns className)
export function getCRTClassName(): string {
  return 'effect-crt';
}

// Neon Glow Effect - adds glow effect (CSS-based, returns className)
export function getNeonClassName(): string {
  return 'effect-neon';
}

// Get CSS class for visual effect
export function getEffectClassName(effect: EffectType): string {
  switch (effect) {
    case 'crt': return 'effect-crt';
    case 'neon': return 'effect-neon';
    case 'glitch': return 'effect-glitch';
    default: return '';
  }
}

// Apply text-based effects (matrix, glitch)
export function applyTextEffect(text: string, effect: EffectType, intensity: number = 50): string {
  switch (effect) {
    case 'matrix': return applyMatrixEffect(text, intensity);
    case 'glitch': return applyGlitchEffect(text, intensity);
    default: return text;
  }
}
