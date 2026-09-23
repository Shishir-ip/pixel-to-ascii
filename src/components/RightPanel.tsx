import { motion } from 'framer-motion';
import { useState } from 'react';
import { ControlsPanel } from './ControlsPanel';
import { EffectsPanel } from './EffectsPanel';
import { ExportPanel } from './ExportPanel';
import { PresetCarousel } from './PresetCarousel';
import { Sliders, Sparkles, Download, LayoutGrid } from 'lucide-react';

type Tab = 'controls' | 'effects' | 'presets' | 'export';

export function RightPanel() {
  const [activeTab, setActiveTab] = useState<Tab>('controls');

  const tabs = [
    { id: 'controls' as const, label: 'Controls', icon: Sliders },
    { id: 'effects' as const, label: 'Effects', icon: Sparkles },
    { id: 'presets' as const, label: 'Presets', icon: LayoutGrid },
    { id: 'export' as const, label: 'Export', icon: Download },
  ];

  return (
    <motion.div
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="w-full lg:w-80 bg-black/20 backdrop-blur-xl flex flex-col overflow-hidden max-h-[50vh] lg:max-h-none"
    >
      {/* Tab Bar */}
      <div className="flex border-b border-white/5 bg-black/20 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 min-w-[70px] flex flex-col items-center gap-1 py-3 px-2 text-[10px] font-medium transition-all relative whitespace-nowrap ${
              activeTab === tab.id
                ? 'text-cyan-400'
                : 'text-white/40 hover:text-white/70'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
            {activeTab === tab.id && (
              <motion.div
                layoutId="tab-indicator"
                className="absolute bottom-0 left-2 right-2 h-0.5 bg-cyan-400 rounded-t"
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="p-4"
        >
          {activeTab === 'controls' && <ControlsPanel onChange={() => {}} />}
          {activeTab === 'effects' && <EffectsPanel />}
          {activeTab === 'presets' && <PresetCarousel />}
          {activeTab === 'export' && <ExportPanel outputRef={{ current: null }} />}
        </motion.div>
      </div>
    </motion.div>
  );
}
