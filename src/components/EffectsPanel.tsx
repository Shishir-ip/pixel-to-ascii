import { motion } from 'framer-motion';
import { Sparkles, Zap, Monitor, Radio } from 'lucide-react';
import { useStore } from '../store';
import { VisualEffect } from '../types';

export function EffectsPanel() {
  const { settings, updateSettings } = useStore();

  const effects: { id: VisualEffect; label: string; icon: any; description: string }[] = [
    { id: 'none', label: 'None', icon: Sparkles, description: 'No effects applied' },
    { id: 'matrix', label: 'Matrix', icon: Zap, description: 'Characters morph like the Matrix' },
    { id: 'glitch', label: 'Glitch', icon: Zap, description: 'Cyberpunk glitch distortion' },
    { id: 'crt', label: 'CRT', icon: Monitor, description: 'Retro CRT monitor look' },
    { id: 'neon', label: 'Neon', icon: Radio, description: 'Glowing neon sign effect' },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-violet-400" />
        Special Effects
        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-violet-500/20 text-violet-400 border border-violet-500/20">
          NEW
        </span>
      </h3>

      {/* Effect selector */}
      <div className="grid grid-cols-3 gap-2">
        {effects.map(effect => (
          <motion.button
            key={effect.id}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => updateSettings({ visualEffect: effect.id })}
            className={`flex flex-col items-center gap-1 p-2.5 rounded-xl text-xs transition-all border ${
              settings.visualEffect === effect.id
                ? 'bg-violet-500/10 text-violet-400 border-violet-500/30 shadow-lg shadow-violet-500/10'
                : 'text-zinc-500 border-zinc-800 hover:border-zinc-700 hover:text-zinc-300'
            }`}
          >
            <effect.icon className="w-4 h-4" />
            <span className="font-medium">{effect.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Effect description */}
      <p className="text-[10px] text-zinc-600">
        {effects.find(e => e.id === settings.visualEffect)?.description}
      </p>

      {/* Intensity slider (only for text-based effects) */}
      {(settings.visualEffect === 'matrix' || settings.visualEffect === 'glitch') && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="space-y-1.5"
        >
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-zinc-400">Intensity</label>
            <span className="text-xs text-zinc-500 font-mono">{settings.effectIntensity}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={settings.effectIntensity}
            onChange={(e) => updateSettings({ effectIntensity: Number(e.target.value) })}
            className="w-full"
          />
        </motion.div>
      )}

      {/* Effect preview note */}
      {(settings.visualEffect === 'crt' || settings.visualEffect === 'neon') && (
        <p className="text-[10px] text-zinc-500 italic">
          CSS-based effect applied to the preview panel.
        </p>
      )}
    </div>
  );
}
