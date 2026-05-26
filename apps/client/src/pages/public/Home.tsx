import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { useProjectStore, Project } from '@/store/projectStore';
import { useSettingsStore } from '@/store/settingsStore';
import { getFile } from '@/utils/indexedDB';
import heroBg from '@/assets/hero-bg.png';

// Decorative corner brackets resembling a camera viewfinder
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

export const Home = () => {
  const { projects, trackView } = useProjectStore();
  const { studioName, editorName, supportEmail, priceReel, priceYoutube, priceCreator } = useSettingsStore();
  const socialHandle = '@' + studioName.toLowerCase().replace(/\s+/g, '');
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);
  const [isFetchingVideo, setIsFetchingVideo] = useState(false);

  const fadeUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-50px" },
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  };

  // Filter only published projects and take the top 5
  const publishedProjects = projects.filter(p => p.status === 'Published').slice(0, 5);

  const bentoSpans = [
    "lg:col-span-2 lg:row-span-2", // Item 1 (Big focus)
    "col-span-1",                  // Item 2
    "col-span-1",                  // Item 3
    "md:col-span-2 lg:col-span-1", // Item 4
    "md:col-span-2 lg:col-span-2"  // Item 5 (Medium focus)
  ];

  // Play showreel or a project's video
  const handlePlayProject = async (project: Project | null, fallbackUrl?: string) => {
    if (!project) {
      setActiveProject(null);
      setActiveVideoUrl(fallbackUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ');
      return;
    }
    
    trackView(project.id);
    setActiveProject(project);
    if (project.isLocalVideo) {
      try {
        setIsFetchingVideo(true);
        const file = await getFile(project.id);
        if (file) {
          const blobUrl = URL.createObjectURL(file);
          setActiveVideoUrl(blobUrl);
        } else {
          alert("Local video file not found in browser database.");
          setActiveProject(null);
        }
      } catch (err) {
        console.error("Error loading local video:", err);
        alert("Failed to load video file.");
        setActiveProject(null);
      } finally {
        setIsFetchingVideo(false);
      }
    } else {
      setActiveVideoUrl(project.videoUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ');
    }
  };

  const handleClosePlayer = () => {
    if (activeProject?.isLocalVideo && activeVideoUrl) {
      URL.revokeObjectURL(activeVideoUrl);
    }
    setActiveVideoUrl(null);
    setActiveProject(null);
  };

  useEffect(() => {
    return () => {
      if (activeProject?.isLocalVideo && activeVideoUrl) {
        URL.revokeObjectURL(activeVideoUrl);
      }
    };
  }, [activeVideoUrl, activeProject]);

  return (
    <div className="flex flex-col items-center w-full relative bg-dark overflow-hidden">
      
      {/* Global Editorial Vertical Guide Lines */}
      <div className="absolute inset-0 pointer-events-none z-0 flex justify-between max-w-[1100px] w-full mx-auto px-8">
        <div className="w-[1px] h-full bg-white/[0.02]" />
        <div className="w-[1px] h-full bg-white/[0.02] hidden md:block" />
        <div className="w-[1px] h-full bg-white/[0.02] hidden md:block" />
        <div className="w-[1px] h-full bg-white/[0.02]" />
      </div>

      {/* Hero Section */}
      <section className="relative w-full min-h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden pt-24 pb-16" style={{
        background: '#070605'
      }}>
        
        {/* Layer 0: Cinematic Backdrop Image (Vintage camera) */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-[0.35]">
          <img 
            src={heroBg} 
            alt="Vintage Camera" 
            className="w-full h-full object-cover filter grayscale contrast-125 brightness-[0.4]"
          />
        </div>

        {/* Layer 1: Subtle Vignette Mask Overlay (Fades image edges to solid black) */}
        <div className="absolute inset-0 z-0 pointer-events-none" style={{
          background: 'radial-gradient(circle at 50% 50%, transparent 35%, #070605 95%)'
        }} />

        {/* Layer 2: Cinematic Grid Lines (Skeletal Grid Layout) */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]">
          {/* Vertical lines */}
          <div className="absolute inset-0 flex justify-between max-w-[1100px] mx-auto w-full px-8">
            <div className="w-[1px] h-full bg-gold" />
            <div className="w-[1px] h-full bg-gold hidden md:block" />
            <div className="w-[1px] h-full bg-gold hidden md:block" />
            <div className="w-[1px] h-full bg-gold" />
          </div>
          {/* Horizontal lines */}
          <div className="absolute inset-0 flex flex-col justify-between py-16">
            <div className="h-[1px] w-full bg-gold" />
            <div className="h-[1px] w-full bg-gold" />
            <div className="h-[1px] w-full bg-gold" />
          </div>
        </div>

        {/* Layer 3: Top Center Spotlight */}
        <div className="absolute inset-0 z-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 50% 80% at 50% 0%, rgba(200,151,58,0.18) 0%, transparent 80%)'
        }} />

        {/* Layer 4: Main Gold Radial Glow behind content */}
        <div className="absolute inset-0 z-0 pointer-events-none" style={{
          background: 'radial-gradient(circle 400px at 50% 45%, rgba(200,151,58,0.07) 0%, transparent 100%)'
        }} />

        {/* Layer 5: Localized Film Grain Overlay */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.05] mix-blend-overlay" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
        }} />

        {/* Layer 6: Animated Blurred Light Blobs */}
        <motion.div 
          animate={{
            x: [0, 50, -30, 0],
            y: [0, -40, 30, 0],
            scale: [1, 1.1, 0.95, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[15%] left-[20%] w-[350px] h-[350px] rounded-full bg-gold/5 blur-[110px] pointer-events-none z-0 mix-blend-screen"
        />
        <motion.div 
          animate={{
            x: [0, -60, 40, 0],
            y: [0, 50, -25, 0],
            scale: [1, 0.95, 1.1, 1]
          }}
          transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[20%] right-[15%] w-[450px] h-[450px] rounded-full bg-gold/4 blur-[130px] pointer-events-none z-0 mix-blend-screen"
        />
        <motion.div 
          animate={{
            scale: [0.98, 1.03, 0.98]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[400px] rounded-full bg-gold/[0.03] blur-[120px] pointer-events-none z-0 mix-blend-screen"
        />
        
        <motion.div 
          initial={{ opacity: 0, y: -12 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8 }}
          className="relative z-10 border border-gold/40 text-gold text-[0.65rem] tracking-[0.4em] uppercase py-2 px-6 rounded-full mb-8 backdrop-blur-md bg-gold/[0.02] flex items-center gap-2"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
          {studioName} · Visual Story Studio
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          className="relative z-10 font-serif text-[clamp(3.5rem,9vw,7.5rem)] font-black leading-[0.9] tracking-[-0.03em] text-cream"
        >
          Sculpting Raw<br/>
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-gold via-cream to-gold italic font-normal py-2">Masterpieces.</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          className="relative z-10 mt-8 text-[clamp(0.9rem,1.8vw,1.05rem)] text-cream/50 font-light tracking-[0.05em] max-w-[500px] leading-relaxed"
        >
          We orchestrate cuts, craft color profiles, and shape sound fields — transforming raw footage into high-end cinematic statements.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.45 }}
          className="relative z-10 mt-12 flex flex-wrap justify-center gap-5"
        >
          <Button size="lg" className="shadow-[0_0_20px_rgba(200,151,58,0.15)]" onClick={() => handlePlayProject(null, 'https://www.youtube.com/embed/dQw4w9WgXcQ')}>
            ▶ Play Showreel
          </Button>
          <Button variant="outline" size="lg" className="hover:bg-white/5" onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}>
            See Our Packages
          </Button>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-cream/30 text-[0.6rem] tracking-[0.3em] uppercase"
        >
          <div className="w-[1px] h-12 bg-gradient-to-b from-gold to-transparent animate-scrollPulse" />
          scroll
        </motion.div>
      </section>

      {/* Services Section */}
      <section className="w-full py-28 px-8 relative border-t border-white/5 bg-charcoal/[0.15]">
        <div className="max-w-[1100px] mx-auto relative z-10">
          <motion.p {...fadeUp} className="text-[0.65rem] tracking-[0.4em] uppercase text-gold mb-3 font-medium">What We Offer</motion.p>
          <motion.h2 {...fadeUp} className="font-serif text-[clamp(2rem,4.5vw,3.2rem)] font-bold leading-[1.1] mb-6">Everything. Done to perfection.</motion.h2>
          <motion.div {...fadeUp} className="w-[50px] h-[1px] bg-gold mb-16" />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '🎬', title: 'Cinematic Editing', desc: 'Premium pacing and structural flow. Raw clips forged into immersive narratives.' },
              { icon: '🎨', title: 'Color Grading', desc: 'Deep color correction and cinematic grading to match your visual storytelling goals.' },
              { icon: '🔊', title: 'Sound Design', desc: 'Bespoke foley layering, dynamic audio leveling, and professional sound mixing.' },
              { icon: '⚡', title: 'Motion Graphics', desc: 'Modern minimalist typography, lower-thirds, and visual asset overlays.' }
            ].map((s, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                key={i} 
                className="group bg-white/[0.01] border border-white/5 p-10 relative overflow-hidden transition-all duration-500 rounded hover:border-gold/30 hover:bg-[#201A12]/20 hover:shadow-[0_10px_30px_rgba(32,26,18,0.3)]"
              >
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gold/0 to-transparent group-hover:via-gold/40 transition-all duration-500" />
                <span className="text-3xl block mb-6 transition-transform duration-300 group-hover:scale-110">{s.icon}</span>
                <h3 className="font-serif text-[1.25rem] font-bold mb-3 text-cream group-hover:text-gold transition-colors duration-300">{s.title}</h3>
                <p className="text-[0.88rem] text-cream/45 leading-[1.65] font-light">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Top 5 Works */}
      <section className="w-full py-28 px-8 border-t border-white/5 bg-charcoal/[0.05]">
        <div className="max-w-[1100px] mx-auto relative z-10">
          <motion.p {...fadeUp} className="text-[0.65rem] tracking-[0.4em] uppercase text-gold mb-3 font-medium">Selected Works</motion.p>
          <motion.h2 {...fadeUp} className="font-serif text-[clamp(2rem,4.5vw,3.2rem)] font-bold leading-[1.1] mb-6">Our Top 5 Masterpieces.</motion.h2>
          <motion.div {...fadeUp} className="w-[50px] h-[1px] bg-gold mb-16" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[320px]">
            {publishedProjects.length === 0 ? (
              <div className="col-span-full py-16 text-center text-white/40 font-light">
                No projects published yet. Manage them in the admin dashboard.
              </div>
            ) : (
              publishedProjects.map((work, i) => (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.98 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.7, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                  key={work.id} 
                  onClick={() => handlePlayProject(work)}
                  className={`relative group overflow-hidden rounded border border-white/5 cursor-pointer ${work.span || bentoSpans[i % bentoSpans.length]}`}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500 z-10" />
                  <img src={work.img} alt={work.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out" />
                  
                  <ViewfinderBrackets />
                  
                  <div className="absolute bottom-6 left-6 z-20 flex flex-col items-start translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    <p className="text-gold text-[0.6rem] tracking-[0.25em] uppercase mb-1.5 font-medium">{work.category}</p>
                    <h3 className="font-serif text-2xl font-bold text-cream group-hover:text-gold transition-colors duration-300">{work.title}</h3>
                  </div>

                  <div className="absolute top-6 right-6 z-20 text-[0.65rem] text-gold border border-gold/30 rounded-full w-8 h-8 flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    ▶
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="w-full py-28 px-8 border-t border-white/5 bg-dark">
        <div className="max-w-[1100px] mx-auto relative z-10">
          <motion.p {...fadeUp} className="text-[0.65rem] tracking-[0.4em] uppercase text-gold mb-3 font-medium">Pricing</motion.p>
          <h2 className="font-serif text-[clamp(2rem,4.5vw,3.2rem)] font-bold leading-[1.1] mb-6">Simple. Transparent. Flat rates.</h2>
          <div className="w-[50px] h-[1px] bg-gold mb-16" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Starter */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0, ease: [0.16, 1, 0.3, 1] }}
              className="border border-white/5 p-10 rounded bg-white/[0.01] relative transition-all duration-500 hover:border-gold/30 hover:-translate-y-1 hover:bg-[#201A12]/5"
            >
              <p className="text-[0.65rem] tracking-[0.3em] uppercase text-gold mb-4 font-semibold">Reel Edit</p>
              <div className="font-serif text-5xl font-black leading-none text-cream mb-2 flex items-baseline">
                <sup className="text-xl font-normal text-gold mr-1">₹</sup>{priceReel.toLocaleString('en-IN')}
              </div>
              <p className="text-[0.8rem] text-cream/40 mb-8 border-b border-white/5 pb-4">Per Short Form Video</p>
              <ul className="flex flex-col gap-4 mb-10">
                {['Up to 60 seconds duration', 'Engaging minimal typography', 'Cinematic LUT application', 'Sound FX & Trending track mix', '1 revision cycle'].map((f, i) => (
                  <li key={i} className="text-[0.88rem] text-cream/60 flex items-center gap-3">
                    <span className="text-gold text-[0.5rem]">✦</span> {f}
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="w-full hover:bg-gold hover:text-dark">Book Now</Button>
            </motion.div>

            {/* Featured */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="border border-gold bg-gold/[0.02] p-10 rounded relative transition-all duration-500 hover:-translate-y-1 shadow-[0_0_35px_rgba(200,151,58,0.15)]"
            >
              <div className="absolute top-[-1px] right-6 bg-gold text-dark text-[0.6rem] font-bold tracking-[0.2em] uppercase px-4 py-1.5 rounded-b">
                Popular Choice
              </div>
              <p className="text-[0.65rem] tracking-[0.3em] uppercase text-gold mb-4 font-semibold">YouTube Edit</p>
              <div className="font-serif text-5xl font-black leading-none text-cream mb-2 flex items-baseline">
                <sup className="text-xl font-normal text-gold mr-1">₹</sup>{priceYoutube.toLocaleString('en-IN')}
              </div>
              <p className="text-[0.8rem] text-cream/40 mb-8 border-b border-white/5 pb-4">Per Long Form Video</p>
              <ul className="flex flex-col gap-4 mb-10">
                {['Up to 15 minutes cut', 'Advanced narrative structural cuts', 'Primary color profile development', 'Complete audio design & dialogue cleanup', 'Custom title & overlay graphics', '2 revision cycles'].map((f, i) => (
                  <li key={i} className="text-[0.88rem] text-cream/70 flex items-center gap-3">
                    <span className="text-gold text-[0.5rem]">✦</span> {f}
                  </li>
                ))}
              </ul>
              <Button className="w-full shadow-lg">Book Now</Button>
            </motion.div>

            {/* Retainer */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="border border-white/5 p-10 rounded bg-white/[0.01] relative transition-all duration-500 hover:border-gold/30 hover:-translate-y-1 hover:bg-[#201A12]/5"
            >
              <p className="text-[0.65rem] tracking-[0.3em] uppercase text-gold mb-4 font-semibold">Creator Pack</p>
              <div className="font-serif text-5xl font-black leading-none text-cream mb-2 flex items-baseline">
                <sup className="text-xl font-normal text-gold mr-1">₹</sup>{priceCreator.toLocaleString('en-IN')}
              </div>
              <p className="text-[0.8rem] text-cream/40 mb-8 border-b border-white/5 pb-4">Monthly Retainer</p>
              <ul className="flex flex-col gap-4 mb-10">
                {['4 Premium Long Form edits', '12 Custom Short Form reels', 'YouTube Thumbnail design included', 'Priority workflow delivery', 'Dedicated collaboration room', 'Flexible revision pipeline'].map((f, i) => (
                  <li key={i} className="text-[0.88rem] text-cream/60 flex items-center gap-3">
                    <span className="text-gold text-[0.5rem]">✦</span> {f}
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="w-full hover:bg-gold hover:text-dark">Book Now</Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Meet the Creator */}
      <section className="w-full py-28 px-8 border-t border-white/5 bg-charcoal/[0.1] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-white/[0.01] -skew-x-12 translate-x-20 pointer-events-none" />
        <div className="max-w-[1100px] mx-auto flex flex-col md:flex-row items-center gap-16 relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full md:w-1/2 relative"
          >
            <div className="aspect-[4/5] w-full max-w-[380px] mx-auto relative rounded overflow-hidden border border-white/10 p-2">
              <ViewfinderBrackets />
              <img 
                src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=800" 
                alt="Creator Profile" 
                className="w-full h-full object-cover rounded grayscale hover:grayscale-0 transition-all duration-700 ease-out"
              />
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="w-full md:w-1/2 flex flex-col items-start"
          >
            <p className="text-[0.65rem] tracking-[0.4em] uppercase text-gold mb-3 font-medium">Behind the Lens</p>
            <h2 className="font-serif text-[clamp(2rem,4vw,2.8rem)] font-bold leading-[1.1] mb-6">Hi, I'm {editorName}.</h2>
            <p className="text-[0.95rem] text-cream/55 leading-[1.8] mb-6 font-light">
              I built {studioName} out of a pure love for visual storytelling. Based in the heart of the city, my goal is to transform ordinary footage into cinematic masterpieces that capture raw emotion and rhythm.
            </p>
            <p className="text-[0.95rem] text-cream/55 leading-[1.8] mb-8 font-light">
              With over 5 years of industry experience cutting everything from music videos to brand documentaries, I don't just edit videos—I sculpt narratives.
            </p>
            <div className="font-serif text-3xl text-gold/80 italic border-l-2 border-gold/40 pl-4 py-1">{editorName}</div>
          </motion.div>
        </div>
      </section>

      {/* Process Section */}
      <section className="w-full py-28 px-8 border-t border-white/5 bg-dark">
        <div className="max-w-[1100px] mx-auto relative z-10">
          <motion.p {...fadeUp} className="text-[0.65rem] tracking-[0.4em] uppercase text-gold mb-3 font-medium">Process</motion.p>
          <h2 className="font-serif text-[clamp(2rem,4.5vw,3.2rem)] font-bold leading-[1.1] mb-6">How we bring ideas to life.</h2>
          <div className="w-[50px] h-[1px] bg-gold mb-16" />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative mt-4">
            {[
              { num: '01', icon: '💬', title: 'Consult & Brief', desc: 'Reach out and share your vision, target audience, and reference styles.' },
              { num: '02', icon: '📤', title: 'Upload Footage', desc: 'Drop your raw files into our secure drive. We review everything immediately.' },
              { num: '03', icon: '✂️', title: 'The Magic', desc: 'We meticulously cut, grade, and design your video to perfection.' },
              { num: '04', icon: '✨', title: 'Review & Post', desc: 'You get a link to review. Once approved, the final high-res file is yours.' }
            ].map((step, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                key={i} 
                className="p-8 border border-white/5 rounded bg-white/[0.01] hover:border-gold/25 transition-colors duration-300 relative group"
              >
                <div className="font-serif text-5xl font-black text-gold/10 leading-none mb-4 group-hover:text-gold/25 transition-colors duration-300">{step.num}</div>
                <span className="text-2xl block mb-4">{step.icon}</span>
                <h3 className="font-serif text-[1.15rem] mb-2 text-cream font-bold">{step.title}</h3>
                <p className="text-[0.85rem] text-cream/45 leading-[1.65] font-light">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Payment Policy */}
      <section className="w-full py-28 px-8 border-t border-white/5 bg-charcoal/[0.05]">
        <div className="max-w-[1100px] mx-auto relative z-10">
          <motion.p {...fadeUp} className="text-[0.65rem] tracking-[0.4em] uppercase text-gold mb-3 font-medium">Payment Policy</motion.p>
          <h2 className="font-serif text-[clamp(2rem,4.5vw,3.2rem)] font-bold leading-[1.1] mb-6">Fair terms for flat rates.</h2>
          <div className="w-[50px] h-[1px] bg-gold mb-16" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white/[0.01] border border-white/5 p-12 text-center rounded relative hover:border-gold/25 transition-colors duration-300"
            >
              <div className="font-serif text-[4.5rem] font-black text-gold/20 leading-none mb-3">50%</div>
              <h3 className="font-serif text-[1.2rem] mb-3 text-cream font-bold">To Start Work</h3>
              <p className="text-[0.88rem] text-cream/45 leading-[1.7] max-w-[280px] mx-auto font-light">
                Once we agree on project scope and inputs are received, a 50% deposit secures your booking in our editor queue.
              </p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white/[0.01] border border-white/5 p-12 text-center rounded relative hover:border-gold/25 transition-colors duration-300"
            >
              <div className="font-serif text-[4.5rem] font-black text-gold/20 leading-none mb-3">50%</div>
              <h3 className="font-serif text-[1.2rem] mb-3 text-cream font-bold">Upon Final Delivery</h3>
              <p className="text-[0.88rem] text-cream/45 leading-[1.7] max-w-[280px] mx-auto font-light">
                Remaining 50% is processed only after you review and approve the watermarked final cut.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Promise Banner */}
      <div className="w-full bg-gold py-20 px-8 text-center overflow-hidden relative">
        <div className="absolute inset-0 pointer-events-none bg-black/[0.03] pattern-grid" />
        <motion.h2 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif text-[clamp(1.8rem,3.5vw,2.8rem)] font-black text-dark leading-[1.25] max-w-[800px] mx-auto relative z-10"
        >
          You bring the raw vision. <em className="text-dark/60 italic font-normal">We bring the rhythm, color fields, cutting patterns — and the story.</em>
        </motion.h2>
      </div>

      {/* Contact Section */}
      <section id="contact" className="w-full py-28 px-8 bg-charcoal/[0.1] text-center border-t border-white/5">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="border border-gold/15 rounded p-12 md:p-16 max-w-[650px] mx-auto bg-gold/[0.01] backdrop-blur-md relative"
        >
          <ViewfinderBrackets />
          <p className="text-[0.65rem] tracking-[0.4em] uppercase text-gold mb-6 font-semibold">Get in Touch</p>
          <h2 className="font-serif text-[clamp(1.8rem,3.5vw,2.5rem)] font-bold mb-4 leading-tight">Let's craft something beautiful together.</h2>
          <p className="text-[0.9rem] text-cream/45 leading-[1.7] mb-10 max-w-[480px] mx-auto font-light">
            Ready to elevate your visual output? Reach out to kick off your project brief — we take care of the timeline and polish.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-12 max-w-[440px] mx-auto">
            <Button size="lg" className="w-full shadow-lg" onClick={() => window.location.href='/contact'}>
              ✉️ Contact Form
            </Button>
            <Button variant="outline" size="lg" className="w-full hover:bg-white/5">
              📲 Message on Discord
            </Button>
          </div>

          <div className="flex justify-center gap-8 flex-wrap pt-6 border-t border-gold/15 text-[0.85rem]">
            <div className="text-center">
              <p className="text-[0.65rem] tracking-[0.25em] uppercase text-gold mb-1">Direct Email</p>
              <a href={`mailto:${supportEmail}`} className="text-cream/70 hover:text-gold no-underline transition-colors font-medium">{supportEmail}</a>
            </div>
            <div className="text-center">
              <p className="text-[0.65rem] tracking-[0.25em] uppercase text-gold mb-1">Socials</p>
              <a href="#" className="text-cream/70 hover:text-gold no-underline transition-colors font-medium">{socialHandle}</a>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Video Overlay Modal */}
      <AnimatePresence>
        {activeVideoUrl && (
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
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
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
                ) : (activeProject?.isLocalVideo && activeVideoUrl) || isDirectVideo(activeProject?.videoUrl) ? (
                  <video 
                    className="w-full h-full object-cover"
                    src={activeVideoUrl || activeProject?.videoUrl}
                    controls
                    autoPlay
                  />
                ) : (
                  <iframe 
                    className="w-full h-full object-cover"
                    src={activeVideoUrl || ''}
                    title="Video Player"
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
