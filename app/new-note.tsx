import { router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNotes } from "./store/NotesProvider";

export default function NewNote() {
    const { addNote } = useNotes();

    const [title, setTitle] = React.useState("");
    const [content, setContent] = React.useState("");

    const onSave = () => {
      addNote(title, content);
      router.back();
    }

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <View style={styles.header}>
                <Text style={styles.h1}>New Note</Text>
                <Text style={styles.sub}>Create a new note below.</Text>
            </View>
            <View>
                <TextInput 
                style={styles.search}
                placeholder="Enter title for note"
                placeholderTextColor="#999"
                value={title}
                onChangeText={setTitle}
                />
            </View>
            <View>
                <TextInput 
                style={[styles.search, { height: 200, textAlignVertical: 'top', marginTop: 12 }]}
                placeholder="Start writing your note here..."
                placeholderTextColor="#999"
                multiline={true}
                value={content}
                onChangeText={setContent}
                />
            </View>
            
              <Pressable
                onPress={onSave}
                style={({ pressed }) => [
                  styles.button,
                  pressed && styles.buttonPressed,
                ]}>
                <Text style={styles.buttonIcon}>Save</Text>
              </Pressable>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#f6f6f6",
    paddingHorizontal: 16,
  },

  header: { 
    paddingTop: 16, 
    paddingBottom: 10 },
  h1: { 
    fontSize: 28, 
    fontWeight: "800", 
    letterSpacing: -0.3, 
    color: "#111" },
  sub: { 
    marginTop: 4, 
    fontSize: 14, 
    opacity: 0.7, 
    color: "#111" },

  search: {
    height: 44,
    borderRadius: 14,
    paddingHorizontal: 14,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ededed",
    fontSize: 15,
    color: "#111",
  },
  button: {
    marginTop: 20,
    height: 54,
    borderRadius: 16,
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 1 }],
    backgroundColor: "#999",
  },
  buttonIcon: {
    fontSize: 17,
    color: "#fff",
    fontWeight: "600",
    letterSpacing: 0.5,
  },
});
