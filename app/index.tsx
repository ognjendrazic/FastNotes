import { router } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type NotePreview = {
  id: string;
  title: string;
  preview: string;
  updatedAt: string;
}

const MockNotes: NotePreview[] = [
  {
    id: "1", 
    title: "First Note", 
    preview: "This is a preview of the first note.", 
    updatedAt: "Today"
  },
  {
    id: "2", 
    title: "Second Note", 
    preview: "This is a preview of the second note.", 
    updatedAt: "Today"
  },
  {
    id: "3", 
    title: "Third Note", 
    preview: "This is a preview of the third note.", 
    updatedAt: "Today"
  },
  {
    id: "4", 
    title: "Fourth Note", 
    preview: "This is a preview of the fourth note.", 
    updatedAt: "Today"
  },
  {
    id: "5", 
    title: "Fifth Note", 
    preview: "This is a preview of the fifth note.", 
    updatedAt: "Today"
  }
]

export default function Index() {
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.h1}>Fast Notes</Text>
        <Text style={styles.sub}>Your notes, organized and accessible.</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchWrap}>
        <TextInput 
        style={styles.search} 
        placeholder='Search for a note...'
        placeholderTextColor="#999">
        </TextInput>
      </View>

      {/* Notes List */}
      <View>
        <FlatList
          data={MockNotes}
          keyExtractor={(notes) => notes.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <Pressable 
              style={({ pressed }) => [
                styles.card, 
                pressed && styles.cardPressed
              ]}>
              <View style={styles.cardTop}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.time}>{item.updatedAt}</Text>
              </View>
              <Text style={styles.preview}>{item.preview}</Text>
            </Pressable>
          )}
        />
      </View>

      {/* Button Creating Note */}
      <Pressable
        onPress={() => router.push('/new-note')} 
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed
        ]}>
        <Text style={styles.buttonIcon}>+</Text>
      </Pressable>
    </SafeAreaView> 
  )
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#f6f6f6" },

  header: { 
    paddingTop: 16, 
    paddingHorizontal: 16, 
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

  searchWrap: { 
    paddingHorizontal: 16, 
    paddingBottom: 8 },
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

  listContent: { 
    padding: 16, 
    paddingBottom: 104, 
    gap: 5 },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#efefef",
  },
  cardPressed: { 
    transform: [{ scale: 1 }], opacity: 0.70 },

  cardTop: { 
    flexDirection: "row", 
    alignItems: "center", 
    gap: 10 },
  title: { 
    flex: 1, 
    fontSize: 16, 
    fontWeight: "700", 
    color: "#111" },
  time: { 
    fontSize: 12, 
    opacity: 0.55, 
    color: "#111" },

  preview: { 
    marginTop: 8, 
    fontSize: 14, 
    lineHeight: 19, 
    opacity: 0.75, 
    color: "#111" },

  button: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#111",
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.95 }],
  },
  buttonIcon: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "300",
    marginTop: -2,
  },
});