import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { AppLogo } from './optimized-image';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  showLogo?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({ 
  size = 'md', 
  text,
  showLogo = true 
}) => {
  const { language } = useLanguage();
  
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-24 h-24'
  };

  const defaultText = text || (language === 'th' ? 'กำลังโหลด...' : 'Loading...');

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      {showLogo && (
        <div className={`${sizes[size]} bg-mint-green rounded-full flex items-center justify-center animate-pulse-gentle`}>
          <AppLogo
            size={size === 'lg' ? 'lg' : size === 'md' ? 'md' : 'sm'}
          />
        </div>
      )}
      <p className={`text-gray-600 ${language === 'th' ? 'thai-text' : ''}`}>
        {defaultText}
      </p>
    </div>
  );
};

export const FullScreenLoading: React.FC<{ text?: string }> = ({ text }) => (
  <div className="min-h-screen app-gradient flex items-center justify-center">
    <Loading size="lg" text={text} />
  </div>
);

export const InlineLoading: React.FC<{ text?: string }> = ({ text }) => (
  <div className="flex items-center justify-center py-8">
    <Loading size="sm" text={text} showLogo={false} />
  </div>
);
