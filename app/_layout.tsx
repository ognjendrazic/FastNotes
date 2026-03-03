import { Stack } from "expo-router";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider, useAuth } from "../context/AuthContext";
import NotesProvider from "../context/NotesContext";

// Main app layout that defines the navigation structure and wraps the app with necessary providers
function AppLayout() {
  // Get user session from auth context to display user's name in header
  const { session } = useAuth();
  const displayName = session?.user?.user_metadata?.full_name;

  return (
    <NotesProvider>
      <Stack screenOptions={{ headerTitleAlign: "center" }}>
        <Stack.Screen name="index" options={{ headerTitle: `Welcome, ${displayName}!` }} />
        <Stack.Screen name="auth/login" options={{ title: "Login - FastNotes", headerShown: false }} />
        <Stack.Screen name="auth/signup" options={{ title: "Sign Up - FastNotes" }} />
        <Stack.Screen name="note/new-note" options={{ title: "Create a new note" }} />
        <Stack.Screen name="note/edit-note" options={{ title: "Edit note" }} />
        <Stack.Screen name="note/work-notes" options={{ title: "View Company Notes" }} />
        <Stack.Screen name="note/[id]" options={{ title: "Note" }} />
      </Stack>
    </NotesProvider>
  );
}

// Root layout that wraps the entire app with necessary providers
export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <KeyboardProvider>
        <AuthProvider>
          <AppLayout />
        </AuthProvider>
      </KeyboardProvider>
    </SafeAreaProvider>
  );
}