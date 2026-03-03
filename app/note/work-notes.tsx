import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Note } from '../../context/NotesContext';
import { supabase } from '../../lib/supabase';

export default function WorkNotes() {
    const [publicNotes, setPublicNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch all notes regardless of user, using policy to filter out private notes
    useEffect(() => {
        const fetchAllNotes = async () => {
            const { data } = await supabase
                .from('Notes')
                .select('*')
                .order('updated_at', { ascending: false });

            if (data) setPublicNotes(data);
            setLoading(false);
        };
        fetchAllNotes();
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
            <View>
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
                        </View>
                    )}
                />
            </View>
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
});