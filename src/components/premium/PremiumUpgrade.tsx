
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Crown } from 'lucide-react';
import { StripeCheckout } from './StripeCheckout';

interface PremiumUpgradeProps {
  onUpgrade?: () => void;
  showAsModal?: boolean;
}

export const PremiumUpgrade: React.FC<PremiumUpgradeProps> = ({ onUpgrade, showAsModal = false }) => {
  const { language } = useLanguage();

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
          <StripeCheckout onClose={() => {}} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className="min-h-screen bg-soft-blue p-6">
      <Card className="max-w-md mx-auto p-6 bg-white shadow-lg">
        <StripeCheckout />
      </Card>
    </div>
  );
};
