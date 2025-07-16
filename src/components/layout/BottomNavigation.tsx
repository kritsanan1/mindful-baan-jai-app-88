
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, MessageCircle, Book, User, Calendar } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export const BottomNavigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const navItems = [
    {
      path: '/',
      icon: Home,
      label: t('nav.home'),
      activeColor: 'text-dark-green'
    },
    {
      path: '/chat',
      icon: MessageCircle,
      label: t('nav.chat'),
      activeColor: 'text-calming-blue'
    },
    {
      path: '/content',
      icon: Book,
      label: t('nav.content'),
      activeColor: 'text-warm-orange'
    },
    {
      path: '/therapist',
      icon: Calendar,
      label: t('nav.therapist'),
      activeColor: 'text-purple-600'
    },
    {
      path: '/profile',
      icon: User,
      label: t('nav.profile'),
      activeColor: 'text-indigo-600'
    }
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-200 px-4 py-2 shadow-lg">
      <div className="flex justify-around items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-200 hover:bg-gray-50 ${
                isActive ? 'transform scale-105' : ''
              }`}
            >
              <Icon 
                size={20} 
                className={`mb-1 transition-colors duration-200 ${
                  isActive ? item.activeColor : 'text-gray-500'
                }`}
              />
              <span 
                className={`text-xs font-medium transition-colors duration-200 ${
                  isActive ? item.activeColor : 'text-gray-500'
                }`}
              >
                {item.label}
              </span>
              {isActive && (
                <div className={`w-1 h-1 rounded-full mt-1 ${item.activeColor.replace('text-', 'bg-')}`} />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
