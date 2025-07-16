
import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Star, Crown, X } from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  titleTh: string;
  description: string;
  descriptionTh: string;
  icon: string;
  points: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface AchievementPopupProps {
  achievement: Achievement | null;
  onClose: () => void;
  onClaimReward?: () => void;
}

export const AchievementPopup: React.FC<AchievementPopupProps> = ({
  achievement,
  onClose,
  onClaimReward
}) => {
  const { language } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (achievement) {
      setIsVisible(true);
    }
  }, [achievement]);

  if (!achievement || !isVisible) return null;

  const rarityColors = {
    common: 'from-gray-400 to-gray-600',
    rare: 'from-blue-400 to-blue-600',
    epic: 'from-purple-400 to-purple-600',
    legendary: 'from-yellow-400 to-orange-500'
  };

  const rarityLabels = {
    common: language === 'th' ? 'ธรรมดา' : 'Common',
    rare: language === 'th' ? 'หายาก' : 'Rare',
    epic: language === 'th' ? 'พิเศษ' : 'Epic',
    legendary: language === 'th' ? 'ตำนาน' : 'Legendary'
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className={`max-w-sm w-full bg-white shadow-2xl transform transition-all duration-300 ${
        isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
      }`}>
        <div className="relative p-6 text-center">
          <Button
            onClick={handleClose}
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 p-1 h-8 w-8"
          >
            <X className="w-4 h-4" />
          </Button>

          {/* Achievement Icon with Glow Effect */}
          <div className="relative mb-4">
            <div className={`w-20 h-20 rounded-full bg-gradient-to-r ${rarityColors[achievement.rarity]} flex items-center justify-center mx-auto mb-2 animate-pulse`}>
              <div className="text-3xl">{achievement.icon}</div>
            </div>
            <div className="flex items-center justify-center space-x-1">
              {[...Array(achievement.rarity === 'legendary' ? 5 : achievement.rarity === 'epic' ? 4 : achievement.rarity === 'rare' ? 3 : 2)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
          </div>

          {/* Achievement Details */}
          <div className="mb-6">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Trophy className="w-5 h-5 text-dark-green" />
              <span className="text-sm font-medium text-dark-green uppercase tracking-wide">
                {language === 'th' ? 'ความสำเร็จใหม่!' : 'Achievement Unlocked!'}
              </span>
            </div>
            
            <h3 className={`text-xl font-bold text-gray-800 mb-2 ${language === 'th' ? 'thai-text' : ''}`}>
              {language === 'th' ? achievement.titleTh : achievement.title}
            </h3>
            
            <p className={`text-gray-600 mb-3 ${language === 'th' ? 'thai-text' : ''}`}>
              {language === 'th' ? achievement.descriptionTh : achievement.description}
            </p>

            <div className="flex items-center justify-center space-x-4">
              <div className="flex items-center space-x-1">
                <div className="w-6 h-6 bg-dark-green rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">+</span>
                </div>
                <span className="font-semibold text-dark-green">{achievement.points}</span>
                <span className={`text-sm text-gray-600 ${language === 'th' ? 'thai-text' : ''}`}>
                  {language === 'th' ? 'คะแนน' : 'points'}
                </span>
              </div>
              
              <div className={`px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${rarityColors[achievement.rarity]} text-white`}>
                {rarityLabels[achievement.rarity]}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            {onClaimReward && achievement.rarity === 'legendary' && (
              <Button
                onClick={onClaimReward}
                className="w-full bg-gradient-to-r from-warm-orange to-yellow-400 hover:from-orange-600 hover:to-yellow-500 text-white"
              >
                <Crown className="w-4 h-4 mr-2" />
                <span className={language === 'th' ? 'thai-text' : ''}>
                  {language === 'th' ? 'รับรางวัลพิเศษ' : 'Claim Special Reward'}
                </span>
              </Button>
            )}
            
            <Button
              onClick={handleClose}
              variant="outline"
              className="w-full"
            >
              <span className={language === 'th' ? 'thai-text' : ''}>
                {language === 'th' ? 'เยี่ยมมาก!' : 'Awesome!'}
              </span>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
