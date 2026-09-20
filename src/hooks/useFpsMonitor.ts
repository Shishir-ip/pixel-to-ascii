import { useRef, useState, useCallback, useEffect } from 'react';

export function useFpsMonitor(isActive: boolean) {
  const [fps, setFps] = useState(0);
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const rafRef = useRef<number>(0);

  const tick = useCallback(() => {
    frameCountRef.current++;
    const now = performance.now();
    const elapsed = now - lastTimeRef.current;
    
    if (elapsed >= 1000) {
      setFps(Math.round((frameCountRef.current * 1000) / elapsed));
      frameCountRef.current = 0;
      lastTimeRef.current = now;
    }
    
    if (isActive) {
      rafRef.current = requestAnimationFrame(tick);
    }
  }, [isActive]);

  useEffect(() => {
    if (isActive) {
      lastTimeRef.current = performance.now();
      frameCountRef.current = 0;
      rafRef.current = requestAnimationFrame(tick);
    }
    
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [isActive, tick]);

  return fps;
}
