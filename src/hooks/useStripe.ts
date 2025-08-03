import { useState } from 'react';
import { stripePromise } from '@/lib/stripe';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useStripe = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const createCheckoutSession = async (priceId: string, successUrl?: string, cancelUrl?: string) => {
    setIsLoading(true);
    
    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error('User not authenticated');
      }

      // Call Supabase Edge Function to create checkout session
      const { data, error } = await supabase.functions.invoke('stripe-checkout', {
        body: {
          priceId,
          userId: user.id,
          successUrl: successUrl || `${window.location.origin}/profile?success=true`,
          cancelUrl: cancelUrl || `${window.location.origin}/profile?canceled=true`,
        },
      });

      if (error) {
        throw error;
      }

      // Redirect to Stripe Checkout
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Stripe failed to load');
      }

      const { error: redirectError } = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });

      if (redirectError) {
        throw redirectError;
      }

    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: "Payment Error",
        description: "Failed to initiate payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createPortalSession = async () => {
    setIsLoading(true);
    
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase.functions.invoke('stripe-portal', {
        body: {
          userId: user.id,
          returnUrl: `${window.location.origin}/profile`,
        },
      });

      if (error) {
        throw error;
      }

      // Redirect to Stripe Customer Portal
      window.location.href = data.url;

    } catch (error) {
      console.error('Portal error:', error);
      toast({
        title: "Portal Error",
        description: "Failed to open billing portal. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createCheckoutSession,
    createPortalSession,
    isLoading,
  };
};