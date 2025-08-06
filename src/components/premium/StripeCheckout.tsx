import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crown, Check, Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useStripe } from '@/hooks/useStripe';
import { STRIPE_PRODUCTS, formatPrice } from '@/lib/stripe';

interface StripeCheckoutProps {
  onClose?: () => void;
}

export const StripeCheckout: React.FC<StripeCheckoutProps> = ({ onClose }) => {
  const { language } = useLanguage();
  const { createCheckoutSession, isLoading } = useStripe();
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly');

  const plans = [
    {
      id: 'monthly' as const,
      product: STRIPE_PRODUCTS.PREMIUM_MONTHLY,
      popular: false,
    },
    {
      id: 'yearly' as const,
      product: STRIPE_PRODUCTS.PREMIUM_YEARLY,
      popular: true,
    },
  ];

  const handleUpgrade = async (priceId: string) => {
    await createCheckoutSession(priceId);
  };

  const calculateSavings = () => {
    const yearlyPrice = STRIPE_PRODUCTS.PREMIUM_YEARLY.price;
    const monthlyYearlyPrice = STRIPE_PRODUCTS.PREMIUM_MONTHLY.price * 12;
    const savings = monthlyYearlyPrice - yearlyPrice;
    return Math.round((savings / monthlyYearlyPrice) * 100);
  };

  return (
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {plans.map(({ id, product, popular }) => (
          <Card 
            key={id}
            className={`cursor-pointer transition-all ${
              selectedPlan === id 
                ? 'ring-2 ring-dark-green bg-mint-green/20' 
                : 'hover:shadow-md'
            } ${popular ? 'relative' : ''}`}
            onClick={() => setSelectedPlan(id)}
          >
            {popular && (
              <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-warm-orange text-white">
                {language === 'th' ? 'แนะนำ' : 'Most Popular'}
              </Badge>
            )}
            <CardHeader className="text-center pb-2">
              <CardTitle className={`text-lg ${language === 'th' ? 'thai-text' : ''}`}>
                {language === 'th' ? product.nameTh : product.name}
              </CardTitle>
              <div className="space-y-1">
                <div className="text-3xl font-bold text-dark-green">
                  {formatPrice(product.price)}
                </div>
                {'originalPrice' in product && (
                  <div className="text-sm text-gray-500 line-through">
                    {formatPrice(product.originalPrice)}
                  </div>
                )}
                <div className={`text-sm text-gray-600 ${language === 'th' ? 'thai-text' : ''}`}>
                  {language === 'th' 
                    ? `ต่อ${product.interval === 'month' ? 'เดือน' : 'ปี'}` 
                    : `per ${product.interval}`
                  }
                </div>
                {id === 'yearly' && (
                  <Badge variant="secondary" className="text-xs">
                    {language === 'th' ? 'ประหยัด' : 'Save'} {calculateSavings()}%
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {(language === 'th' ? product.featuresTh : product.features).map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-dark-green flex-shrink-0" />
                    <span className={`text-sm ${language === 'th' ? 'thai-text' : ''}`}>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Checkout Button */}
      <div className="space-y-4">
        <Button
          onClick={() => handleUpgrade(plans.find(p => p.id === selectedPlan)!.product.priceId)}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-warm-orange to-yellow-400 hover:from-orange-600 hover:to-yellow-500 text-white font-semibold py-3"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              <span className={language === 'th' ? 'thai-text' : ''}>
                {language === 'th' ? 'กำลังดำเนินการ...' : 'Processing...'}
              </span>
            </>
          ) : (
            <>
              <Crown className="w-5 h-5 mr-2" />
              <span className={language === 'th' ? 'thai-text' : ''}>
                {language === 'th' 
                  ? `อัปเกรดเพียง ${formatPrice(plans.find(p => p.id === selectedPlan)!.product.price)}` 
                  : `Upgrade for ${formatPrice(plans.find(p => p.id === selectedPlan)!.product.price)}`
                }
              </span>
            </>
          )}
        </Button>

        <p className={`text-xs text-gray-500 text-center ${language === 'th' ? 'thai-text' : ''}`}>
          {language === 'th'
            ? 'ยกเลิกได้ทุกเมื่อ • รับประกันคืนเงิน 7 วัน • ปลอดภัยด้วย Stripe'
            : 'Cancel anytime • 7-day money back guarantee • Secured by Stripe'
          }
        </p>
      </div>
    </div>
  );
};