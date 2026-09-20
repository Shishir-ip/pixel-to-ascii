import { motion } from 'framer-motion';
import { Zap, Github, Moon, Sun } from 'lucide-react';
import { useState } from 'react';

export function Navbar() {
  const [dark, setDark] = useState(true);

  const toggleTheme = () => {
    setDark(!dark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-zinc-800/50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
              Pixel to ASCII
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="https://github.com/Shishir-ip/pixel-to-ascii"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800/50 border border-zinc-700/50 hover:border-zinc-600 transition-all text-xs text-zinc-400 hover:text-zinc-200"
            >
              <Github className="w-3.5 h-3.5" />
              <span>Star on GitHub</span>
              <img 
                src="https://img.shields.io/github/stars/Shishir-ip/pixel-to-ascii?style=social&label=&color=06b6d4" 
                alt="GitHub stars" 
                className="h-4"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
              />
            </a>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-zinc-800 transition-colors"
              aria-label="Toggle theme"
            >
              {dark ? <Sun className="w-5 h-5 text-zinc-400" /> : <Moon className="w-5 h-5 text-zinc-400" />}
            </button>
            <a
              href="https://github.com/Shishir-ip/pixel-to-ascii"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg hover:bg-zinc-800 transition-colors sm:hidden"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5 text-zinc-400" />
            </a>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
