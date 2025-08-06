import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, Lock, User, Heart } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    confirmPassword: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      toast({
        title: language === 'th' ? 'เข้าสู่ระบบสำเร็จ' : 'Welcome back!',
        description: language === 'th' ? 'ยินดีต้อนรับกลับ' : 'Successfully signed in',
      });

      onSuccess?.();
      onClose();
    } catch (error: any) {
      toast({
        title: language === 'th' ? 'เข้าสู่ระบบไม่สำเร็จ' : 'Sign in failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: language === 'th' ? 'รหัสผ่านไม่ตรงกัน' : 'Passwords do not match',
        description: language === 'th' ? 'กรุณาตรวจสอบรหัสผ่านอีกครั้ง' : 'Please check your passwords',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
          }
        }
      });

      if (error) throw error;

      // Create profile
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            full_name: formData.fullName,
            preferred_language: language,
            onboarding_completed: false,
            premium_member: false,
          });

        if (profileError) {
          console.error('Profile creation error:', profileError);
        }
      }

      toast({
        title: language === 'th' ? 'สมัครสมาชิกสำเร็จ' : 'Account created!',
        description: language === 'th' ? 'ยินดีต้อนรับสู่บ้านใจ' : 'Welcome to Baan Jai',
      });

      onSuccess?.();
      onClose();
    } catch (error: any) {
      toast({
        title: language === 'th' ? 'สมัครสมาชิกไม่สำเร็จ' : 'Sign up failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Heart className="w-6 h-6 text-primary" />
              <span className={language === 'th' ? 'thai-text' : ''}>
                บ้านใจ • Baan Jai
              </span>
            </div>
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'signin' | 'signup')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin" className={language === 'th' ? 'thai-text' : ''}>
              {language === 'th' ? 'เข้าสู่ระบบ' : 'Sign In'}
            </TabsTrigger>
            <TabsTrigger value="signup" className={language === 'th' ? 'thai-text' : ''}>
              {language === 'th' ? 'สมัครสมาชิก' : 'Sign Up'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <Card>
              <CardHeader>
                <CardTitle className={`text-center ${language === 'th' ? 'thai-text' : ''}`}>
                  {language === 'th' ? 'เข้าสู่ระบบ' : 'Welcome Back'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email" className={language === 'th' ? 'thai-text' : ''}>
                      {language === 'th' ? 'อีเมล' : 'Email'}
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signin-email"
                        type="email"
                        placeholder={language === 'th' ? 'อีเมลของคุณ' : 'your@email.com'}
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signin-password" className={language === 'th' ? 'thai-text' : ''}>
                      {language === 'th' ? 'รหัสผ่าน' : 'Password'}
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signin-password"
                        type="password"
                        placeholder={language === 'th' ? 'รหัสผ่าน' : 'Password'}
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        <span className={language === 'th' ? 'thai-text' : ''}>
                          {language === 'th' ? 'กำลังเข้าสู่ระบบ...' : 'Signing in...'}
                        </span>
                      </>
                    ) : (
                      <span className={language === 'th' ? 'thai-text' : ''}>
                        {language === 'th' ? 'เข้าสู่ระบบ' : 'Sign In'}
                      </span>
                    )}
                  </Button>
                </form>

                {/* Demo Account Section */}
                <div className="mt-6 pt-4 border-t">
                  <div className="text-center mb-4">
                    <p className={`text-sm text-muted-foreground ${language === 'th' ? 'thai-text' : ''}`}>
                      {language === 'th' ? 'หรือทดลองใช้งาน' : 'Or try the demo'}
                    </p>
                  </div>
                  {/* DemoAccount component would go here if we had imported it */}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle className={`text-center ${language === 'th' ? 'thai-text' : ''}`}>
                  {language === 'th' ? 'สมัครสมาชิก' : 'Create Account'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name" className={language === 'th' ? 'thai-text' : ''}>
                      {language === 'th' ? 'ชื่อ-นามสกุล' : 'Full Name'}
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder={language === 'th' ? 'ชื่อ-นามสกุล' : 'Your full name'}
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className={language === 'th' ? 'thai-text' : ''}>
                      {language === 'th' ? 'อีเมล' : 'Email'}
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder={language === 'th' ? 'อีเมลของคุณ' : 'your@email.com'}
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className={language === 'th' ? 'thai-text' : ''}>
                      {language === 'th' ? 'รหัสผ่าน' : 'Password'}
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder={language === 'th' ? 'รหัสผ่าน' : 'Password'}
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password" className={language === 'th' ? 'thai-text' : ''}>
                      {language === 'th' ? 'ยืนยันรหัสผ่าน' : 'Confirm Password'}
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder={language === 'th' ? 'ยืนยันรหัสผ่าน' : 'Confirm password'}
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        <span className={language === 'th' ? 'thai-text' : ''}>
                          {language === 'th' ? 'กำลังสมัครสมาชิก...' : 'Creating account...'}
                        </span>
                      </>
                    ) : (
                      <span className={language === 'th' ? 'thai-text' : ''}>
                        {language === 'th' ? 'สมัครสมาชิก' : 'Create Account'}
                      </span>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <p className={`text-xs text-center text-muted-foreground mt-4 ${language === 'th' ? 'thai-text' : ''}`}>
          {language === 'th'
            ? 'การสมัครสมาชิกหมายความว่าคุณยอมรับเงื่อนไขการใช้งานและนโยบายความเป็นส่วนตัว'
            : 'By signing up, you agree to our Terms of Service and Privacy Policy'
          }
        </p>
      </DialogContent>
    </Dialog>
  );
};