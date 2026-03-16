import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Note } from '../../context/NotesContext';
import { supabase } from '../../lib/supabase';

export default function WorkNotes() {
    const [publicNotes, setPublicNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    const PAGE_SIZE = 5;

    const fetchAllNotes = async (start = 0, append = false) => {
        if (append) {
            setLoadingMore(true);
        } else {
            setLoading(true);
        }

        const { data } = await supabase
            .from('Notes')
            .select('*')
            .order('updated_at', { ascending: false })
            .range(start, start + PAGE_SIZE - 1);

        if (data) {
            setPublicNotes((prev) => (append ? [...prev, ...data] : data));
        }

        setLoading(false);
        setLoadingMore(false);
    };

    // Fetch first page
    useEffect(() => {
        fetchAllNotes(0, false);
    }, []);


    // Show loading indicator while checking auth status
    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f6f6f6' }}>
                <ActivityIndicator size="large" color="#111" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.h1}>Company Notes</Text>
                <Text style={styles.sub}>Your teams, organized and accessible notes.</Text>
            </View>

            {/* Notes List */}
            <View style={styles.listWrap}>
                <FlatList
                    data={publicNotes}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <View style={styles.cardTop}>
                                <Text style={styles.title}>{item.title}</Text>
                                <Text style={styles.time}>{new Date(item.updated_at).toLocaleString()}</Text>
                            </View>
                            <Text style={styles.author}>By {item.author_name || 'Unknown User'}</Text>
                            <Text style={styles.preview} numberOfLines={1}>{item.content}</Text>
                            {item.image_url && (
                                <Image
                                    source={{ uri: item.image_url }}
                                    style={styles.noteImage}
                                    resizeMode="cover"
                                />
                            )}
                        </View>
                    )}
                />
            </View>

            {/* Load More Button */}
            <Pressable
                disabled={loadingMore}
                style={({ pressed }) => [
                    styles.loadMoreButton,
                    loadingMore && styles.loadMoreButtonDisabled,
                    pressed && !loadingMore && styles.loadMoreButtonPressed,
                ]}
                onPress={() => fetchAllNotes(publicNotes.length, true)}>
                <Text style={styles.loadMoreText}>{loadingMore ? 'Loading...' : 'Load More'}</Text>
            </Pressable>
        </SafeAreaView>
    );
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
    author: {
        marginTop: 4,
        fontSize: 12,
        fontWeight: '600',
        color: '#111',
        opacity: 0.6,
    },

    preview: {
        marginTop: 8,
        fontSize: 14,
        lineHeight: 19,
        opacity: 0.75,
        color: "#111"
    },
    noteImage: {
        width: '100%',
        aspectRatio: 16 / 9,
        borderRadius: 8,
        marginTop: 10,
    },
    loadMoreButton: {
        alignSelf: 'center',
        marginBottom: 24,
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