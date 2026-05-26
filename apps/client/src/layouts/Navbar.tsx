import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useSettingsStore } from '@/store/settingsStore';

export const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { studioName } = useSettingsStore();

  const words = studioName.split(' ');
  const firstWord = words[0] || '';
  const remainingWords = words.slice(1).join(' ');

  const links = [
    { name: 'Home', path: '/' },
    { name: 'Works', path: '/works' },
    { name: 'Services', path: '/services' },
    { name: 'About', path: '/about' },
  ];

  return (
    <header className="fixed top-0 w-full z-50 glass">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="font-serif text-xl font-bold tracking-tighter">
          {firstWord} {remainingWords && <span className="text-gold italic">{remainingWords}.</span>}
        </Link>
        
        <nav className="hidden md:flex space-x-8">
          {links.map((link) => (
            <Link key={link.path} to={link.path} className="text-sm font-medium hover:text-white/70 transition-colors">
              {link.name}
            </Link>
          ))}
        </nav>
        
        <div className="hidden md:block">
          <Link to="/contact" className="px-4 py-2 bg-white text-black text-sm font-medium rounded-md hover:bg-white/90 transition-colors">
            Contact Me
          </Link>
        </div>

        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden glass absolute top-16 w-full border-t border-white/10 flex flex-col p-4 space-y-4">
          {links.map((link) => (
            <Link key={link.path} to={link.path} onClick={() => setIsOpen(false)} className="text-sm font-medium">
              {link.name}
            </Link>
          ))}
          <Link to="/contact" onClick={() => setIsOpen(false)} className="px-4 py-2 bg-white text-black text-center text-sm font-medium rounded-md">
            Contact Me
          </Link>
        </div>
      )}
    </header>
  );
};
