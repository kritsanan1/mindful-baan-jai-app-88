import React, { useState } from 'react';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Clock, 
  User, 
  CheckCircle2,
  AlertCircle,
  Calendar as CalendarIcon
} from 'lucide-react';
import { format, addMonths, subMonths, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

interface CalendarEvent {
  id: string;
  title: string;
  titleTh: string;
  date: Date;
  time: string;
  type: 'meditation' | 'therapy' | 'mood' | 'reminder';
  status: 'scheduled' | 'completed' | 'missed';
  therapistName?: string;
  duration?: number;
}

interface CalendarProps {
  onDateSelect?: (date: Date) => void;
  onEventCreate?: (date: Date) => void;
  showEvents?: boolean;
}

export const Calendar: React.FC<CalendarProps> = ({ 
  onDateSelect, 
  onEventCreate, 
  showEvents = true 
}) => {
  const { language } = useLanguage();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  // Mock events data
  const events: CalendarEvent[] = [
    {
      id: '1',
      title: 'Morning Meditation',
      titleTh: 'สมาธิตอนเช้า',
      date: new Date(),
      time: '07:00',
      type: 'meditation',
      status: 'completed',
      duration: 15
    },
    {
      id: '2',
      title: 'Therapy Session',
      titleTh: 'นัดพบนักจิตวิทยา',
      date: new Date(Date.now() + 24 * 60 * 60 * 1000),
      time: '14:00',
      type: 'therapy',
      status: 'scheduled',
      therapistName: 'Dr. Sarah Johnson',
      duration: 60
    },
    {
      id: '3',
      title: 'Mood Check Reminder',
      titleTh: 'แจ้งเตือนบันทึกอารมณ์',
      date: new Date(Date.now() + 48 * 60 * 60 * 1000),
      time: '20:00',
      type: 'reminder',
      status: 'scheduled'
    }
  ];

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      onDateSelect?.(date);
    }
  };

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => isSameDay(event.date, date));
  };

  const getDaysInMonth = () => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return eachDayOfInterval({ start, end });
  };

  const getEventTypeColor = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'meditation':
        return 'bg-green-100 text-green-800';
      case 'therapy':
        return 'bg-blue-100 text-blue-800';
      case 'mood':
        return 'bg-purple-100 text-purple-800';
      case 'reminder':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: CalendarEvent['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-3 h-3 text-green-600" />;
      case 'missed':
        return <AlertCircle className="w-3 h-3 text-red-600" />;
      default:
        return <Clock className="w-3 h-3 text-gray-500" />;
    }
  };

  const selectedDateEvents = getEventsForDate(selectedDate);

  return (
    <div className="space-y-4">
      {/* Calendar Header */}
      <Card className="p-4 bg-white shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-lg font-semibold text-gray-800 ${language === 'th' ? 'thai-text' : ''}`}>
            {language === 'th' ? 'ปฏิทิน' : 'Calendar'}
          </h2>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevMonth}
              className="p-2"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className={`text-sm font-medium min-w-[120px] text-center ${language === 'th' ? 'thai-text' : ''}`}>
              {format(currentMonth, 'MMMM yyyy')}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextMonth}
              className="p-2"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Calendar Component */}
        <CalendarComponent
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          month={currentMonth}
          onMonthChange={setCurrentMonth}
          className="w-full"
          modifiers={{
            hasEvents: (date) => getEventsForDate(date).length > 0
          }}
          modifiersClassNames={{
            hasEvents: "bg-mint-green/20 text-dark-green font-medium"
          }}
        />
      </Card>

      {/* Selected Date Events */}
      {showEvents && (
        <Card className="p-4 bg-white shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className={`font-semibold text-gray-800 ${language === 'th' ? 'thai-text' : ''}`}>
              {format(selectedDate, language === 'th' ? 'dd MMMM yyyy' : 'MMMM dd, yyyy')}
            </h3>
            {onEventCreate && (
              <Button
                size="sm"
                onClick={() => onEventCreate(selectedDate)}
                className="bg-dark-green hover:bg-green-700"
              >
                <Plus className="w-4 h-4 mr-1" />
                <span className={language === 'th' ? 'thai-text' : ''}>
                  {language === 'th' ? 'เพิ่ม' : 'Add'}
                </span>
              </Button>
            )}
          </div>

          {selectedDateEvents.length > 0 ? (
            <div className="space-y-3">
              {selectedDateEvents.map(event => (
                <div
                  key={event.id}
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-shrink-0">
                    {getStatusIcon(event.status)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className={`font-medium text-gray-800 text-sm ${language === 'th' ? 'thai-text' : ''}`}>
                        {language === 'th' ? event.titleTh : event.title}
                      </span>
                      <Badge className={`text-xs ${getEventTypeColor(event.type)}`}>
                        {event.type}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-xs text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{event.time}</span>
                      </div>
                      
                      {event.duration && (
                        <span>{event.duration} {language === 'th' ? 'นาที' : 'min'}</span>
                      )}
                      
                      {event.therapistName && (
                        <div className="flex items-center space-x-1">
                          <User className="w-3 h-3" />
                          <span>{event.therapistName}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <CalendarIcon className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className={`text-gray-500 text-sm ${language === 'th' ? 'thai-text' : ''}`}>
                {language === 'th' ? 'ไม่มีกิจกรรมในวันนี้' : 'No events scheduled for this day'}
              </p>
            </div>
          )}
        </Card>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="p-3 bg-white shadow-md text-center">
          <div className="text-lg font-bold text-green-600">
            {events.filter(e => e.status === 'completed').length}
          </div>
          <div className={`text-xs text-gray-600 ${language === 'th' ? 'thai-text' : ''}`}>
            {language === 'th' ? 'เสร็จแล้ว' : 'Completed'}
          </div>
        </Card>
        
        <Card className="p-3 bg-white shadow-md text-center">
          <div className="text-lg font-bold text-blue-600">
            {events.filter(e => e.status === 'scheduled').length}
          </div>
          <div className={`text-xs text-gray-600 ${language === 'th' ? 'thai-text' : ''}`}>
            {language === 'th' ? 'กำหนดไว้' : 'Scheduled'}
          </div>
        </Card>
        
        <Card className="p-3 bg-white shadow-md text-center">
          <div className="text-lg font-bold text-orange-600">
            {events.filter(e => e.type === 'meditation').length}
          </div>
          <div className={`text-xs text-gray-600 ${language === 'th' ? 'thai-text' : ''}`}>
            {language === 'th' ? 'สมาธิ' : 'Meditation'}
          </div>
        </Card>
      </div>
    </div>
  );
};