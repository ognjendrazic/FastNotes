import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';

// Mocks
jest.mock('expo', () => ({}));

jest.mock('../lib/supabase', () => ({
  supabase: {},
}));

jest.mock('expo-router', () => ({
  __esModule: true,
  router: {
    back: jest.fn(),
  },
}));

const mockAddNote = jest.fn().mockResolvedValue('fake-note-id');
jest.mock('../context/NotesContext', () => ({
  useNotes: () => ({
    addNote: mockAddNote,
  }),
}));

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

import { router } from 'expo-router';
import NewNote from '../app/note/new-note';

// Test Logic
describe('NewNote - creation and navigation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Alert, 'alert');
  });

  it('calls addNote with correct args and navigates back on valid submission', async () => {
    render(<NewNote />);

    fireEvent.changeText(screen.getByPlaceholderText('Enter title for note'), 'My Note');
    fireEvent.changeText(screen.getByPlaceholderText('Start writing your note here...'), 'Some content');
    fireEvent.press(screen.getByText('Save'));

    await waitFor(() => {
      expect(mockAddNote).toHaveBeenCalledWith('My Note', 'Some content', 'Test User');
      expect(Alert.alert).toHaveBeenCalledWith('Success', 'Note saved successfully!');
      expect(router.back).toHaveBeenCalledTimes(1);
    });
  });
});