import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward,
  Volume2,
  Heart,
  BookmarkPlus,
  Share2,
  Star,
  Clock,
  Users,
  Download,
  Headphones
} from 'lucide-react';

interface ContentDetailProps {
  contentId: string;
  onBack: () => void;
}

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
  reviews: number;
  instructor: string;
  instructorTh: string;
  thumbnail: string;
  audioUrl?: string;
  transcript: string;
  transcriptTh: string;
  benefits: string[];
  benefitsTh: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  tagsTh: string[];
}

export const ContentDetail: React.FC<ContentDetailProps> = ({ contentId, onBack }) => {
  const { language } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isFavorite, setIsFavorite] = useState(false);

  // Mock content data
  const content: ContentItem = {
    id: contentId,
    title: 'Morning Mindfulness',
    titleTh: 'สติในตอนเช้า',
    description: 'Start your day with peaceful awareness and gentle breathing exercises',
    descriptionTh: 'เริ่มต้นวันด้วยการมีสติอย่างสงบและการหายใจเบาๆ',
    duration: 10,
    category: 'meditation',
    isPremium: false,
    rating: 4.8,
    reviews: 1245,
    instructor: 'Sarah Johnson',
    instructorTh: 'ซาร่าห์ จอห์นสัน',
    thumbnail: '🌅',
    transcript: 'Welcome to this morning mindfulness session. Find a comfortable position and close your eyes...',
    transcriptTh: 'ยินดีต้อนรับสู่การฝึกสติในตอนเช้า ค้นหาท่านั่งที่สบายและหลับตา...',
    benefits: [
      'Reduces morning anxiety',
      'Improves focus throughout the day',
      'Creates positive morning routine',
      'Enhances emotional regulation'
    ],
    benefitsTh: [
      'ลดความวิตกกังวลในตอนเช้า',
      'เพิ่มสมาธิตลอดทั้งวัน',
      'สร้างกิจวัตรเช้าที่ดี',
      'เสริมการควบคุมอารมณ์'
    ],
    difficulty: 'beginner',
    tags: ['morning', 'mindfulness', 'breathing', 'gentle'],
    tagsTh: ['ตอนเช้า', 'สติ', 'หายใจ', 'เบาๆ']
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    // Audio playback logic would go here
  };

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleShare = () => {
    // Share functionality
    console.log('Sharing content');
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    if (language === 'th') {
      switch (difficulty) {
        case 'beginner': return 'เริ่มต้น';
        case 'intermediate': return 'ปานกลาง';
        case 'advanced': return 'ขั้นสูง';
        default: return 'ไม่ระบุ';
      }
    } else {
      return difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
    }
  };

  return (
    <div className="min-h-screen bg-soft-blue pb-20">
      {/* Header */}
      <div className="bg-white px-6 py-4 shadow-sm">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-4 p-0 text-gray-600 hover:text-gray-800"
        >
          ← {language === 'th' ? 'กลับ' : 'Back'}
        </Button>
        
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 bg-mint-green rounded-2xl flex items-center justify-center text-3xl">
            {content.thumbnail}
          </div>
          
          <div className="flex-1">
            <h1 className={`text-xl font-bold text-gray-800 mb-1 ${language === 'th' ? 'thai-text' : ''}`}>
              {language === 'th' ? content.titleTh : content.title}
            </h1>
            
            <p className={`text-gray-600 text-sm mb-2 ${language === 'th' ? 'thai-text' : ''}`}>
              {language === 'th' ? content.instructorTh : content.instructor}
            </p>
            
            <div className="flex items-center space-x-3 text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{content.duration} {language === 'th' ? 'นาที' : 'min'}</span>
              </div>
              
              <div className="flex items-center space-x-1">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span>{content.rating}</span>
              </div>
              
              <div className="flex items-center space-x-1">
                <Users className="w-3 h-3" />
                <span>{content.reviews.toLocaleString()}</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col space-y-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleFavorite}
              className={`p-2 ${isFavorite ? 'text-red-500' : 'text-gray-400'}`}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="p-2 text-gray-400"
            >
              <Share2 className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Audio Player */}
      <Card className="mx-6 mt-4 p-4 bg-white shadow-md">
        <div className="space-y-4">
          {/* Progress Bar */}
          <div className="space-y-2">
            <Progress value={progress} className="w-full" />
            <div className="flex justify-between text-xs text-gray-500">
              <span>2:30</span>
              <span>{content.duration}:00</span>
            </div>
          </div>
          
          {/* Controls */}
          <div className="flex items-center justify-center space-x-6">
            <Button variant="ghost" size="sm" className="p-2">
              <SkipBack className="w-5 h-5" />
            </Button>
            
            <Button
              onClick={handlePlayPause}
              className="bg-dark-green hover:bg-green-700 rounded-full p-4"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6" />
              ) : (
                <Play className="w-6 h-6 ml-1" />
              )}
            </Button>
            
            <Button variant="ghost" size="sm" className="p-2">
              <SkipForward className="w-5 h-5" />
            </Button>
          </div>
          
          {/* Volume */}
          <div className="flex items-center space-x-3">
            <Volume2 className="w-4 h-4 text-gray-500" />
            <div className="flex-1">
              <Progress value={volume} className="w-full" />
            </div>
            <span className="text-xs text-gray-500 w-8">{volume}%</span>
          </div>
        </div>
      </Card>

      {/* Content Info */}
      <div className="px-6 pt-4 space-y-4">
        {/* Tags and Difficulty */}
        <Card className="p-4 bg-white shadow-md">
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <Badge className={getDifficultyColor(content.difficulty)}>
                {getDifficultyText(content.difficulty)}
              </Badge>
              
              {(language === 'th' ? content.tagsTh : content.tags).map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
            
            <p className={`text-sm text-gray-700 leading-relaxed ${language === 'th' ? 'thai-text' : ''}`}>
              {language === 'th' ? content.descriptionTh : content.description}
            </p>
          </div>
        </Card>

        {/* Benefits */}
        <Card className="p-4 bg-white shadow-md">
          <h3 className={`font-semibold text-gray-800 mb-3 ${language === 'th' ? 'thai-text' : ''}`}>
            {language === 'th' ? 'ประโยชน์' : 'Benefits'}
          </h3>
          
          <div className="space-y-2">
            {(language === 'th' ? content.benefitsTh : content.benefits).map((benefit, index) => (
              <div key={index} className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-dark-green rounded-full mt-2 flex-shrink-0" />
                <span className={`text-sm text-gray-700 ${language === 'th' ? 'thai-text' : ''}`}>
                  {benefit}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Transcript */}
        <Card className="p-4 bg-white shadow-md">
          <h3 className={`font-semibold text-gray-800 mb-3 ${language === 'th' ? 'thai-text' : ''}`}>
            {language === 'th' ? 'เนื้อหา' : 'Transcript'}
          </h3>
          
          <p className={`text-sm text-gray-700 leading-relaxed ${language === 'th' ? 'thai-text' : ''}`}>
            {language === 'th' ? content.transcriptTh : content.transcript}
          </p>
        </Card>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="flex items-center justify-center space-x-2 py-3"
          >
            <Download className="w-4 h-4" />
            <span className={language === 'th' ? 'thai-text' : ''}>
              {language === 'th' ? 'ดาวน์โหลด' : 'Download'}
            </span>
          </Button>
          
          <Button
            variant="outline"
            className="flex items-center justify-center space-x-2 py-3"
          >
            <BookmarkPlus className="w-4 h-4" />
            <span className={language === 'th' ? 'thai-text' : ''}>
              {language === 'th' ? 'บันทึก' : 'Save'}
            </span>
          </Button>
        </div>

        {/* Related Content */}
        <Card className="p-4 bg-white shadow-md">
          <h3 className={`font-semibold text-gray-800 mb-3 ${language === 'th' ? 'thai-text' : ''}`}>
            {language === 'th' ? 'เนื้อหาที่เกี่ยวข้อง' : 'Related Content'}
          </h3>
          
          <div className="space-y-3">
            {[1, 2, 3].map(index => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-mint-green rounded-lg flex items-center justify-center text-lg">
                  🧘‍♀️
                </div>
                
                <div className="flex-1">
                  <h4 className={`font-medium text-sm text-gray-800 ${language === 'th' ? 'thai-text' : ''}`}>
                    {language === 'th' ? 'สมาธิเย็น' : 'Evening Meditation'}
                  </h4>
                  <p className="text-xs text-gray-500">
                    15 {language === 'th' ? 'นาที' : 'min'}
                  </p>
                </div>
                
                <Button variant="ghost" size="sm" className="p-2">
                  <Play className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};