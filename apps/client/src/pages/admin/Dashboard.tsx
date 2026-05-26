import React, { useEffect, useState } from 'react';
import { useProjectStore } from '@/store/projectStore';
import axios from 'axios';
import { Film, Inbox, Eye, Clock, ArrowUpRight } from 'lucide-react';

interface Inquiry {
  id: string;
  name: string;
  email: string;
  package: string;
  message: string;
  createdAt: string;
}

export const Dashboard = () => {
  const { projects, fetchProjects } = useProjectStore();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
    axios.get('/api/v1/inquiries')
      .then((res) => {
        setInquiries(res.data);
      })
      .catch((err) => console.error('Failed to load inquiries for dashboard:', err))
      .finally(() => setIsLoading(false));
  }, []);

  const totalProjects = projects.length;
  const totalInquiries = inquiries.length;
  const totalViews = projects.reduce((sum, p) => sum + (p.views || 0), 0);

  // Generate last 7 days of inquiries graph dynamically
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d;
  });

  const inquiriesByDay = last7Days.map(day => {
    const dateStr = day.toDateString();
    return inquiries.filter(inq => {
      const inqDate = new Date(inq.createdAt);
      return inqDate.toDateString() === dateStr;
    }).length;
  });

  const maxInquiries = Math.max(...inquiriesByDay, 1);

  // Map 7 days to the SVG width (480px) and height (150px)
  // X values: 0, 80, 160, 240, 320, 400, 480
  // Y values: scale count to fit height margin [20, 130]
  const chartDataPoints = last7Days.map((_, i) => {
    const count = inquiriesByDay[i];
    const x = i * 80;
    const y = 130 - (count / maxInquiries) * 110; // y ranges from 130 (0 inquiries) to 20 (max inquiries)
    return { x, y, count };
  });

  const chartPoints = chartDataPoints.map(p => `${p.x},${p.y}`).join(' ');
  const chartGradientPoints = `${chartPoints} 480,150 0,150`;

  const dayNames = last7Days.map(day => 
    day.toLocaleDateString('en-US', { weekday: 'short' })
  );

  return (
    <div className="space-y-6 text-cream">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Visitors */}
        <div className="bg-surface/20 p-6 rounded-lg border border-white/5 relative overflow-hidden backdrop-blur-sm">
          <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-gold/20 pointer-events-none" />
          <h3 className="text-white/40 text-xs font-mono uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Eye size={14} className="text-gold" /> Total Showcase Views
          </h3>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-black text-white font-serif">{totalViews}</p>
            <span className="text-[0.7rem] text-green-400 font-mono flex items-center font-bold">
              +12% <ArrowUpRight size={10} />
            </span>
          </div>
        </div>

        {/* Projects */}
        <div className="bg-surface/20 p-6 rounded-lg border border-white/5 relative overflow-hidden backdrop-blur-sm">
          <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-gold/20 pointer-events-none" />
          <h3 className="text-white/40 text-xs font-mono uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Film size={14} className="text-gold" /> Active Projects
          </h3>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-black text-white font-serif">{totalProjects}</p>
            <span className="text-[0.7rem] text-gold font-mono font-light">
              Live on site
            </span>
          </div>
        </div>

        {/* Inquiries */}
        <div className="bg-surface/20 p-6 rounded-lg border border-white/5 relative overflow-hidden backdrop-blur-sm">
          <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-gold/20 pointer-events-none" />
          <h3 className="text-white/40 text-xs font-mono uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Inbox size={14} className="text-gold" /> Total Inquiries
          </h3>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-black text-white font-serif">{totalInquiries}</p>
            <span className="text-[0.7rem] text-gold font-mono font-light">
              Pending response
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Card */}
        <div className="lg:col-span-2 bg-surface/20 p-6 rounded-lg border border-white/5 backdrop-blur-sm space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-gold/30 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-gold/30 pointer-events-none" />

          <div className="flex justify-between items-center border-b border-white/5 pb-4">
            <div>
              <h3 className="text-[0.95rem] font-serif font-bold text-white">Showcase Growth & Plays</h3>
              <p className="text-xs text-white/40 font-light">Metrics indicating weekly user engagement activity.</p>
            </div>
            <span className="text-[0.65rem] font-mono tracking-widest text-gold uppercase bg-gold/10 px-2 py-0.5 rounded border border-gold/15">
              Live Updates
            </span>
          </div>

          {/* SVG Animated Chart */}
          <div className="h-[150px] w-full relative pt-2">
            <svg viewBox="0 0 480 150" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#C8973A" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#C8973A" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Grid Lines */}
              <line x1="0" y1="30" x2="480" y2="30" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              <line x1="0" y1="75" x2="480" y2="75" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              <line x1="0" y1="120" x2="480" y2="120" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              
              {/* Filled Area */}
              <polygon points={chartGradientPoints} fill="url(#chartGlow)" />
              
              {/* Path Line */}
              <polyline
                fill="none"
                stroke="#C8973A"
                strokeWidth="2.5"
                points={chartPoints}
                className="drop-shadow-[0_2px_8px_rgba(200,151,58,0.4)]"
              />
              {/* Interactive Point Markers */}
              {chartDataPoints.map((p, i) => (
                <circle 
                  key={i} 
                  cx={p.x} 
                  cy={p.y} 
                  r={i === chartDataPoints.length - 1 ? 5 : 4} 
                  fill={i === chartDataPoints.length - 1 ? "#C8973A" : "#0E0B07"} 
                  stroke="#C8973A" 
                  strokeWidth="2"
                  className="cursor-pointer"
                >
                  <title>{`${dayNames[i]}: ${p.count} inquiries`}</title>
                </circle>
              ))}
            </svg>
          </div>
          <div className="flex justify-between text-[0.62rem] font-mono tracking-widest text-white/30 uppercase">
            {dayNames.map((name, i) => (
              <span key={i}>{name}</span>
            ))}
          </div>
        </div>

        {/* Side Panel: Recent Inquiries */}
        <div className="bg-surface/20 p-6 rounded-lg border border-white/5 backdrop-blur-sm flex flex-col justify-between min-h-[300px] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-gold/30 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-gold/30 pointer-events-none" />

          <div>
            <h3 className="text-[0.95rem] font-serif font-bold text-white border-b border-white/5 pb-3 flex items-center gap-1.5">
              Recent Inquiries
            </h3>

            <div className="mt-4 space-y-4">
              {isLoading ? (
                <div className="text-center py-8 text-gold/60 font-mono text-xs">Loading requests...</div>
              ) : inquiries.length === 0 ? (
                <div className="text-center py-8 text-white/20 text-xs font-light">No customer requests yet.</div>
              ) : (
                inquiries.slice(0, 3).map((item) => (
                  <div key={item.id} className="p-3 bg-dark/40 rounded border border-white/5 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-white text-xs">{item.name}</span>
                      <span className="text-[0.62rem] font-mono text-gold px-1.5 py-0.2 bg-gold/10 rounded">{item.package}</span>
                    </div>
                    <div className="text-[0.65rem] text-white/40 flex items-center gap-1 font-mono">
                      <Clock size={10} /> {new Date(item.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-white/5">
            <p className="text-[0.65rem] text-white/30 font-light">Check the CRM tab on the sidebar to view full descriptions and reply directly.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
