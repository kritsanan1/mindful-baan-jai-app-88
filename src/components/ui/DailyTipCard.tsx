
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

export const DailyTipCard: React.FC = () => {
  const { t, language } = useLanguage();
  const [currentTip, setCurrentTip] = useState(0);

  const tips = [
    'tips.breathing',
    'tips.gratitude',
    'tips.nature',
    'tips.meditation'
  ];

  useEffect(() => {
    const today = new Date().getDate();
    setCurrentTip(today % tips.length);
  }, []);

  return (
    <Card className="p-4 bg-white/80 backdrop-blur-sm border border-white/50 shadow-md animate-fade-in">
      <div className="flex items-start space-x-3">
        <div className="text-2xl">💡</div>
        <div>
          <h4 className={`font-medium text-sm text-gray-600 mb-1 ${language === 'th' ? 'thai-text' : ''}`}>
            {t('home.daily_tip')}
          </h4>
          <p className={`text-sm text-gray-800 ${language === 'th' ? 'thai-text' : ''}`}>
            {t(tips[currentTip])}
          </p>
        </div>
      </div>
    </Card>
  );
};
