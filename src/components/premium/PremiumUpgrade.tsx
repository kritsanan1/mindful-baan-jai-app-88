
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crown, Check, Star, Zap, Heart, Users } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface PremiumUpgradeProps {
  onUpgrade?: () => void;
  showAsModal?: boolean;
}

export const PremiumUpgrade: React.FC<PremiumUpgradeProps> = ({ onUpgrade, showAsModal = false }) => {
  const { language } = useLanguage();
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');

  const premiumFeatures = [
    {
      icon: Zap,
      title: language === 'th' ? 'AI ไม่จำกัด' : 'Unlimited AI Chat',
      description: language === 'th' ? 'สนทนากับ AI ได้ไม่จำกัด' : 'Chat with AI without limits'
    },
    {
      icon: Heart,
      title: language === 'th' ? 'เนื้อหาพิเศษ' : 'Premium Content',
      description: language === 'th' ? 'สมาธิและบทความเฉพาะสมาชิก' : 'Exclusive meditations and articles'
    },
    {
      icon: Users,
      title: language === 'th' ? 'นักจิตวิทยาพิเศษ' : 'Premium Therapists',
      description: language === 'th' ? 'เข้าถึงนักจิตวิทยาชั้นนำ' : 'Access to top-rated therapists'
    },
    {
      icon: Star,
      title: language === 'th' ? 'วิเคราะห์เจาะลึก' : 'Advanced Analytics',
      description: language === 'th' ? 'รายงานอารมณ์และความคืบหน้า' : 'Detailed mood and progress reports'
    }
  ];

  const plans = [
    {
      id: 'monthly',
      title: language === 'th' ? 'รายเดือน' : 'Monthly',
      price: '199',
      originalPrice: '299',
      duration: language === 'th' ? 'ต่อเดือน' : 'per month',
      discount: '33%',
      popular: false
    },
    {
      id: 'yearly',
      title: language === 'th' ? 'รายปี' : 'Yearly',
      price: '1,499',
      originalPrice: '2,388',
      duration: language === 'th' ? 'ต่อปี' : 'per year',
      discount: '37%',
      popular: true
    }
  ];

  const UpgradeContent = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-20 h-20 bg-gradient-to-r from-warm-orange to-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <Crown className="w-10 h-10 text-white" />
        </div>
        <h2 className={`text-2xl font-bold text-gray-800 mb-2 ${language === 'th' ? 'thai-text' : ''}`}>
          {language === 'th' ? 'อัปเกรดเป็นพรีเมี่ยม' : 'Upgrade to Premium'}
        </h2>
        <p className={`text-gray-600 ${language === 'th' ? 'thai-text' : ''}`}>
          {language === 'th' 
            ? 'ปลดล็อกฟีเจอร์พิเศษทั้งหมดเพื่อสุขภาพจิตที่ดีขึ้น'
            : 'Unlock all premium features for better mental wellness'
          }
        </p>
      </div>

      {/* Plan Selection */}
      <div className="grid grid-cols-2 gap-3">
        {plans.map(plan => (
          <Card 
            key={plan.id}
            className={`p-4 cursor-pointer transition-all ${
              selectedPlan === plan.id 
                ? 'ring-2 ring-dark-green bg-mint-green/20' 
                : 'hover:shadow-md'
            } ${plan.popular ? 'relative' : ''}`}
            onClick={() => setSelectedPlan(plan.id as 'monthly' | 'yearly')}
          >
            {plan.popular && (
              <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-warm-orange text-white">
                {language === 'th' ? 'แนะนำ' : 'Popular'}
              </Badge>
            )}
            <div className="text-center">
              <h3 className={`font-semibold text-gray-800 mb-2 ${language === 'th' ? 'thai-text' : ''}`}>
                {plan.title}
              </h3>
              <div className="mb-2">
                <span className="text-2xl font-bold text-dark-green">฿{plan.price}</span>
                <div className="text-xs text-gray-500 line-through">฿{plan.originalPrice}</div>
              </div>
              <p className={`text-xs text-gray-600 mb-2 ${language === 'th' ? 'thai-text' : ''}`}>
                {plan.duration}
              </p>
              <Badge variant="secondary" className="text-xs">
                {language === 'th' ? 'ประหยัด' : 'Save'} {plan.discount}
              </Badge>
            </div>
          </Card>
        ))}
      </div>

      {/* Features List */}
      <div className="space-y-3">
        <h3 className={`font-semibold text-gray-800 ${language === 'th' ? 'thai-text' : ''}`}>
          {language === 'th' ? 'สิ่งที่คุณจะได้รับ' : 'What you get:'}
        </h3>
        {premiumFeatures.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div key={index} className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-mint-green rounded-full flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-dark-green" />
              </div>
              <div>
                <h4 className={`font-medium text-gray-800 ${language === 'th' ? 'thai-text' : ''}`}>
                  {feature.title}
                </h4>
                <p className={`text-sm text-gray-600 ${language === 'th' ? 'thai-text' : ''}`}>
                  {feature.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA Button */}
      <Button
        onClick={onUpgrade}
        className="w-full bg-gradient-to-r from-warm-orange to-yellow-400 hover:from-orange-600 hover:to-yellow-500 text-white font-semibold py-3"
      >
        <Crown className="w-5 h-5 mr-2" />
        <span className={language === 'th' ? 'thai-text' : ''}>
          {language === 'th' 
            ? `อัปเกรดเพียง ฿${plans.find(p => p.id === selectedPlan)?.price}` 
            : `Upgrade for ฿${plans.find(p => p.id === selectedPlan)?.price}`
          }
        </span>
      </Button>

      <p className={`text-xs text-gray-500 text-center ${language === 'th' ? 'thai-text' : ''}`}>
        {language === 'th'
          ? 'ยกเลิกได้ทุกเมื่อ • รับประกันคืนเงิน 7 วัน'
          : 'Cancel anytime • 7-day money back guarantee'
        }
      </p>
    </div>
  );

  if (showAsModal) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button className="bg-gradient-to-r from-warm-orange to-yellow-400 text-white">
            <Crown className="w-4 h-4 mr-2" />
            <span className={language === 'th' ? 'thai-text' : ''}>
              {language === 'th' ? 'อัปเกรดเป็นพรีเมี่ยม' : 'Upgrade to Premium'}
            </span>
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <UpgradeContent />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className="min-h-screen bg-soft-blue p-6">
      <Card className="max-w-md mx-auto p-6 bg-white shadow-lg">
        <UpgradeContent />
      </Card>
    </div>
  );
};
