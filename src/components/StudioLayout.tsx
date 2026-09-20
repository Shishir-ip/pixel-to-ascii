import { motion } from 'framer-motion';
import { Home, Palette, Image, Settings, Github } from 'lucide-react';
import { useState } from 'react';

type View = 'studio' | 'gallery' | 'settings';

interface StudioLayoutProps {
  children: React.ReactNode;
}

export function StudioLayout({ children }: StudioLayoutProps) {
  const [activeView, setActiveView] = useState<View>('studio');

  return (
    <div className="h-screen w-screen flex flex-col bg-[#09090b] overflow-hidden relative">
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
              <span className="hidden sm:inline">Star on GitHub</span>
            </a>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="flex-1 flex relative z-10 overflow-hidden">
        {/* Left Sidebar */}
        <motion.nav
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="w-16 border-r border-white/5 bg-black/20 backdrop-blur-xl flex flex-col items-center py-4 gap-2"
        >
          <SidebarButton
            icon={Home}
            label="Studio"
            active={activeView === 'studio'}
            onClick={() => setActiveView('studio')}
          />
          <SidebarButton
            icon={Palette}
            label="Gallery"
            active={activeView === 'gallery'}
            onClick={() => setActiveView('gallery')}
          />
          <SidebarButton
            icon={Image}
            label="Upload"
            active={false}
            onClick={() => {}}
          />
          <div className="flex-1" />
          <SidebarButton
            icon={Settings}
            label="Settings"
            active={activeView === 'settings'}
            onClick={() => setActiveView('settings')}
          />
        </motion.nav>

        {/* Main Workspace */}
        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}

function SidebarButton({ 
  icon: Icon, 
  label, 
  active, 
  onClick 
}: { 
  icon: any; 
  label: string; 
  active: boolean; 
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`group relative w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
        active
          ? 'bg-cyan-500/20 text-cyan-400'
          : 'text-white/40 hover:text-white/70 hover:bg-white/5'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="absolute left-full ml-2 px-2 py-1 rounded-md bg-black/80 text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
        {label}
      </span>
      {active && (
        <motion.div
          layoutId="sidebar-indicator"
          className="absolute left-0 w-0.5 h-6 bg-cyan-400 rounded-r"
        />
      )}
    </button>
  );
}
