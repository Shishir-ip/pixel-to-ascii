import { motion } from 'framer-motion';
import { 
  Copy, Download, FileText, FileCode, Image, 
  Share2, Save, Check, Sparkles
} from 'lucide-react';
import { useState } from 'react';
import { useStore } from '../store';
import { 
  downloadTextFile, downloadHtmlFile, downloadPng, downloadColoredPng,
  downloadSvg, exportSettings, copyToClipboard, encodeSettingsToUrl
} from '../lib/exportUtils';

interface ExportPanelProps {
  outputRef: React.RefObject<HTMLPreElement>;
}

export function ExportPanel({ outputRef }: ExportPanelProps) {
  const { outputText, outputHtml, settings, addToast, savedPresets, savePreset, deletePreset } = useStore();
  const [copiedAction, setCopiedAction] = useState<string | null>(null);
  const [presetName, setPresetName] = useState('');
  const [showSavePreset, setShowSavePreset] = useState(false);

  const handleCopy = async (content: string, label: string) => {
    try {
      await copyToClipboard(content);
      setCopiedAction(label);
      addToast(`${label} copied!`, 'success');
      setTimeout(() => setCopiedAction(null), 2000);
    } catch {
      addToast('Failed to copy', 'error');
    }
  };

  const handleDownloadTxt = () => {
    downloadTextFile(outputText, 'ascii-art.txt');
    addToast('Downloaded as TXT', 'success');
  };

  const handleDownloadHtml = () => {
    downloadHtmlFile(outputHtml || outputText, settings);
    addToast('Downloaded as HTML', 'success');
  };

  const handleDownloadPng = (scale: number) => {
    if (outputRef.current) {
      if (settings.outputMode === 'colored-ascii') {
        downloadColoredPng(outputHtml, settings, scale);
      } else {
        downloadPng(outputRef.current, settings, scale);
      }
      addToast(`Downloaded as PNG (${scale}x)`, 'success');
    }
  };

  const handleDownloadSvg = () => {
    downloadSvg(outputText, settings);
    addToast('Downloaded as SVG', 'success');
  };

  const handleExportSettings = () => {
    exportSettings(settings);
    addToast('Settings exported', 'success');
  };

  const handleCopyShareUrl = async () => {
    const url = encodeSettingsToUrl(settings);
    await handleCopy(url, 'Share URL');
  };

  const handleSavePreset = () => {
    if (presetName.trim()) {
      savePreset(presetName.trim());
      setPresetName('');
      setShowSavePreset(false);
      addToast('Preset saved!', 'success');
    }
  };

  const ExportButton = ({ 
    icon: Icon, label, onClick, action 
  }: { 
    icon: any; label: string; onClick: () => void; action: string;
  }) => (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-zinc-800/50 border border-zinc-700/50 hover:bg-zinc-800 hover:border-zinc-600 transition-all text-left group"
    >
      <div className="w-8 h-8 rounded-lg bg-zinc-700/50 flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
        <Icon className="w-4 h-4 text-zinc-400 group-hover:text-cyan-400 transition-colors" />
      </div>
      <span className="text-sm text-zinc-300 group-hover:text-zinc-100 transition-colors flex-1">{label}</span>
      {copiedAction === action && <Check className="w-4 h-4 text-green-400" />}
    </motion.button>
  );

  return (
    <div className="space-y-6">
      {/* Copy Options */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
          <Copy className="w-4 h-4 text-cyan-400" />
          Copy to Clipboard
        </h3>
        <div className="space-y-2">
          <ExportButton
            icon={FileText}
            label="Copy Plain Text"
            onClick={() => handleCopy(outputText, 'Plain Text')}
            action="Plain Text"
          />
          {settings.outputMode === 'colored-ascii' && (
            <ExportButton
              icon={FileCode}
              label="Copy Colored HTML"
              onClick={() => handleCopy(outputHtml, 'HTML')}
              action="HTML"
            />
          )}
          <ExportButton
            icon={Share2}
            label="Copy Share URL"
            onClick={handleCopyShareUrl}
            action="Share URL"
          />
        </div>
      </div>

      {/* Download Options */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
          <Download className="w-4 h-4 text-cyan-400" />
          Download
        </h3>
        <div className="space-y-2">
          <ExportButton icon={FileText} label="Download TXT" onClick={handleDownloadTxt} action="" />
          <ExportButton icon={FileCode} label="Download HTML" onClick={handleDownloadHtml} action="" />
          <ExportButton icon={Image} label="Download PNG (1x)" onClick={() => handleDownloadPng(1)} action="" />
          <ExportButton icon={Image} label="Download PNG (2x)" onClick={() => handleDownloadPng(2)} action="" />
          <ExportButton icon={Image} label="Download PNG (4x)" onClick={() => handleDownloadPng(4)} action="" />
          <ExportButton icon={FileCode} label="Download SVG" onClick={handleDownloadSvg} action="" />
        </div>
      </div>

      {/* Settings */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
          <Save className="w-4 h-4 text-cyan-400" />
          Settings
        </h3>
        <div className="space-y-2">
          <ExportButton icon={Download} label="Export Settings (JSON)" onClick={handleExportSettings} action="" />
        </div>
      </div>

      {/* Presets */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            Custom Presets
          </h3>
          <button
            onClick={() => setShowSavePreset(!showSavePreset)}
            className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            + Save Current
          </button>
        </div>

        {showSavePreset && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
              placeholder="Preset name..."
              className="flex-1 px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-sm text-zinc-200 focus:border-cyan-500 focus:outline-none"
              onKeyDown={(e) => e.key === 'Enter' && handleSavePreset()}
            />
            <button
              onClick={handleSavePreset}
              className="px-3 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 text-sm hover:bg-cyan-500/30 transition-colors"
            >
              Save
            </button>
          </motion.div>
        )}

        {savedPresets.length > 0 && (
          <div className="space-y-2">
            {savedPresets.map(preset => (
              <div
                key={preset.id}
                className="flex items-center justify-between px-3 py-2 rounded-lg bg-zinc-800/50 border border-zinc-700/50"
              >
                <button
                  onClick={() => {
                    useStore.getState().applyPreset(preset);
                    addToast(`Applied preset: ${preset.name}`, 'success');
                  }}
                  className="text-sm text-zinc-300 hover:text-zinc-100 transition-colors"
                >
                  {preset.name}
                </button>
                <button
                  onClick={() => deletePreset(preset.id)}
                  className="text-xs text-zinc-500 hover:text-red-400 transition-colors"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {savedPresets.length === 0 && !showSavePreset && (
          <p className="text-xs text-zinc-500">No custom presets saved yet.</p>
        )}
      </div>
    </div>
  );
}
