import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { useNotes } from "../../context/NotesContext";

export default function NoteDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getNoteById, deleteNote } = useNotes();
  const note = id ? getNoteById(id) : null;

  if (!note) {
    return (
      <View style={styles.container}>
        <Text>Note not found</Text>
      </View>
    );
  }

  console.log(note.updated_at); // Debugging

  {/* Handle note deletion with confirmation */ }
  const handleDelete = () => {
    Alert.alert('Delete Note', 'Are you sure you want to delete this note?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive',
        onPress: async () => {
          await deleteNote(note.id);
          Alert.alert('Success', 'Note deleted successfully!');
          router.back();
        },
      }
    ])
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{note.title}</Text>
        <Text style={styles.meta}>Last updated: {new Date(note.updated_at).toLocaleString()}</Text>
        <View style={styles.divider} />
        <Text style={styles.content}>{note.content}</Text>
      </View>
      <Pressable onPress={() => router.push(`/note/edit-note?id=${note.id}`)} style={({ pressed }) =>
        [styles.deleteButton, { backgroundColor: "#007aff" }, pressed && { opacity: 0.6 }]}>
        <Text style={styles.deleteText}>Edit Note</Text>
      </Pressable>
      <Pressable onPress={handleDelete} style={({ pressed }) =>
        [styles.deleteButton, pressed && { opacity: 0.6 }]}>
        <Text style={styles.deleteText}>Delete Note</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f6f6",
    padding: 16,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#efefef",
  },

  title: {
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: -0.3,
    color: "#111",
  },

  meta: {
    marginTop: 6,
    fontSize: 12,
    color: "#111",
    opacity: 0.6,
  },

  divider: {
    height: 1,
    backgroundColor: "#efefef",
    marginVertical: 12,
  },

  content: {
    fontSize: 16,
    lineHeight: 22,
    color: "#111",
    opacity: 0.9,
  },

  deleteButton: {
    marginTop: 16,
    backgroundColor: "#ff3b30",
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
  },
  deleteText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
});
