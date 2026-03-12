// __tests__/new-note.test.tsx
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';

// Mock expo
jest.mock('expo', () => ({}));

// Mock supabase to prevent native module loading
jest.mock('../lib/supabase', () => ({
  supabase: {},
}));

// Mock expo-router with jest.fn() inside factory to avoid hoisting issues
jest.mock('expo-router', () => ({
  __esModule: true,
  router: {
    back: jest.fn(),
  },
}));

// Mock NotesContext
const mockAddNote = jest.fn().mockResolvedValue('fake-note-id');
jest.mock('../context/NotesContext', () => ({
  useNotes: () => ({
    addNote: mockAddNote,
  }),
}));

// Mock AuthContext
jest.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    session: {
      user: {
        user_metadata: { full_name: 'Test User' },
      },
    },
  }),
}));

// Mock native UI modules
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }: any) => children,
}));

// Import after all mocks are defined
import { router } from 'expo-router';
import NewNote from '../app/note/new-note';

describe('NewNote - creation and navigation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Alert, 'alert');
  });

  it('calls addNote with correct args and navigates back on valid submission', async () => {
    render(<NewNote />);

    // Fill in title and content
    fireEvent.changeText(screen.getByPlaceholderText('Enter title for note'), 'My Note');
    fireEvent.changeText(screen.getByPlaceholderText('Start writing your note here...'), 'Some content');

    // Press save button
    fireEvent.press(screen.getByText('Save'));

    // Wait for async onSave to complete
    await waitFor(() => {
      // Verify addNote was called with correct arguments
      expect(mockAddNote).toHaveBeenCalledWith('My Note', 'Some content', 'Test User');

      // Verify success alert was shown
      expect(Alert.alert).toHaveBeenCalledWith('Success', 'Note saved successfully!');

      // Verify navigation back to main screen
      expect(router.back).toHaveBeenCalledTimes(1);
    });
  });
});