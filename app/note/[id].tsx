import { useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useNotes } from "../store/NotesProvider";

export default function NoteDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getNoteById } = useNotes();

  const note = id ? getNoteById(id) : null;

  if (!note) {
    return (
      <View style={styles.container}>
        <Text>Note not found</Text>
      </View>
    );
  }

return (
  <View style={styles.container}>
    <View style={styles.card}>
      <Text style={styles.title}>{note.title}</Text>
      <Text style={styles.meta}>Sist oppdatert: {new Date(note.updatedAt).toLocaleString()}</Text>
      <View style={styles.divider} />
      <Text style={styles.content}>{note.content}</Text>
    </View>
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
});
