import { Ionicons } from '@expo/vector-icons';
import { Redirect, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { useNotes } from '../context/NotesContext';
import registerForPushNotificationsAsync from "../hooks/usePushNotification";

export default function Index() {
  const { session, loading, signOut } = useAuth();
  const { notes, fetchNotes, loadingMore } = useNotes();
  const [searchQuery, setSearchQuery] = useState('');
  const [_pushToken, setPushToken] = useState('');

  useEffect(() => {
  registerForPushNotificationsAsync().then(token => {
    if (token) setPushToken(token);
  });
}, []);

  // Show loading indicator while checking auth status, set to 3 seconds
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f6f6f6' }}>
        <ActivityIndicator size="large" color="#111" />
      </View>
    );
  }

  // Redirect to login if not authenticated
  if (!session) {
    return <Redirect href="/auth/login" />;
  }

  // Filter notes based on search query
  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={styles.h1}>Fast Notes</Text>
          <Pressable onPress={signOut} style={({ pressed }) => [styles.signOutButton, pressed && { opacity: 0.6 }]}>
            <Text style={styles.signOutText}>Sign Out</Text>
          </Pressable>
        </View>
        <Text style={styles.sub}>Your notes, organized and accessible.</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchWrap}>
        <TextInput
          style={styles.search}
          placeholder='Search for a note...'
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Notes List */}
      <View style={styles.listWrap}>
        <FlatList
          data={filteredNotes}
          keyExtractor={(notes) => notes.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => router.push(`/note/${item.id}`)}
              style={({ pressed }) => [
                styles.card,
                pressed && styles.cardPressed
              ]}>
              <View style={styles.cardTop}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.time}>{new Date(item.updated_at).toLocaleString()}</Text>
              </View>
              <Text style={styles.preview} numberOfLines={1}>{item.content}</Text>
            </Pressable>
          )}
        />
      </View>
      
      {/* Load More Button*/}
      <Pressable
        disabled={loadingMore}
        style={({ pressed }) => [
          styles.loadMoreButton,
          loadingMore && styles.loadMoreButtonDisabled,
          pressed && !loadingMore && styles.loadMoreButtonPressed,
        ]}
        onPress={() => fetchNotes(notes.length, true)}>
        <Text style={styles.loadMoreText}>{loadingMore ? 'Loading...' : 'Load More'}</Text>
      </Pressable>

      {/* Button Creating Note */}
      <Pressable
        onPress={() => router.push('/note/new-note')}
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed
        ]}>
        <Ionicons name="add-outline" size={28} color="#fff" />
      </Pressable>

      {/* View Company Notes Button */}
      <Pressable
        onPress={() => router.push('/note/work-notes')}
        style={({ pressed }) => [
          styles.button,
          { right: undefined, left: 24 },
          pressed && styles.buttonPressed
        ]}>
        <Ionicons name="briefcase-outline" size={28} color="#fff" />
      </Pressable>

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f6f6"
  },

  header: {
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 10
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  signOutButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#eee',
  },
  signOutText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },
  h1: {
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.3,
    color: "#111"
  },
  sub: {
    marginTop: 4,
    fontSize: 14,
    opacity: 0.8,
    color: "#111"
  },

  searchWrap: {
    paddingHorizontal: 16,
    paddingBottom: 8
  },
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
    gap: 5
  },
  listWrap: {
    flex: 1,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#efefef",
  },
  cardPressed: {
    transform: [{ scale: 1 }], opacity: 0.70
  },

  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    color: "#111"
  },
  time: {
    fontSize: 12,
    opacity: 0.80,
    color: "#111",
    textAlign: 'right',
    maxWidth: 100,
  },

  preview: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 19,
    opacity: 0.75,
    color: "#111"
  },

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
  loadMoreButton: {
    alignSelf: 'center',
    marginBottom: 90,
    paddingHorizontal: 150,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#e9e9e9',
  },
  loadMoreButtonDisabled: {
    opacity: 0.6,
  },
  loadMoreButtonPressed: {
    opacity: 0.85,
  },
  loadMoreText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
});