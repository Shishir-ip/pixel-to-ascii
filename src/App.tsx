import { useRef, useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StudioLayout } from './components/StudioLayout';
import { LeftPanel } from './components/LeftPanel';
import { CenterPanel } from './components/CenterPanel';
import { RightPanel } from './components/RightPanel';
import { LandingPage } from './components/LandingPage';
import { FullscreenPreview } from './components/PreviewPanel';
import { ToastContainer } from './components/Toast';
import { useStore } from './store';
import { 
  generateAscii, generateColoredAscii, generateEmoji, generateColoredEmoji
} from './lib/asciiConverter';
import { SAMPLE_IMAGES } from './lib/constants';

function App() {
  const { 
    image, htmlImageElement, settings, setOutput, setProcessing, 
    isProcessing, loadState 
  } = useStore();
  
  const [showLanding, setShowLanding] = useState(!image);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  // Load persisted state on mount
  useEffect(() => {
    loadState();
  }, [loadState]);

  // Process image when settings change
  const processImage = useCallback(() => {
    if (!htmlImageElement) return;
    
    setProcessing(true);
    
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

  // Debounced processing
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

  const handleEnterStudio = () => {
    setShowLanding(false);
  };

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
        setShowLanding(false);
      };
      img.src = url;
    } catch {
      useStore.getState().addToast('Failed to load demo image.', 'error');
    }
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {showLanding ? (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.5 }}
          >
            <LandingPage onEnterStudio={handleEnterStudio} onTryDemo={handleTryDemo} />
          </motion.div>
        ) : (
          <motion.div
            key="studio"
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <StudioLayout>
              <div className="flex flex-col lg:flex-row h-full">
                <div className="lg:w-80 lg:border-r border-white/5">
                  <LeftPanel />
                </div>
                <div className="flex-1 min-w-0">
                  <CenterPanel />
                </div>
                <div className="lg:w-80 lg:border-l border-white/5">
                  <RightPanel />
                </div>
              </div>
            </StudioLayout>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fullscreen modal */}
      <FullscreenPreview />
      
      {/* Toast notifications */}
      <ToastContainer />
    </>
  );
}

export default App;
