
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

interface MoodCardProps {
  moodScore?: number;
  moodText?: string;
  onCheckMood: () => void;
}

export const MoodCard: React.FC<MoodCardProps> = ({ 
  moodScore, 
  moodText, 
  onCheckMood 
}) => {
  const { t, language } = useLanguage();

  const getMoodEmoji = (score?: number) => {
    if (!score) return '😊';
    if (score >= 8) return '😄';
    if (score >= 6) return '😊';
    if (score >= 4) return '😐';
    if (score >= 2) return '😔';
    return '😢';
  };

  const getMoodColor = (score?: number) => {
    if (!score) return 'from-mint-green to-soft-blue';
    if (score >= 8) return 'from-green-200 to-green-100';
    if (score >= 6) return 'from-blue-200 to-blue-100';
    if (score >= 4) return 'from-yellow-200 to-yellow-100';
    if (score >= 2) return 'from-orange-200 to-orange-100';
    return 'from-red-200 to-red-100';
  };

  return (
    <Card className={`p-6 bg-gradient-to-br ${getMoodColor(moodScore)} border-0 shadow-lg animate-scale-in`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="text-4xl animate-pulse-gentle">
            {getMoodEmoji(moodScore)}
          </div>
          <div>
            <h3 className={`font-semibold text-lg ${language === 'th' ? 'thai-text' : ''}`}>
              {t('home.mood_check')}
            </h3>
            {moodText && (
              <p className={`text-sm text-gray-600 mt-1 ${language === 'th' ? 'thai-text' : ''}`}>
                {moodText}
              </p>
            )}
          </div>
        </div>
        <Button
          onClick={onCheckMood}
          className="bg-dark-green hover:bg-green-700 text-white rounded-full px-6 transition-all duration-200 hover:scale-105"
        >
          <span className={language === 'th' ? 'thai-text' : ''}>
            {t('home.check_mood')}
          </span>
        </Button>
      </div>
    </Card>
  );
};
