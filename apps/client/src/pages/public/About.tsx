import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { useSettingsStore } from '@/store/settingsStore';

export const About = () => {
  const { studioName, editorName } = useSettingsStore();

  const fadeUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-50px" },
    transition: { duration: 0.6 }
  };

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-dark text-cream pt-20">
      {/* Hero Section */}
      <section className="w-full py-20 px-8 relative overflow-hidden border-b border-gold/10">
        <div className="absolute inset-0 pointer-events-none z-0" style={{
          background: 'radial-gradient(ellipse 60% 60% at 50% 30%, rgba(200,151,58,0.1) 0%, transparent 70%)'
        }} />
        
        <div className="max-w-[1100px] mx-auto flex flex-col md:flex-row items-center gap-16 relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full md:w-1/2"
          >
            <div className="aspect-[4/5] w-full max-w-[400px] mx-auto relative">
              <div className="absolute inset-0 border border-gold translate-x-4 translate-y-4 rounded-md" />
              <img 
                src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=800" 
                alt={`${editorName} - Creator of ${studioName}`} 
                className="absolute inset-0 w-full h-full object-cover rounded-md grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full md:w-1/2"
          >
            <p className="text-[0.65rem] tracking-[0.4em] uppercase text-gold mb-4">The Story Behind The Lens</p>
            <h1 className="font-serif text-[clamp(2.5rem,5vw,4.5rem)] font-black leading-[1] mb-6">{editorName}</h1>
            <p className="text-[1.05rem] text-cream/70 leading-[1.8] mb-6 font-light">
              Hi, I'm the founder and lead editor of {studioName}. My journey into video editing started with a simple fascination: how putting two clips together could change the entire heartbeat of a scene. 
            </p>
            <p className="text-[0.95rem] text-cream/55 leading-[1.7] mb-8 font-light">
              Over the last 5+ years, I have worked with independent creators, high-growth startups, and musicians to tell stories that stick. I believe editing isn't just about cutting clips—it is about timing, rhythm, and color psychology. {studioName} was created to bring high-end, cinematic polish to creators worldwide.
            </p>
            <Button size="lg" onClick={() => window.location.href='/contact'}>Work with me</Button>
          </motion.div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="w-full py-24 px-8 bg-charcoal">
        <div className="max-w-[800px] mx-auto text-center">
          <motion.p {...fadeUp} className="text-[0.65rem] tracking-[0.4em] uppercase text-gold mb-6">Philosophy</motion.p>
          <motion.h2 {...fadeUp} className="font-serif text-[clamp(1.8rem,4vw,2.8rem)] font-bold mb-8 leading-[1.2]">
            "We sculpt stories, frames, and sounds to create digital dreams."
          </motion.h2>
          <motion.p {...fadeUp} className="text-[0.95rem] text-cream/60 leading-[1.8] max-w-[650px] mx-auto font-light">
            We don't do boring edits. We don't just dump subtitles on top of reels. Every frame is treated with respect—color-graded to evoke specific emotions, timed precisely to custom sound cues, and paced perfectly to retain attention. That is the {studioName} promise.
          </motion.p>
        </div>
      </section>

      {/* Tech Stack / Toolkit Section */}
      <section className="w-full py-24 px-8 bg-dark">
        <div className="max-w-[1100px] mx-auto">
          <div className="text-center mb-16">
            <motion.p {...fadeUp} className="text-[0.65rem] tracking-[0.4em] uppercase text-gold mb-4">Our Arsenal</motion.p>
            <motion.h2 {...fadeUp} className="font-serif text-3xl md:text-4xl font-bold">The tools of the craft</motion.h2>
            <motion.div {...fadeUp} className="w-[60px] h-[2px] bg-gold mx-auto mt-6" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "DaVinci Resolve Studio", role: "Color Grading & Advanced Editing", desc: "Our weapon of choice for color correction, HDR grading, and deep finishing tasks." },
              { title: "Adobe Premiere Pro", role: "Long & Short Form Assembly", desc: "Industry-standard timelines for fast-paced edits, structural assembly, and audio synchronization." },
              { title: "Adobe After Effects", role: "Motion Design & VFX", desc: "Sleek typography, 3D titles, lower-thirds, and visual effects that feel modern and seamless." }
            ].map((tool, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                key={i}
                className="p-8 border border-gold/15 rounded-md bg-charcoal/30 hover:border-gold transition-colors duration-300"
              >
                <h3 className="font-serif text-xl font-bold mb-1">{tool.title}</h3>
                <p className="text-[0.7rem] text-gold tracking-widest uppercase mb-4">{tool.role}</p>
                <p className="text-[0.88rem] text-cream/55 leading-[1.65] font-light">{tool.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
