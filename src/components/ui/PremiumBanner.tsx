
import React from 'react';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { PremiumUpgrade } from '@/components/premium/PremiumUpgrade';

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
        <PremiumUpgrade showAsModal={true} />
      </div>
    </Card>
  );
};
