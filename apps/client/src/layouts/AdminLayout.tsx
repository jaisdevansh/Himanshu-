import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Video, Image, Settings, Users, LogOut, Menu, X } from 'lucide-react';
import { useSettingsStore } from '@/store/settingsStore';

export const AdminLayout = () => {
  const location = useLocation();
  const { studioName } = useSettingsStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const sidebarLinks = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Portfolio', path: '/admin/portfolio', icon: Video },
    { name: 'Media', path: '/admin/media', icon: Image },
    { name: 'CRM', path: '/admin/crm', icon: Users },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  const words = studioName.split(' ');
  const firstWord = words[0] || '';
  const restWords = words.slice(1).join(' ') || '';

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="min-h-screen bg-dark flex overflow-hidden">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-[#0A0806] border-r border-gold/10 flex flex-col transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-6 border-b border-gold/10 flex justify-between items-center">
          <div>
            <h2 className="font-serif text-lg font-bold text-cream leading-tight">
              {firstWord} {restWords && <span className="text-gold italic">{restWords}</span>}
            </h2>
            <span className="text-[0.55rem] font-mono tracking-[0.3em] text-white/30 uppercase block mt-1">Control Room</span>
          </div>
          <button 
            className="md:hidden text-white/50 hover:text-white"
            onClick={closeMobileMenu}
          >
            <X size={20} />
          </button>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-6 overflow-y-auto">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={closeMobileMenu}
                className={`flex items-center space-x-3 px-4 py-3 rounded-md transition-all duration-300 ${
                  isActive 
                    ? 'bg-gold/10 text-gold border border-gold/20 shadow-sm' 
                    : 'text-white/40 hover:bg-white/[0.02] hover:text-white'
                }`}
              >
                <Icon size={18} />
                <span className="font-medium text-xs tracking-wider uppercase font-mono">{link.name}</span>
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-gold/10">
          <button className="flex items-center space-x-3 px-4 py-3 w-full text-left text-white/40 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-colors">
            <LogOut size={18} />
            <span className="font-medium text-xs tracking-wider uppercase font-mono">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-[#070605] w-full">
        <header className="h-16 border-b border-gold/10 flex items-center justify-between px-4 md:px-8 bg-[#0A0806]/85 backdrop-blur-md sticky top-0 z-30">
           <div className="flex items-center gap-3">
             <button 
               className="md:hidden text-white/60 hover:text-white transition-colors"
               onClick={() => setIsMobileMenuOpen(true)}
             >
               <Menu size={24} />
             </button>
             <h1 className="text-[0.95rem] font-serif font-bold text-white tracking-wide flex items-center gap-2">
               <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse hidden md:inline-block" />
               {location.pathname.split('/').pop() || 'Dashboard'}
             </h1>
           </div>
           <Link to="/" className="text-[0.65rem] tracking-widest font-mono uppercase text-white/40 hover:text-gold transition-colors">
             <span className="hidden sm:inline">← View Website</span>
             <span className="sm:hidden">← Site</span>
           </Link>
        </header>
        <div className="p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
