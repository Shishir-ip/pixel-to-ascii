import { motion } from 'framer-motion';
import { UploadZone } from './UploadZone';
import { MediaInput } from './MediaInput';
import { useStore } from '../store';
import { FileImage } from 'lucide-react';

export function LeftPanel() {
  const { image } = useStore();

  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="w-80 border-r border-white/5 bg-black/20 backdrop-blur-xl overflow-y-auto"
    >
      <div className="p-4 space-y-4">
        {/* Upload Section */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-white/60 uppercase tracking-wider">Source</h3>
          <UploadZone onImageLoad={() => {}} />
        </div>

        {/* Image Info */}
        {image && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 rounded-xl bg-white/5 border border-white/5"
          >
            <div className="flex items-center gap-2 mb-2">
              <FileImage className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-medium text-white/90 truncate flex-1">
                {image.name}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[10px] text-white/50">
              <div>
                <span className="text-white/30">Size:</span> {image.width}×{image.height}
              </div>
              <div>
                <span className="text-white/30">File:</span> {(image.size / 1024).toFixed(1)}KB
              </div>
            </div>
          </motion.div>
        )}

        {/* Media Input */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-white/60 uppercase tracking-wider">Media</h3>
          <MediaInput />
        </div>
      </div>
    </motion.div>
  );
}
