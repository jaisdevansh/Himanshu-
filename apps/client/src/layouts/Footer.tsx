import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSettingsStore } from '@/store/settingsStore';

export const Footer = () => {
  const navigate = useNavigate();
  const { studioName } = useSettingsStore();

  return (
    <footer className="w-full bg-dark border-t border-gold/10 py-8 text-center text-[0.75rem] text-cream/25 tracking-[0.08em] select-none">
      © {new Date().getFullYear()} {studioName}. Crafted with{' '}
      <span 
        onDoubleClick={() => navigate('/admin')} 
        className="text-gold cursor-default"
      >
        excellence
      </span>
      .
    </footer>
  );
};
