import { create } from 'zustand';
import { AsciiSettings, ImageData, Preset, Toast } from './types';
import { DEFAULT_SETTINGS, BUILT_IN_PRESETS } from './lib/constants';

interface AppState {
  // Image state
  image: ImageData | null;
  htmlImageElement: HTMLImageElement | null;
  
  // Settings
  settings: AsciiSettings;
  
  // Output
  outputText: string;
  outputHtml: string;
  isProcessing: boolean;
  
  // UI state
  activeTab: 'original' | 'output' | 'settings' | 'export';
  showFullscreen: boolean;
  toasts: Toast[];
  
  // Presets
  savedPresets: Preset[];
  
  // Actions
  setImage: (image: ImageData | null, element?: HTMLImageElement | null) => void;
  updateSettings: (settings: Partial<AsciiSettings>) => void;
  resetSettings: () => void;
  setOutput: (text: string, html?: string) => void;
  setProcessing: (processing: boolean) => void;
  setActiveTab: (tab: 'original' | 'output' | 'settings' | 'export') => void;
  setShowFullscreen: (show: boolean) => void;
  addToast: (message: string, type: Toast['type']) => void;
  removeToast: (id: string) => void;
  applyPreset: (preset: Preset) => void;
  savePreset: (name: string) => void;
  deletePreset: (id: string) => void;
  loadState: () => void;
}

const STORAGE_KEY = 'asciiforge-state';

function loadFromStorage(): Partial<{ settings: AsciiSettings; savedPresets: Preset[] }> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // Ignore storage errors
  }
  return {};
}

function saveToStorage(settings: AsciiSettings, savedPresets: Preset[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ settings, savedPresets }));
  } catch {
    // Ignore storage errors
  }
}

const stored = loadFromStorage();

export const useStore = create<AppState>((set, get) => ({
  image: null,
  htmlImageElement: null,
  settings: { ...DEFAULT_SETTINGS, ...stored.settings },
  outputText: '',
  outputHtml: '',
  isProcessing: false,
  activeTab: 'original',
  showFullscreen: false,
  toasts: [],
  savedPresets: stored.savedPresets || [],
  
  setImage: (image, element) => set({ 
    image, 
    htmlImageElement: element || null,
    activeTab: image ? 'output' : 'original'
  }),
  
  updateSettings: (newSettings) => {
    const state = get();
    const settings = { ...state.settings, ...newSettings };
    set({ settings });
    saveToStorage(settings, state.savedPresets);
  },
  
  resetSettings: () => {
    const state = get();
    set({ settings: DEFAULT_SETTINGS });
    saveToStorage(DEFAULT_SETTINGS, state.savedPresets);
  },
  
  setOutput: (text, html) => set({ outputText: text, outputHtml: html || '' }),
  
  setProcessing: (processing) => set({ isProcessing: processing }),
  
  setActiveTab: (tab) => set({ activeTab: tab }),
  
  setShowFullscreen: (show) => set({ showFullscreen: show }),
  
  addToast: (message, type) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter(t => t.id !== id) }));
    }, 3000);
  },
  
  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter(t => t.id !== id) })),
  
  applyPreset: (preset) => {
    const state = get();
    const settings = { ...DEFAULT_SETTINGS, ...preset.settings };
    set({ settings });
    saveToStorage(settings, state.savedPresets);
  },
  
  savePreset: (name) => {
    const state = get();
    const newPreset: Preset = {
      id: Date.now().toString(),
      name,
      settings: { ...state.settings },
      isCustom: true,
    };
    const savedPresets = [...state.savedPresets, newPreset];
    set({ savedPresets });
    saveToStorage(state.settings, savedPresets);
  },
  
  deletePreset: (id) => {
    const state = get();
    const savedPresets = state.savedPresets.filter(p => p.id !== id);
    set({ savedPresets });
    saveToStorage(state.settings, savedPresets);
  },
  
  loadState: () => {
    const stored = loadFromStorage();
    if (stored.settings) {
      set({ settings: { ...DEFAULT_SETTINGS, ...stored.settings } });
    }
    if (stored.savedPresets) {
      set({ savedPresets: stored.savedPresets });
    }
  },
}));

export { BUILT_IN_PRESETS };
