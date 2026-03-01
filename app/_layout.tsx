import { Stack } from "expo-router";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";
import NotesProvider from "./store/NotesProvider";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <KeyboardProvider>
      <NotesProvider>
      <Stack screenOptions={{headerTitleAlign: "center"}}>
        <Stack.Screen name="index" options={{title: "Fast Notes"}} />
        <Stack.Screen name="login" options={{title: "Login - FastNotes", headerShown: false}} />
        <Stack.Screen name="signup" options={{title: "Sign Up - FastNotes"}} />
        <Stack.Screen name="new-note" options={{title: "Create a new note"}} />
        <Stack.Screen name="note/[id]" options={{title: "Note"}} />
      </Stack>
      </NotesProvider>
      </KeyboardProvider>
    </SafeAreaProvider>
  ) 
}