import React from 'react';
import { useProjectStore } from '@/store/projectStore';
import { Film, Image as ImageIcon, ExternalLink, Calendar } from 'lucide-react';

export const MediaManager = () => {
  const { projects } = useProjectStore();

  return (
    <div className="space-y-6 text-cream">
      <div className="bg-surface/30 p-6 rounded-lg border border-white/5 backdrop-blur-sm">
        <h2 className="text-xl font-bold tracking-tight">Cloud Media Library</h2>
        <p className="text-sm text-white/40 font-light">Inspect all image assets and video reels hosted on Cloudinary or locally.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="bg-surface/20 border border-white/5 rounded-lg overflow-hidden backdrop-blur-sm group hover:border-gold/30 transition-all duration-350 flex flex-col">
            {/* Thumbnail Preview Area */}
            <div className="aspect-video relative overflow-hidden bg-black/40">
              <img
                src={project.img}
                alt={project.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm text-[0.65rem] font-mono tracking-widest uppercase text-gold border border-gold/15 flex items-center gap-1.5">
                <ImageIcon size={10} /> Thumbnail
              </span>
            </div>

            {/* Meta Info */}
            <div className="p-5 flex-1 flex flex-col justify-between gap-4">
              <div>
                <h3 className="font-serif font-bold text-white text-[1.05rem] leading-snug">{project.title}</h3>
                <span className="text-[0.65rem] text-gold uppercase tracking-wider font-mono block mt-1">{project.category}</span>
              </div>

              <div className="space-y-2 border-t border-white/5 pt-3">
                {project.videoUrl && (
                  <div className="flex items-center justify-between text-xs text-white/60 font-light">
                    <span className="flex items-center gap-1.5">
                      <Film size={12} className="text-gold/60" /> Reel Link
                    </span>
                    <a
                      href={project.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gold hover:underline font-mono text-[0.65rem] max-w-[150px] truncate flex items-center gap-1"
                    >
                      View Source <ExternalLink size={10} />
                    </a>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-white/40 font-light">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={12} /> Added Date
                  </span>
                  <span className="font-mono text-[0.68rem]">{project.date}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
