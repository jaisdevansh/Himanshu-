import React, { Suspense, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { PublicLayout } from './layouts/PublicLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useProjectStore } from './store/projectStore';

// Lazy loading views for performance
const Home = React.lazy(() => import('./pages/public/Home').then(m => ({ default: m.Home })));
const Works = React.lazy(() => import('./pages/public/Works').then(m => ({ default: m.Works })));
const Services = React.lazy(() => import('./pages/public/Services').then(m => ({ default: m.Services })));
const About = React.lazy(() => import('./pages/public/About').then(m => ({ default: m.About })));
const Contact = React.lazy(() => import('./pages/public/Contact').then(m => ({ default: m.Contact })));
const Dashboard = React.lazy(() => import('./pages/admin/Dashboard').then(m => ({ default: m.Dashboard })));
const PortfolioManager = React.lazy(() => import('./pages/admin/PortfolioManager').then(m => ({ default: m.PortfolioManager })));
const CRM = React.lazy(() => import('./pages/admin/CRM').then(m => ({ default: m.CRM })));
const MediaManager = React.lazy(() => import('./pages/admin/MediaManager').then(m => ({ default: m.MediaManager })));
const Settings = React.lazy(() => import('./pages/admin/Settings').then(m => ({ default: m.Settings })));

const PageSkeleton = () => (
  <div className="min-h-screen w-full bg-dark text-cream p-8 flex flex-col gap-8 animate-pulse">
    {/* Navbar Skeleton */}
    <div className="h-16 border-b border-gold/10 flex items-center justify-between px-4">
      <div className="w-32 h-6 bg-white/10 rounded" />
      <div className="flex gap-6">
        <div className="w-16 h-4 bg-white/10 rounded" />
        <div className="w-16 h-4 bg-white/10 rounded" />
        <div className="w-16 h-4 bg-white/10 rounded" />
      </div>
    </div>
    {/* Hero Skeleton */}
    <div className="flex-1 flex flex-col items-center justify-center text-center py-20 gap-6">
      <div className="w-48 h-8 bg-white/10 rounded-full" />
      <div className="w-96 h-16 bg-white/10 rounded" />
      <div className="w-80 h-6 bg-white/10 rounded" />
      <div className="flex gap-4 mt-8">
        <div className="w-32 h-10 bg-white/10 rounded" />
        <div className="w-32 h-10 bg-white/10 rounded" />
      </div>
    </div>
  </div>
);

function App() {
  const fetchProjects = useProjectStore((state) => state.fetchProjects);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return (
    <Suspense fallback={<PageSkeleton />}>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/works" element={<Works />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Route>
        
        {/* Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="portfolio" element={<PortfolioManager />} />
          <Route path="media" element={<MediaManager />} />
          <Route path="crm" element={<CRM />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
