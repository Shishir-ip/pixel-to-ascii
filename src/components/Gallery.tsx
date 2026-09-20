import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useStore } from '../store';
import { BUILT_IN_PRESETS } from '../lib/constants';

const galleryItems = [
  {
    title: 'Cyberpunk Portrait',
    description: 'High-detail colored ASCII with neon glow',
    presetId: 'cyberpunk-glow',
    emoji: '🌆',
    gradient: 'from-violet-500/20 to-pink-500/20',
    border: 'border-violet-500/20',
  },
  {
    title: 'Matrix Rain',
    description: 'Classic green terminal with detailed charset',
    presetId: 'dark-terminal',
    emoji: '💚',
    gradient: 'from-green-500/20 to-emerald-500/20',
    border: 'border-green-500/20',
  },
  {
    title: 'Emoji Landscape',
    description: 'Nature scene rendered with emoji circles',
    presetId: 'emoji-portrait',
    emoji: '🌄',
    gradient: 'from-amber-500/20 to-orange-500/20',
    border: 'border-amber-500/20',
  },
  {
    title: 'Minimal Line Art',
    description: 'Edge-detected minimalist style',
    presetId: 'minimal-line-art',
    emoji: '✏️',
    gradient: 'from-zinc-500/20 to-zinc-400/20',
    border: 'border-zinc-500/20',
  },
  {
    title: 'Braille Detail',
    description: 'Ultra-fine detail using braille characters',
    presetId: 'braille-art',
    emoji: '🔍',
    gradient: 'from-cyan-500/20 to-blue-500/20',
    border: 'border-cyan-500/20',
  },
];

export function Gallery() {
  const { applyPreset, addToast } = useStore();

  const handleRemix = (item: typeof galleryItems[0]) => {
    const preset = BUILT_IN_PRESETS.find(p => p.id === item.presetId);
    if (preset) {
      applyPreset(preset);
      addToast(`Loaded "${item.title}" settings! Upload an image to see it.`, 'success');
    }
  };

  return (
    <section className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-4 h-4 text-cyan-400" />
        <h2 className="text-sm font-semibold text-zinc-200">Gallery & Inspiration</h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {galleryItems.map((item, idx) => (
          <motion.button
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08 }}
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleRemix(item)}
            className={`group relative p-4 rounded-2xl bg-gradient-to-br ${item.gradient} border ${item.border} text-left transition-all hover:shadow-lg`}
          >
            <div className="text-2xl mb-2">{item.emoji}</div>
            <h3 className="text-xs font-semibold text-zinc-200 mb-1">{item.title}</h3>
            <p className="text-[10px] text-zinc-500 mb-3 leading-tight">{item.description}</p>
            <span className="inline-flex items-center gap-1 text-[10px] text-cyan-400 group-hover:text-cyan-300 transition-colors">
              Remix <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </motion.button>
        ))}
      </div>
    </section>
  );
}
