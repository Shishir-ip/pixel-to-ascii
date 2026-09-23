import { motion } from 'framer-motion';
import { Github } from 'lucide-react';
import { LeftPanel } from './LeftPanel';
import { CenterPanel } from './CenterPanel';
import { RightPanel } from './RightPanel';

export function StudioDesktop() {
  return (
    <div className="h-dvh w-screen flex flex-col bg-[#09090b] overflow-hidden relative">
      {/* Noise texture overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Mesh gradient background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
      </div>

      {/* Top Bar */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-50 h-14 border-b border-white/5 bg-black/20 backdrop-blur-xl"
      >
        <div className="h-full px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span className="text-sm font-medium text-white/90">Pixel to ASCII</span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://github.com/Shishir-ip/pixel-to-ascii"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 transition-all text-xs text-white/70 hover:text-white"
            >
              <Github className="w-3.5 h-3.5" />
              <span>Star on GitHub</span>
            </a>
          </div>
        </div>
      </motion.header>

      {/* Main Content - 3 Column Layout */}
      <div className="flex-1 flex relative z-10 overflow-hidden">
        <div className="w-80 border-r border-white/5">
          <LeftPanel />
        </div>
        <div className="flex-1 min-w-0">
          <CenterPanel />
        </div>
        <div className="w-80 border-l border-white/5 h-full min-h-0 flex flex-col">
          <RightPanel />
        </div>
      </div>
    </div>
  );
}
