import { motion } from 'framer-motion';
import { useStore, BUILT_IN_PRESETS } from '../store';
import { Sparkles } from 'lucide-react';

interface PresetGalleryProps {
  onApply: () => void;
}

export function PresetGallery({ onApply }: PresetGalleryProps) {
  const { applyPreset, addToast } = useStore();

  const handleApply = (preset: typeof BUILT_IN_PRESETS[0]) => {
    applyPreset(preset);
    addToast(`Applied preset: ${preset.name}`, 'success');
    onApply();
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-cyan-400" />
        Quick Presets
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {BUILT_IN_PRESETS.map((preset, idx) => (
          <motion.button
            key={preset.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleApply(preset)}
            className="px-3 py-2.5 rounded-xl bg-zinc-800/50 border border-zinc-700/50 hover:border-cyan-500/30 hover:bg-zinc-800 transition-all text-left group"
          >
            <span className="text-xs font-medium text-zinc-300 group-hover:text-cyan-400 transition-colors">
              {preset.name}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
