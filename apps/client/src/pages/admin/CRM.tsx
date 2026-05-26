import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Mail, Search, MessageSquare, Clock, Filter, Trash2 } from 'lucide-react';
import { useSettingsStore } from '@/store/settingsStore';

interface Inquiry {
  id: string;
  name: string;
  email: string;
  package: string;
  message: string;
  createdAt: string;
}

export const CRM = () => {
  const { studioName } = useSettingsStore();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPackage, setFilterPackage] = useState('All');

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/api/v1/inquiries');
      setInquiries(response.data);
      if (response.data.length > 0) {
        setSelectedInquiry(response.data[0]);
      }
    } catch (error) {
      console.error('Error fetching inquiries:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredInquiries = inquiries.filter((inquiry) => {
    const matchesSearch =
      inquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.message.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterPackage === 'All' || inquiry.package === filterPackage;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6 text-cream">
      {/* Action Header */}
      <div className="flex justify-between items-center bg-surface/30 p-6 rounded-lg border border-white/5 backdrop-blur-sm">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Client Relationship Management (CRM)</h2>
          <p className="text-sm text-white/40 font-light">Respond to client project inquiries, briefs, and customization requests.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Search & List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 bg-surface/20 p-4 rounded-lg border border-white/5">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 text-white/30" size={18} />
              <input
                type="text"
                placeholder="Search by name, email or message content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-dark/60 border border-white/10 rounded pl-10 pr-4 py-2 text-sm text-white focus:border-gold focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="text-gold/60" size={16} />
              <select
                value={filterPackage}
                onChange={(e) => setFilterPackage(e.target.value)}
                className="bg-dark/60 border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-gold focus:outline-none min-w-[150px]"
              >
                <option value="All">All Packages</option>
                <option value="Reel Edit">Reel Edit</option>
                <option value="YouTube Edit">YouTube Edit</option>
                <option value="Creator Pack">Creator Pack</option>
                <option value="Custom Project">Custom Project</option>
              </select>
            </div>
          </div>

          <div className="bg-surface/20 rounded-lg border border-white/5 overflow-hidden backdrop-blur-sm max-h-[500px] overflow-y-auto">
            {isLoading ? (
              <div className="p-12 text-center text-gold">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold mx-auto mb-3" />
                <span className="text-xs font-mono tracking-widest uppercase">Fetching client logs...</span>
              </div>
            ) : filteredInquiries.length === 0 ? (
              <div className="p-12 text-center text-white/30 font-light">
                No inquiries matched your search filter.
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {filteredInquiries.map((inquiry) => (
                  <div
                    key={inquiry.id}
                    onClick={() => setSelectedInquiry(inquiry)}
                    className={`p-5 cursor-pointer transition-all flex items-start justify-between ${
                      selectedInquiry?.id === inquiry.id
                        ? 'bg-white/[0.04] border-l-2 border-gold'
                        : 'hover:bg-white/[0.01]'
                    }`}
                  >
                    <div className="space-y-1 pr-4 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-[0.95rem] truncate">{inquiry.name}</span>
                        <span className="px-2 py-0.5 rounded bg-gold/10 text-gold text-[0.65rem] font-mono border border-gold/15">
                          {inquiry.package}
                        </span>
                      </div>
                      <div className="text-xs text-white/50 truncate flex items-center gap-1 font-light">
                        <Mail size={12} className="text-gold/40" /> {inquiry.email}
                      </div>
                      <p className="text-xs text-white/40 truncate max-w-[450px] font-light mt-2 italic">
                        "{inquiry.message}"
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-[0.7rem] text-white/35 font-mono flex items-center gap-1">
                        <Clock size={10} />
                        {new Date(inquiry.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Inquiry Details Card */}
        <div className="lg:col-span-1">
          {selectedInquiry ? (
            <div className="bg-surface/20 rounded-lg border border-gold/20 p-6 backdrop-blur-sm space-y-6 relative overflow-hidden">
              {/* Corner mark styling */}
              <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-gold/30 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-gold/30 pointer-events-none" />

              <div className="border-b border-white/5 pb-4">
                <p className="text-[0.65rem] tracking-[0.25em] uppercase text-gold font-mono mb-1">Inquiry Details</p>
                <h3 className="text-lg font-bold text-white font-serif">{selectedInquiry.name}</h3>
                <a
                  href={`mailto:${selectedInquiry.email}`}
                  className="text-xs text-gold hover:underline flex items-center gap-1 mt-1 font-light"
                >
                  <Mail size={12} /> {selectedInquiry.email}
                </a>
              </div>

              <div className="space-y-4">
                <div className="bg-dark/40 p-4 rounded border border-white/5">
                  <span className="text-[0.65rem] tracking-wider uppercase text-white/30 font-mono block mb-1">Selected Service Type</span>
                  <span className="font-bold text-white text-sm">{selectedInquiry.package}</span>
                </div>

                <div className="space-y-2">
                  <span className="text-[0.65rem] tracking-wider uppercase text-white/30 font-mono block">Client Brief & Message</span>
                  <div className="bg-dark/20 p-4 rounded border border-white/5 text-xs text-white/70 leading-relaxed font-light whitespace-pre-wrap min-h-[120px] max-h-[220px] overflow-y-auto">
                    {selectedInquiry.message}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 flex gap-2">
                <a
                  href={`mailto:${selectedInquiry.email}?subject=Re: Inquiring about ${selectedInquiry.package} - ${studioName}&body=Hi ${selectedInquiry.name},%0D%0A%0D%0AThank you for reaching out about our ${selectedInquiry.package} service!`}
                  className="flex-1 bg-gold hover:bg-gold-light text-dark font-bold text-xs py-2.5 rounded flex items-center justify-center gap-2 transition-all shadow-glow font-mono uppercase tracking-wider"
                >
                  <MessageSquare size={14} /> Send Reply
                </a>
              </div>
            </div>
          ) : (
            <div className="bg-surface/20 rounded-lg border border-white/5 p-8 text-center text-white/30 font-light">
              Select an inquiry to view details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
