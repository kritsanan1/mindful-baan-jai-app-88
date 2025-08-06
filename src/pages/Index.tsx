import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { AuthModal } from '@/components/auth/AuthModal';
import { MoodCard } from '@/components/ui/MoodCard';
import { MeditationCard } from '@/components/ui/MeditationCard';
import { DailyTipCard } from '@/components/ui/DailyTipCard';
import { PremiumBanner } from '@/components/ui/PremiumBanner';
import { Button } from '@/components/ui/button';
import { FullScreenLoading } from '@/components/ui/loading';
import { AppLogo } from '@/components/ui/optimized-image';
import { LogIn, UserPlus } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { t, language, setLanguage } = useLanguage();
  const { user, isLoading } = useAuth();
  const [meditationStreak] = useState(7);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const userName = useMemo(() =>
    user?.user_metadata?.full_name || (language === 'th' ? 'ผู้ใช้' : 'User'),
    [user?.user_metadata?.full_name, language]
  );

  const handleMoodCheck = useCallback(() => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    navigate('/chat');
  }, [user, navigate]);

  const handleStartMeditation = useCallback(() => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    navigate('/content');
  }, [user, navigate]);

  const handleUpgrade = useCallback(() => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    console.log('Navigate to premium upgrade');
  }, [user]);

  if (isLoading) {
    return <FullScreenLoading />;
  }

  return (
    <div className="min-h-screen app-gradient">
      {/* Header */}
      <header className="pt-12 pb-6 px-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className={`text-2xl font-bold text-gray-800 ${language === 'th' ? 'thai-text' : ''}`}>
              {user ? `${t('home.greeting')}, ${userName} 👋` : (language === 'th' ? 'ยินดีต้อนรับสู่บ้านใจ' : 'Welcome to Baan Jai')}
            </h1>
            <p className={`text-gray-600 mt-1 ${language === 'th' ? 'thai-text' : ''}`}>
              {user ? (
                new Date().toLocaleDateString(language === 'th' ? 'th-TH' : 'en-US', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long'
                })
              ) : (
                language === 'th' ? 'แอปดูแลสุขภาพจิตด้วย AI' : 'AI-powered mental health companion'
              )}
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
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

            {/* Auth Button */}
            {!user && (
              <Button
                onClick={() => setShowAuthModal(true)}
                size="sm"
                className="bg-dark-green hover:bg-green-700"
              >
                <LogIn className="w-4 h-4 mr-1" />
                <span className={language === 'th' ? 'thai-text' : ''}>
                  {language === 'th' ? 'เข้าสู่ระบบ' : 'Sign In'}
                </span>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 space-y-6">
        {user ? (
          <>
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
          </>
        ) : (
          /* Welcome Section for Non-Authenticated Users */
          <div className="space-y-6">
            <div className="text-center py-8">
              <div className="w-24 h-24 bg-mint-green rounded-full flex items-center justify-center mx-auto mb-6">
                <AppLogo size="lg" />
              </div>
              <h2 className={`text-2xl font-bold text-gray-800 mb-4 ${language === 'th' ? 'thai-text' : ''}`}>
                {language === 'th' ? 'ดูแลจิตใจ ด้วยใจ' : 'Caring for your mind, with heart'}
              </h2>
              <p className={`text-gray-600 mb-8 max-w-sm mx-auto ${language === 'th' ? 'thai-text' : ''}`}>
                {language === 'th' 
                  ? 'แอปพลิเคชันดูแลสุขภาพจิตด้วยปัญญาประดิษฐ์ สำหรับคนไทยวัยรุ่น'
                  : 'AI-powered mental health companion designed for Thai young adults'
                }
              </p>
              
              <div className="space-y-3">
                <Button
                  onClick={() => setShowAuthModal(true)}
                  className="w-full bg-dark-green hover:bg-green-700 py-3"
                >
                  <UserPlus className="w-5 h-5 mr-2" />
                  <span className={language === 'th' ? 'thai-text' : ''}>
                    {language === 'th' ? 'เริ่มต้นใช้งานฟรี' : 'Get Started Free'}
                  </span>
                </Button>
                
                <Button
                  onClick={() => setShowAuthModal(true)}
                  variant="outline"
                  className="w-full py-3"
                >
                  <LogIn className="w-5 h-5 mr-2" />
                  <span className={language === 'th' ? 'thai-text' : ''}>
                    {language === 'th' ? 'เข้าสู่ระบบ' : 'Sign In'}
                  </span>
                </Button>
              </div>
            </div>

            {/* Feature Preview */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-md">
                <div className="text-3xl mb-2">🤖</div>
                <h3 className={`font-semibold text-gray-800 mb-1 ${language === 'th' ? 'thai-text' : ''}`}>
                  {language === 'th' ? 'AI แชทบอท' : 'AI Chatbot'}
                </h3>
                <p className={`text-xs text-gray-600 ${language === 'th' ? 'thai-text' : ''}`}>
                  {language === 'th' ? 'พูดคุยกับ AI ที่เข้าใจคุณ' : 'Chat with AI that understands you'}
                </p>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-md">
                <div className="text-3xl mb-2">🧘‍♀️</div>
                <h3 className={`font-semibold text-gray-800 mb-1 ${language === 'th' ? 'thai-text' : ''}`}>
                  {language === 'th' ? 'การเจริญสติ' : 'Meditation'}
                </h3>
                <p className={`text-xs text-gray-600 ${language === 'th' ? 'thai-text' : ''}`}>
                  {language === 'th' ? 'เนื้อหาสมาธิและสติ' : 'Guided meditation content'}
                </p>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-md">
                <div className="text-3xl mb-2">👨‍⚕️</div>
                <h3 className={`font-semibold text-gray-800 mb-1 ${language === 'th' ? 'thai-text' : ''}`}>
                  {language === 'th' ? 'นักจิตวิทยา' : 'Therapists'}
                </h3>
                <p className={`text-xs text-gray-600 ${language === 'th' ? 'thai-text' : ''}`}>
                  {language === 'th' ? 'จองเวลากับผู้เชี่ยวชาญ' : 'Book sessions with experts'}
                </p>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-md">
                <div className="text-3xl mb-2">📊</div>
                <h3 className={`font-semibold text-gray-800 mb-1 ${language === 'th' ? 'thai-text' : ''}`}>
                  {language === 'th' ? 'ติดตามสุขภาพ' : 'Health Tracking'}
                </h3>
                <p className={`text-xs text-gray-600 ${language === 'th' ? 'thai-text' : ''}`}>
                  {language === 'th' ? 'ติดตามความคืบหน้า' : 'Monitor your progress'}
                </p>
              </div>
            </div>
          </div>
        )}
        {user && (
          /* Quick Actions */
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
        )}

        {/* App Logo/Branding */}
        <div className="text-center py-8">
          <div className="inline-flex items-center space-x-2 opacity-75">
            <AppLogo size="md" />
            <span className={`text-lg font-semibold text-gray-600 ${language === 'th' ? 'thai-text' : ''}`}>
              บ้านใจ • Baan Jai
            </span>
          </div>
          <p className={`text-xs text-gray-500 mt-2 ${language === 'th' ? 'thai-text' : ''}`}>
            {language === 'th' ? 'ดูแลจิตใจ ด้วยใจ' : 'Caring for your mind, with heart'}
          </p>
        </div>
      </main>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => setShowAuthModal(false)}
      />
    </div>
  );
};

export default Index;
