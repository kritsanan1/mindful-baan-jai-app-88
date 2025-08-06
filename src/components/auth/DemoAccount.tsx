import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserCheck, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const DemoAccount: React.FC = () => {
  const { language } = useLanguage();
  const { toast } = useToast();

  const signInAsDemo = async () => {
    try {
      // Demo account credentials
      const demoEmail = 'demo@baanjai.app';
      const demoPassword = 'demo123456';

      const { data, error } = await supabase.auth.signInWithPassword({
        email: demoEmail,
        password: demoPassword,
      });

      if (error) {
        // If demo account doesn't exist, create it
        if (error.message.includes('Invalid login credentials')) {
          const { error: signUpError } = await supabase.auth.signUp({
            email: demoEmail,
            password: demoPassword,
            options: {
              data: {
                full_name: language === 'th' ? 'ผู้ใช้ทดลอง' : 'Demo User',
                is_demo: true,
              }
            }
          });

          if (signUpError) throw signUpError;

          // Sign in after creation
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email: demoEmail,
            password: demoPassword,
          });

          if (signInError) throw signInError;
        } else {
          throw error;
        }
      }

      toast({
        title: language === 'th' ? 'เข้าสู่ระบบสำเร็จ' : 'Demo Access Granted',
        description: language === 'th' 
          ? 'ยินดีต้อนรับสู่บัญชีทดลอง!' 
          : 'Welcome to the demo experience!',
      });

    } catch (error: any) {
      console.error('Demo login error:', error);
      toast({
        title: language === 'th' ? 'ข้อผิดพลาด' : 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="bg-gradient-to-br from-mint-green/20 to-soft-blue/30 border-mint-green/30">
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-dark-green to-mint-green rounded-full flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <CardTitle className={`text-xl ${language === 'th' ? 'thai-text' : ''}`}>
          {language === 'th' ? 'ทดลองใช้งาน' : 'Try Demo'}
        </CardTitle>
        <CardDescription className={`${language === 'th' ? 'thai-text' : ''}`}>
          {language === 'th' 
            ? 'สำรวจฟีเจอร์ทั้งหมดด้วยบัญชีทดลอง'
            : 'Explore all features with a demo account'
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className={`text-sm text-muted-foreground ${language === 'th' ? 'thai-text' : ''}`}>
            {language === 'th' ? 'ฟีเจอร์ที่สามารถทดลอง:' : 'Demo includes:'}
          </p>
          <ul className={`text-sm space-y-1 text-muted-foreground ${language === 'th' ? 'thai-text' : ''}`}>
            <li>• {language === 'th' ? 'การแชทกับ AI' : 'AI Chat conversations'}</li>
            <li>• {language === 'th' ? 'การติดตามอารมณ์' : 'Mood tracking'}</li>
            <li>• {language === 'th' ? 'การเชื่อมต่อสมาร์ทวอทช์' : 'Smart watch integration'}</li>
            <li>• {language === 'th' ? 'การวิเคราะห์สุขภาพ' : 'Health analytics'}</li>
          </ul>
        </div>
        
        <Button 
          onClick={signInAsDemo}
          className="w-full bg-gradient-to-r from-dark-green to-mint-green hover:from-green-700 hover:to-green-500"
        >
          <UserCheck className="w-4 h-4 mr-2" />
          <span className={language === 'th' ? 'thai-text' : ''}>
            {language === 'th' ? 'เข้าสู่ระบบทดลอง' : 'Try Demo Account'}
          </span>
        </Button>
        
        <p className={`text-xs text-center text-muted-foreground ${language === 'th' ? 'thai-text' : ''}`}>
          {language === 'th' 
            ? 'ข้อมูลจะถูกรีเซ็ตทุก 24 ชั่วโมง'
            : 'Demo data resets every 24 hours'
          }
        </p>
      </CardContent>
    </Card>
  );
};