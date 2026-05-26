import React, { useState, useEffect } from 'react';
import { Save, Shield, Database, Sparkles, Sliders } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useSettingsStore } from '@/store/settingsStore';

export const Settings = () => {
  const settings = useSettingsStore();

  const [studioName, setStudioName] = useState(settings.studioName);
  const [editorName, setEditorName] = useState(settings.editorName);
  const [supportEmail, setSupportEmail] = useState(settings.supportEmail);
  const [currencySymbol, setCurrencySymbol] = useState(settings.currencySymbol);
  const [priceReel, setPriceReel] = useState(settings.priceReel || 500);
  const [priceYoutube, setPriceYoutube] = useState(settings.priceYoutube || 800);
  const [priceCreator, setPriceCreator] = useState(settings.priceCreator || 1500);
  
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setStudioName(settings.studioName);
    setEditorName(settings.editorName);
    setSupportEmail(settings.supportEmail);
    setCurrencySymbol(settings.currencySymbol);
    setPriceReel(settings.priceReel);
    setPriceYoutube(settings.priceYoutube);
    setPriceCreator(settings.priceCreator);
  }, [
    settings.studioName,
    settings.editorName,
    settings.supportEmail,
    settings.currencySymbol,
    settings.priceReel,
    settings.priceYoutube,
    settings.priceCreator
  ]);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    settings.setSettings({
      studioName,
      editorName,
      supportEmail,
      currencySymbol,
      priceReel: Number(priceReel),
      priceYoutube: Number(priceYoutube),
      priceCreator: Number(priceCreator)
    });
    setTimeout(() => {
      setIsSaving(false);
      alert('Settings saved successfully!');
    }, 500);
  };

  return (
    <div className="space-y-6 text-cream max-w-[800px]">
      <div className="bg-surface/30 p-6 rounded-lg border border-white/5 backdrop-blur-sm">
        <h2 className="text-xl font-bold tracking-tight">System Settings</h2>
        <p className="text-sm text-white/40 font-light">Customize portfolio metadata, branding details, and system modules.</p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Branding Settings Card */}
        <div className="bg-surface/20 border border-white/5 rounded-lg p-6 backdrop-blur-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-white/5 pb-3">
            <Sliders className="text-gold" size={18} />
            <h3 className="font-bold text-white text-[0.95rem]">Studio Branding</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[0.65rem] tracking-wider uppercase text-gold font-mono">Studio Name</label>
              <input
                type="text"
                value={studioName}
                onChange={(e) => setStudioName(e.target.value)}
                className="bg-dark/60 border border-white/10 rounded px-4 py-2.5 text-sm text-white focus:border-gold focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[0.65rem] tracking-wider uppercase text-gold font-mono">Lead Creator / Editor</label>
              <input
                type="text"
                value={editorName}
                onChange={(e) => setEditorName(e.target.value)}
                className="bg-dark/60 border border-white/10 rounded px-4 py-2.5 text-sm text-white focus:border-gold focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[0.65rem] tracking-wider uppercase text-gold font-mono">Contact & Support Email</label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="bg-dark/60 border border-white/10 rounded px-4 py-2.5 text-sm text-white focus:border-gold focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[0.65rem] tracking-wider uppercase text-gold font-mono">Currency & Locale</label>
              <input
                type="text"
                value={currencySymbol}
                onChange={(e) => setCurrencySymbol(e.target.value)}
                className="bg-dark/60 border border-white/10 rounded px-4 py-2.5 text-sm text-white focus:border-gold focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Pricing Packages Settings Card */}
        <div className="bg-surface/20 border border-white/5 rounded-lg p-6 backdrop-blur-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-white/5 pb-3">
            <Sparkles className="text-gold" size={18} />
            <h3 className="font-bold text-white text-[0.95rem]">Pricing Packages (Flat Rates)</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[0.65rem] tracking-wider uppercase text-gold font-mono">Reel Edit Price (₹)</label>
              <input
                type="number"
                value={priceReel}
                onChange={(e) => setPriceReel(Number(e.target.value))}
                className="bg-dark/60 border border-white/10 rounded px-4 py-2.5 text-sm text-white focus:border-gold focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[0.65rem] tracking-wider uppercase text-gold font-mono">YouTube Edit Price (₹)</label>
              <input
                type="number"
                value={priceYoutube}
                onChange={(e) => setPriceYoutube(Number(e.target.value))}
                className="bg-dark/60 border border-white/10 rounded px-4 py-2.5 text-sm text-white focus:border-gold focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[0.65rem] tracking-wider uppercase text-gold font-mono">Creator Pack Price (₹)</label>
              <input
                type="number"
                value={priceCreator}
                onChange={(e) => setPriceCreator(Number(e.target.value))}
                className="bg-dark/60 border border-white/10 rounded px-4 py-2.5 text-sm text-white focus:border-gold focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Database & Cloud Info */}
        <div className="bg-surface/20 border border-white/5 rounded-lg p-6 backdrop-blur-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-white/5 pb-3">
            <Database className="text-gold" size={18} />
            <h3 className="font-bold text-white text-[0.95rem]">Active Connections</h3>
          </div>

          <div className="space-y-4 text-xs font-light text-white/60">
            <div className="flex items-center justify-between p-3 bg-dark/40 rounded border border-white/5">
              <div>
                <span className="font-semibold text-white block">Neon Cloud Database</span>
                <span className="font-mono text-white/30 text-[0.65rem]">ep-wild-flower-aqhzwcof-pooler...</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-green-500/10 text-green-400 border border-green-500/20 font-mono font-bold text-[0.65rem]">CONNECTED</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-dark/40 rounded border border-white/5">
              <div>
                <span className="font-semibold text-white block">Cloudinary Assets Storage</span>
                <span className="font-mono text-white/30 text-[0.65rem]">API KEY: 994874522137614</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-green-500/10 text-green-400 border border-green-500/20 font-mono font-bold text-[0.65rem]">ACTIVE</span>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <Button type="submit" className="flex items-center gap-2" disabled={isSaving}>
            <Save size={16} /> {isSaving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </form>
    </div>
  );
};
