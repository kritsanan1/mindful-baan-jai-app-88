import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Clock, 
  User, 
  Calendar as CalendarIcon,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { format, isSameDay, addDays, isAfter, isBefore } from 'date-fns';

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
  therapistId: string;
}

interface Therapist {
  id: string;
  name: string;
  nameTh: string;
  avatar: string;
  hourlyRate: number;
}

interface BookingCalendarProps {
  therapist: Therapist;
  onBookingConfirm: (date: Date, timeSlot: TimeSlot) => void;
  onCancel: () => void;
}

export const BookingCalendar: React.FC<BookingCalendarProps> = ({ 
  therapist, 
  onBookingConfirm, 
  onCancel 
}) => {
  const { language } = useLanguage();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot>();

  // Mock time slots data
  const timeSlots: TimeSlot[] = [
    { id: '1', time: '09:00', available: true, therapistId: therapist.id },
    { id: '2', time: '10:00', available: false, therapistId: therapist.id },
    { id: '3', time: '11:00', available: true, therapistId: therapist.id },
    { id: '4', time: '13:00', available: true, therapistId: therapist.id },
    { id: '5', time: '14:00', available: true, therapistId: therapist.id },
    { id: '6', time: '15:00', available: false, therapistId: therapist.id },
    { id: '7', time: '16:00', available: true, therapistId: therapist.id },
    { id: '8', time: '17:00', available: true, therapistId: therapist.id }
  ];

  const availableSlots = timeSlots.filter(slot => slot.available);
  const bookedSlots = timeSlots.filter(slot => !slot.available);

  const handleDateSelect = (date: Date | undefined) => {
    if (date && isAfter(date, new Date())) {
      setSelectedDate(date);
      setSelectedTimeSlot(undefined);
    }
  };

  const handleTimeSlotSelect = (slot: TimeSlot) => {
    if (slot.available) {
      setSelectedTimeSlot(slot);
    }
  };

  const handleConfirmBooking = () => {
    if (selectedDate && selectedTimeSlot) {
      onBookingConfirm(selectedDate, selectedTimeSlot);
    }
  };

  const isDateDisabled = (date: Date) => {
    return isBefore(date, new Date()) || isSameDay(date, new Date());
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-4 bg-white shadow-md">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-mint-green rounded-full flex items-center justify-center text-2xl">
            {therapist.avatar}
          </div>
          
          <div className="flex-1">
            <h2 className={`text-lg font-semibold text-gray-800 ${language === 'th' ? 'thai-text' : ''}`}>
              {language === 'th' ? 'จองนัดพบ' : 'Book Appointment'}
            </h2>
            <p className={`text-gray-600 ${language === 'th' ? 'thai-text' : ''}`}>
              {language === 'th' ? therapist.nameTh : therapist.name}
            </p>
            <p className="text-sm text-dark-green font-medium">
              ฿{therapist.hourlyRate.toLocaleString()} {language === 'th' ? 'ต่อชั่วโมง' : 'per hour'}
            </p>
          </div>
        </div>
      </Card>

      {/* Calendar Selection */}
      <Card className="p-4 bg-white shadow-md">
        <h3 className={`font-semibold text-gray-800 mb-4 ${language === 'th' ? 'thai-text' : ''}`}>
          {language === 'th' ? 'เลือกวันที่' : 'Select Date'}
        </h3>
        
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          disabled={isDateDisabled}
          className="w-full"
          fromDate={addDays(new Date(), 1)}
        />
      </Card>

      {/* Time Slots */}
      {selectedDate && (
        <Card className="p-4 bg-white shadow-md">
          <h3 className={`font-semibold text-gray-800 mb-4 ${language === 'th' ? 'thai-text' : ''}`}>
            {language === 'th' ? 'เลือกเวลา' : 'Select Time'}
          </h3>
          
          <div className="grid grid-cols-2 gap-3">
            {timeSlots.map(slot => (
              <Button
                key={slot.id}
                variant={selectedTimeSlot?.id === slot.id ? 'default' : 'outline'}
                onClick={() => handleTimeSlotSelect(slot)}
                disabled={!slot.available}
                className={`p-3 h-auto flex items-center justify-center ${
                  selectedTimeSlot?.id === slot.id 
                    ? 'bg-dark-green hover:bg-green-700' 
                    : slot.available 
                      ? 'hover:bg-gray-50' 
                      : 'opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>{slot.time}</span>
                  {!slot.available && (
                    <Badge variant="secondary" className="text-xs ml-2">
                      {language === 'th' ? 'ไม่ว่าง' : 'Booked'}
                    </Badge>
                  )}
                </div>
              </Button>
            ))}
          </div>
        </Card>
      )}

      {/* Booking Summary */}
      {selectedDate && selectedTimeSlot && (
        <Card className="p-4 bg-white shadow-md border-l-4 border-l-dark-green">
          <h3 className={`font-semibold text-gray-800 mb-3 ${language === 'th' ? 'thai-text' : ''}`}>
            {language === 'th' ? 'สรุปการจอง' : 'Booking Summary'}
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <CalendarIcon className="w-4 h-4 text-gray-500" />
              <span className={`text-sm ${language === 'th' ? 'thai-text' : ''}`}>
                {format(selectedDate, language === 'th' ? 'dd MMMM yyyy' : 'MMMM dd, yyyy')}
              </span>
            </div>
            
            <div className="flex items-center space-x-3">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-sm">{selectedTimeSlot.time} - {
                parseInt(selectedTimeSlot.time.split(':')[0]) + 1
              }:00</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <User className="w-4 h-4 text-gray-500" />
              <span className={`text-sm ${language === 'th' ? 'thai-text' : ''}`}>
                {language === 'th' ? therapist.nameTh : therapist.name}
              </span>
            </div>
            
            <div className="border-t pt-3 mt-3">
              <div className="flex justify-between items-center">
                <span className={`font-medium ${language === 'th' ? 'thai-text' : ''}`}>
                  {language === 'th' ? 'ราคารวม:' : 'Total:'}
                </span>
                <span className="font-bold text-lg text-dark-green">
                  ฿{therapist.hourlyRate.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <Button
          variant="outline"
          onClick={onCancel}
          className="flex-1"
        >
          <span className={language === 'th' ? 'thai-text' : ''}>
            {language === 'th' ? 'ยกเลิก' : 'Cancel'}
          </span>
        </Button>
        
        <Button
          onClick={handleConfirmBooking}
          disabled={!selectedDate || !selectedTimeSlot}
          className="flex-1 bg-dark-green hover:bg-green-700"
        >
          <CheckCircle2 className="w-4 h-4 mr-2" />
          <span className={language === 'th' ? 'thai-text' : ''}>
            {language === 'th' ? 'ยืนยันการจอง' : 'Confirm Booking'}
          </span>
        </Button>
      </div>

      {/* Booking Guidelines */}
      <Card className="p-4 bg-blue-50 border border-blue-200">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-2">
            <h4 className={`font-medium text-blue-800 ${language === 'th' ? 'thai-text' : ''}`}>
              {language === 'th' ? 'ข้อมูลสำคัญ' : 'Important Information'}
            </h4>
            <ul className={`text-sm text-blue-700 space-y-1 ${language === 'th' ? 'thai-text' : ''}`}>
              <li>• {language === 'th' ? 'กรุณามาก่อนเวลานัด 5 นาที' : 'Please arrive 5 minutes early'}</li>
              <li>• {language === 'th' ? 'สามารถยกเลิกได้ก่อนเวลานัด 24 ชั่วโมง' : 'Cancellation allowed 24 hours prior'}</li>
              <li>• {language === 'th' ? 'เซสชั่นจะใช้เวลา 60 นาที' : 'Session duration is 60 minutes'}</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};