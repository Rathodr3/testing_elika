
import React from 'react';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  alignment?: 'left' | 'center' | 'right';
  titleSize?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const SectionHeader = ({ 
  title, 
  subtitle, 
  description, 
  alignment = 'center',
  titleSize = 'lg',
  className 
}: SectionHeaderProps) => {
  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  };

  const titleSizeClasses = {
    sm: 'text-2xl lg:text-3xl',
    md: 'text-3xl lg:text-4xl',
    lg: 'text-3xl lg:text-5xl',
    xl: 'text-4xl lg:text-6xl'
  };

  const maxWidthClasses = {
    left: '',
    center: 'max-w-4xl mx-auto',
    right: 'max-w-4xl ml-auto'
  };

  return (
    <div className={cn(
      'mb-12 lg:mb-16',
      alignmentClasses[alignment],
      maxWidthClasses[alignment],
      className
    )}>
      {subtitle && (
        <div className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
          {subtitle}
        </div>
      )}
      
      <h2 className={cn(
        'font-bold text-secondary-800 dark:text-white mb-6 leading-tight',
        titleSizeClasses[titleSize]
      )}>
        {title}
      </h2>
      
      {description && (
        <p className="text-xl text-accent dark:text-gray-300 leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
};

export default SectionHeader;
