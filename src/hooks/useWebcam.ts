import { useRef, useState, useCallback, useEffect } from 'react';

export function useWebcam() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number>(0);
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startWebcam = useCallback(async (mirror: boolean = true) => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' }
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.style.transform = mirror ? 'scaleX(-1)' : 'scaleX(1)';
        await videoRef.current.play();
        setIsActive(true);
      }
    } catch (err) {
      setError('Could not access webcam. Please allow camera permissions.');
      console.error('Webcam error:', err);
    }
  }, []);

  const stopWebcam = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
    setIsActive(false);
  }, []);

  const captureFrame = useCallback((): HTMLCanvasElement | null => {
    if (!videoRef.current || !canvasRef.current || !isActive) return null;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas;
  }, [isActive]);

  useEffect(() => {
    return () => {
      stopWebcam();
    };
  }, [stopWebcam]);

  return {
    videoRef,
    canvasRef,
    isActive,
    error,
    startWebcam,
    stopWebcam,
    captureFrame,
  };
}
