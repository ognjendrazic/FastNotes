// __tests__/auth-guard.test.tsx
import { render, screen } from '@testing-library/react-native';

jest.mock('expo', () => ({}));
jest.mock('../lib/supabase', () => ({ supabase: {} }));

let lastRedirectHref: string | null = null;
jest.mock('expo-router', () => ({
  __esModule: true,
  router: { push: jest.fn() },
  Redirect: ({ href }: { href: string }) => {
    lastRedirectHref = href;
    return null;
  },
}));

jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));

jest.mock('../hooks/usePushNotification', () => jest.fn().mockResolvedValue(undefined));

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }: any) => children,
}));

let mockSession: any = null;
let mockLoading = false;

jest.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    session: mockSession,
    loading: mockLoading,
    signOut: jest.fn(),
  }),
}));

jest.mock('../context/NotesContext', () => ({
  useNotes: () => ({
    notes: [],
  }),
}));

import Index from '../app/index';

describe('Auth Guard - access control', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    lastRedirectHref = null;
    mockLoading = false;
  });

  it('redirects to login when user is not authenticated', () => {
    mockSession = null;

    render(<Index />);

    expect(lastRedirectHref).toBe('/auth/login');
  });

  it('shows the main content when user is authenticated', () => {
    mockSession = { user: { user_metadata: { full_name: 'Test User' } } };

    render(<Index />);

    expect(lastRedirectHref).toBeNull();
    expect(screen.getByText('Fast Notes')).toBeTruthy();
    expect(screen.getByText('Sign Out')).toBeTruthy();
  });
});