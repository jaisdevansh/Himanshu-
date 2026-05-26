import React from 'react';
import { cn } from '@/lib/utils';

interface OptimizedMediaProps {
  publicId: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

export const OptimizedMedia = ({ publicId, alt, className, width, height }: OptimizedMediaProps) => {
  // Construct Cloudinary URL with optimization parameters (f_auto, q_auto)
  // In a real app, this would use the next-cloudinary or cloudinary-react library
  const cloudName = process.env.VITE_CLOUDINARY_CLOUD_NAME || 'demo';
  const url = `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto/${publicId}`;

  return (
    <img 
      src={url} 
      alt={alt} 
      className={cn('object-cover', className)} 
      loading="lazy"
      width={width}
      height={height}
    />
  );
};
