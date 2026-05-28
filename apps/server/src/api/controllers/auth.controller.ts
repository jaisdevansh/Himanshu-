import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../utils/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const admin = await prisma.admin.findUnique({
      where: { email }
    });

    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: admin.id, email: admin.email }, JWT_SECRET, {
      expiresIn: '7d' // Token expires in 7 days
    });

    res.json({
      token,
      admin: {
        id: admin.id,
        email: admin.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
};

export const initAdmin = async (req: Request, res: Response) => {
  try {
    const adminCount = await prisma.admin.count();
    
    if (adminCount > 0) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    const hashedPassword = await bcrypt.hash('password123', 10);
    const newAdmin = await prisma.admin.create({
      data: {
        email: 'admin@example.com',
        password: hashedPassword
      }
    });

    res.status(201).json({ message: 'Default admin created', email: newAdmin.email });
  } catch (error) {
    console.error('Init admin error:', error);
    res.status(500).json({ error: 'Server error during init' });
  }
};
