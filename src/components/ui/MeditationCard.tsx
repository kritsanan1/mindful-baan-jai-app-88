
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

interface MeditationCardProps {
  meditationStreak: number;
  onStartMeditation: () => void;
}

export const MeditationCard: React.FC<MeditationCardProps> = ({
  meditationStreak,
  onStartMeditation
}) => {
  const { t, language } = useLanguage();

  return (
    <Card className="p-6 meditation-gradient text-white border-0 shadow-lg animate-scale-in">
      <div className="flex items-center justify-between">
        <div>
          <h3 className={`font-semibold text-lg mb-2 ${language === 'th' ? 'thai-text' : ''}`}>
            {t('meditation.title')}
          </h3>
          <div className="flex items-center space-x-2">
            <span className={`text-sm opacity-90 ${language === 'th' ? 'thai-text' : ''}`}>
              {t('home.meditation_streak')}:
            </span>
            <span className="font-bold text-xl">{meditationStreak}</span>
            <span className={`text-sm opacity-90 ${language === 'th' ? 'thai-text' : ''}`}>
              {t('home.days')}
            </span>
          </div>
        </div>
        <Button
          onClick={onStartMeditation}
          className="bg-white text-dark-green hover:bg-gray-100 rounded-full px-6 transition-all duration-200 hover:scale-105"
        >
          <span className={language === 'th' ? 'thai-text' : ''}>
            {t('home.start_meditation')}
          </span>
        </Button>
      </div>
      
      {/* Progress indicator */}
      <div className="mt-4">
        <div className="w-full bg-white/20 rounded-full h-2">
          <div 
            className="bg-white rounded-full h-2 transition-all duration-500"
            style={{ width: `${Math.min((meditationStreak / 30) * 100, 100)}%` }}
          />
        </div>
        <p className={`text-xs opacity-75 mt-1 ${language === 'th' ? 'thai-text' : ''}`}>
          {meditationStreak}/30 days to unlock premium content
        </p>
      </div>
    </Card>
  );
};
