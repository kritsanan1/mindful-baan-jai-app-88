
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Shield, Lock, Eye, Database } from 'lucide-react';

interface PrivacyConsentProps {
  onAccept: () => void;
  onDecline: () => void;
}

export const PrivacyConsent: React.FC<PrivacyConsentProps> = ({ onAccept, onDecline }) => {
  const { language } = useLanguage();
  const [consents, setConsents] = useState({
    dataCollection: false,
    aiAnalysis: false,
    analytics: false,
    marketing: false
  });

  const canProceed = consents.dataCollection && consents.aiAnalysis;

  const consentItems = [
    {
      id: 'dataCollection',
      icon: Database,
      required: true,
      title: language === 'th' ? 'การเก็บข้อมูลพื้นฐาน' : 'Basic Data Collection',
      description: language === 'th' 
        ? 'เราจำเป็นต้องเก็บข้อมูลพื้นฐานเพื่อให้บริการแอปพลิเคชัน เช่น ข้อมูลการใช้งาน ประวัติการสนทนา'
        : 'We need to collect basic data to provide app services, such as usage data and conversation history'
    },
    {
      id: 'aiAnalysis',
      icon: Eye,
      required: true,
      title: language === 'th' ? 'การวิเคราะห์ด้วย AI' : 'AI Analysis',
      description: language === 'th'
        ? 'เราใช้ AI เพื่อวิเคราะห์อารมณ์และให้คำแนะนำที่เหมาะสม ข้อมูลจะถูกเข้ารหัสและปลอดภัย'
        : 'We use AI to analyze mood and provide appropriate recommendations. Data is encrypted and secure'
    },
    {
      id: 'analytics',
      icon: Shield,
      required: false,
      title: language === 'th' ? 'การวิเคราะห์การใช้งาน' : 'Usage Analytics',
      description: language === 'th'
        ? 'ช่วยเราปรับปรุงแอปให้ดีขึ้น ข้อมูลจะไม่ระบุตัวตนและไม่แชร์กับบุคคลภายนอก'
        : 'Help us improve the app. Data is anonymous and not shared with third parties'
    },
    {
      id: 'marketing',
      icon: Lock,
      required: false,
      title: language === 'th' ? 'การแจ้งข่าวสารและโปรโมชั่น' : 'Marketing Communications',
      description: language === 'th'
        ? 'รับข้อมูลข่าวสารเกี่ยวกับฟีเจอร์ใหม่และโปรโมชั่นพิเศษ'
        : 'Receive news about new features and special promotions'
    }
  ];

  const handleConsentChange = (id: string, checked: boolean) => {
    setConsents(prev => ({ ...prev, [id]: checked }));
  };

  return (
    <div className="min-h-screen bg-soft-blue flex items-center justify-center p-6">
      <Card className="w-full max-w-md p-6 bg-white shadow-lg">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-mint-green rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-dark-green" />
          </div>
          <h1 className={`text-2xl font-bold text-gray-800 mb-2 ${language === 'th' ? 'thai-text' : ''}`}>
            {language === 'th' ? 'ความเป็นส่วนตัว' : 'Privacy Consent'}
          </h1>
          <p className={`text-gray-600 text-sm ${language === 'th' ? 'thai-text' : ''}`}>
            {language === 'th' 
              ? 'เราให้ความสำคัญกับความเป็นส่วนตัวของคุณ กرุณาอ่านและเลือกการอนุญาต'
              : 'We care about your privacy. Please review and select your consent preferences'
            }
          </p>
        </div>

        <div className="space-y-4 mb-6">
          {consentItems.map(item => {
            const Icon = item.icon;
            return (
              <div key={item.id} className="border rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Icon className="w-5 h-5 text-dark-green mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className={`font-medium text-gray-800 ${language === 'th' ? 'thai-text' : ''}`}>
                        {item.title}
                      </h3>
                      {item.required && (
                        <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                          {language === 'th' ? 'จำเป็น' : 'Required'}
                        </span>
                      )}
                    </div>
                    <p className={`text-sm text-gray-600 mb-3 ${language === 'th' ? 'thai-text' : ''}`}>
                      {item.description}
                    </p>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={consents[item.id as keyof typeof consents]}
                        onCheckedChange={(checked) => handleConsentChange(item.id, checked as boolean)}
                        id={item.id}
                      />
                      <label htmlFor={item.id} className={`text-sm font-medium ${language === 'th' ? 'thai-text' : ''}`}>
                        {language === 'th' ? 'ฉันยินยอม' : 'I consent'}
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="space-y-3">
          <Button
            onClick={onAccept}
            disabled={!canProceed}
            className="w-full bg-dark-green hover:bg-green-700 disabled:opacity-50"
          >
            <span className={language === 'th' ? 'thai-text' : ''}>
              {language === 'th' ? 'ยอมรับและดำเนินการต่อ' : 'Accept and Continue'}
            </span>
          </Button>
          
          <Button
            onClick={onDecline}
            variant="outline"
            className="w-full border-gray-300 text-gray-600 hover:bg-gray-50"
          >
            <span className={language === 'th' ? 'thai-text' : ''}>
              {language === 'th' ? 'ปฏิเสธ' : 'Decline'}
            </span>
          </Button>
        </div>

        <p className={`text-xs text-gray-500 text-center mt-4 ${language === 'th' ? 'thai-text' : ''}`}>
          {language === 'th'
            ? 'เป็นไปตาม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล (PDPA) และ GDPR'
            : 'Compliant with PDPA (Thailand) and GDPR regulations'
          }
        </p>
      </Card>
    </div>
  );
};
