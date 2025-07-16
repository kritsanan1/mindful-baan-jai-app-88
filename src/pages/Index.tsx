
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { MoodCard } from '@/components/ui/MoodCard';
import { MeditationCard } from '@/components/ui/MeditationCard';
import { DailyTipCard } from '@/components/ui/DailyTipCard';
import { PremiumBanner } from '@/components/ui/PremiumBanner';
import { Button } from '@/components/ui/button';

const Index = () => {
  const navigate = useNavigate();
  const { t, language, setLanguage } = useLanguage();
  const [meditationStreak] = useState(7);
  const [userName] = useState('สมชาย'); // Example user name in Thai

  const handleMoodCheck = () => {
    navigate('/chat');
  };

  const handleStartMeditation = () => {
    navigate('/content');
  };

  const handleUpgrade = () => {
    console.log('Navigate to premium upgrade');
  };

  return (
    <div className="min-h-screen app-gradient">
      {/* Header */}
      <header className="pt-12 pb-6 px-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className={`text-2xl font-bold text-gray-800 ${language === 'th' ? 'thai-text' : ''}`}>
              {t('home.greeting')}, {userName} 👋
            </h1>
            <p className={`text-gray-600 mt-1 ${language === 'th' ? 'thai-text' : ''}`}>
              {new Date().toLocaleDateString(language === 'th' ? 'th-TH' : 'en-US', {
                weekday: 'long',
                day: 'numeric',
                month: 'long'
              })}
            </p>
          </div>
          
          {/* Language Toggle */}
          <div className="flex bg-white rounded-full p-1 shadow-md">
            <button
              onClick={() => setLanguage('th')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                language === 'th' 
                  ? 'bg-dark-green text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              ไทย
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                language === 'en' 
                  ? 'bg-dark-green text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              EN
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 space-y-6">
        {/* Mood Check Card */}
        <MoodCard
          moodScore={7}
          moodText="You seem to be doing well today!"
          onCheckMood={handleMoodCheck}
        />

        {/* Meditation Card */}
        <MeditationCard
          meditationStreak={meditationStreak}
          onStartMeditation={handleStartMeditation}
        />

        {/* Daily Tip */}
        <DailyTipCard />

        {/* Premium Banner */}
        <PremiumBanner onUpgrade={handleUpgrade} />

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <Button
            onClick={() => navigate('/content')}
            className="h-20 bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 rounded-2xl flex flex-col items-center justify-center space-y-2 transition-all duration-200 hover:scale-105 shadow-md"
          >
            <span className="text-2xl">🧘‍♀️</span>
            <span className={`text-sm font-medium ${language === 'th' ? 'thai-text' : ''}`}>
              {t('meditation.mindfulness')}
            </span>
          </Button>
          
          <Button
            onClick={() => navigate('/therapist')}
            className="h-20 bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 rounded-2xl flex flex-col items-center justify-center space-y-2 transition-all duration-200 hover:scale-105 shadow-md"
          >
            <span className="text-2xl">👨‍⚕️</span>
            <span className={`text-sm font-medium ${language === 'th' ? 'thai-text' : ''}`}>
              {t('nav.therapist')}
            </span>
          </Button>
        </div>

        {/* App Logo/Branding */}
        <div className="text-center py-8">
          <div className="inline-flex items-center space-x-2 opacity-75">
            <img 
              src="/lovable-uploads/b0906d9f-4936-4c2d-81db-6cffd5004f5d.png" 
              alt="Baan Jai Logo" 
              className="w-8 h-8"
            />
            <span className={`text-lg font-semibold text-gray-600 ${language === 'th' ? 'thai-text' : ''}`}>
              บ้านใจ • Baan Jai
            </span>
          </div>
          <p className={`text-xs text-gray-500 mt-2 ${language === 'th' ? 'thai-text' : ''}`}>
            {language === 'th' ? 'ดูแลจิตใจ ด้วยใจ' : 'Caring for your mind, with heart'}
          </p>
        </div>
      </main>
    </div>
  );
};

export default Index;
