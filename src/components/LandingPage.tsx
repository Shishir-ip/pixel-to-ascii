import { motion } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { ArrowRight, Zap, Lock, Sparkles, Palette, Download } from 'lucide-react';

interface LandingPageProps {
  onEnterStudio: () => void;
  onTryDemo?: () => void;
}

const asciiChars = '@%#*+=-:.·░▒▓█';

export function LandingPage({ onEnterStudio, onTryDemo }: LandingPageProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      });
    };

    const container = containerRef.current;
    container?.addEventListener('mousemove', handleMouseMove);
    return () => container?.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-[#09090b] relative overflow-hidden">
      {/* Animated ASCII Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            transform: `translate(${(mousePos.x - 0.5) * 20}px, ${(mousePos.y - 0.5) * 20}px)`,
            transition: 'transform 0.3s ease-out',
          }}
        >
          <AsciiGrid />
        </div>
      </div>

      {/* Mesh gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px]"
          style={{
            transform: `translate(${(mousePos.x - 0.5) * 40}px, ${(mousePos.y - 0.5) * 40}px)`,
            transition: 'transform 0.5s ease-out',
          }}
        />
        <div 
          className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-violet-500/10 rounded-full blur-[120px]"
          style={{
            transform: `translate(${(mousePos.x - 0.5) * -30}px, ${(mousePos.y - 0.5) * -30}px)`,
            transition: 'transform 0.5s ease-out',
          }}
        />
      </div>

      {/* Noise overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-xs text-white/70">The most advanced ASCII generator on the web</span>
          </motion.div>

          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-white mb-6">
            <span className="block">Text is the</span>
            <span className="block bg-gradient-to-r from-cyan-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
              new pixel.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
            Transform any image into stunning ASCII art, emoji mosaics, and colored text. 
            Private, instant, and fully customizable.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <MagneticButton onClick={onEnterStudio} variant="primary">
              <span>Enter Studio</span>
              <ArrowRight className="w-4 h-4" />
            </MagneticButton>
            <MagneticButton onClick={onTryDemo || onEnterStudio} variant="secondary">
              <span>Try Demo</span>
            </MagneticButton>
          </div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-12 flex items-center justify-center gap-6 text-xs text-white/30"
          >
            <span className="flex items-center gap-1.5">
              <Lock className="w-3 h-3" />
              100% Private
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-3 h-3" />
              Instant Processing
            </span>
            <span className="flex items-center gap-1.5">
              <Download className="w-3 h-3" />
              Multiple Exports
            </span>
          </motion.div>
        </motion.div>

        {/* Bento Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {/* Wide card - Matrix Effect */}
          <BentoCard className="md:col-span-2 md:row-span-1" gradient="from-green-500/20 to-emerald-500/10">
            <div className="flex flex-col h-full">
              <div className="flex-1 font-mono text-[10px] text-green-400/60 leading-tight overflow-hidden">
                {'マトリックス レイン エフェクト\n'.repeat(8)}
                <span className="text-green-400">@%#*+=-:. </span>
                {'ア イ ウ エ オ カ キ ク ケ コ\n'.repeat(4)}
              </div>
              <div className="mt-4">
                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-green-500/20 text-green-400 text-[10px] font-medium">
                  <Zap className="w-3 h-3" />
                  Live Effects
                </span>
                <h3 className="text-lg font-semibold text-white mt-2">Matrix Rain</h3>
                <p className="text-sm text-white/50 mt-1">Characters morph and fall like the iconic digital rain.</p>
              </div>
            </div>
          </BentoCard>

          {/* Tall card - Colored ASCII */}
          <BentoCard className="md:row-span-2" gradient="from-cyan-500/20 to-blue-500/10">
            <div className="flex flex-col h-full">
              <div className="flex-1 font-mono text-[10px] leading-tight overflow-hidden">
                <span className="text-cyan-400">████</span>
                <span className="text-violet-400">████</span>
                <span className="text-pink-400">████</span>{'\n'}
                <span className="text-cyan-400">████</span>
                <span className="text-violet-400">████</span>
                <span className="text-pink-400">████</span>{'\n'}
                <span className="text-cyan-300">▓▓▓▓</span>
                <span className="text-violet-300">▓▓▓▓</span>
                <span className="text-pink-300">▓▓▓▓</span>{'\n'}
                <span className="text-cyan-300">▓▓▓▓</span>
                <span className="text-violet-300">▓▓▓▓</span>
                <span className="text-pink-300">▓▓▓▓</span>{'\n'}
                <span className="text-cyan-200">▒▒▒▒</span>
                <span className="text-violet-200">▒▒▒▒</span>
                <span className="text-pink-200">▒▒▒▒</span>{'\n'}
                <span className="text-cyan-200">▒▒▒▒</span>
                <span className="text-violet-200">▒▒▒▒</span>
                <span className="text-pink-200">▒▒▒▒</span>
              </div>
              <div className="mt-4">
                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-cyan-500/20 text-cyan-400 text-[10px] font-medium">
                  <Palette className="w-3 h-3" />
                  Full Color
                </span>
                <h3 className="text-lg font-semibold text-white mt-2">Colored ASCII</h3>
                <p className="text-sm text-white/50 mt-1">Preserve original pixel colors in every character.</p>
              </div>
            </div>
          </BentoCard>

          {/* Card - Emoji Mode */}
          <BentoCard gradient="from-amber-500/20 to-orange-500/10">
            <div className="text-3xl leading-tight mb-4">
              ⚫🌑🌒🌓🌔🌕⚪
            </div>
            <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-medium">
              <Sparkles className="w-3 h-3" />
              Emoji Art
            </span>
            <h3 className="text-lg font-semibold text-white mt-2">Emoji Mosaics</h3>
            <p className="text-sm text-white/50 mt-1">Create stunning art using emoji characters.</p>
          </BentoCard>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-20"
        >
          <p className="text-sm text-white/30 mb-4">Open Source by Shishir-ip</p>
          <div className="flex items-center justify-center gap-4">
            <a
              href="https://github.com/Shishir-ip/pixel-to-ascii"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-white/40 hover:text-white/70 transition-colors"
            >
              View Source →
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Magnetic Button Component
function MagneticButton({ 
  children, 
  onClick, 
  variant = 'primary' 
}: { 
  children: React.ReactNode; 
  onClick: () => void; 
  variant?: 'primary' | 'secondary';
}) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setPosition({ x: x * 0.15, y: y * 0.15 });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.button
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`group flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition-all ${
        variant === 'primary'
          ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40'
          : 'bg-white/5 text-white/90 border border-white/10 hover:bg-white/10 hover:border-white/20'
      }`}
    >
      {children}
    </motion.button>
  );
}

// Bento Card Component
function BentoCard({ 
  children, 
  className = '', 
  gradient = 'from-white/5 to-white/[0.02]' 
}: { 
  children: React.ReactNode; 
  className?: string; 
  gradient?: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`relative p-6 rounded-2xl bg-gradient-to-br ${gradient} border border-white/10 backdrop-blur-sm overflow-hidden group hover:border-white/20 transition-colors ${className}`}
    >
      {/* Hover glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
      </div>
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

// Animated ASCII Grid Background
function AsciiGrid() {
  const [grid, setGrid] = useState<string[][]>([]);

  useEffect(() => {
    const rows = 30;
    const cols = 60;
    const newGrid: string[][] = [];
    
    for (let i = 0; i < rows; i++) {
      const row: string[] = [];
      for (let j = 0; j < cols; j++) {
        row.push(asciiChars[Math.floor(Math.random() * asciiChars.length)]);
      }
      newGrid.push(row);
    }
    
    setGrid(newGrid);

    // Animate random characters
    const interval = setInterval(() => {
      setGrid(prev => {
        const newGrid = prev.map(row => [...row]);
        const numChanges = 10;
        for (let i = 0; i < numChanges; i++) {
          const row = Math.floor(Math.random() * rows);
          const col = Math.floor(Math.random() * cols);
          newGrid[row][col] = asciiChars[Math.floor(Math.random() * asciiChars.length)];
        }
        return newGrid;
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="font-mono text-[10px] leading-[1.2] text-white/20 whitespace-pre select-none">
      {grid.map((row, i) => (
        <div key={i}>{row.join(' ')}</div>
      ))}
    </div>
  );
}
