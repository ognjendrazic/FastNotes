import { render, screen } from '@testing-library/react-native';
import { ActivityIndicator } from 'react-native';

// Mocks
jest.mock('expo', () => ({}));
jest.mock('../lib/supabase', () => ({ supabase: {} }));

jest.mock('expo-router', () => ({
  __esModule: true,
  router: { push: jest.fn() },
  Redirect: () => null,
}));

jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));

jest.mock('../hooks/usePushNotification', () => jest.fn().mockResolvedValue(undefined));

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }: any) => children,
}));

let mockSession: any = null;
let mockLoading = true;
let mockNotes: any[] = [];

jest.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    session: mockSession,
    loading: mockLoading,
    signOut: jest.fn(),
  }),
}));

jest.mock('../context/NotesContext', () => ({
  useNotes: () => ({
    notes: mockNotes,
  }),
}));

import Index from '../app/index';

describe('Index - loading indicator and data display', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSession = { user: { user_metadata: { full_name: 'Test User' } } };
    mockLoading = true;
    mockNotes = [];
  });

  it('shows a loading spinner while data is being fetched', () => {
    mockLoading = true;

    render(<Index />);

    expect(screen.UNSAFE_getAllByType(ActivityIndicator).length).toBeGreaterThan(0);
  });

  it('hides the loader and shows notes once data is loaded', () => {
    mockLoading = false;
    mockNotes = [
      {
        id: '1',
        title: 'Test Note',
        content: 'This is a test note',
        updated_at: new Date().toISOString(),
        author_name: 'Test User',
        image_url: null,
      },
    ];

    render(<Index />);

    expect(screen.UNSAFE_queryAllByType(ActivityIndicator).length).toBe(0);
    expect(screen.getByText('Test Note')).toBeTruthy();
    expect(screen.getByText('This is a test note')).toBeTruthy();
  });
});