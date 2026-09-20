import { motion } from 'framer-motion';
import { Upload, Sparkles } from 'lucide-react';

interface HeroProps {
  onUploadClick: () => void;
  onTryDemo: () => void;
}

export function Hero({ onUploadClick, onTryDemo }: HeroProps) {
  return (
    <section className="relative pt-28 pb-12 px-4 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-32 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="max-w-4xl mx-auto text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-800/50 border border-zinc-700/50 text-sm text-zinc-400 mb-6">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>100% Client-Side • No Uploads • Private</span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
        >
          <span className="text-zinc-100">Turn any image into</span>
          <br />
          <span className="bg-gradient-to-r from-cyan-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
            stunning ASCII art
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-lg sm:text-xl text-zinc-400 mb-8 max-w-2xl mx-auto"
        >
          Upload an image and transform it into text art, colored ASCII, or emoji mosaics. 
          Private, instant, and fully customizable.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={onUploadClick}
            className="group flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-medium hover:from-cyan-400 hover:to-cyan-500 transition-all shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-105 active:scale-95"
          >
            <Upload className="w-5 h-5 group-hover:animate-bounce" />
            Upload Image
          </button>
          <button
            onClick={onTryDemo}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-800 text-zinc-200 font-medium hover:bg-zinc-700 transition-all border border-zinc-700 hover:border-zinc-600 hover:scale-105 active:scale-95"
          >
            <Sparkles className="w-5 h-5" />
            Try Demo
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8 flex items-center justify-center gap-6 text-sm text-zinc-500"
        >
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            No server uploads
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
            Instant conversion
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-violet-500"></span>
            Multiple export formats
          </span>
        </motion.div>
      </div>
    </section>
  );
}
