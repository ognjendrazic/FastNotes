import { render, screen, waitFor } from '@testing-library/react-native';
import { ActivityIndicator } from 'react-native';

jest.mock('expo', () => ({}));
jest.mock('../lib/supabase', () => ({ supabase: {} }));
jest.mock('expo-router', () => ({ __esModule: true, router: { push: jest.fn() }, Redirect: () => null }));
jest.mock('@expo/vector-icons', () => ({ Ionicons: 'Ionicons' }));
jest.mock('../hooks/usePushNotification', () => jest.fn().mockResolvedValue(undefined));
jest.mock('react-native-safe-area-context', () => ({ SafeAreaView: ({ children }: any) => children }));

let mockLoading = true;
let mockNotes: any[] = [];

jest.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    session: { user: { user_metadata: { full_name: 'Test User' } } },
    loading: mockLoading,
    signOut: jest.fn(),
  }),
}));

jest.mock('../context/NotesContext', () => ({
  useNotes: () => ({ notes: mockNotes }),
}));

import Index from '../app/index';

it('shows spinner while loading, then displays note when done', async () => {
  mockLoading = true;
  mockNotes = [];

  const { rerender } = render(<Index />);
  expect(screen.UNSAFE_getAllByType(ActivityIndicator).length).toBeGreaterThan(0);

  mockLoading = false;
  mockNotes = [{ id: '1', title: 'Test Note', content: 'This is a test note', updated_at: new Date().toISOString(), author_name: 'Test User', image_url: null }];

  rerender(<Index />);

  await waitFor(() => {
    expect(screen.UNSAFE_queryAllByType(ActivityIndicator).length).toBe(0);
    expect(screen.getByText('Test Note')).toBeTruthy();
  });
});