import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Skeleton } from '@/components/ui/Skeleton';
import { useProjectStore, Project } from '@/store/projectStore';
import { getFile } from '@/utils/indexedDB';

// Viewfinder corners for visual style consistency
const ViewfinderBrackets = () => (
  <>
    <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-gold/40" />
    <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-gold/40" />
    <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-gold/40" />
    <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-gold/40" />
  </>
);

const isDirectVideo = (url?: string) => {
  if (!url) return false;
  return url.includes('cloudinary.com') || url.match(/\.(mp4|webm|mov|ogg)($|\?)/i) !== null;
};

export const Works = () => {
  const { projects, trackView } = useProjectStore();
  const [activeFilter, setActiveFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(false);
  
  // Selected project for playing video
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [localVideoUrl, setLocalVideoUrl] = useState<string | null>(null);
  const [isFetchingVideo, setIsFetchingVideo] = useState(false);

  const filters = ['All', 'Commercial', 'Music Video', 'Automotive', 'Documentary', 'Short Film'];

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  // Handle opening a project's video
  const handlePlayProject = async (project: Project) => {
    trackView(project.id);
    setActiveProject(project);
    if (project.isLocalVideo) {
      try {
        setIsFetchingVideo(true);
        const file = await getFile(project.id);
        if (file) {
          const blobUrl = URL.createObjectURL(file);
          setLocalVideoUrl(blobUrl);
        } else {
          alert("Local video file not found in browser database.");
          setActiveProject(null);
        }
      } catch (err) {
        console.error("Error loading local video from IndexedDB:", err);
        alert("Failed to load video file.");
        setActiveProject(null);
      } finally {
        setIsFetchingVideo(false);
      }
    } else {
      setLocalVideoUrl(null);
    }
  };

  // Clean up object URLs to prevent memory leaks
  const handleClosePlayer = () => {
    if (localVideoUrl) {
      URL.revokeObjectURL(localVideoUrl);
      setLocalVideoUrl(null);
    }
    setActiveProject(null);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (localVideoUrl) {
        URL.revokeObjectURL(localVideoUrl);
      }
    };
  }, [localVideoUrl]);

  // Filter only published projects
  const publishedProjects = projects.filter(p => p.status === 'Published');

  const filteredItems = activeFilter === 'All' 
    ? publishedProjects 
    : publishedProjects.filter(item => item.category === activeFilter);

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-dark text-cream pt-20">
      {/* Header */}
      <section className="w-full py-20 px-8 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none z-0" style={{
          background: 'radial-gradient(ellipse 60% 60% at 50% 30%, rgba(200,151,58,0.1) 0%, transparent 70%)'
        }} />
        
        <div className="max-w-[1100px] mx-auto text-center relative z-10">
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[0.65rem] tracking-[0.4em] uppercase text-gold mb-4"
          >
            Portfolio
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-serif text-[clamp(2.5rem,6vw,5rem)] font-black leading-[1] mb-8"
          >
            Our Selected <span className="text-gold italic">Works.</span>
          </motion.h1>

          {/* Filters */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-2 md:gap-4 max-w-[800px] mx-auto mb-16 border-t border-b border-gold/15 py-4"
          >
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => handleFilterChange(filter)}
                className={`px-4 py-1.5 rounded-full text-[0.75rem] tracking-[0.15em] uppercase transition-all duration-300 font-medium ${
                  activeFilter === filter 
                    ? 'bg-gold text-dark font-semibold' 
                    : 'text-cream/55 hover:text-cream border border-transparent hover:border-gold/30'
                }`}
              >
                {filter}
              </button>
            ))}
          </motion.div>

          {/* Grid Container */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {isLoading ? (
                // Skeleton loading state
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={`skeleton-${i}`} className="aspect-video relative rounded-md overflow-hidden bg-charcoal/30 border border-gold/10 p-6 flex flex-col justify-end gap-3 animate-pulse">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-6 w-3/4" />
                  </div>
                ))
              ) : filteredItems.length === 0 ? (
                <div className="col-span-full py-20 text-center text-white/40 font-light">
                  No projects published in this category yet.
                </div>
              ) : (
                filteredItems.map((work) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                    key={work.id}
                    onClick={() => handlePlayProject(work)}
                    className="aspect-video relative group overflow-hidden rounded-md cursor-pointer border border-gold/10"
                  >
                    <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors z-10" />
                    <img 
                      src={work.img} 
                      alt={work.title} 
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    />
                    <div className="absolute bottom-6 left-6 z-20 text-left">
                      <p className="text-gold text-[0.65rem] tracking-[0.2em] uppercase mb-1">{work.category}</p>
                      <h3 className="font-serif text-xl font-bold text-cream">{work.title}</h3>
                    </div>
                    <div className="absolute inset-0 z-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      <div className="w-12 h-12 rounded-full bg-gold/90 text-dark flex items-center justify-center text-lg shadow-lg font-bold">
                        ▶
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Video Overlay Modal */}
      <AnimatePresence>
        {activeProject && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-dark/95 flex items-center justify-center p-4 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-[850px] relative"
            >
              <button 
                onClick={handleClosePlayer}
                className="absolute -top-12 right-0 text-cream hover:text-gold text-[0.75rem] tracking-widest uppercase font-bold"
              >
                ✕ Close Project
              </button>
              
              <div className="aspect-video w-full border border-gold/30 rounded-lg overflow-hidden bg-black relative shadow-2xl">
                <ViewfinderBrackets />
                {isFetchingVideo ? (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-gold">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold" />
                    <span className="text-[0.65rem] tracking-widest uppercase font-mono">Fetching local video block...</span>
                  </div>
                ) : (activeProject.isLocalVideo && localVideoUrl) || isDirectVideo(activeProject.videoUrl) ? (
                  <video 
                    className="w-full h-full object-cover"
                    src={localVideoUrl || activeProject.videoUrl}
                    controls
                    autoPlay
                  />
                ) : (
                  <iframe 
                    className="w-full h-full object-cover"
                    src={activeProject.videoUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ'}
                    title="Project Video Player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
