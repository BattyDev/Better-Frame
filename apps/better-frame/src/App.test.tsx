import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from './App';

// Mock Supabase to avoid needing real credentials in tests
vi.mock('./lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: vi.fn().mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      }),
    },
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: null }),
        }),
      }),
    }),
  },
}));

describe('App', () => {
  it('renders the home page with app title', async () => {
    render(<App />);
    const titles = await screen.findAllByText('Tenno Trove');
    expect(titles.length).toBeGreaterThanOrEqual(1);
  });

  it('shows navigation links', async () => {
    render(<App />);
    expect(await screen.findByText('Warframe')).toBeInTheDocument();
    expect(await screen.findByText('Primary')).toBeInTheDocument();
    expect(await screen.findByText('Browse')).toBeInTheDocument();
  });

  it('shows sign in link when not authenticated', async () => {
    render(<App />);
    const signInLink = await screen.findByText('Sign in');
    expect(signInLink).toBeInTheDocument();
  });
});
