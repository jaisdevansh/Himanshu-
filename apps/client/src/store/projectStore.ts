import { create } from 'zustand';
import axios from 'axios';
import { deleteFile } from '@/utils/indexedDB';

export interface Project {
  id: string;
  title: string;
  category: string;
  img: string;
  videoUrl?: string;
  status: 'Published' | 'Draft';
  date: string;
  description?: string;
  span?: string; // used for bento layout grid
  isLocalVideo?: boolean;
  isLocalImg?: boolean;
  views?: number;
}

interface ProjectState {
  projects: Project[];
  isLoading: boolean;
  error: string | null;
  fetchProjects: () => Promise<void>;
  addProject: (project: Omit<Project, 'id' | 'date'>) => Promise<string>; // returns the new id
  updateProject: (id: string, updatedFields: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  trackView: (id: string) => Promise<void>;
}

export const useProjectStore = create<ProjectState>()((set) => ({
  projects: [],
  isLoading: false,
  error: null,
  
  fetchProjects: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get('/api/v1/projects');
      set({ projects: response.data, isLoading: false });
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch projects', isLoading: false });
    }
  },

  addProject: async (projectData) => {
    try {
      const response = await axios.post('/api/v1/projects', projectData);
      const newProject = response.data;
      set((state) => ({
        projects: [newProject, ...state.projects]
      }));
      return newProject.id;
    } catch (err: any) {
      console.error('Failed to add project:', err);
      throw err;
    }
  },

  updateProject: async (id, updatedFields) => {
    try {
      const response = await axios.put(`/api/v1/projects/${id}`, updatedFields);
      const updatedProject = response.data;
      set((state) => ({
        projects: state.projects.map((p) => p.id === id ? updatedProject : p)
      }));
    } catch (err: any) {
      console.error('Failed to update project:', err);
      throw err;
    }
  },

  deleteProject: async (id) => {
    try {
      await axios.delete(`/api/v1/projects/${id}`);
      // Clean up from IndexedDB as well
      deleteFile(id).catch(console.error);
      set((state) => ({
        projects: state.projects.filter((p) => p.id !== id)
      }));
    } catch (err: any) {
      console.error('Failed to delete project:', err);
      throw err;
    }
  },

  trackView: async (id) => {
    try {
      await axios.post(`/api/v1/projects/${id}/view`);
      set((state) => ({
        projects: state.projects.map((p) => p.id === id ? { ...p, views: (p.views || 0) + 1 } : p)
      }));
    } catch (err: any) {
      console.error('Failed to track project view:', err);
    }
  },
}));
