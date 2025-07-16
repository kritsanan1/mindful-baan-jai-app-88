
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Play, Clock, Star, Lock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ContentItem {
  id: string;
  title: string;
  titleTh: string;
  description: string;
  descriptionTh: string;
  duration: number;
  category: 'meditation' | 'breathing' | 'sleep' | 'stress';
  isPremium: boolean;
  rating: number;
  thumbnail: string;
}

const Content = () => {
  const { t, language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDuration, setSelectedDuration] = useState<string>('all');

  const contentItems: ContentItem[] = [
    {
      id: '1',
      title: 'Morning Mindfulness',
      titleTh: 'สติในตอนเช้า',
      description: 'Start your day with peaceful awareness',
      descriptionTh: 'เริ่มต้นวันด้วยการมีสติอย่างสงบ',
      duration: 10,
      category: 'meditation',
      isPremium: false,
      rating: 4.8,
      thumbnail: '🌅'
    },
    {
      id: '2',
      title: 'Deep Breathing Exercise',
      titleTh: 'การหายใจลึก',
      description: 'Calm your mind with focused breathing',
      descriptionTh: 'ทำใจให้สงบด้วยการหายใจอย่างมีสติ',
      duration: 5,
      category: 'breathing',
      isPremium: false,
      rating: 4.9,
      thumbnail: '💨'
    },
    {
      id: '3',
      title: 'Sleep Meditation',
      titleTh: 'สมาธิก่อนนอน',
      description: 'Drift into peaceful sleep',
      descriptionTh: 'หลับสนิทด้วยใจที่สงบ',
      duration: 15,
      category: 'sleep',
      isPremium: true,
      rating: 4.7,
      thumbnail: '🌙'
    },
    {
      id: '4',
      title: 'Stress Relief',
      titleTh: 'คลายเครียด',
      description: 'Release tension and find peace',
      descriptionTh: 'ปล่อยความเครียดและค้นหาความสงบ',
      duration: 12,
      category: 'stress',
      isPremium: false,
      rating: 4.6,
      thumbnail: '🌿'
    }
  ];

  const categories = [
    { id: 'all', label: language === 'th' ? 'ทั้งหมด' : 'All' },
    { id: 'meditation', label: language === 'th' ? 'สมาธิ' : 'Meditation' },
    { id: 'breathing', label: language === 'th' ? 'หายใจ' : 'Breathing' },
    { id: 'sleep', label: language === 'th' ? 'นอนหลับ' : 'Sleep' },
    { id: 'stress', label: language === 'th' ? 'คลายเครียด' : 'Stress Relief' }
  ];

  const durations = [
    { id: 'all', label: language === 'th' ? 'ทุกระยะเวลา' : 'All Durations' },
    { id: '5', label: '5 นาที / 5 min' },
    { id: '10', label: '10 นาที / 10 min' },
    { id: '15', label: '15+ นาที / 15+ min' }
  ];

  const filteredContent = contentItems.filter(item => {
    const categoryMatch = selectedCategory === 'all' || item.category === selectedCategory;
    const durationMatch = selectedDuration === 'all' || 
      (selectedDuration === '5' && item.duration <= 5) ||
      (selectedDuration === '10' && item.duration > 5 && item.duration <= 10) ||
      (selectedDuration === '15' && item.duration > 10);
    
    return categoryMatch && durationMatch;
  });

  const handlePlayContent = (item: ContentItem) => {
    if (item.isPremium) {
      // Show premium upgrade prompt
      return;
    }
    // Navigate to content player
    console.log('Playing:', item.title);
  };

  return (
    <div className="min-h-screen bg-soft-blue pb-20">
      {/* Header */}
      <div className="bg-white px-6 py-4 shadow-sm">
        <h1 className={`text-2xl font-bold text-gray-800 ${language === 'th' ? 'thai-text' : ''}`}>
          {t('nav.content')}
        </h1>
        <p className={`text-gray-600 mt-1 ${language === 'th' ? 'thai-text' : ''}`}>
          {language === 'th' ? 'เนื้อหาเพื่อสุขภาพจิต' : 'Content for Mental Wellness'}
        </p>
      </div>

      {/* Filters */}
      <div className="px-6 py-4 space-y-4">
        {/* Category Filter */}
        <div>
          <h3 className={`text-sm font-medium text-gray-700 mb-2 ${language === 'th' ? 'thai-text' : ''}`}>
            {language === 'th' ? 'หมวดหมู่' : 'Category'}
          </h3>
          <div className="flex space-x-2 overflow-x-auto">
            {categories.map(category => (
              <Button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                size="sm"
                className={`whitespace-nowrap ${
                  selectedCategory === category.id 
                    ? 'bg-dark-green hover:bg-green-700' 
                    : 'bg-white hover:bg-gray-50'
                } ${language === 'th' ? 'thai-text' : ''}`}
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Duration Filter */}
        <div>
          <h3 className={`text-sm font-medium text-gray-700 mb-2 ${language === 'th' ? 'thai-text' : ''}`}>
            {language === 'th' ? 'ระยะเวลา' : 'Duration'}
          </h3>
          <div className="flex space-x-2 overflow-x-auto">
            {durations.map(duration => (
              <Button
                key={duration.id}
                onClick={() => setSelectedDuration(duration.id)}
                variant={selectedDuration === duration.id ? 'default' : 'outline'}
                size="sm"
                className={`whitespace-nowrap ${
                  selectedDuration === duration.id 
                    ? 'bg-dark-green hover:bg-green-700' 
                    : 'bg-white hover:bg-gray-50'
                } ${language === 'th' ? 'thai-text' : ''}`}
              >
                {duration.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="px-6 space-y-4">
        {filteredContent.map(item => (
          <Card key={item.id} className="p-4 bg-white shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-4">
              {/* Thumbnail */}
              <div className="w-16 h-16 bg-mint-green rounded-xl flex items-center justify-center text-2xl">
                {item.thumbnail}
              </div>

              {/* Content Info */}
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className={`font-semibold text-gray-800 ${language === 'th' ? 'thai-text' : ''}`}>
                    {language === 'th' ? item.titleTh : item.title}
                  </h3>
                  {item.isPremium && (
                    <Badge className="bg-warm-orange text-white">
                      <Lock className="w-3 h-3 mr-1" />
                      Premium
                    </Badge>
                  )}
                </div>
                
                <p className={`text-sm text-gray-600 mb-2 ${language === 'th' ? 'thai-text' : ''}`}>
                  {language === 'th' ? item.descriptionTh : item.description}
                </p>
                
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{item.duration} {language === 'th' ? 'นาที' : 'min'}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span>{item.rating}</span>
                  </div>
                </div>
              </div>

              {/* Play Button */}
              <Button
                onClick={() => handlePlayContent(item)}
                className="bg-dark-green hover:bg-green-700 rounded-full p-3"
              >
                <Play className="w-5 h-5" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredContent.length === 0 && (
        <div className="text-center py-12 px-6">
          <div className="text-4xl mb-4">🔍</div>
          <p className={`text-gray-600 ${language === 'th' ? 'thai-text' : ''}`}>
            {language === 'th' 
              ? 'ไม่พบเนื้อหาที่ตรงกับการค้นหา' 
              : 'No content matches your filters'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default Content;
