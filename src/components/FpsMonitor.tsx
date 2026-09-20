import { useFpsMonitor } from '../hooks/useFpsMonitor';

interface FpsMonitorProps {
  isActive: boolean;
}

export function FpsMonitor({ isActive }: FpsMonitorProps) {
  const fps = useFpsMonitor(isActive);

  if (!isActive) return null;

  const color = fps >= 25 ? 'text-green-400' : fps >= 15 ? 'text-yellow-400' : 'text-red-400';

  return (
    <div className="absolute top-2 right-2 px-2 py-1 rounded-md bg-zinc-900/80 border border-zinc-800 backdrop-blur-sm z-10">
      <span className={`text-[10px] font-mono font-bold ${color}`}>
        {fps} FPS
      </span>
    </div>
  );
}
