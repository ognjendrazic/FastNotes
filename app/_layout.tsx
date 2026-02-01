import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{headerTitleAlign: "center"}}>
    <Stack.Screen name="index" options={{title: "Welcome to FastNotes"}} />
    <Stack.Screen name="new-note" options={{title: "New Note"}} />
    <Stack.Screen name="note/[id]" options={{title: "Note"}} />
    </Stack>
  ) 
}