
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Settings, Trophy, Star, Calendar, Bell, Lock, Crown, LogOut } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { BillingPortal } from '@/components/premium/BillingPortal';
import { PremiumUpgrade } from '@/components/premium/PremiumUpgrade';

const Profile = () => {
  const { t, language, setLanguage } = useLanguage();
  const { user, signOut } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [privacyMode, setPrivacyMode] = useState(false);

  // Mock user data
  const userData = {
    name: user?.user_metadata?.full_name || (language === 'th' ? 'ผู้ใช้' : 'User'),
    email: user?.email || '',
    joinDate: new Date('2024-01-15'),
    isPremium: false,
    meditationStreak: 7,
    totalMeditations: 45,
    totalMinutes: 450,
    moodEntries: 23,
    level: 3,
    points: 1250,
    nextLevelPoints: 1500
  };

  const achievements = [
    {
      id: '1',
      title: language === 'th' ? 'นักสมาธิมือใหม่' : 'Meditation Beginner',
      description: language === 'th' ? 'ทำสมาธิครบ 5 วัน' : 'Complete 5 days of meditation',
      icon: '🧘‍♀️',
      earned: true,
      points: 100
    },
    {
      id: '2',
      title: language === 'th' ? 'ผู้บันทึกอารมณ์' : 'Mood Tracker',
      description: language === 'th' ? 'บันทึกอารมณ์ครบ 20 ครั้ง' : 'Log your mood 20 times',
      icon: '📊',
      earned: true,
      points: 150
    },
    {
      id: '3',
      title: language === 'th' ? 'นักสมาธิเซียน' : 'Meditation Master',
      description: language === 'th' ? 'ทำสมาธิครบ 30 วัน' : 'Complete 30 days of meditation',
      icon: '🏆',
      earned: false,
      points: 500
    }
  ];

  const handleUpgradeToPremium = () => {
    console.log('Navigate to premium upgrade');
  };

  const handleLogout = async () => {
    await signOut();
  };

  const progressPercentage = (userData.points / userData.nextLevelPoints) * 100;

  return (
    <div className="min-h-screen bg-soft-blue pb-20">
      {/* Header */}
      <div className="bg-white px-6 py-6 shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-mint-green rounded-full flex items-center justify-center text-2xl">
            😊
          </div>
          <div className="flex-1">
            <h1 className={`text-xl font-bold text-gray-800 ${language === 'th' ? 'thai-text' : ''}`}>
              {userData.name}
            </h1>
            <p className="text-gray-600 text-sm">{userData.email}</p>
            <div className="flex items-center space-x-2 mt-1">
              <Badge variant={userData.isPremium ? 'default' : 'secondary'} className="text-xs">
                {userData.isPremium ? (
                  <>
                    <Crown className="w-3 h-3 mr-1" />
                    Premium
                  </>
                ) : (
                  'Free Plan'
                )}
              </Badge>
              <Badge variant="outline" className="text-xs">
                Level {userData.level}
              </Badge>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span className={language === 'th' ? 'thai-text' : ''}>
              {language === 'th' ? 'ความคืบหน้า' : 'Progress to Level'} {userData.level + 1}
            </span>
            <span>{userData.points}/{userData.nextLevelPoints}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-dark-green rounded-full h-2 transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-6 py-4 grid grid-cols-2 gap-4">
        <Card className="p-4 bg-white shadow-md">
          <div className="text-center">
            <div className="text-2xl font-bold text-dark-green">{userData.meditationStreak}</div>
            <div className={`text-sm text-gray-600 ${language === 'th' ? 'thai-text' : ''}`}>
              {language === 'th' ? 'วันติดต่อกัน' : 'Day Streak'}
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-white shadow-md">
          <div className="text-center">
            <div className="text-2xl font-bold text-dark-green">{userData.totalMinutes}</div>
            <div className={`text-sm text-gray-600 ${language === 'th' ? 'thai-text' : ''}`}>
              {language === 'th' ? 'นาทีทั้งหมด' : 'Total Minutes'}
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-white shadow-md">
          <div className="text-center">
            <div className="text-2xl font-bold text-dark-green">{userData.totalMeditations}</div>
            <div className={`text-sm text-gray-600 ${language === 'th' ? 'thai-text' : ''}`}>
              {language === 'th' ? 'ครั้งทั้งหมด' : 'Sessions'}
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-white shadow-md">
          <div className="text-center">
            <div className="text-2xl font-bold text-dark-green">{userData.moodEntries}</div>
            <div className={`text-sm text-gray-600 ${language === 'th' ? 'thai-text' : ''}`}>
              {language === 'th' ? 'บันทึกอารมณ์' : 'Mood Entries'}
            </div>
          </div>
        </Card>
      </div>

      {/* Premium Upgrade */}
      {!userData.isPremium && (
        <div className="px-6 pb-4">
          <PremiumUpgrade showAsModal={true} />
        </div>
      )}

      {/* Billing Portal for Premium Users */}
      {userData.isPremium && (
        <div className="px-6 pb-4">
          <BillingPortal 
            isPremium={userData.isPremium}
            subscription={{
              status: 'active',
              currentPeriodEnd: '2024-02-15',
              priceId: 'price_premium_monthly',
              cancelAtPeriodEnd: false
            }}
          />
        </div>
      )}

      {/* Achievements */}
      <div className="px-6 pb-4">
        <h2 className={`text-lg font-semibold text-gray-800 mb-3 ${language === 'th' ? 'thai-text' : ''}`}>
          {language === 'th' ? 'ความสำเร็จ' : 'Achievements'}
        </h2>
        <div className="space-y-3">
          {achievements.map(achievement => (
            <Card key={achievement.id} className={`p-4 ${achievement.earned ? 'bg-white' : 'bg-gray-50'}`}>
              <div className="flex items-center space-x-3">
                <div className={`text-2xl ${!achievement.earned ? 'grayscale opacity-50' : ''}`}>
                  {achievement.icon}
                </div>
                <div className="flex-1">
                  <h3 className={`font-medium ${achievement.earned ? 'text-gray-800' : 'text-gray-500'} ${language === 'th' ? 'thai-text' : ''}`}>
                    {achievement.title}
                  </h3>
                  <p className={`text-sm ${achievement.earned ? 'text-gray-600' : 'text-gray-400'} ${language === 'th' ? 'thai-text' : ''}`}>
                    {achievement.description}
                  </p>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-medium ${achievement.earned ? 'text-dark-green' : 'text-gray-400'}`}>
                    +{achievement.points}
                  </div>
                  <div className="text-xs text-gray-500">
                    {language === 'th' ? 'คะแนน' : 'points'}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Settings */}
      <div className="px-6 pb-4">
        <h2 className={`text-lg font-semibold text-gray-800 mb-3 ${language === 'th' ? 'thai-text' : ''}`}>
          {language === 'th' ? 'การตั้งค่า' : 'Settings'}
        </h2>
        <Card className="bg-white shadow-md">
          <div className="divide-y divide-gray-100">
            {/* Language Setting */}
            <div className="p-4 flex items-center justify-between">
              <div>
                <h3 className={`font-medium text-gray-800 ${language === 'th' ? 'thai-text' : ''}`}>
                  {language === 'th' ? 'ภาษา' : 'Language'}
                </h3>
                <p className={`text-sm text-gray-600 ${language === 'th' ? 'thai-text' : ''}`}>
                  {language === 'th' ? 'เปลี่ยนภาษาแอป' : 'Change app language'}
                </p>
              </div>
              <div className="flex bg-gray-100 rounded-full p-1">
                <button
                  onClick={() => setLanguage('th')}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                    language === 'th' 
                      ? 'bg-dark-green text-white' 
                      : 'text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  ไทย
                </button>
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                    language === 'en' 
                      ? 'bg-dark-green text-white' 
                      : 'text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  EN
                </button>
              </div>
            </div>

            {/* Notifications */}
            <div className="p-4 flex items-center justify-between">
              <div>
                <h3 className={`font-medium text-gray-800 ${language === 'th' ? 'thai-text' : ''}`}>
                  {language === 'th' ? 'การแจ้งเตือน' : 'Notifications'}
                </h3>
                <p className={`text-sm text-gray-600 ${language === 'th' ? 'thai-text' : ''}`}>
                  {language === 'th' ? 'รับการแจ้งเตือนรายวัน' : 'Receive daily reminders'}
                </p>
              </div>
              <Switch
                checked={notifications}
                onCheckedChange={setNotifications}
              />
            </div>

            {/* Privacy Mode */}
            <div className="p-4 flex items-center justify-between">
              <div>
                <h3 className={`font-medium text-gray-800 ${language === 'th' ? 'thai-text' : ''}`}>
                  {language === 'th' ? 'โหมดส่วนตัว' : 'Privacy Mode'}
                </h3>
                <p className={`text-sm text-gray-600 ${language === 'th' ? 'thai-text' : ''}`}>
                  {language === 'th' ? 'ซ่อนข้อมูลส่วนตัว' : 'Hide personal data'}
                </p>
              </div>
              <Switch
                checked={privacyMode}
                onCheckedChange={setPrivacyMode}
              />
            </div>

            {/* Logout */}
            <div className="p-4">
              <Button
                onClick={handleLogout}
                variant="outline"
                className="w-full text-red-600 border-red-200 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                <span className={language === 'th' ? 'thai-text' : ''}>
                  {language === 'th' ? 'ออกจากระบบ' : 'Sign Out'}
                </span>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
