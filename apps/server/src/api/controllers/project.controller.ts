import { Request, Response } from 'express';
import { prisma } from '../../utils/prisma';
import { uploadToCloudinary } from '../../utils/cloudinary'; // Helper for Cloudinary file uploads

export const getProjects = async (req: Request, res: Response) => {
  try {
    let projects = await prisma.project.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Seed default projects if the database table is empty
    if (projects.length === 0) {
      const defaultProjects = [
        { title: "Brand Anthem", category: "Commercial", img: "https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&q=80&w=1200", status: 'Published', date: 'Oct 24, 2026', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
        { title: "Neon Nights", category: "Music Video", img: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=600", status: 'Published', date: 'Oct 20, 2026', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
        { title: "Desert Drift", category: "Automotive", img: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=600", status: 'Published', date: 'Oct 18, 2026', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
        { title: "Urban Pulse", category: "Documentary", img: "https://images.unsplash.com/photo-1511882150382-421056c89033?auto=format&fit=crop&q=80&w=600", status: 'Published', date: 'Oct 15, 2026', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
        { title: "Echoes", category: "Short Film", img: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=1200", status: 'Published', date: 'Oct 10, 2026', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
        { title: "Velvet Sun", category: "Music Video", img: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&q=80&w=600", status: 'Published', date: 'Oct 05, 2026', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }
      ];

      await prisma.project.createMany({
        data: defaultProjects
      });

      projects = await prisma.project.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      });
    }

    res.status(200).json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
};

export const createProject = async (req: Request, res: Response) => {
  try {
    const { title, category, img, videoUrl, status, description, isLocalVideo, isLocalImg, date } = req.body;
    
    if (!title || !category) {
      return res.status(400).json({ error: 'Title and category are required' });
    }

    const project = await prisma.project.create({
      data: {
        title,
        category,
        img,
        videoUrl,
        status: status || 'Published',
        description,
        isLocalVideo: !!isLocalVideo,
        isLocalImg: !!isLocalImg,
        date: date || new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      },
    });

    res.status(201).json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
};

export const updateProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, category, img, videoUrl, status, description, isLocalVideo, isLocalImg, date } = req.body;

    const project = await prisma.project.update({
      where: { id },
      data: {
        title,
        category,
        img,
        videoUrl,
        status,
        description,
        isLocalVideo,
        isLocalImg,
        date,
      },
    });

    res.status(200).json(project);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.project.delete({
      where: { id },
    });

    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
};

export const uploadMedia = async (req: Request, res: Response) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const url = await uploadToCloudinary(file.buffer, file.mimetype);
    res.status(200).json({ url });
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    res.status(500).json({ error: 'Failed to upload media to the cloud' });
  }
};

export const trackProjectView = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const project = await prisma.project.update({
      where: { id },
      data: {
        views: {
          increment: 1,
        },
      },
    });

    res.status(200).json({ views: project.views });
  } catch (error) {
    console.error('Error tracking project view:', error);
    res.status(500).json({ error: 'Failed to increment views' });
  }
};
