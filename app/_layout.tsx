import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack screenOptions={{headerTitleAlign: "center"}}>
        <Stack.Screen name="index" options={{title: "Welcome to FastNotes"}} />
        <Stack.Screen name="new-note" options={{title: "Create a new note"}} />
        <Stack.Screen name="note/[id]" options={{title: "Note"}} />
      </Stack>
    </SafeAreaProvider>
  ) 
}