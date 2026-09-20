import { motion } from 'framer-motion';
import { useStore, BUILT_IN_PRESETS } from '../store';
import { Sparkles } from 'lucide-react';

export function PresetCarousel() {
  const { applyPreset, addToast } = useStore();

  const handleApply = (preset: typeof BUILT_IN_PRESETS[0]) => {
    applyPreset(preset);
    addToast(`Applied preset: ${preset.name}`, 'success');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-cyan-400" />
        <h3 className="text-sm font-semibold text-white/90">Quick Presets</h3>
      </div>

      {/* Horizontal scrolling carousel */}
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-thin">
        {BUILT_IN_PRESETS.map((preset, idx) => (
          <motion.button
            key={preset.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleApply(preset)}
            className="flex-shrink-0 w-32 p-3 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:border-cyan-500/30 transition-all text-left group"
          >
            <div className="w-full aspect-square rounded-lg bg-gradient-to-br from-cyan-500/10 to-violet-500/10 mb-2 flex items-center justify-center">
              <span className="text-2xl">
                {preset.id === 'cyberpunk-glow' && '🌆'}
                {preset.id === 'dark-terminal' && '💚'}
                {preset.id === 'colored-pixel' && '🎨'}
                {preset.id === 'emoji-portrait' && '🌄'}
                {preset.id === 'minimal-line-art' && '✏️'}
                {preset.id === 'high-contrast' && '⚫'}
                {preset.id === 'soft-gradient' && '🌈'}
                {preset.id === 'braille-art' && '🔍'}
                {preset.id === 'classic-ascii' && '📝'}
              </span>
            </div>
            <h4 className="text-xs font-medium text-white/90 group-hover:text-cyan-400 transition-colors mb-1">
              {preset.name}
            </h4>
            <p className="text-[10px] text-white/40 line-clamp-2">
              {preset.id === 'cyberpunk-glow' && 'Neon glow with detailed charset'}
              {preset.id === 'dark-terminal' && 'Classic green terminal style'}
              {preset.id === 'colored-pixel' && 'Colored block characters'}
              {preset.id === 'emoji-portrait' && 'Emoji circles portrait'}
              {preset.id === 'minimal-line-art' && 'Edge-detected minimalist'}
              {preset.id === 'high-contrast' && 'Binary high contrast'}
              {preset.id === 'soft-gradient' && 'Smooth gradient characters'}
              {preset.id === 'braille-art' && 'Ultra-fine braille detail'}
              {preset.id === 'classic-ascii' && 'Traditional ASCII art'}
            </p>
          </motion.button>
        ))}
      </div>

      <p className="text-[10px] text-white/30 text-center">
        Click a preset to apply its settings
      </p>
    </div>
  );
}
