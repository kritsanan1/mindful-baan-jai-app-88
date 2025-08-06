
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, MessageCircle, Book, User, Calendar, Heart } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';

export const BottomNavigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user } = useAuth();

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
      path: '/health',
      icon: Heart,
      label: 'Health',
      activeColor: 'text-red-500'
    },
    {
      path: '/profile',
      icon: User,
      label: t('nav.profile'),
      activeColor: 'text-indigo-600'
    }
  ];

  const handleNavigation = (path: string) => {
    if (!user && path !== '/') {
      // For non-authenticated users, redirect to home which will show auth modal
      navigate('/');
      return;
    }
    navigate(path);
  };

  return (
    <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-200 px-4 py-2 shadow-lg">
      <div className="flex justify-around items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          const isDisabled = !user && item.path !== '/';
          
          return (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-200 hover:bg-gray-50 ${
                isActive ? 'transform scale-105' : ''
              } ${
                isDisabled ? 'opacity-50' : ''
              }`}
              disabled={isDisabled}
            >
              <Icon 
                size={20} 
                className={`mb-1 transition-colors duration-200 ${
                  isActive ? item.activeColor : isDisabled ? 'text-gray-300' : 'text-gray-500'
                }`}
              />
              <span 
                className={`text-xs font-medium transition-colors duration-200 ${
                  isActive ? item.activeColor : isDisabled ? 'text-gray-300' : 'text-gray-500'
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
