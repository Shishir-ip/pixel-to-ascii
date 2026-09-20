import { motion } from 'framer-motion';
import { useStore } from '../store';
import { CHAR_SETS, EMOJI_SETS } from '../lib/constants';
import { OutputMode, DitheringMode, BackgroundMode } from '../types';
import { 
  Type, Palette, Sliders, FlipHorizontal, 
  Sun, Grid3X3, RotateCcw
} from 'lucide-react';

interface ControlsPanelProps {
  onChange: () => void;
}

function SliderControl({ 
  label, value, min, max, step = 1, onChange, unit = '' 
}: { 
  label: string; value: number; min: number; max: number; step?: number; 
  onChange: (v: number) => void; unit?: string;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-zinc-400">{label}</label>
        <span className="text-xs text-zinc-500 font-mono">{value}{unit}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
      />
    </div>
  );
}

function ToggleControl({ 
  label, value, onChange 
}: { 
  label: string; value: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <label className="text-xs font-medium text-zinc-400">{label}</label>
      <button
        onClick={() => onChange(!value)}
        className={`relative w-10 h-5 rounded-full transition-colors ${
          value ? 'bg-cyan-500' : 'bg-zinc-700'
        }`}
        role="switch"
        aria-checked={value}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
            value ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}

function SelectControl<T extends string>({ 
  label, value, options, onChange 
}: { 
  label: string; value: T; options: { value: T; label: string }[]; onChange: (v: T) => void;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-zinc-400">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-sm text-zinc-200 focus:border-cyan-500 focus:outline-none transition-colors"
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

export function ControlsPanel({ onChange }: ControlsPanelProps) {
  const { settings, updateSettings, resetSettings } = useStore();

  const triggerUpdate = (partial: Record<string, unknown>) => {
    updateSettings(partial as any);
    onChange();
  };

  const modeOptions: { value: OutputMode; label: string }[] = [
    { value: 'ascii', label: 'ASCII' },
    { value: 'colored-ascii', label: 'Colored ASCII' },
    { value: 'emoji', label: 'Emoji' },
    { value: 'colored-emoji', label: 'Colored Emoji' },
    { value: 'block', label: 'Block Characters' },
    { value: 'braille', label: 'Braille' },
    { value: 'custom', label: 'Custom Characters' },
  ];

  const charsetOptions = Object.entries(CHAR_SETS).map(([key, value]) => ({
    value: key,
    label: `${key.charAt(0).toUpperCase() + key.slice(1)} (${value.slice(0, 8)}...)`,
  }));

  const emojiOptions = Object.entries(EMOJI_SETS).map(([key]) => ({
    value: key,
    label: key.charAt(0).toUpperCase() + key.slice(1),
  }));

  const ditherOptions: { value: DitheringMode; label: string }[] = [
    { value: 'none', label: 'None' },
    { value: 'threshold', label: 'Simple Threshold' },
    { value: 'ordered', label: 'Ordered Dithering' },
    { value: 'floyd-steinberg', label: 'Floyd-Steinberg' },
  ];

  const bgOptions: { value: BackgroundMode; label: string }[] = [
    { value: 'dark', label: 'Dark' },
    { value: 'light', label: 'Light' },
    { value: 'transparent', label: 'Transparent' },
    { value: 'custom', label: 'Custom' },
  ];

  const isEmojiMode = settings.outputMode === 'emoji' || settings.outputMode === 'colored-emoji';
  const isAsciiMode = !isEmojiMode;

  return (
    <div className="space-y-6">
      {/* Output Mode */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
          <Type className="w-4 h-4 text-cyan-400" />
          Output Mode
        </h3>
        <SelectControl
          label="Mode"
          value={settings.outputMode}
          options={modeOptions}
          onChange={(v) => triggerUpdate({ outputMode: v })}
        />
      </div>

      {/* Character/Emoji Set */}
      {isAsciiMode && settings.outputMode !== 'block' && settings.outputMode !== 'braille' && (
        <div className="space-y-3">
          <SelectControl
            label="Character Set"
            value={settings.charsetPreset}
            options={charsetOptions}
            onChange={(v) => triggerUpdate({ charsetPreset: v })}
          />
          {settings.outputMode === 'custom' && (
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-400">Custom Characters</label>
              <input
                type="text"
                value={settings.customCharset}
                onChange={(e) => triggerUpdate({ customCharset: e.target.value })}
                placeholder="Enter characters from dark to light..."
                className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-sm text-zinc-200 font-mono focus:border-cyan-500 focus:outline-none"
              />
            </div>
          )}
          <ToggleControl
            label="Reverse Characters"
            value={settings.reverseChars}
            onChange={(v) => triggerUpdate({ reverseChars: v })}
          />
        </div>
      )}

      {isEmojiMode && (
        <div className="space-y-3">
          <SelectControl
            label="Emoji Set"
            value={settings.emojiPreset}
            options={emojiOptions}
            onChange={(v) => triggerUpdate({ emojiPreset: v })}
          />
        </div>
      )}

      {/* Size & Display */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
          <Grid3X3 className="w-4 h-4 text-cyan-400" />
          Size & Display
        </h3>
        <SliderControl
          label={isEmojiMode ? 'Emoji Width' : 'Output Width'}
          value={settings.outputWidth}
          min={20}
          max={isEmojiMode ? 80 : 300}
          onChange={(v) => triggerUpdate({ outputWidth: v })}
          unit={isEmojiMode ? ' emojis' : ' chars'}
        />
        <SliderControl
          label="Font Size"
          value={settings.fontSize}
          min={4}
          max={20}
          onChange={(v) => triggerUpdate({ fontSize: v })}
          unit="px"
        />
        <SliderControl
          label="Line Height"
          value={settings.lineHeight}
          min={0.5}
          max={2.0}
          step={0.1}
          onChange={(v) => triggerUpdate({ lineHeight: v })}
        />
        <SliderControl
          label="Letter Spacing"
          value={settings.letterSpacing}
          min={-2}
          max={4}
          step={0.5}
          onChange={(v) => triggerUpdate({ letterSpacing: v })}
          unit="px"
        />
        <ToggleControl
          label="Aspect Ratio Correction"
          value={settings.aspectCorrection}
          onChange={(v) => triggerUpdate({ aspectCorrection: v })}
        />
      </div>

      {/* Image Adjustments */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
          <Sliders className="w-4 h-4 text-cyan-400" />
          Image Adjustments
        </h3>
        <SliderControl
          label="Brightness"
          value={settings.brightness}
          min={-100}
          max={100}
          onChange={(v) => triggerUpdate({ brightness: v })}
        />
        <SliderControl
          label="Contrast"
          value={settings.contrast}
          min={-100}
          max={100}
          onChange={(v) => triggerUpdate({ contrast: v })}
        />
        <SliderControl
          label="Saturation"
          value={settings.saturation}
          min={0}
          max={200}
          onChange={(v) => triggerUpdate({ saturation: v })}
          unit="%"
        />
        <SliderControl
          label="Gamma"
          value={settings.gamma}
          min={0.1}
          max={3.0}
          step={0.1}
          onChange={(v) => triggerUpdate({ gamma: v })}
        />
        <SliderControl
          label="Character Density"
          value={settings.charDensity}
          min={0.1}
          max={3.0}
          step={0.1}
          onChange={(v) => triggerUpdate({ charDensity: v })}
        />
      </div>

      {/* Color & Background */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
          <Palette className="w-4 h-4 text-cyan-400" />
          Color & Background
        </h3>
        <SelectControl
          label="Background"
          value={settings.backgroundColor}
          options={bgOptions}
          onChange={(v) => triggerUpdate({ backgroundColor: v })}
        />
        {settings.backgroundColor === 'custom' && (
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={settings.customBgColor}
              onChange={(e) => triggerUpdate({ customBgColor: e.target.value })}
              className="w-8 h-8 rounded border border-zinc-700 cursor-pointer"
            />
            <span className="text-xs text-zinc-500 font-mono">{settings.customBgColor}</span>
          </div>
        )}
        <ToggleControl
          label="Invert Output"
          value={settings.invert}
          onChange={(v) => triggerUpdate({ invert: v })}
        />
      </div>

      {/* Transform */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
          <FlipHorizontal className="w-4 h-4 text-cyan-400" />
          Transform
        </h3>
        <ToggleControl
          label="Flip Horizontal"
          value={settings.flipHorizontal}
          onChange={(v) => triggerUpdate({ flipHorizontal: v })}
        />
        <ToggleControl
          label="Flip Vertical"
          value={settings.flipVertical}
          onChange={(v) => triggerUpdate({ flipVertical: v })}
        />
        <ToggleControl
          label="Edge Detection Mode"
          value={settings.edgeMode}
          onChange={(v) => triggerUpdate({ edgeMode: v })}
        />
      </div>

      {/* Dithering */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
          <Sun className="w-4 h-4 text-cyan-400" />
          Dithering
        </h3>
        <SelectControl
          label="Dithering Mode"
          value={settings.ditheringMode}
          options={ditherOptions}
          onChange={(v) => triggerUpdate({ ditheringMode: v })}
        />
      </div>

      {/* Reset */}
      <button
        onClick={() => { resetSettings(); onChange(); }}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-zinc-800 border border-zinc-700 text-sm text-zinc-300 hover:bg-zinc-700 hover:text-zinc-100 transition-colors"
      >
        <RotateCcw className="w-4 h-4" />
        Reset to Defaults
      </button>
    </div>
  );
}
