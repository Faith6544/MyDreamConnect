import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock window.scrollTo (used by ScrollToTop)
window.scrollTo = jest.fn();

// Mock IntersectionObserver (often used by animations or lazy loading)
class IntersectionObserver {
  observe = jest.fn();
  disconnect = jest.fn();
  unobserve = jest.fn();
}
Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: IntersectionObserver,
});

jest.mock('./lib/supabase', () => {
  const makeQuery = () => {
    const query = {
      select: () => query,
      eq: () => query,
      neq: () => query,
      order: () => query,
      limit: () => query,
      in: () => query,
      insert: async () => ({ data: [], error: null }),
      update: async () => ({ data: [], error: null }),
      delete: async () => ({ data: [], error: null }),
      single: async () => ({ data: null, error: null }),
      maybeSingle: async () => ({ data: null, error: null }),
      then: (resolve) => resolve({ data: [], error: null }),
    };
    return query;
  };

  return {
    supabase: {
      auth: {
        getSession: async () => ({ data: { session: null } }),
        getUser: async () => ({ data: { user: null }, error: null }), // Added getUser
        onAuthStateChange: () => ({
          data: { subscription: { unsubscribe: () => {} } },
        }),
        signOut: async () => ({ error: null }),
      },
      from: () => makeQuery(),
      rpc: async () => ({ data: [], error: null }),
      storage: {
        from: () => ({
          upload: async () => ({ data: null, error: null }),
          remove: async () => ({ data: null, error: null }),
          getPublicUrl: () => ({ data: { publicUrl: '' } }),
        }),
      },
    },
  };
});

test('renders the app shell without crashing', () => {
  render(<App />);
  // Just check if the document body has content
  expect(document.body).toBeInTheDocument();
});