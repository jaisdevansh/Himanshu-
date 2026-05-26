import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { useSettingsStore } from '@/store/settingsStore';
import axios from 'axios';

export const Contact = () => {
  const { supportEmail, studioName, priceReel, priceYoutube, priceCreator } = useSettingsStore();
  const socialHandle = '@' + studioName.toLowerCase().replace(/\s+/g, '');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: 'Reel Edit',
    message: ''
  });

  const fadeUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-50px" },
    transition: { duration: 0.6 }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/v1/inquiries', {
        name: formData.name,
        email: formData.email,
        package: formData.projectType,
        message: formData.message,
      });
      alert("Message sent! We will get back to you within 24 hours.");
      setFormData({
        name: '',
        email: '',
        projectType: 'Reel Edit',
        message: ''
      });
    } catch (err: any) {
      console.error("Error submitting contact form:", err);
      alert(err.response?.data?.error || "Failed to submit inquiry. Please try again.");
    }
  };

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
            Get In Touch
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-serif text-[clamp(2.5rem,6vw,5rem)] font-black leading-[1] mb-6"
          >
            Let's Start the <span className="text-gold italic">Conversation.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-[1.05rem] text-cream/60 font-light max-w-[600px] mx-auto leading-[1.8]"
          >
            Tell us about your project, raw footage length, and your goal style. Let's sculpt something together.
          </motion.p>
        </div>
      </section>

      {/* Main Split */}
      <section className="w-full py-20 px-8 bg-charcoal/20">
        <div className="max-w-[1100px] mx-auto flex flex-col lg:flex-row gap-16 items-stretch">
          
          {/* Contact Details */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="w-full lg:w-1/2 flex flex-col justify-between"
          >
            <div>
              <h2 className="font-serif text-3xl font-bold mb-6">Direct Channels</h2>
              <p className="text-[0.95rem] text-cream/55 leading-[1.7] font-light mb-8">
                If forms aren't your thing, drop a direct note to us. We check these channels hourly and reply almost immediately.
              </p>

              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full border border-gold/25 flex items-center justify-center text-gold text-lg">
                    ✉️
                  </div>
                  <div>
                    <p className="text-[0.65rem] tracking-[0.2em] uppercase text-gold">Email</p>
                    <a href={`mailto:${supportEmail}`} className="text-cream text-[0.95rem] hover:text-gold transition-colors font-medium">{supportEmail}</a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full border border-gold/25 flex items-center justify-center text-gold text-lg">
                    📲
                  </div>
                  <div>
                    <p className="text-[0.65rem] tracking-[0.2em] uppercase text-gold">Social Media / Discord</p>
                    <a href="#" className="text-cream text-[0.95rem] hover:text-gold transition-colors font-medium">{socialHandle}</a>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gold/10 pt-10 mt-10">
              <h3 className="font-serif text-xl font-bold mb-4">Frequently Asked Questions</h3>
              <div className="flex flex-col gap-6 text-[0.88rem]">
                <div>
                  <p className="text-gold font-medium mb-1">What is your typical turnaround time?</p>
                  <p className="text-cream/50 leading-relaxed font-light">Short-form content is usually delivered within 48 hours. Long-form edits take 3-5 working days depending on structural complexity.</p>
                </div>
                <div>
                  <p className="text-gold font-medium mb-1">Do you provide sound design and graphics?</p>
                  <p className="text-cream/50 leading-relaxed font-light">Yes, all our editing packages include essential sound levelling and clean minimal motion typography overlays.</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="w-full lg:w-1/2 p-8 md:p-12 border border-gold/20 rounded-md bg-charcoal/30 flex flex-col justify-center"
          >
            <h2 className="font-serif text-2xl font-bold mb-8">Send a Message</h2>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[0.65rem] tracking-[0.2em] uppercase text-gold">Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="bg-transparent border border-gold/15 rounded px-4 py-3 text-[0.95rem] focus:border-gold focus:outline-none text-cream placeholder-cream/25"
                  placeholder="Himanshu Kumar"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[0.65rem] tracking-[0.2em] uppercase text-gold">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="bg-transparent border border-gold/15 rounded px-4 py-3 text-[0.95rem] focus:border-gold focus:outline-none text-cream placeholder-cream/25"
                  placeholder="himanshu@example.com"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[0.65rem] tracking-[0.2em] uppercase text-gold">Select Package</label>
                <select 
                  value={formData.projectType}
                  onChange={(e) => setFormData({...formData, projectType: e.target.value})}
                  className="bg-charcoal border border-gold/15 rounded px-4 py-3 text-[0.95rem] focus:border-gold focus:outline-none text-cream"
                >
                  <option value="Reel Edit">Reel Edit (₹{priceReel.toLocaleString('en-IN')})</option>
                  <option value="YouTube Edit">YouTube Edit (₹{priceYoutube.toLocaleString('en-IN')})</option>
                  <option value="Creator Pack">Creator Pack (₹{priceCreator.toLocaleString('en-IN')}/mo)</option>
                  <option value="Custom Project">Custom Project</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[0.65rem] tracking-[0.2em] uppercase text-gold">Project Brief</label>
                <textarea 
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="bg-transparent border border-gold/15 rounded px-4 py-3 text-[0.95rem] focus:border-gold focus:outline-none text-cream placeholder-cream/25 resize-none"
                  placeholder="Provide links to your raw files, reference clips, or simply write down your concept..."
                />
              </div>

              <Button type="submit" size="lg" className="w-full mt-4">
                Send Request
              </Button>
            </form>
          </motion.div>

        </div>
      </section>
    </div>
  );
};
