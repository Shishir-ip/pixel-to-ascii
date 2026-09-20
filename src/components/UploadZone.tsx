import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Image as ImageIcon, FileImage } from 'lucide-react';
import { useState, useCallback, useRef, useEffect } from 'react';
import { useStore } from '../store';
import { SAMPLE_IMAGES } from '../lib/constants';

interface UploadZoneProps {
  onImageLoad: (file: File, url: string, img: HTMLImageElement) => void;
}

export function UploadZone({ onImageLoad }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const { image, setImage, addToast } = useStore();

  const acceptedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif', 'image/avif', 'image/bmp'];

  const processFile = useCallback((file: File) => {
    setError(null);
    
    if (!acceptedTypes.includes(file.type)) {
      setError('Unsupported file format. Please use PNG, JPG, WEBP, GIF, AVIF, or BMP.');
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setError('File too large. Maximum size is 50MB.');
      return;
    }

    const url = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      onImageLoad(file, url, img);
      setImage({
        file,
        url,
        width: img.naturalWidth,
        height: img.naturalHeight,
        name: file.name,
        size: file.size,
      }, img);
      addToast('Image loaded successfully!', 'success');
    };
    img.onerror = () => {
      setError('Failed to load image. Please try another file.');
      URL.revokeObjectURL(url);
    };
    img.src = url;
  }, [onImageLoad, setImage, addToast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, [processFile]);

  const handlePaste = useCallback((e: ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) processFile(file);
        break;
      }
    }
  }, [processFile]);

  // Listen for paste events
  useEffect(() => {
    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, [handlePaste]);

  const handleSampleImage = async (sample: typeof SAMPLE_IMAGES[0]) => {
    try {
      const response = await fetch(sample.url);
      const blob = await response.blob();
      const file = new File([blob], `${sample.name.toLowerCase()}.jpg`, { type: 'image/jpeg' });
      const url = sample.url;
      const img = new window.Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        onImageLoad(file, url, img);
        setImage({
          file,
          url,
          width: img.naturalWidth,
          height: img.naturalHeight,
          name: sample.name,
          size: blob.size,
        }, img);
        addToast('Demo image loaded!', 'success');
      };
      img.onerror = () => {
        addToast('Failed to load demo image. Try uploading your own.', 'error');
      };
      img.src = url;
    } catch {
      addToast('Failed to load demo image.', 'error');
    }
  };

  const removeImage = () => {
    if (image?.url && image.url.startsWith('blob:')) {
      URL.revokeObjectURL(image.url);
    }
    setImage(null);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-4">
      {/* Upload area */}
      <AnimatePresence mode="wait">
        {!image ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-8 sm:p-12 text-center transition-all duration-300 ${
                isDragging 
                  ? 'border-cyan-500 bg-cyan-500/5 shadow-lg shadow-cyan-500/20' 
                  : 'border-zinc-700 hover:border-zinc-500 hover:bg-zinc-800/30'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept={acceptedTypes.join(',')}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) processFile(file);
                }}
                className="hidden"
              />
              
              <motion.div
                animate={isDragging ? { scale: 1.1 } : { scale: 1 }}
                className="flex flex-col items-center gap-4"
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors ${
                  isDragging ? 'bg-cyan-500/20' : 'bg-zinc-800'
                }`}>
                  <Upload className={`w-8 h-8 ${isDragging ? 'text-cyan-400' : 'text-zinc-400'}`} />
                </div>
                <div>
                  <p className="text-lg font-medium text-zinc-200 mb-1">
                    {isDragging ? 'Drop your image here' : 'Drop an image or click to upload'}
                  </p>
                  <p className="text-sm text-zinc-500">
                    PNG, JPG, WEBP, GIF, AVIF, BMP • Max 50MB
                  </p>
                  <p className="text-xs text-zinc-600 mt-2">
                    You can also paste from clipboard (Ctrl+V)
                  </p>
                </div>
              </motion.div>

              {/* Animated border glow */}
              {isDragging && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 rounded-2xl pointer-events-none"
                  style={{
                    background: 'radial-gradient(circle at center, rgba(6,182,212,0.1) 0%, transparent 70%)',
                  }}
                />
              )}
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Sample images */}
            <div className="mt-6">
              <p className="text-sm text-zinc-500 mb-3 text-center">Or try a sample image:</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {SAMPLE_IMAGES.map((sample) => (
                  <motion.button
                    key={sample.name}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSampleImage(sample)}
                    className="group relative rounded-xl overflow-hidden border border-zinc-800 hover:border-zinc-600 transition-colors aspect-[4/3]"
                  >
                    <img
                      src={sample.url}
                      alt={sample.name}
                      className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-2">
                      <span className="text-xs font-medium text-white">{sample.name}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="rounded-2xl border border-zinc-800 overflow-hidden"
          >
            <div className="relative">
              <img
                src={image.url}
                alt="Uploaded preview"
                className="w-full max-h-64 object-contain bg-zinc-900"
              />
              <button
                onClick={removeImage}
                className="absolute top-3 right-3 p-2 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700 transition-colors"
                aria-label="Remove image"
              >
                <X className="w-4 h-4 text-zinc-400" />
              </button>
            </div>
            <div className="p-3 flex items-center gap-3 text-sm text-zinc-400 border-t border-zinc-800">
              <FileImage className="w-4 h-4" />
              <span className="truncate flex-1">{image.name}</span>
              <span>{image.width}×{image.height}</span>
              <span>{formatSize(image.size)}</span>
              <button
                onClick={() => replaceInputRef.current?.click()}
                className="text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                Replace
              </button>
              <input
                ref={replaceInputRef}
                type="file"
                accept={acceptedTypes.join(',')}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) processFile(file);
                }}
                className="hidden"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
