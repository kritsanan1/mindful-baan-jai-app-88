
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

interface PremiumBannerProps {
  onUpgrade: () => void;
}

export const PremiumBanner: React.FC<PremiumBannerProps> = ({ onUpgrade }) => {
  const { t, language } = useLanguage();

  return (
    <Card className="p-4 bg-gradient-to-r from-warm-orange to-yellow-400 text-white border-0 shadow-lg animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">⭐</div>
          <div>
            <h4 className={`font-semibold text-sm ${language === 'th' ? 'thai-text' : ''}`}>
              {t('common.premium')}
            </h4>
            <p className={`text-xs opacity-90 ${language === 'th' ? 'thai-text' : ''}`}>
              Unlock unlimited AI chats & exclusive content
            </p>
          </div>
        </div>
        <Button
          onClick={onUpgrade}
          size="sm"
          className="bg-white text-warm-orange hover:bg-gray-100 rounded-full transition-all duration-200 hover:scale-105"
        >
          <span className={language === 'th' ? 'thai-text' : ''}>
            {t('common.upgrade')}
          </span>
        </Button>
      </div>
    </Card>
  );
};
