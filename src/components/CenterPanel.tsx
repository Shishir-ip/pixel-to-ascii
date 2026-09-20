import { motion } from 'framer-motion';
import { useRef, useState } from 'react';
import { useStore } from '../store';
import { PreviewPanel } from './PreviewPanel';
import { ZoomIn, ZoomOut, Maximize, Minimize } from 'lucide-react';

export function CenterPanel() {
  const { image } = useStore();
  const outputRef = useRef<HTMLPreElement>(null);
  const [zoom, setZoom] = useState(1);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="flex-1 flex flex-col bg-[#09090b] relative overflow-hidden"
    >
      {/* Subtle grid background */}
      <div 
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Canvas area */}
      <div className="flex-1 overflow-hidden relative p-6">
        {!image ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-cyan-500/20 to-violet-500/20 border border-white/10 flex items-center justify-center">
                <span className="text-4xl">⚡</span>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white/90 mb-1">The Canvas</h2>
                <p className="text-sm text-white/50">Upload an image to begin</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full" style={{ transform: `scale(${zoom})`, transformOrigin: 'center center', transition: 'transform 0.3s ease' }}>
            <PreviewPanel outputRef={outputRef} />
          </div>
        )}
      </div>

      {/* Floating Zoom Controls */}
      {image && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1 p-1 rounded-xl bg-black/60 backdrop-blur-xl border border-white/10"
        >
          <button
            onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
            className="p-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors"
            aria-label="Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs text-white/50 font-mono w-12 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom(Math.min(3, zoom + 0.1))}
            className="p-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors"
            aria-label="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <div className="w-px h-4 bg-white/10" />
          <button
            onClick={() => setZoom(1)}
            className="p-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors"
            aria-label="Fit to screen"
          >
            <Minimize className="w-4 h-4" />
          </button>
          <button
            onClick={() => useStore.getState().setShowFullscreen(true)}
            className="p-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors"
            aria-label="Fullscreen"
          >
            <Maximize className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}
