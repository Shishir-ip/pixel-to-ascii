import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Camera, Video, Music, Link, X, Play, Pause, RefreshCw } from 'lucide-react';
import { useWebcam } from '../hooks/useWebcam';
import { useStore } from '../store';

export function MediaInput() {
  const [mediaMode, setMediaMode] = useState<'webcam' | 'video' | 'audio' | 'url'>('webcam');
  const [urlInput, setUrlInput] = useState('');
  const [urlError, setUrlError] = useState<string | null>(null);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const videoFileRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { videoRef, canvasRef, isActive, error: webcamError, startWebcam, stopWebcam } = useWebcam();
  const { settings, updateSettings, addToast } = useStore();

  const modes = [
    { id: 'webcam' as const, label: 'Webcam', icon: Camera },
    { id: 'video' as const, label: 'Video', icon: Video },
    { id: 'audio' as const, label: 'Audio', icon: Music },
    { id: 'url' as const, label: 'URL', icon: Link },
  ];

  const handleWebcamToggle = useCallback(() => {
    if (isActive) {
      stopWebcam();
    } else {
      startWebcam(settings.mirrorWebcam);
    }
  }, [isActive, stopWebcam, startWebcam, settings.mirrorWebcam]);

  const handleVideoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('video/')) {
      addToast('Please select a video file', 'error');
      return;
    }
    
    const url = URL.createObjectURL(file);
    if (videoFileRef.current) {
      videoFileRef.current.src = url;
      videoFileRef.current.play();
      setVideoPlaying(true);
    }
  }, [addToast]);

  const handleVideoPlayPause = () => {
    if (!videoFileRef.current) return;
    if (videoPlaying) {
      videoFileRef.current.pause();
    } else {
      videoFileRef.current.play();
    }
    setVideoPlaying(!videoPlaying);
  };

  const handleUrlImport = async () => {
    if (!urlInput.trim()) return;
    setUrlError(null);
    
    try {
      // Try to load the image from URL
      const img = new window.Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        // Create a file-like object from the URL
        useStore.getState().setImage({
          file: null,
          url: urlInput,
          width: img.naturalWidth,
          height: img.naturalHeight,
          name: 'url-import',
          size: 0,
        }, img);
        addToast('Image loaded from URL!', 'success');
      };
      
      img.onerror = () => {
        setUrlError('Failed to load image. The URL may be blocked by CORS. Try downloading the image first.');
      };
      
      img.src = urlInput;
    } catch {
      setUrlError('Invalid URL format');
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-4 space-y-4">
      <h3 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
        <Video className="w-4 h-4 text-cyan-400" />
        Media Mode
        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-violet-500/20 text-violet-400 border border-violet-500/20">
          BETA
        </span>
      </h3>
      
      {/* Mode selector */}
      <div className="grid grid-cols-4 gap-1">
        {modes.map(mode => (
          <button
            key={mode.id}
            onClick={() => {
              if (isActive) stopWebcam();
              setMediaMode(mode.id);
            }}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg text-xs transition-all ${
              mediaMode === mode.id
                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'
            }`}
          >
            <mode.icon className="w-4 h-4" />
            <span>{mode.label}</span>
          </button>
        ))}
      </div>

      {/* Webcam Mode */}
      {mediaMode === 'webcam' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <div className="relative rounded-xl overflow-hidden bg-zinc-900 aspect-video">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              playsInline
              muted
              style={{ transform: settings.mirrorWebcam ? 'scaleX(-1)' : 'scaleX(1)' }}
            />
            {!isActive && (
              <div className="absolute inset-0 flex items-center justify-center bg-zinc-900/80">
                <p className="text-zinc-500 text-sm">Click Start to begin</p>
              </div>
            )}
          </div>
          <canvas ref={canvasRef} className="hidden" />
          
          {webcamError && (
            <p className="text-xs text-red-400">{webcamError}</p>
          )}
          
          <div className="flex gap-2">
            <button
              onClick={handleWebcamToggle}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-red-500/20 text-red-400 border border-red-500/20 hover:bg-red-500/30'
                  : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/30'
              }`}
            >
              {isActive ? <><X className="w-4 h-4" /> Stop</> : <><Camera className="w-4 h-4" /> Start</>}
            </button>
            <button
              onClick={() => updateSettings({ mirrorWebcam: !settings.mirrorWebcam })}
              className={`px-3 py-2 rounded-lg text-sm transition-all ${
                settings.mirrorWebcam
                  ? 'bg-violet-500/20 text-violet-400 border border-violet-500/20'
                  : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
              }`}
              title="Mirror webcam"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      {/* Video Mode */}
      {mediaMode === 'video' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <div className="relative rounded-xl overflow-hidden bg-zinc-900 aspect-video">
            <video
              ref={videoFileRef}
              className="w-full h-full object-cover"
              playsInline
              onPlay={() => setVideoPlaying(true)}
              onPause={() => setVideoPlaying(false)}
            />
            {!videoFileRef.current?.src && (
              <div className="absolute inset-0 flex items-center justify-center bg-zinc-900/80">
                <p className="text-zinc-500 text-sm">Upload a video file</p>
              </div>
            )}
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="video/mp4,video/webm,video/ogg"
            onChange={handleVideoUpload}
            className="hidden"
          />
          
          <div className="flex gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/30 text-sm font-medium transition-all"
            >
              <Video className="w-4 h-4" /> Upload Video
            </button>
            {videoFileRef.current?.src && (
              <button
                onClick={handleVideoPlayPause}
                className="px-3 py-2 rounded-lg bg-zinc-800 text-zinc-400 border border-zinc-700 hover:bg-zinc-700 transition-all"
              >
                {videoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
            )}
          </div>
          
          <p className="text-[10px] text-zinc-600">
            Video will be processed frame-by-frame. Best with short clips.
          </p>
        </motion.div>
      )}

      {/* Audio Mode */}
      {mediaMode === 'audio' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <div className="rounded-xl bg-zinc-900 p-6 text-center">
            <Music className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
            <p className="text-sm text-zinc-400">Audio Reactive Mode</p>
            <p className="text-xs text-zinc-600 mt-1">
              Upload audio or use microphone to make ASCII art pulse to the beat
            </p>
          </div>
          
          <div className="space-y-2">
            <label className="text-xs text-zinc-400">Sensitivity</label>
            <input
              type="range"
              min={0}
              max={100}
              value={settings.audioSensitivity}
              onChange={(e) => updateSettings({ audioSensitivity: Number(e.target.value) })}
              className="w-full"
            />
          </div>
          
          <p className="text-[10px] text-zinc-600">
            🔬 Labs feature — Audio frequency analysis maps to brightness/contrast
          </p>
        </motion.div>
      )}

      {/* URL Mode */}
      {mediaMode === 'url' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <div className="flex gap-2">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="flex-1 px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-sm text-zinc-200 focus:border-cyan-500 focus:outline-none"
              onKeyDown={(e) => e.key === 'Enter' && handleUrlImport()}
            />
            <button
              onClick={handleUrlImport}
              className="px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/30 text-sm font-medium transition-all"
            >
              Load
            </button>
          </div>
          
          {urlError && (
            <p className="text-xs text-red-400">{urlError}</p>
          )}
          
          <p className="text-[10px] text-zinc-600">
            ⚠️ Some URLs may be blocked by CORS. Images from Unsplash, Imgur, and most CDNs work.
          </p>
        </motion.div>
      )}
    </div>
  );
}
