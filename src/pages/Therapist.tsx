
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Clock, Phone, Crown } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { BookingCalendar } from '@/components/booking/BookingCalendar';
import { toast } from 'sonner';

interface Therapist {
  id: string;
  name: string;
  nameTh: string;
  specialty: string[];
  specialtyTh: string[];
  bio: string;
  bioTh: string;
  hourlyRate: number;
  rating: number;
  reviews: number;
  languages: string[];
  avatar: string;
  isPremium: boolean;
  availability: string[];
  location: string;
  locationTh: string;
}

const Therapist = () => {
  const { t, language } = useLanguage();
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [selectedPriceRange, setPriceRange] = useState<string>('all');
  const [selectedTherapist, setSelectedTherapist] = useState<Therapist | null>(null);
  const [showBookingCalendar, setShowBookingCalendar] = useState(false);

  const therapists: Therapist[] = [
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      nameTh: 'ดร. ซาร่าห์ จอห์นสัน',
      specialty: ['Anxiety', 'Depression', 'CBT'],
      specialtyTh: ['ความวิตกกังวล', 'ภาวะซึมเศร้า', 'CBT'],
      bio: 'Specialized in cognitive behavioral therapy with 10+ years experience',
      bioTh: 'เชี่ยวชาญด้านการบำบัดทางปัญญาพฤติกรรม มีประสบการณ์ 10+ ปี',
      hourlyRate: 2500,
      rating: 4.9,
      reviews: 127,
      languages: ['English', 'Thai'],
      avatar: '👩‍⚕️',
      isPremium: true,
      availability: ['Mon 9-17', 'Wed 9-17', 'Fri 9-17'],
      location: 'Bangkok',
      locationTh: 'กรุงเทพฯ'
    },
    {
      id: '2',
      name: 'Ajarn Somchai Wellness',
      nameTh: 'อาจารย์สมชาย เวลเนส',
      specialty: ['Mindfulness', 'Meditation', 'Stress Management'],
      specialtyTh: ['สติ', 'สมาธิ', 'การจัดการความเครียด'],
      bio: 'Traditional Thai mindfulness practitioner and modern psychology expert',
      bioTh: 'ผู้เชี่ยวชาญด้านสติปัฏฐานแบบไทยและจิตวิทยาสมัยใหม่',
      hourlyRate: 1800,
      rating: 4.7,
      reviews: 89,
      languages: ['Thai', 'English'],
      avatar: '🧘‍♂️',
      isPremium: false,
      availability: ['Tue 10-18', 'Thu 10-18', 'Sat 10-16'],
      location: 'Chiang Mai',
      locationTh: 'เชียงใหม่'
    },
    {
      id: '3',
      name: 'Dr. Lisa Chen',
      nameTh: 'ดร. ลิซ่า เฉิน',
      specialty: ['Youth Counseling', 'Family Therapy', 'EMDR'],
      specialtyTh: ['การให้คำปรึกษาเยาวชน', 'การบำบัดครอบครัว', 'EMDR'],
      bio: 'Specializing in young adult mental health and trauma recovery',
      bioTh: 'เชี่ยวชาญด้านสุขภาพจิตวัยรุ่นและการฟื้นฟูจากบาดแผลใจ',
      hourlyRate: 3000,
      rating: 4.8,
      reviews: 156,
      languages: ['English', 'Thai', 'Chinese'],
      avatar: '👩‍🦰',
      isPremium: true,
      availability: ['Mon 13-20', 'Wed 13-20', 'Sun 9-17'],
      location: 'Bangkok',
      locationTh: 'กรุงเทพฯ'
    }
  ];

  const specialties = [
    { id: 'all', label: language === 'th' ? 'ทั้งหมด' : 'All Specialties' },
    { id: 'anxiety', label: language === 'th' ? 'ความวิตกกังวล' : 'Anxiety' },
    { id: 'depression', label: language === 'th' ? 'ภาวะซึมเศร้า' : 'Depression' },
    { id: 'mindfulness', label: language === 'th' ? 'สติ' : 'Mindfulness' },
    { id: 'family', label: language === 'th' ? 'ครอบครัว' : 'Family Therapy' }
  ];

  const priceRanges = [
    { id: 'all', label: language === 'th' ? 'ทุกราคา' : 'All Prices' },
    { id: 'budget', label: language === 'th' ? 'ต่ำกว่า 2,000 บาท' : 'Under ฿2,000' },
    { id: 'mid', label: '฿2,000 - ฿2,500' },
    { id: 'premium', label: language === 'th' ? 'สูงกว่า 2,500 บาท' : 'Above ฿2,500' }
  ];

  const filteredTherapists = therapists.filter(therapist => {
    const specialtyMatch = selectedSpecialty === 'all' || 
      therapist.specialty.some(s => s.toLowerCase().includes(selectedSpecialty));
    
    const priceMatch = selectedPriceRange === 'all' ||
      (selectedPriceRange === 'budget' && therapist.hourlyRate < 2000) ||
      (selectedPriceRange === 'mid' && therapist.hourlyRate >= 2000 && therapist.hourlyRate <= 2500) ||
      (selectedPriceRange === 'premium' && therapist.hourlyRate > 2500);
    
    return specialtyMatch && priceMatch;
  });

  const handleBooking = (therapist: Therapist) => {
    if (therapist.isPremium) {
      // Show premium upgrade prompt
      return;
    }
    setSelectedTherapist(therapist);
    setShowBookingCalendar(true);
  };

  const handleBookingConfirm = (date: Date, timeSlot: any) => {
    toast.success(
      language === 'th' 
        ? 'จองนัดพบเรียบร้อยแล้ว!' 
        : 'Appointment booked successfully!'
    );
    setShowBookingCalendar(false);
    setSelectedTherapist(null);
  };

  const handleBookingCancel = () => {
    setShowBookingCalendar(false);
    setSelectedTherapist(null);
  };

  if (showBookingCalendar && selectedTherapist) {
    return (
      <div className="min-h-screen bg-soft-blue pb-20">
        <div className="px-6 py-4">
          <BookingCalendar
            therapist={selectedTherapist}
            onBookingConfirm={handleBookingConfirm}
            onCancel={handleBookingCancel}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-soft-blue pb-20">
      {/* Header */}
      <div className="bg-white px-6 py-4 shadow-sm">
        <h1 className={`text-2xl font-bold text-gray-800 ${language === 'th' ? 'thai-text' : ''}`}>
          {t('nav.therapist')}
        </h1>
        <p className={`text-gray-600 mt-1 ${language === 'th' ? 'thai-text' : ''}`}>
          {language === 'th' ? 'ค้นหานักจิตวิทยาที่เหมาะกับคุณ' : 'Find the right therapist for you'}
        </p>
      </div>

      {/* Filters */}
      <div className="px-6 py-4 space-y-4">
        {/* Specialty Filter */}
        <div>
          <h3 className={`text-sm font-medium text-gray-700 mb-2 ${language === 'th' ? 'thai-text' : ''}`}>
            {language === 'th' ? 'ความเชี่ยวชาญ' : 'Specialty'}
          </h3>
          <div className="flex space-x-2 overflow-x-auto">
            {specialties.map(specialty => (
              <Button
                key={specialty.id}
                onClick={() => setSelectedSpecialty(specialty.id)}
                variant={selectedSpecialty === specialty.id ? 'default' : 'outline'}
                size="sm"
                className={`whitespace-nowrap ${
                  selectedSpecialty === specialty.id 
                    ? 'bg-dark-green hover:bg-green-700' 
                    : 'bg-white hover:bg-gray-50'
                } ${language === 'th' ? 'thai-text' : ''}`}
              >
                {specialty.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Price Filter */}
        <div>
          <h3 className={`text-sm font-medium text-gray-700 mb-2 ${language === 'th' ? 'thai-text' : ''}`}>
            {language === 'th' ? 'ราคา' : 'Price Range'}
          </h3>
          <div className="flex space-x-2 overflow-x-auto">
            {priceRanges.map(range => (
              <Button
                key={range.id}
                onClick={() => setPriceRange(range.id)}
                variant={selectedPriceRange === range.id ? 'default' : 'outline'}
                size="sm"
                className={`whitespace-nowrap ${
                  selectedPriceRange === range.id 
                    ? 'bg-dark-green hover:bg-green-700' 
                    : 'bg-white hover:bg-gray-50'
                } ${language === 'th' ? 'thai-text' : ''}`}
              >
                {range.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Therapist List */}
      <div className="px-6 space-y-4">
        {filteredTherapists.map(therapist => (
          <Card key={therapist.id} className="p-4 bg-white shadow-md hover:shadow-lg transition-shadow">
            <div className="flex space-x-4">
              {/* Avatar */}
              <div className="w-16 h-16 bg-mint-green rounded-full flex items-center justify-center text-2xl relative">
                {therapist.avatar}
                {therapist.isPremium && (
                  <div className="absolute -top-1 -right-1 bg-warm-orange rounded-full p-1">
                    <Crown className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className={`font-semibold text-gray-800 ${language === 'th' ? 'thai-text' : ''}`}>
                    {language === 'th' ? therapist.nameTh : therapist.name}
                  </h3>
                  <div className="text-right">
                    <div className="font-bold text-dark-green">
                      ฿{therapist.hourlyRate.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      {language === 'th' ? 'ต่อชั่วโมง' : 'per hour'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 mb-2">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{therapist.rating}</span>
                    <span className="text-xs text-gray-500">({therapist.reviews})</span>
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <MapPin className="w-3 h-3" />
                    <span>{language === 'th' ? therapist.locationTh : therapist.location}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-2">
                  {(language === 'th' ? therapist.specialtyTh : therapist.specialty).slice(0, 3).map((spec, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {spec}
                    </Badge>
                  ))}
                </div>

                <p className={`text-sm text-gray-600 mb-3 line-clamp-2 ${language === 'th' ? 'thai-text' : ''}`}>
                  {language === 'th' ? therapist.bioTh : therapist.bio}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>{language === 'th' ? 'มีเวลาว่าง' : 'Available'}</span>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <span className={language === 'th' ? 'thai-text' : ''}>
                            {language === 'th' ? 'ดูข้อมูล' : 'View Profile'}
                          </span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle className={language === 'th' ? 'thai-text' : ''}>
                            {language === 'th' ? therapist.nameTh : therapist.name}
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <p className={`text-sm ${language === 'th' ? 'thai-text' : ''}`}>
                            {language === 'th' ? therapist.bioTh : therapist.bio}
                          </p>
                          <div>
                            <h4 className={`font-medium mb-2 ${language === 'th' ? 'thai-text' : ''}`}>
                              {language === 'th' ? 'ความเชี่ยวชาญ' : 'Specialties'}
                            </h4>
                            <div className="flex flex-wrap gap-1">
                              {(language === 'th' ? therapist.specialtyTh : therapist.specialty).map((spec, index) => (
                                <Badge key={index} variant="secondary">
                                  {spec}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className={`font-medium mb-2 ${language === 'th' ? 'thai-text' : ''}`}>
                              {language === 'th' ? 'เวลาให้บริการ' : 'Availability'}
                            </h4>
                            <div className="space-y-1">
                              {therapist.availability.map((time, index) => (
                                <div key={index} className="text-sm text-gray-600">
                                  {time}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Button
                      onClick={() => handleBooking(therapist)}
                      className="bg-dark-green hover:bg-green-700"
                      size="sm"
                    >
                      <span className={language === 'th' ? 'thai-text' : ''}>
                        {language === 'th' ? 'จองเวลา' : 'Book Now'}
                      </span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredTherapists.length === 0 && (
        <div className="text-center py-12 px-6">
          <div className="text-4xl mb-4">🔍</div>
          <p className={`text-gray-600 ${language === 'th' ? 'thai-text' : ''}`}>
            {language === 'th' 
              ? 'ไม่พบนักจิตวิทยาที่ตรงกับเงื่อนไข' 
              : 'No therapists match your criteria'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default Therapist;
