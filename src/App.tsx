import { useRef, useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, Eye, Download, Image, ChevronDown, ChevronUp,
  Layers
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { UploadZone } from './components/UploadZone';
import { ControlsPanel } from './components/ControlsPanel';
import { PreviewPanel, FullscreenPreview } from './components/PreviewPanel';
import { ExportPanel } from './components/ExportPanel';
import { PresetGallery } from './components/PresetGallery';
import { ToastContainer } from './components/Toast';
import { useStore } from './store';
import { 
  generateAscii, generateColoredAscii, generateEmoji, generateColoredEmoji
} from './lib/asciiConverter';
import { SAMPLE_IMAGES } from './lib/constants';

function App() {
  const { 
    image, htmlImageElement, settings, setOutput, setProcessing, 
    isProcessing, activeTab, setActiveTab, loadState 
  } = useStore();
  
  const outputRef = useRef<HTMLPreElement>(null);
  const uploadRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const [controlsOpen, setControlsOpen] = useState(true);
  const [mobilePanel, setMobilePanel] = useState<'upload' | 'preview' | 'controls' | 'export'>('upload');

  // Load persisted state on mount
  useEffect(() => {
    loadState();
  }, [loadState]);

  // Process image when settings change
  const processImage = useCallback(() => {
    if (!htmlImageElement) return;
    
    setProcessing(true);
    
    // Use requestAnimationFrame to avoid blocking UI
    requestAnimationFrame(() => {
      try {
        let text = '';
        let html = '';
        
        switch (settings.outputMode) {
          case 'ascii':
          case 'block':
          case 'braille':
          case 'custom':
            text = generateAscii(settings, htmlImageElement);
            break;
          case 'colored-ascii':
            const result = generateColoredAscii(settings, htmlImageElement);
            text = result.text;
            html = result.html;
            break;
          case 'emoji':
            text = generateEmoji(settings, htmlImageElement);
            break;
          case 'colored-emoji':
            text = generateColoredEmoji(settings, htmlImageElement);
            break;
        }
        
        setOutput(text, html);
      } catch (err) {
        console.error('Processing error:', err);
      } finally {
        setProcessing(false);
      }
    });
  }, [htmlImageElement, settings, setOutput, setProcessing]);

  // Debounced processing for slider changes
  const debouncedProcess = useCallback(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      processImage();
    }, 150);
  }, [processImage]);

  // Process when image or settings change
  useEffect(() => {
    if (htmlImageElement) {
      debouncedProcess();
    }
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [htmlImageElement, settings, debouncedProcess]);

  const handleImageLoad = useCallback((_file: File, _url: string, _img: HTMLImageElement) => {
    // Image is already set in store by UploadZone, processing handled by useEffect
  }, []);

  const handleTryDemo = useCallback(async () => {
    const sample = SAMPLE_IMAGES[0];
    try {
      const response = await fetch(sample.url);
      const blob = await response.blob();
      const file = new File([blob], `${sample.name.toLowerCase()}.jpg`, { type: 'image/jpeg' });
      const url = sample.url;
      const img = new window.Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        useStore.getState().setImage({
          file,
          url,
          width: img.naturalWidth,
          height: img.naturalHeight,
          name: sample.name,
          size: blob.size,
        }, img);
      };
      img.src = url;
    } catch {
      useStore.getState().addToast('Failed to load demo image.', 'error');
    }
  }, []);

  const scrollToUpload = () => {
    uploadRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const tabs = [
    { id: 'upload' as const, label: 'Upload', icon: Image },
    { id: 'preview' as const, label: 'Preview', icon: Eye },
    { id: 'controls' as const, label: 'Settings', icon: Settings },
    { id: 'export' as const, label: 'Export', icon: Download },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <Navbar />
      
      {/* Hero - only show when no image */}
      <AnimatePresence>
        {!image && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Hero onUploadClick={scrollToUpload} onTryDemo={handleTryDemo} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 pt-4">
        {/* Mobile tab navigation */}
        <div className="lg:hidden sticky top-16 z-30 py-3 -mx-4 px-4 bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800/50">
          <div className="flex gap-1 max-w-full overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setMobilePanel(tab.id)}
                className={`flex-1 min-w-0 flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                  mobilePanel === tab.id 
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' 
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <tab.icon className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Desktop layout */}
        <div className="mt-6 lg:mt-8">
          {/* Upload zone - always visible at top */}
          <div ref={uploadRef} className="mb-6">
            <UploadZone onImageLoad={handleImageLoad} />
          </div>

          {image && (
            <>
              {/* Preset gallery */}
              <div className="mb-6">
                <PresetGallery onApply={() => {}} />
              </div>

              {/* Desktop: 3-column layout */}
              <div className="hidden lg:grid lg:grid-cols-12 gap-4 xl:gap-6">
                {/* Controls Panel */}
                <div className="col-span-12 xl:col-span-3 lg:col-span-3">
                  <div className="glass-panel rounded-2xl p-4 lg:sticky lg:top-20 max-h-[80vh] overflow-y-auto">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
                        <Settings className="w-4 h-4 text-cyan-400" />
                        Controls
                      </h2>
                      <button
                        onClick={() => setControlsOpen(!controlsOpen)}
                        className="p-1 rounded hover:bg-zinc-800 transition-colors"
                      >
                        {controlsOpen ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
                      </button>
                    </div>
                    <AnimatePresence>
                      {controlsOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ControlsPanel onChange={() => {}} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Preview Panel */}
                <div className="col-span-12 lg:col-span-6 min-w-0">
                  <PreviewPanel outputRef={outputRef} />
                </div>

                {/* Export Panel */}
                <div className="col-span-12 xl:col-span-3 lg:col-span-3">
                  <div className="glass-panel rounded-2xl p-4 lg:sticky lg:top-20 max-h-[80vh] overflow-y-auto">
                    <h2 className="text-sm font-semibold text-zinc-200 flex items-center gap-2 mb-4">
                      <Download className="w-4 h-4 text-cyan-400" />
                      Export & Share
                    </h2>
                    <ExportPanel outputRef={outputRef} />
                  </div>
                </div>
              </div>

              {/* Mobile: Tab-based layout */}
              <div className="lg:hidden mt-4">
                <AnimatePresence mode="wait">
                  {mobilePanel === 'upload' && (
                    <motion.div
                      key="upload-mobile"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      {/* Already shown above */}
                      <div className="text-center py-8">
                        <p className="text-zinc-500 text-sm">Image loaded! Switch to Preview tab to see results.</p>
                      </div>
                    </motion.div>
                  )}
                  
                  {mobilePanel === 'preview' && (
                    <motion.div
                      key="preview-mobile"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <PreviewPanel outputRef={outputRef} />
                    </motion.div>
                  )}
                  
                  {mobilePanel === 'controls' && (
                    <motion.div
                      key="controls-mobile"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="glass-panel rounded-2xl p-4"
                    >
                      <ControlsPanel onChange={() => {}} />
                    </motion.div>
                  )}
                  
                  {mobilePanel === 'export' && (
                    <motion.div
                      key="export-mobile"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="glass-panel rounded-2xl p-4"
                    >
                      <ExportPanel outputRef={outputRef} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800/50 py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <Layers className="w-4 h-4" />
            <span>Pixel to ASCII — All processing happens locally in your browser.</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-zinc-600">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              100% Private
            </span>
            <span>No uploads</span>
            <span>No tracking</span>
          </div>
        </div>
      </footer>

      {/* Fullscreen modal */}
      <FullscreenPreview />
      
      {/* Toast notifications */}
      <ToastContainer />
    </div>
  );
}

export default App;
