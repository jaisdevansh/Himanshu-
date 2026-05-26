import { Request, Response, NextFunction } from 'express';

// Stub for express-rate-limit implementation
export const rateLimiter = (req: Request, res: Response, next: NextFunction) => {
  // In a real implementation:
  // const limiter = rateLimit({
  //   windowMs: 15 * 60 * 1000, // 15 minutes
  //   max: 100, // Limit each IP to 100 requests per windowMs
  //   message: 'Too many requests from this IP, please try again later.'
  // });
  // return limiter(req, res, next);
  
  next();
};

export const aiRateLimiter = (req: Request, res: Response, next: NextFunction) => {
  // Stricter rate limit for AI generation (e.g. 5 requests per minute)
  next();
};
