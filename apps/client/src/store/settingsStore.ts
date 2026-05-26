import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  studioName: string;
  editorName: string;
  supportEmail: string;
  currencySymbol: string;
  priceReel: number;
  priceYoutube: number;
  priceCreator: number;
  setSettings: (settings: {
    studioName: string;
    editorName: string;
    supportEmail: string;
    currencySymbol: string;
    priceReel: number;
    priceYoutube: number;
    priceCreator: number;
  }) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      studioName: 'Khasikae Khawab',
      editorName: 'Himanshu Kumar',
      supportEmail: 'hello@khasikaekhawab.com',
      currencySymbol: 'INR (₹)',
      priceReel: 500,
      priceYoutube: 800,
      priceCreator: 1500,
      setSettings: (settings) => set(settings),
    }),
    {
      name: 'portfolio-settings',
    }
  )
);
