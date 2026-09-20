import { motion } from 'framer-motion';
import { useStore } from '../store';
import { Maximize2, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { copyToClipboard } from '../lib/exportUtils';

interface PreviewPanelProps {
  outputRef: React.RefObject<HTMLPreElement>;
}

export function PreviewPanel({ outputRef }: PreviewPanelProps) {
  const { outputText, outputHtml, settings, isProcessing, image, setShowFullscreen, addToast } = useStore();
  const [copied, setCopied] = useState(false);

  const isColoredMode = settings.outputMode === 'colored-ascii';
  const isEmojiMode = settings.outputMode === 'emoji' || settings.outputMode === 'colored-emoji';

  const bgColor = settings.backgroundColor === 'dark' ? 'bg-zinc-950' :
                  settings.backgroundColor === 'light' ? 'bg-zinc-100' :
                  settings.transparentBackground ? 'bg-[repeating-conic-gradient(#27272a_0%_25%,#18181b_0%_50%)_0_0/20px_20px]' : '';

  const handleCopy = async () => {
    const text = isColoredMode ? outputHtml : outputText;
    try {
      await copyToClipboard(text);
      setCopied(true);
      addToast('Copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      addToast('Failed to copy', 'error');
    }
  };

  if (!image) {
    return (
      <div className="flex items-center justify-center h-64 rounded-2xl border border-zinc-800 bg-zinc-900/50">
        <p className="text-zinc-500 text-sm">Upload an image to see the preview</p>
      </div>
    );
  }

  if (isProcessing) {
    return (
      <div className="flex items-center justify-center h-64 rounded-2xl border border-zinc-800 bg-zinc-900/50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-zinc-400 text-sm">Processing pixels...</p>
        </div>
      </div>
    );
  }

  if (!outputText) {
    return (
      <div className="flex items-center justify-center h-64 rounded-2xl border border-zinc-800 bg-zinc-900/50">
        <p className="text-zinc-500 text-sm">No output generated yet</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="rounded-2xl border border-zinc-800 overflow-hidden"
    >
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800 bg-zinc-900/80">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-zinc-400">
            {settings.outputWidth} × {outputText.split('\n').filter(l => l).length}
          </span>
          <span className="text-xs text-zinc-600">•</span>
          <span className="text-xs text-zinc-500 capitalize">{settings.outputMode.replace('-', ' ')}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-md hover:bg-zinc-800 transition-colors"
            aria-label="Copy to clipboard"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-400" />
            ) : (
              <Copy className="w-4 h-4 text-zinc-400" />
            )}
          </button>
          <button
            onClick={() => setShowFullscreen(true)}
            className="p-1.5 rounded-md hover:bg-zinc-800 transition-colors"
            aria-label="Fullscreen"
          >
            <Maximize2 className="w-4 h-4 text-zinc-400" />
          </button>
        </div>
      </div>

      {/* Output */}
      <div className={`overflow-x-auto overflow-y-auto max-h-[500px] p-4 ${bgColor}`}>
        {isColoredMode ? (
          <pre
            ref={outputRef}
            className={`font-mono text-zinc-200 ${isEmojiMode ? 'emoji-output' : 'ascii-output'}`}
            style={{
              fontSize: `${settings.fontSize}px`,
              lineHeight: settings.lineHeight,
              letterSpacing: `${settings.letterSpacing}px`,
            }}
            dangerouslySetInnerHTML={{ __html: outputHtml }}
          />
        ) : (
          <pre
            ref={outputRef}
            className={`font-mono text-zinc-200 ${isEmojiMode ? 'emoji-output' : 'ascii-output'}`}
            style={{
              fontSize: `${settings.fontSize}px`,
              lineHeight: settings.lineHeight,
              letterSpacing: `${settings.letterSpacing}px`,
            }}
          >
            {outputText}
          </pre>
        )}
      </div>
    </motion.div>
  );
}

export function FullscreenPreview() {
  const { outputText, outputHtml, settings, showFullscreen, setShowFullscreen } = useStore();
  
  if (!showFullscreen) return null;

  const isColoredMode = settings.outputMode === 'colored-ascii';
  const isEmojiMode = settings.outputMode === 'emoji' || settings.outputMode === 'colored-emoji';

  const bgColor = settings.backgroundColor === 'dark' ? 'bg-zinc-950' :
                  settings.backgroundColor === 'light' ? 'bg-white' :
                  settings.transparentBackground ? 'bg-[repeating-conic-gradient(#27272a_0%_25%,#18181b_0%_50%)_0_0/20px_20px]' : '';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-zinc-950/95 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={() => setShowFullscreen(false)}
    >
      <div className="max-w-full max-h-full overflow-auto" onClick={e => e.stopPropagation()}>
        {isColoredMode ? (
          <pre
            className={`font-mono text-zinc-200 ${isEmojiMode ? 'emoji-output' : 'ascii-output'} ${bgColor} p-8 rounded-xl`}
            style={{
              fontSize: `${settings.fontSize * 1.5}px`,
              lineHeight: settings.lineHeight,
              letterSpacing: `${settings.letterSpacing}px`,
            }}
            dangerouslySetInnerHTML={{ __html: outputHtml }}
          />
        ) : (
          <pre
            className={`font-mono text-zinc-200 ${isEmojiMode ? 'emoji-output' : 'ascii-output'} ${bgColor} p-8 rounded-xl`}
            style={{
              fontSize: `${settings.fontSize * 1.5}px`,
              lineHeight: settings.lineHeight,
              letterSpacing: `${settings.letterSpacing}px`,
            }}
          >
            {outputText}
          </pre>
        )}
      </div>
      <button
        onClick={() => setShowFullscreen(false)}
        className="absolute top-4 right-4 p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors"
        aria-label="Close fullscreen"
      >
        <span className="text-zinc-400 text-lg">✕</span>
      </button>
    </motion.div>
  );
}
