import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { useProjectStore, Project } from '@/store/projectStore';
import { saveFile, getFile } from '@/utils/indexedDB';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Edit, Plus, X, Globe, EyeOff, Upload, Link as LinkIcon, Film } from 'lucide-react';
import axios from 'axios';

// Helper to resize and compress local images to keep LocalStorage slim
const resizeAndCompressImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800; // standard width for previews
        let width = img.width;
        let height = img.height;

        if (width > MAX_WIDTH) {
          height = Math.round((height * MAX_WIDTH) / width);
          width = MAX_WIDTH;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        // Compress as jpeg with 0.7 quality to keep size under 50KB
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
        resolve(dataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

export const PortfolioManager = () => {
  const { projects, addProject, updateProject, deleteProject } = useProjectStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Commercial');
  const [img, setImg] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [status, setStatus] = useState<'Published' | 'Draft'>('Published');
  const [description, setDescription] = useState('');

  // Image Upload Type: 'file' | 'url'
  const [imageSource, setImageSource] = useState<'file' | 'url'>('file');
  const [isUploadingImg, setIsUploadingImg] = useState(false);

  // Video Upload Type: 'file' | 'url'
  const [videoSource, setVideoSource] = useState<'file' | 'url'>('file');
  const [localVideoFile, setLocalVideoFile] = useState<File | null>(null);
  const [localVideoName, setLocalVideoName] = useState('');
  const [videoPreviewUrl, setVideoPreviewUrl] = useState('');
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const closeModal = () => {
    if (videoPreviewUrl) {
      URL.revokeObjectURL(videoPreviewUrl);
      setVideoPreviewUrl('');
    }
    setIsModalOpen(false);
  };

  useEffect(() => {
    return () => {
      if (videoPreviewUrl) {
        URL.revokeObjectURL(videoPreviewUrl);
      }
    };
  }, [videoPreviewUrl]);

  const openAddModal = () => {
    setEditingProject(null);
    setTitle('');
    setCategory('Commercial');
    setImg('');
    setVideoUrl('');
    setStatus('Published');
    setDescription('');
    setImageSource('file');
    setVideoSource('file');
    setLocalVideoFile(null);
    setLocalVideoName('');
    if (videoPreviewUrl) {
      URL.revokeObjectURL(videoPreviewUrl);
    }
    setVideoPreviewUrl('');
    setIsModalOpen(true);
  };

  const openEditModal = async (project: Project) => {
    setEditingProject(project);
    setTitle(project.title);
    setCategory(project.category);
    setImg(project.img);
    setVideoUrl(project.videoUrl || '');
    setStatus(project.status);
    setDescription(project.description || '');
    setImageSource(project.img.startsWith('data:') ? 'file' : 'url');
    setVideoSource(project.isLocalVideo ? 'file' : 'url');
    setLocalVideoFile(null);
    setLocalVideoName(project.isLocalVideo ? 'Stored Local Video' : '');
    
    if (videoPreviewUrl) {
      URL.revokeObjectURL(videoPreviewUrl);
      setVideoPreviewUrl('');
    }

    if (project.isLocalVideo) {
      try {
        const file = await getFile(project.id);
        if (file) {
          const url = URL.createObjectURL(file);
          setVideoPreviewUrl(url);
        }
      } catch (err) {
        console.error("Error loading video edit preview:", err);
      }
    }
    setIsModalOpen(true);
  };

  const uploadFileToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await axios.post('/api/v1/projects/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data.url;
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingImg(true);
      const url = await uploadFileToCloudinary(file);
      setImg(url);
    } catch (err: any) {
      console.error("Error uploading image:", err);
      alert(err.response?.data?.error || "Failed to upload image. Please check your Cloudinary configuration.");
    } finally {
      setIsUploadingImg(false);
    }
  };

  const handleVideoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingVideo(true);
      setLocalVideoName(file.name);
      
      const url = await uploadFileToCloudinary(file);
      setVideoUrl(url);
      
      if (videoPreviewUrl) {
        URL.revokeObjectURL(videoPreviewUrl);
      }
      const previewUrl = URL.createObjectURL(file);
      setVideoPreviewUrl(previewUrl);
    } catch (err: any) {
      console.error("Error uploading video:", err);
      alert(err.response?.data?.error || "Failed to upload video. Please check your Cloudinary configuration.");
      setLocalVideoName('');
    } finally {
      setIsUploadingVideo(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (imageSource === 'file' && !img) {
      alert("Please select a thumbnail image file to upload.");
      return;
    }

    if (videoSource === 'file' && !videoUrl) {
      alert("Please select a video file to upload.");
      return;
    }

    const isLocalVideo = videoSource === 'file' && !videoUrl.startsWith('http');

    const projectData = {
      title,
      category,
      img: img || 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=600',
      videoUrl,
      status,
      description,
      isLocalVideo
    };

    let projectId = '';

    if (editingProject) {
      projectId = editingProject.id;
      await updateProject(projectId, projectData);
    } else {
      projectId = await addProject(projectData);
    }

    closeModal();
  };

  const handleToggleStatus = (project: Project) => {
    updateProject(project.id, {
      status: project.status === 'Published' ? 'Draft' : 'Published'
    });
  };

  return (
    <div className="space-y-6 text-cream">
      {/* Top action bar */}
      <div className="flex justify-between items-center bg-surface/30 p-6 rounded-lg border border-white/5 backdrop-blur-sm">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Manage Projects</h2>
          <p className="text-sm text-white/40 font-light">Add, edit, or toggle status of your portfolio projects.</p>
        </div>
        <Button onClick={openAddModal} className="flex items-center gap-2 shadow-glow">
          <Plus size={16} /> Add Project
        </Button>
      </div>
      
      {/* Table Container */}
      <div className="bg-surface/20 rounded-lg border border-white/5 overflow-hidden backdrop-blur-sm shadow-xl">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/5 text-white/50 border-b border-white/5 font-mono text-[0.7rem] uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 font-semibold">Thumbnail & Project</th>
              <th className="px-6 py-4 font-semibold">Category</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">Views</th>
              <th className="px-6 py-4 font-semibold">Media Type</th>
              <th className="px-6 py-4 font-semibold">Date Added</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {projects.map((project) => (
              <tr key={project.id} className="hover:bg-white/[0.02] transition-colors duration-200">
                <td className="px-6 py-4 font-medium flex items-center gap-4">
                  <img 
                    src={project.img} 
                    alt={project.title} 
                    className="w-16 h-10 object-cover rounded border border-white/10 bg-black/40" 
                  />
                  <div>
                    <div className="text-white font-bold text-[0.95rem]">{project.title}</div>
                    <div className="text-white/40 text-xs font-light max-w-[200px] truncate">{project.description || 'No description provided.'}</div>
                  </div>
                </td>
                <td className="px-6 py-4 text-white/60 font-light">{project.category}</td>
                <td className="px-6 py-4">
                  <button 
                    onClick={() => handleToggleStatus(project)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 flex items-center gap-1.5 ${
                      project.status === 'Published' 
                        ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                        : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                    }`}
                  >
                    {project.status === 'Published' ? (
                      <>
                        <Globe size={12} /> Published
                      </>
                    ) : (
                      <>
                        <EyeOff size={12} /> Draft
                      </>
                    )}
                  </button>
                </td>
                <td className="px-6 py-4 font-mono text-xs text-gold/80 font-semibold">{project.views || 0}</td>
                <td className="px-6 py-4">
                  <span className="text-white/50 text-xs flex items-center gap-1">
                    {project.isLocalVideo ? (
                      <>
                        <Upload size={12} className="text-gold" /> Local Video File
                      </>
                    ) : (
                      <>
                        <LinkIcon size={12} className="text-gold" /> Remote Embed Link
                      </>
                    )}
                  </span>
                </td>
                <td className="px-6 py-4 text-white/40 font-mono text-xs">{project.date}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => openEditModal(project)}
                      className="p-2 text-white/50 hover:text-white bg-white/5 hover:bg-white/10 rounded transition-colors"
                      title="Edit Project"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => deleteProject(project.id)}
                      className="p-2 text-white/50 hover:text-red-400 bg-white/5 hover:bg-red-500/10 rounded transition-colors"
                      title="Delete Project"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Editor Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-charcoal border border-gold/25 w-full max-w-[550px] rounded-lg max-h-[90vh] overflow-y-auto shadow-2xl p-8 relative"
            >
              <button 
                onClick={closeModal}
                className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>

              <h3 className="font-serif text-2xl font-bold mb-6 text-white border-b border-white/5 pb-3">
                {editingProject ? 'Edit Project' : 'Add New Project'}
              </h3>

              <form onSubmit={handleSave} className="space-y-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[0.65rem] tracking-wider uppercase text-gold font-mono">Project Title</label>
                  <input 
                    type="text" 
                    required 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="bg-dark border border-white/10 rounded px-4 py-2.5 text-sm focus:border-gold focus:outline-none text-white placeholder-white/20"
                    placeholder="e.g. Neon Nights Music Video"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[0.65rem] tracking-wider uppercase text-gold font-mono">Category</label>
                    <select 
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="bg-dark border border-white/10 rounded px-4 py-2.5 text-sm focus:border-gold focus:outline-none text-white"
                    >
                      <option value="Commercial">Commercial</option>
                      <option value="Music Video">Music Video</option>
                      <option value="Automotive">Automotive</option>
                      <option value="Documentary">Documentary</option>
                      <option value="Short Film">Short Film</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[0.65rem] tracking-wider uppercase text-gold font-mono">Status</label>
                    <select 
                      value={status}
                      onChange={(e) => setStatus(e.target.value as 'Published' | 'Draft')}
                      className="bg-dark border border-white/10 rounded px-4 py-2.5 text-sm focus:border-gold focus:outline-none text-white"
                    >
                      <option value="Published">Published</option>
                      <option value="Draft">Draft</option>
                    </select>
                  </div>
                </div>

                {/* Thumbnail Source Selection */}
                <div className="flex flex-col gap-2">
                  <label className="text-[0.65rem] tracking-wider uppercase text-gold font-mono">Thumbnail Image Source</label>
                  <div className="flex gap-2 bg-dark p-1 rounded border border-white/5">
                    <button
                      type="button"
                      onClick={() => setImageSource('file')}
                      className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-xs rounded transition-all ${
                        imageSource === 'file' ? 'bg-gold text-dark font-bold' : 'text-white/60 hover:text-white'
                      }`}
                    >
                      <Upload size={14} /> Upload File
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageSource('url')}
                      className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-xs rounded transition-all ${
                        imageSource === 'url' ? 'bg-gold text-dark font-bold' : 'text-white/60 hover:text-white'
                      }`}
                    >
                      <LinkIcon size={14} /> Image URL Link
                    </button>
                  </div>

                  {imageSource === 'file' ? (
                    <>
                      <input 
                        type="file" 
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleImageFileChange}
                        onClick={(e) => e.stopPropagation()}
                        className="hidden"
                      />
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="group relative flex flex-col items-center justify-center border border-dashed border-gold/30 hover:border-gold/60 bg-dark/40 hover:bg-dark/70 rounded-lg p-6 cursor-pointer transition-all duration-300 min-h-[120px]"
                      >
                        {isUploadingImg ? (
                          <div className="flex flex-col items-center gap-2 text-gold">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gold" />
                            <span className="text-[0.65rem] tracking-wider uppercase font-mono">Uploading to Cloud...</span>
                          </div>
                        ) : img ? (
                          <div className="absolute inset-0 w-full h-full rounded-lg overflow-hidden">
                            <img src={img} alt="Thumbnail Preview" className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-300" />
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 group-hover:bg-black/60 transition-colors">
                              <Upload size={20} className="text-gold mb-1 transform group-hover:-translate-y-1 transition-transform" />
                              <span className="text-[0.7rem] text-gold tracking-wider font-mono font-bold uppercase">Change Image File</span>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-2 text-white/50 group-hover:text-white/80 transition-colors">
                            <Upload size={24} className="text-gold/60 group-hover:text-gold" />
                            <span className="text-xs font-semibold">Upload Local Image</span>
                            <span className="text-[0.6rem] text-white/30 font-mono">PNG, JPG (Auto-optimized)</span>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <input 
                      type="url" 
                      value={img.startsWith('data:') ? '' : img}
                      onChange={(e) => setImg(e.target.value)}
                      className="bg-dark border border-white/10 rounded px-4 py-2.5 text-sm focus:border-gold focus:outline-none text-white placeholder-white/20"
                      placeholder="https://images.unsplash.com/..."
                    />
                  )}
                </div>

                {/* Video Source Selection */}
                <div className="flex flex-col gap-2">
                  <label className="text-[0.65rem] tracking-wider uppercase text-gold font-mono">Video File / Stream</label>
                  <div className="flex gap-2 bg-dark p-1 rounded border border-white/5">
                    <button
                      type="button"
                      onClick={() => setVideoSource('file')}
                      className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-xs rounded transition-all ${
                        videoSource === 'file' ? 'bg-gold text-dark font-bold' : 'text-white/60 hover:text-white'
                      }`}
                    >
                      <Film size={14} /> Upload Video File
                    </button>
                    <button
                      type="button"
                      onClick={() => setVideoSource('url')}
                      className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-xs rounded transition-all ${
                        videoSource === 'url' ? 'bg-gold text-dark font-bold' : 'text-white/60 hover:text-white'
                      }`}
                    >
                      <LinkIcon size={14} /> Video Link (Embed)
                    </button>
                  </div>

                  {videoSource === 'file' ? (
                    <>
                      <input 
                        type="file" 
                        ref={videoInputRef}
                        accept="video/*"
                        onChange={handleVideoFileChange}
                        onClick={(e) => e.stopPropagation()}
                        className="hidden"
                      />
                      <div 
                        onClick={() => videoInputRef.current?.click()}
                        className="group relative flex flex-col items-center justify-center border border-dashed border-gold/30 hover:border-gold/60 bg-dark/40 hover:bg-dark/70 rounded-lg p-6 cursor-pointer transition-all duration-300 min-h-[140px]"
                      >
                        {isUploadingVideo ? (
                          <div className="flex flex-col items-center gap-2 text-gold">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gold" />
                            <span className="text-[0.65rem] tracking-wider uppercase font-mono">Uploading Video (this may take a moment)...</span>
                          </div>
                        ) : videoPreviewUrl ? (
                          <div className="absolute inset-0 w-full h-full rounded-lg overflow-hidden flex flex-col">
                            <video 
                              src={videoPreviewUrl} 
                              muted 
                              loop 
                              autoPlay 
                              className="w-full h-full object-cover opacity-50 group-hover:opacity-30 transition-opacity" 
                            />
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 group-hover:bg-black/60 transition-colors">
                              <Film size={20} className="text-gold mb-1 transform group-hover:-translate-y-1 transition-transform" />
                              <span className="text-[0.7rem] text-gold tracking-wider font-mono font-bold uppercase">Change Video File</span>
                              {localVideoName && (
                                <span className="text-[0.6rem] text-white/50 max-w-[80%] truncate mt-1 font-mono">{localVideoName}</span>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-2 text-white/50 group-hover:text-white/80 transition-colors">
                            <Film size={24} className="text-gold/60 group-hover:text-gold" />
                            <span className="text-xs font-semibold">Upload Local Video</span>
                            <span className="text-[0.6rem] text-white/30 font-mono">MP4, MOV, WebM (Stored in browser)</span>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <input 
                      type="url"
                      value={videoUrl.startsWith('local://') || videoUrl === localVideoName ? '' : videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      className="bg-dark border border-white/10 rounded px-4 py-2.5 text-sm focus:border-gold focus:outline-none text-white placeholder-white/20"
                      placeholder="https://www.youtube.com/embed/..."
                    />
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[0.65rem] tracking-wider uppercase text-gold font-mono">Description</label>
                  <textarea 
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="bg-dark border border-white/10 rounded px-4 py-2.5 text-sm focus:border-gold focus:outline-none text-white placeholder-white/20 resize-none"
                    placeholder="Provide details about editing timeline structure, foley cleanup, LUT profiles..."
                  />
                </div>

                <div className="flex justify-end gap-3 border-t border-white/5 pt-4 mt-6">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={closeModal}
                    className="hover:bg-white/5"
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    Save Project
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
