
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowRight, LucideIcon } from 'lucide-react';

interface EnhancedCardProps {
  title: string;
  description: string;
  image?: string;
  icon?: LucideIcon;
  features?: string[];
  buttonText?: string;
  buttonVariant?: 'default' | 'outline' | 'ghost';
  onButtonClick?: () => void;
  className?: string;
  hover?: boolean;
  gradient?: boolean;
}

const EnhancedCard = ({
  title,
  description,
  image,
  icon: Icon,
  features,
  buttonText,
  buttonVariant = 'outline',
  onButtonClick,
  className,
  hover = true,
  gradient = false
}: EnhancedCardProps) => {
  return (
    <Card 
      className={cn(
        'border-0 shadow-lg bg-white overflow-hidden transition-all duration-300 flex flex-col h-full',
        hover && 'hover:shadow-xl hover:-translate-y-1 card-hover',
        gradient && 'bg-gradient-to-br from-white to-gray-50',
        className
      )}
    >
      {/* Image or Icon Header */}
      {(image || Icon) && (
        <div className="relative overflow-hidden">
          {image ? (
            <>
              <img 
                src={image} 
                alt={title}
                className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              {Icon && (
                <Icon className="absolute top-4 right-4 w-8 h-8 text-white drop-shadow-lg" />
              )}
            </>
          ) : Icon && (
            <div className="p-6 pb-0">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Icon className="h-6 w-6 text-white" />
              </div>
            </div>
          )}
        </div>
      )}
      
      <CardContent className={cn('p-6 flex flex-col flex-grow justify-between', !image && !Icon && 'pt-6')}>
        <CardTitle className="text-xl font-bold text-secondary-800 mb-3 group-hover:text-primary transition-colors duration-300">
          {title}
        </CardTitle>
        
        <p className="text-accent leading-relaxed mb-2">
          {description}
        </p>

        {/* Action Button */}
        {buttonText && (
          <Button 
            variant={buttonVariant} 
            className="w-full group/btn"
            onClick={onButtonClick}
          >
            {buttonText}
            <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedCard;
