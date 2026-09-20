import { useState, useEffect } from 'react';

const asciiChars = '@%#*+=-:.·░▒▓█';

export function ShimmerLoader() {
  const [text, setText] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      let newText = '';
      for (let i = 0; i < 40; i++) {
        newText += asciiChars[Math.floor(Math.random() * asciiChars.length)];
      }
      setText(newText);
    }, 80);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center h-64 rounded-2xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
      <div className="text-center">
        <div className="font-mono text-xs text-cyan-500/40 mb-3 tracking-wider animate-pulse">
          {text}
        </div>
        <p className="text-zinc-400 text-sm">Processing pixels...</p>
        <div className="mt-3 w-32 h-1 mx-auto rounded-full bg-zinc-800 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-cyan-500 to-violet-500 rounded-full animate-shimmer" 
               style={{ width: '60%' }} />
        </div>
      </div>
    </div>
  );
}
