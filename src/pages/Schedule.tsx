import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Calendar } from '@/components/calendar/Calendar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  User,
  Phone,
  Video,
  Edit,
  Trash2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface ScheduleEvent {
  id: string;
  title: string;
  titleTh: string;
  description?: string;
  descriptionTh?: string;
  date: Date;
  time: string;
  endTime: string;
  type: 'therapy' | 'meditation' | 'appointment' | 'reminder' | 'personal';
  status: 'scheduled' | 'completed' | 'cancelled' | 'missed';
  location?: string;
  locationTh?: string;
  isOnline: boolean;
  therapistName?: string;
  therapistId?: string;
  reminderMinutes: number;
  priority: 'low' | 'medium' | 'high';
}

const Schedule = () => {
  const { language } = useLanguage();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [editingEvent, setEditingEvent] = useState<ScheduleEvent | null>(null);

  // Mock events data
  const [events, setEvents] = useState<ScheduleEvent[]>([
    {
      id: '1',
      title: 'Therapy Session with Dr. Sarah',
      titleTh: 'นัดพบจิตแพทย์กับ ดร.ซาร่าห์',
      description: 'Weekly therapy session focusing on anxiety management',
      descriptionTh: 'การบำบัดรายสัปดาห์ เน้นการจัดการความวิตกกังวล',
      date: new Date(),
      time: '14:00',
      endTime: '15:00',
      type: 'therapy',
      status: 'scheduled',
      location: 'Bangkok Mental Health Clinic',
      locationTh: 'คลินิกสุขภาพจิตกรุงเทพ',
      isOnline: false,
      therapistName: 'Dr. Sarah Johnson',
      therapistId: 'dr-sarah-1',
      reminderMinutes: 30,
      priority: 'high'
    },
    {
      id: '2',
      title: 'Morning Meditation',
      titleTh: 'สมาธิตอนเช้า',
      description: 'Daily mindfulness practice',
      descriptionTh: 'การฝึกสติประจำวัน',
      date: new Date(),
      time: '07:00',
      endTime: '07:15',
      type: 'meditation',
      status: 'completed',
      isOnline: true,
      reminderMinutes: 15,
      priority: 'medium'
    },
    {
      id: '3',
      title: 'Online Consultation',
      titleTh: 'ปรึกษาออนไลน์',
      description: 'Follow-up session via video call',
      descriptionTh: 'การติดตามผลผ่านวิดีโอคอล',
      date: new Date(Date.now() + 24 * 60 * 60 * 1000),
      time: '16:30',
      endTime: '17:30',
      type: 'therapy',
      status: 'scheduled',
      isOnline: true,
      therapistName: 'Ajarn Somchai',
      therapistId: 'ajarn-somchai-1',
      reminderMinutes: 60,
      priority: 'high'
    }
  ]);

  const [newEvent, setNewEvent] = useState<Partial<ScheduleEvent>>({
    type: 'appointment',
    isOnline: false,
    reminderMinutes: 30,
    priority: 'medium',
    status: 'scheduled'
  });

  const getEventTypeColor = (type: ScheduleEvent['type']) => {
    switch (type) {
      case 'therapy':
        return 'bg-blue-100 text-blue-800';
      case 'meditation':
        return 'bg-green-100 text-green-800';
      case 'appointment':
        return 'bg-purple-100 text-purple-800';
      case 'reminder':
        return 'bg-orange-100 text-orange-800';
      case 'personal':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: ScheduleEvent['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-600';
      case 'cancelled':
        return 'text-red-600';
      case 'missed':
        return 'text-orange-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: ScheduleEvent['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'cancelled':
      case 'missed':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const handleCreateEvent = () => {
    if (!newEvent.title || !selectedDate || !newEvent.time) {
      toast.error(language === 'th' ? 'กรุณากรอกข้อมูลให้ครบถ้วน' : 'Please fill in all required fields');
      return;
    }

    const event: ScheduleEvent = {
      id: Date.now().toString(),
      title: newEvent.title!,
      titleTh: newEvent.titleTh || newEvent.title!,
      description: newEvent.description,
      descriptionTh: newEvent.descriptionTh,
      date: selectedDate,
      time: newEvent.time!,
      endTime: newEvent.endTime || newEvent.time!,
      type: newEvent.type!,
      status: 'scheduled',
      location: newEvent.location,
      locationTh: newEvent.locationTh,
      isOnline: newEvent.isOnline!,
      therapistName: newEvent.therapistName,
      therapistId: newEvent.therapistId,
      reminderMinutes: newEvent.reminderMinutes!,
      priority: newEvent.priority!
    };

    setEvents([...events, event]);
    setNewEvent({
      type: 'appointment',
      isOnline: false,
      reminderMinutes: 30,
      priority: 'medium',
      status: 'scheduled'
    });
    setShowCreateEvent(false);
    toast.success(language === 'th' ? 'เพิ่มกิจกรรมแล้ว' : 'Event created successfully');
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(events.filter(e => e.id !== eventId));
    toast.success(language === 'th' ? 'ลบกิจกรรมแล้ว' : 'Event deleted');
  };

  const handleStatusChange = (eventId: string, newStatus: ScheduleEvent['status']) => {
    setEvents(events.map(e => 
      e.id === eventId ? { ...e, status: newStatus } : e
    ));
    toast.success(language === 'th' ? 'อัปเดตสถานะแล้ว' : 'Status updated');
  };

  const todayEvents = events.filter(event => 
    event.date.toDateString() === selectedDate.toDateString()
  ).sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div className="min-h-screen bg-soft-blue pb-20">
      {/* Header */}
      <div className="bg-white px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-2xl font-bold text-gray-800 ${language === 'th' ? 'thai-text' : ''}`}>
              {language === 'th' ? 'ตารางนัด' : 'Schedule'}
            </h1>
            <p className={`text-gray-600 mt-1 ${language === 'th' ? 'thai-text' : ''}`}>
              {language === 'th' ? 'จัดการนัดหมายและกิจกรรม' : 'Manage your appointments and activities'}
            </p>
          </div>
          
          <Dialog open={showCreateEvent} onOpenChange={setShowCreateEvent}>
            <DialogTrigger asChild>
              <Button className="bg-dark-green hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" />
                <span className={language === 'th' ? 'thai-text' : ''}>
                  {language === 'th' ? 'เพิ่ม' : 'Add'}
                </span>
              </Button>
            </DialogTrigger>
            
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className={language === 'th' ? 'thai-text' : ''}>
                  {language === 'th' ? 'เพิ่มกิจกรรมใหม่' : 'Add New Event'}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title" className={language === 'th' ? 'thai-text' : ''}>
                    {language === 'th' ? 'ชื่อกิจกรรม' : 'Event Title'}
                  </Label>
                  <Input
                    id="title"
                    value={newEvent.title || ''}
                    onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                    placeholder={language === 'th' ? 'ระบุชื่อกิจกรรม' : 'Enter event title'}
                  />
                </div>
                
                <div>
                  <Label htmlFor="type" className={language === 'th' ? 'thai-text' : ''}>
                    {language === 'th' ? 'ประเภท' : 'Type'}
                  </Label>
                  <Select value={newEvent.type} onValueChange={(value) => setNewEvent({...newEvent, type: value as any})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="therapy">{language === 'th' ? 'การบำบัด' : 'Therapy'}</SelectItem>
                      <SelectItem value="meditation">{language === 'th' ? 'สมาธิ' : 'Meditation'}</SelectItem>
                      <SelectItem value="appointment">{language === 'th' ? 'นัดหมาย' : 'Appointment'}</SelectItem>
                      <SelectItem value="reminder">{language === 'th' ? 'การแจ้งเตือน' : 'Reminder'}</SelectItem>
                      <SelectItem value="personal">{language === 'th' ? 'ส่วนตัว' : 'Personal'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="time" className={language === 'th' ? 'thai-text' : ''}>
                      {language === 'th' ? 'เวลาเริ่ม' : 'Start Time'}
                    </Label>
                    <Input
                      id="time"
                      type="time"
                      value={newEvent.time || ''}
                      onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="endTime" className={language === 'th' ? 'thai-text' : ''}>
                      {language === 'th' ? 'เวลาสิ้นสุด' : 'End Time'}
                    </Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={newEvent.endTime || ''}
                      onChange={(e) => setNewEvent({...newEvent, endTime: e.target.value})}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="description" className={language === 'th' ? 'thai-text' : ''}>
                    {language === 'th' ? 'รายละเอียด' : 'Description'}
                  </Label>
                  <Textarea
                    id="description"
                    value={newEvent.description || ''}
                    onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                    placeholder={language === 'th' ? 'รายละเอียดเพิ่มเติม' : 'Additional details'}
                    rows={3}
                  />
                </div>
                
                <div className="flex justify-end space-x-3">
                  <Button variant="outline" onClick={() => setShowCreateEvent(false)}>
                    <span className={language === 'th' ? 'thai-text' : ''}>
                      {language === 'th' ? 'ยกเลิก' : 'Cancel'}
                    </span>
                  </Button>
                  <Button onClick={handleCreateEvent} className="bg-dark-green hover:bg-green-700">
                    <span className={language === 'th' ? 'thai-text' : ''}>
                      {language === 'th' ? 'บันทึก' : 'Save'}
                    </span>
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="px-6 py-4 space-y-6">
        {/* Calendar */}
        <Calendar 
          onDateSelect={setSelectedDate}
          onEventCreate={(date) => {
            setSelectedDate(date);
            setShowCreateEvent(true);
          }}
          showEvents={false}
        />

        {/* Daily Events */}
        <Card className="p-4 bg-white shadow-md">
          <h3 className={`font-semibold text-gray-800 mb-4 ${language === 'th' ? 'thai-text' : ''}`}>
            {format(selectedDate, language === 'th' ? 'dd MMMM yyyy' : 'MMMM dd, yyyy')}
          </h3>
          
          {todayEvents.length > 0 ? (
            <div className="space-y-3">
              {todayEvents.map(event => (
                <div key={event.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        {getStatusIcon(event.status)}
                        <h4 className={`font-medium text-gray-800 ${language === 'th' ? 'thai-text' : ''}`}>
                          {language === 'th' ? event.titleTh : event.title}
                        </h4>
                        <Badge className={`text-xs ${getEventTypeColor(event.type)}`}>
                          {event.type}
                        </Badge>
                      </div>
                      
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-3 h-3" />
                          <span>{event.time} - {event.endTime}</span>
                        </div>
                        
                        {event.location && (
                          <div className="flex items-center space-x-2">
                            {event.isOnline ? (
                              <Video className="w-3 h-3" />
                            ) : (
                              <MapPin className="w-3 h-3" />
                            )}
                            <span className={language === 'th' ? 'thai-text' : ''}>
                              {event.isOnline ? 'Online' : (language === 'th' ? event.locationTh : event.location)}
                            </span>
                          </div>
                        )}
                        
                        {event.therapistName && (
                          <div className="flex items-center space-x-2">
                            <User className="w-3 h-3" />
                            <span>{event.therapistName}</span>
                          </div>
                        )}
                        
                        {event.description && (
                          <p className={`text-xs mt-2 ${language === 'th' ? 'thai-text' : ''}`}>
                            {language === 'th' ? event.descriptionTh : event.description}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {event.status === 'scheduled' && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusChange(event.id, 'completed')}
                            className="text-green-600 border-green-200 hover:bg-green-50"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusChange(event.id, 'cancelled')}
                            className="text-red-600 border-red-200 hover:bg-red-50"
                          >
                            <AlertCircle className="w-3 h-3" />
                          </Button>
                        </>
                      )}
                      
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteEvent(event.id)}
                        className="text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
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
      </div>
    </div>
  );
};

export default Schedule;