import { motion, AnimatePresence } from 'framer-motion';
import { Github, Upload, Sliders, Sparkles, Download, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useStore } from '../store';
import { UploadZone } from './UploadZone';
import { ControlsPanel } from './ControlsPanel';
import { EffectsPanel } from './EffectsPanel';
import { ExportPanel } from './ExportPanel';
import { PreviewPanel } from './PreviewPanel';

type MobileTab = 'source' | 'controls' | 'effects' | 'export';

export function StudioMobile() {
  const [activeSheet, setActiveSheet] = useState<MobileTab | null>(null);
  const { image, settings } = useStore();
  const outputRef = useRef<HTMLPreElement>(null);

  // Lock body scroll when sheet is open
  useEffect(() => {
    if (activeSheet) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeSheet]);

  // Auto-scale font size for mobile preview
  const mobileFontSize = Math.min(settings.fontSize, 5);

  const tabs: { id: MobileTab; label: string; icon: any }[] = [
    { id: 'source', label: 'Source', icon: Upload },
    { id: 'controls', label: 'Controls', icon: Sliders },
    { id: 'effects', label: 'Effects', icon: Sparkles },
    { id: 'export', label: 'Export', icon: Download },
  ];

  return (
    <div className="h-dvh w-screen flex flex-col bg-[#09090b] relative overflow-hidden">
      {/* Noise texture overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Sticky Top Bar */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-50 h-12 border-b border-white/5 bg-black/40 backdrop-blur-xl flex-shrink-0"
      >
        <div className="h-full px-3 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-xs">P</span>
            </div>
            <span className="text-xs font-medium text-white/90 truncate">Pixel to ASCII</span>
          </div>

          <a
            href="https://github.com/Shishir-ip/pixel-to-ascii"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 transition-all flex-shrink-0"
            aria-label="GitHub"
          >
            <Github className="w-4 h-4 text-white/70" />
          </a>
        </div>
      </motion.header>

      {/* Preview Area */}
      <div className="flex-1 min-h-0 flex flex-col relative z-10 overflow-hidden">
        <div className="flex-1 min-h-0 p-2 overflow-hidden">
          {!image ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center space-y-3 px-4">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-cyan-500/20 to-violet-500/20 border border-white/10 flex items-center justify-center">
                  <span className="text-3xl">⚡</span>
                </div>
                <div>
                  <h2 className="text-base font-semibold text-white/90 mb-1">The Canvas</h2>
                  <p className="text-xs text-white/50">Tap Source to upload an image</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full overflow-auto max-w-full min-w-0 rounded-xl border border-white/5 bg-black/40">
              <div className="min-w-0 p-2">
                <PreviewPanel outputRef={outputRef} mobileFontSize={mobileFontSize} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Tab Bar */}
      <motion.nav
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="relative z-40 border-t border-white/5 bg-black/60 backdrop-blur-xl flex-shrink-0"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <div className="flex">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSheet(tab.id)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 min-h-[56px] transition-colors ${
                activeSheet === tab.id
                  ? 'text-cyan-400'
                  : 'text-white/50 active:text-white/80'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </motion.nav>

      {/* Bottom Sheet */}
      <AnimatePresence>
        {activeSheet && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveSheet(null)}
              className="absolute inset-0 z-40 bg-black/50 backdrop-blur-sm"
            />
            
            {/* Sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="absolute bottom-0 left-0 right-0 z-50 bg-[#0f0f12] border-t border-white/10 rounded-t-2xl flex flex-col"
              style={{ 
                maxHeight: '70dvh',
                paddingBottom: 'env(safe-area-inset-bottom, 0px)' 
              }}
            >
              {/* Drag Handle + Header */}
              <div className="flex-shrink-0 pt-2 pb-3 px-4 border-b border-white/5">
                <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-3" />
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white/90 capitalize">
                    {activeSheet}
                  </h3>
                  <button
                    onClick={() => setActiveSheet(null)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                    aria-label="Close"
                  >
                    <X className="w-4 h-4 text-white/70" />
                  </button>
                </div>
              </div>

              {/* Sheet Content */}
              <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4">
                {activeSheet === 'source' && (
                  <div className="space-y-4">
                    <UploadZone onImageLoad={() => {}} />
                  </div>
                )}
                {activeSheet === 'controls' && (
                  <ControlsPanel onChange={() => {}} />
                )}
                {activeSheet === 'effects' && (
                  <EffectsPanel />
                )}
                {activeSheet === 'export' && (
                  <ExportPanel outputRef={outputRef} />
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
