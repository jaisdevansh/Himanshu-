import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';

export const Services = () => {
  const fadeUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-50px" },
    transition: { duration: 0.6 }
  };

  const services = [
    {
      num: "01",
      title: "Cinematic Video Editing",
      tagline: "We shape your raw clips into structured visual journeys.",
      desc: "Our primary service. We handle pacing, narrative arcs, and structure. Whether it's a documentary, music video, or brand showcase, we ensure that the edit hooks viewers in the first 3 seconds and holds them until the end.",
      features: ["Advanced Narrative Pacing", "Seamless Sound Synchronization", "Jump-cut & Montage design", "Multi-cam Editing support"]
    },
    {
      num: "02",
      title: "Signature Color Grading",
      tagline: "Unlocking the emotional landscape of your footage.",
      desc: "Color is the difference between amateur footage and a Hollywood look. We correction-balance exposures, match cameras, and apply tailored cinematic LUTs to elevate the visual narrative to high-end aesthetic levels.",
      features: ["SDR & HDR Color Correction", "Shot-to-Shot Matching", "Atmospheric Look Design", "Beauty & Skin Retouching"]
    },
    {
      num: "03",
      title: "Premium Sound Design",
      tagline: "Audio dictates how the video actually feels.",
      desc: "Good video editing is invisible, but bad sound is impossible to ignore. We clean up dialogue, layer custom foley effects, and design complex transitions using spatial audio layouts to fully immerse the audience.",
      features: ["Foley & Sound Effects Layering", "Dialogue Denoiser & Levelling", "Dynamic Music Pacing", "Audio Mix Mastering"]
    },
    {
      num: "04",
      title: "Modern Motion Graphics",
      tagline: "Dynamic typographic styling and custom overlays.",
      desc: "Clean titles and visual cues that reinforce key concepts. We design modern typography overlays, seamless minimal transitions, logo introductions, and attention-grabbing subtitles optimized for social consumption.",
      features: ["Sleek Minimal Lower-thirds", "Custom Kinetic Typography", "Transition Sound-effects integration", "Social Subtitle Templates"]
    }
  ];

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-dark text-cream pt-20">
      {/* Header */}
      <section className="w-full py-20 px-8 relative overflow-hidden border-b border-gold/10">
        <div className="absolute inset-0 pointer-events-none z-0" style={{
          background: 'radial-gradient(ellipse 60% 60% at 50% 30%, rgba(200,151,58,0.1) 0%, transparent 70%)'
        }} />
        
        <div className="max-w-[1100px] mx-auto text-center relative z-10">
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-[0.65rem] tracking-[0.4em] uppercase text-gold mb-4"
          >
            What We Do
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-serif text-[clamp(2.5rem,6vw,5rem)] font-black leading-[1] mb-6"
          >
            Crafting the <span className="text-gold italic">Dream.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-[1.05rem] text-cream/60 font-light max-w-[600px] mx-auto leading-[1.8]"
          >
            From assembly edit to the final export, we handle every post-production layer to make sure your work stands out in the noise.
          </motion.p>
        </div>
      </section>

      {/* Services Showcase */}
      <section className="w-full py-20 px-8 bg-charcoal/20">
        <div className="max-w-[1000px] mx-auto flex flex-col gap-24">
          {services.map((service, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
              key={i}
              className={`flex flex-col md:flex-row gap-12 md:gap-20 items-start ${i % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
            >
              <div className="w-full md:w-1/3 flex flex-col items-start">
                <span className="font-serif text-8xl font-black text-gold/10 leading-none mb-4">{service.num}</span>
                <h2 className="font-serif text-3xl font-bold leading-tight mb-2">{service.title}</h2>
                <p className="text-gold text-[0.8rem] tracking-wider uppercase font-medium mt-1 leading-snug">{service.tagline}</p>
              </div>
              <div className="w-full md:w-2/3 flex flex-col">
                <p className="text-[0.95rem] text-cream/70 leading-[1.8] font-light mb-8">
                  {service.desc}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {service.features.map((feat, fi) => (
                    <div key={fi} className="flex items-center gap-3 text-[0.88rem] text-cream/60">
                      <span className="text-gold text-[0.6rem]">✦</span> {feat}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="w-full py-24 px-8 bg-dark border-t border-gold/10">
        <div className="max-w-[800px] mx-auto text-center">
          <motion.h2 {...fadeUp} className="font-serif text-3xl md:text-4xl font-bold mb-6">Need a custom bundle?</motion.h2>
          <motion.p {...fadeUp} className="text-[0.95rem] text-cream/60 leading-[1.8] max-w-[600px] mx-auto mb-10 font-light">
            If you need editing combined with graphics or want to put us on a custom retainer structure, we can tailor a package specifically to your content calendar.
          </motion.p>
          <motion.div {...fadeUp}>
            <Button size="lg" onClick={() => window.location.href='/contact'}>Get a Custom Quote</Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
