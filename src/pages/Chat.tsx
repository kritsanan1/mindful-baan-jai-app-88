
import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mic, Send, Heart, Save } from 'lucide-react';
import { toast } from 'sonner';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  moodScore?: number;
}

const Chat = () => {
  const { t, language } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: language === 'th' 
        ? 'สวัสดีค่ะ! ฉันพร้อมจะรับฟังและช่วยเหลือคุณ วันนี้คุณรู้สึกอย่างไรบ้างคะ?' 
        : 'Hello! I\'m here to listen and help. How are you feeling today?',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const analyzeMood = (text: string): number => {
    // Simple mood analysis based on keywords
    const positiveWords = ['happy', 'good', 'great', 'wonderful', 'excited', 'ดี', 'สุข', 'ดีใจ', 'มีความสุข'];
    const negativeWords = ['sad', 'bad', 'terrible', 'depressed', 'angry', 'เศร้า', 'แย่', 'โกรธ', 'หงุดหงิด'];
    
    const words = text.toLowerCase().split(' ');
    let score = 5; // neutral
    
    words.forEach(word => {
      if (positiveWords.includes(word)) score += 1;
      if (negativeWords.includes(word)) score -= 1;
    });
    
    return Math.max(1, Math.min(10, score));
  };

  const generateAIResponse = (userMessage: string, moodScore: number): string => {
    if (language === 'th') {
      if (moodScore >= 7) {
        return 'ดีใจที่ได้ยินว่าคุณรู้สึกดี! คุณต้องการทำสมาธิสั้นๆ เพื่อรักษาอารมณ์ดีนี้ไว้ไหมคะ?';
      } else if (moodScore >= 4) {
        return 'เข้าใจความรู้สึกของคุณค่ะ บางทีการหายใจลึกๆ 5 นาที อาจจะช่วยให้คุณรู้สึกดีขึ้น ลองไหมคะ?';
      } else {
        return 'ฉันเข้าใจว่าคุณรู้สึกหนักใจ อยากลองทำกิจกรรมผ่อนคลายหรือพูดคุยกับนักจิตวิทยาไหมคะ?';
      }
    } else {
      if (moodScore >= 7) {
        return 'I\'m glad to hear you\'re feeling good! Would you like to do a short meditation to maintain this positive mood?';
      } else if (moodScore >= 4) {
        return 'I understand how you\'re feeling. Perhaps a 5-minute breathing exercise could help you feel better. Would you like to try?';
      } else {
        return 'I can see you\'re going through a tough time. Would you like to try a relaxation activity or speak with a therapist?';
      }
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI processing delay
    setTimeout(() => {
      const moodScore = analyzeMood(inputText);
      const aiResponse = generateAIResponse(inputText, moodScore);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        isUser: false,
        timestamp: new Date(),
        moodScore
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSaveMood = () => {
    const lastAiMessage = messages.filter(m => !m.isUser && m.moodScore).pop();
    if (lastAiMessage?.moodScore) {
      toast.success(
        language === 'th' 
          ? `บันทึกอารมณ์แล้ว: ${lastAiMessage.moodScore}/10`
          : `Mood saved: ${lastAiMessage.moodScore}/10`
      );
    }
  };

  const handleVoiceInput = () => {
    setIsRecording(!isRecording);
    // Voice recording functionality would be implemented here
    toast.info(
      language === 'th' 
        ? 'ฟีเจอร์บันทึกเสียงกำลังพัฒนา'
        : 'Voice recording feature coming soon'
    );
  };

  return (
    <div className="flex flex-col h-screen bg-soft-blue">
      {/* Header */}
      <div className="bg-white px-6 py-4 shadow-sm border-b">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-mint-green rounded-full flex items-center justify-center">
            <Heart className="w-5 h-5 text-dark-green" />
          </div>
          <div>
            <h1 className={`font-semibold text-lg ${language === 'th' ? 'thai-text' : ''}`}>
              {t('nav.chat')}
            </h1>
            <p className={`text-sm text-gray-500 ${language === 'th' ? 'thai-text' : ''}`}>
              {language === 'th' ? 'AI ผู้ช่วยดูแลจิตใจ' : 'Your AI Mental Health Companion'}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-4 rounded-2xl ${
              message.isUser 
                ? 'bg-dark-green text-white' 
                : 'bg-white shadow-md border border-gray-100'
            }`}>
              <p className={`text-sm ${language === 'th' ? 'thai-text' : ''}`}>
                {message.text}
              </p>
              {message.moodScore && (
                <div className="mt-2 flex items-center space-x-2">
                  <span className="text-xs text-gray-500">
                    {language === 'th' ? 'คะแนนอารมณ์:' : 'Mood Score:'}
                  </span>
                  <div className="flex space-x-1">
                    {[...Array(10)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full ${
                          i < message.moodScore! ? 'bg-dark-green' : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-medium">{message.moodScore}/10</span>
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white p-4 rounded-2xl shadow-md border border-gray-100">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      <div className="px-4 py-2">
        <div className="flex space-x-2 overflow-x-auto">
          <Button
            onClick={handleSaveMood}
            size="sm"
            className="bg-mint-green text-dark-green hover:bg-mint-green/80 whitespace-nowrap"
          >
            <Save className="w-4 h-4 mr-1" />
            <span className={language === 'th' ? 'thai-text' : ''}>
              {language === 'th' ? 'บันทึกอารมณ์' : 'Save Mood'}
            </span>
          </Button>
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white px-4 py-4 border-t">
        <div className="flex items-center space-x-3">
          <div className="flex-1 flex items-center bg-gray-100 rounded-full px-4 py-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={
                language === 'th' 
                  ? 'พิมพ์ข้อความของคุณ...' 
                  : 'Type your message...'
              }
              className={`flex-1 bg-transparent outline-none text-sm ${language === 'th' ? 'thai-text' : ''}`}
            />
            <button
              onClick={handleVoiceInput}
              className={`p-1 rounded-full transition-colors ${
                isRecording ? 'bg-red-100 text-red-600' : 'text-gray-500 hover:text-dark-green'
              }`}
            >
              <Mic className="w-4 h-4" />
            </button>
          </div>
          <Button
            onClick={handleSendMessage}
            size="sm"
            className="bg-dark-green hover:bg-green-700 rounded-full p-2"
            disabled={!inputText.trim()}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
