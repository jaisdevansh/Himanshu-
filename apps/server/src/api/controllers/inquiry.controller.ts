import { Request, Response } from 'express';
import { prisma } from '../../utils/prisma';

export const getInquiries = async (req: Request, res: Response) => {
  try {
    const inquiries = await prisma.inquiry.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    res.status(200).json(inquiries);
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    res.status(500).json({ error: 'Failed to fetch inquiries' });
  }
};

export const createInquiry = async (req: Request, res: Response) => {
  try {
    const { name, email, package: packageName, message } = req.body;

    if (!name || !email || !packageName || !message) {
      return res.status(400).json({ error: 'All fields (name, email, package, message) are required' });
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        name,
        email,
        package: packageName,
        message,
      },
    });

    res.status(201).json(inquiry);
  } catch (error) {
    console.error('Error creating inquiry:', error);
    res.status(500).json({ error: 'Failed to submit inquiry' });
  }
};
