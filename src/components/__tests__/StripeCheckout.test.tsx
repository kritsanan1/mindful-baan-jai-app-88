import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Simple screen implementation for testing
const screen = {
  getByText: (text: string | RegExp) => document.querySelector(`*:contains("${text}")`) as HTMLElement,
};
import { StripeCheckout } from '../premium/StripeCheckout';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock the hooks
vi.mock('@/hooks/useStripe', () => ({
  useStripe: () => ({
    createCheckoutSession: vi.fn(),
    isLoading: false,
  }),
}));

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

// Test wrapper component
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        {children}
      </LanguageProvider>
    </QueryClientProvider>
  );
};

describe('StripeCheckout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders premium upgrade options', () => {
    render(
      <TestWrapper>
        <StripeCheckout />
      </TestWrapper>
    );

    expect(screen.getByText('Upgrade to Premium')).toBeInTheDocument();
    expect(screen.getByText('Premium Monthly')).toBeInTheDocument();
    expect(screen.getByText('Premium Yearly')).toBeInTheDocument();
  });

  it('shows most popular badge for yearly plan', () => {
    render(
      <TestWrapper>
        <StripeCheckout />
      </TestWrapper>
    );

    expect(screen.getByText('Most Popular')).toBeInTheDocument();
  });

  it('calculates and displays savings percentage', () => {
    render(
      <TestWrapper>
        <StripeCheckout />
      </TestWrapper>
    );

    // Should show savings percentage for yearly plan
    expect(screen.getByText(/Save \d+%/)).toBeInTheDocument();
  });

  it('allows plan selection', () => {
    render(
      <TestWrapper>
        <StripeCheckout />
      </TestWrapper>
    );

    const monthlyPlan = screen.getByText('Premium Monthly').closest('div');
    const yearlyPlan = screen.getByText('Premium Yearly').closest('div');

    // Initially yearly should be selected (default)
    expect(yearlyPlan).toHaveClass('ring-2');

    // Click monthly plan
    if (monthlyPlan) {
      userEvent.click(monthlyPlan);
      expect(monthlyPlan).toHaveClass('ring-2');
    }
  });

  it('displays features list for each plan', () => {
    render(
      <TestWrapper>
        <StripeCheckout />
      </TestWrapper>
    );

    expect(screen.getByText('Unlimited AI Chat')).toBeInTheDocument();
    expect(screen.getByText('Premium Content Library')).toBeInTheDocument();
    expect(screen.getByText('Advanced Analytics')).toBeInTheDocument();
    expect(screen.getByText('Priority Support')).toBeInTheDocument();
  });

  it('shows security and guarantee information', () => {
    render(
      <TestWrapper>
        <StripeCheckout />
      </TestWrapper>
    );

    expect(screen.getByText(/Cancel anytime/)).toBeInTheDocument();
    expect(screen.getByText(/7-day money back guarantee/)).toBeInTheDocument();
    expect(screen.getByText(/Secured by Stripe/)).toBeInTheDocument();
  });
});