import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

/**
 * Smoke test for the app shell.
 *
 * The Supabase client is mocked so the test never touches the network.
 * Every query builder method returns a chainable stub, and the object is
 * thenable so that `await supabase.from(...).select(...)` resolves to an
 * empty result set.
 */
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

  // The navbar is part of the shared shell in App.js.
  expect(screen.getByRole('navigation')).toBeInTheDocument();
});

test('renders the primary navigation links', () => {
  render(<App />);

  // "Home" and "About Us" appear in both the navbar and the footer, so use
  // getAllByRole to avoid "found multiple elements" failures.
  expect(screen.getAllByRole('link', { name: /home/i }).length).toBeGreaterThan(0);
  expect(screen.getAllByRole('link', { name: /about us/i }).length).toBeGreaterThan(0);
  expect(screen.getAllByRole('link', { name: /take a course/i }).length).toBeGreaterThan(0);
});

test('shows the signed-out call to action when there is no session', () => {
  render(<App />);

  expect(screen.getByRole('link', { name: /take a course/i })).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: /log out/i })).not.toBeInTheDocument();
});
