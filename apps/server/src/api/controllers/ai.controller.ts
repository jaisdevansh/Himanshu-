import { Request, Response } from 'express';
import { AIService } from '../../services/ai.service';

export const generateContent = async (req: Request, res: Response) => {
  try {
    const { type, context, title, description } = req.body;
    
    let result;
    
    switch (type) {
      case 'TITLE':
        result = await AIService.generateTitle(context);
        break;
      case 'DESCRIPTION':
        result = await AIService.generateDescription(context);
        break;
      case 'SEO':
        result = await AIService.generateSEO(title, description);
        break;
      default:
        return res.status(400).json({ error: 'Invalid generation type' });
    }
    
    // In a real app, we would log this to Prisma AIHistory here
    // await prisma.aIHistory.create({ data: { prompt: context, response: JSON.stringify(result), tool: type, userId: req.user.id } });

    res.status(200).json({ data: result });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate AI content' });
  }
};
