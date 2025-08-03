import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Calendar, Settings, Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useStripe } from '@/hooks/useStripe';

interface BillingPortalProps {
  subscription?: {
    status: string;
    currentPeriodEnd: string;
    priceId: string;
    cancelAtPeriodEnd: boolean;
  };
  isPremium: boolean;
}

export const BillingPortal: React.FC<BillingPortalProps> = ({ subscription, isPremium }) => {
  const { language } = useLanguage();
  const { createPortalSession, isLoading } = useStripe();

  const handleManageBilling = async () => {
    await createPortalSession();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(
      language === 'th' ? 'th-TH' : 'en-US',
      {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'canceled':
        return 'bg-red-100 text-red-800';
      case 'past_due':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    const statusMap = {
      active: language === 'th' ? 'ใช้งานอยู่' : 'Active',
      canceled: language === 'th' ? 'ยกเลิกแล้ว' : 'Canceled',
      past_due: language === 'th' ? 'ค้างชำระ' : 'Past Due',
      trialing: language === 'th' ? 'ทดลองใช้' : 'Trial',
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  if (!isPremium) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className={`font-semibold text-gray-800 mb-2 ${language === 'th' ? 'thai-text' : ''}`}>
            {language === 'th' ? 'ไม่มีการสมัครสมาชิก' : 'No Active Subscription'}
          </h3>
          <p className={`text-gray-600 text-sm ${language === 'th' ? 'thai-text' : ''}`}>
            {language === 'th' 
              ? 'อัปเกรดเป็นพรีเมี่ยมเพื่อปลดล็อกฟีเจอร์พิเศษ'
              : 'Upgrade to Premium to unlock exclusive features'
            }
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className={`flex items-center space-x-2 ${language === 'th' ? 'thai-text' : ''}`}>
          <CreditCard className="w-5 h-5" />
          <span>{language === 'th' ? 'การเรียกเก็บเงิน' : 'Billing & Subscription'}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {subscription && (
          <>
            <div className="flex items-center justify-between">
              <span className={`text-sm text-gray-600 ${language === 'th' ? 'thai-text' : ''}`}>
                {language === 'th' ? 'สถานะ' : 'Status'}
              </span>
              <Badge className={getStatusColor(subscription.status)}>
                {getStatusText(subscription.status)}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className={`text-sm text-gray-600 ${language === 'th' ? 'thai-text' : ''}`}>
                {language === 'th' ? 'รอบการเรียกเก็บเงินถัดไป' : 'Next Billing Date'}
              </span>
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium">
                  {formatDate(subscription.currentPeriodEnd)}
                </span>
              </div>
            </div>

            {subscription.cancelAtPeriodEnd && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className={`text-sm text-yellow-800 ${language === 'th' ? 'thai-text' : ''}`}>
                  {language === 'th'
                    ? 'การสมัครสมาชิกของคุณจะสิ้นสุดในวันที่ระบุข้างต้น'
                    : 'Your subscription will end on the date shown above'
                  }
                </p>
              </div>
            )}
          </>
        )}

        <Button
          onClick={handleManageBilling}
          disabled={isLoading}
          variant="outline"
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              <span className={language === 'th' ? 'thai-text' : ''}>
                {language === 'th' ? 'กำลังโหลด...' : 'Loading...'}
              </span>
            </>
          ) : (
            <>
              <Settings className="w-4 h-4 mr-2" />
              <span className={language === 'th' ? 'thai-text' : ''}>
                {language === 'th' ? 'จัดการการเรียกเก็บเงิน' : 'Manage Billing'}
              </span>
            </>
          )}
        </Button>

        <p className={`text-xs text-gray-500 text-center ${language === 'th' ? 'thai-text' : ''}`}>
          {language === 'th'
            ? 'จัดการการชำระเงิน อัปเดตข้อมูลบัตร และดูประวัติการเรียกเก็บเงิน'
            : 'Manage payments, update card details, and view billing history'
          }
        </p>
      </CardContent>
    </Card>
  );
};