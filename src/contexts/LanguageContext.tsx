
import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'th' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  th: {
    // Navigation
    'nav.home': 'หน้าหลัก',
    'nav.chat': 'แชท AI',
    'nav.content': 'เนื้อหา',
    'nav.health': 'สุขภาพ',
    'nav.therapist': 'นักจิตวิทยา',
    'nav.profile': 'โปรไฟล์',
    
    // Home screen
    'home.greeting': 'สวัสดี',
    'home.mood_check': 'ตรวจสอบอารมณ์วันนี้',
    'home.daily_tip': 'เคล็ดลับประจำวัน',
    'home.start_meditation': 'เริ่มเจริญสติ',
    'home.check_mood': 'ตรวจสอบอารมณ์',
    'home.meditation_streak': 'ความต่อเนื่องในการเจริญสติ',
    'home.days': 'วัน',
    
    // Common
    'common.premium': 'พรีเมี่ยม',
    'common.upgrade': 'อัพเกรด',
    'common.continue': 'ดำเนินการต่อ',
    'common.start_now': 'เริ่มเลย',
    'common.try_meditation': 'ลองเจริญสติ',
    
    // Meditation
    'meditation.title': 'การเจริญสติ',
    'meditation.breathing': 'การหายใจ',
    'meditation.mindfulness': 'สติ',
    'meditation.sleep': 'การนอนหลับ',
    'meditation.stress_relief': 'คลายความเครียด',
    
    // AI Chat
    'chat.placeholder': 'พิมพ์ข้อความของคุณ...',
    'chat.send': 'ส่ง',
    'chat.save_mood': 'บันทึกอารมณ์',
    
    // Mental health tips
    'tips.breathing': 'หายใจเข้าลึกๆ 4 ครั้ง เพื่อความสงบ',
    'tips.gratitude': 'เขียนสิ่งที่ขอบคุณ 3 อย่างในวันนี้',
    'tips.nature': 'ใช้เวลา 10 นาทีกับธรรมชาติ',
    'tips.meditation': 'เจริญสติ 5 นาทีเพื่อจิตใจที่สงบ',
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.chat': 'AI Chat',
    'nav.content': 'Content',
    'nav.health': 'Health',
    'nav.therapist': 'Therapist',
    'nav.profile': 'Profile',
    
    // Home screen
    'home.greeting': 'Hello',
    'home.mood_check': 'Check Today\'s Mood',
    'home.daily_tip': 'Daily Tip',
    'home.start_meditation': 'Start Meditation',
    'home.check_mood': 'Check Mood',
    'home.meditation_streak': 'Meditation Streak',
    'home.days': 'days',
    
    // Common
    'common.premium': 'Premium',
    'common.upgrade': 'Upgrade',
    'common.continue': 'Continue',
    'common.start_now': 'Start Now',
    'common.try_meditation': 'Try Meditation',
    
    // Meditation
    'meditation.title': 'Meditation',
    'meditation.breathing': 'Breathing',
    'meditation.mindfulness': 'Mindfulness',
    'meditation.sleep': 'Sleep',
    'meditation.stress_relief': 'Stress Relief',
    
    // AI Chat
    'chat.placeholder': 'Type your message...',
    'chat.send': 'Send',
    'chat.save_mood': 'Save Mood',
    
    // Mental health tips
    'tips.breathing': 'Take 4 deep breaths for instant calm',
    'tips.gratitude': 'Write down 3 things you\'re grateful for today',
    'tips.nature': 'Spend 10 minutes in nature',
    'tips.meditation': 'Meditate for 5 minutes for peace of mind',
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('th');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('baanjai-language') as Language;
    if (savedLanguage && (savedLanguage === 'th' || savedLanguage === 'en')) {
      setLanguage(savedLanguage);
    }
  }, []);

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('baanjai-language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
