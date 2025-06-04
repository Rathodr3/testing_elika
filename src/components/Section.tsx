
import React from 'react';
import { cn } from '@/lib/utils';
import Layout from './Layout';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  background?: 'white' | 'gray' | 'primary' | 'gradient';
  spacing?: 'sm' | 'md' | 'lg' | 'xl';
  id?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

const Section = ({ 
  children, 
  className, 
  background = 'white',
  spacing = 'lg',
  id,
  maxWidth = 'xl'
}: SectionProps) => {
  const backgroundClasses = {
    white: 'bg-white',
    gray: 'bg-gray-50 dark:bg-gray-900',
    primary: 'bg-primary text-white',
    gradient: 'bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800'
  };

  const spacingClasses = {
    sm: 'py-12 lg:py-16',
    md: 'py-16 lg:py-20', 
    lg: 'py-20 lg:py-32',
    xl: 'py-24 lg:py-40'
  };

  return (
    <section 
      id={id}
      className={cn(
        backgroundClasses[background],
        spacingClasses[spacing],
        className
      )}
    >
      <Layout maxWidth={maxWidth}>
        {children}
      </Layout>
    </section>
  );
};

export default Section;
