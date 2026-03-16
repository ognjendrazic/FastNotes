import { supabase } from '@/lib/supabase';
import React from 'react';
import { useAuth } from './AuthContext';

export interface Note {
    id: string;
    title: string;
    content: string;
    updated_at: string;
    author_name: string;
    image_url: string | null;
}

interface NoteValues {
    notes: Note[];
    loading: boolean;
    loadingMore: boolean;
    hasMore: boolean;
    addNote: (title: string, content: string, author_name: string) => Promise<string | null>;
    editNote: (id: string, title: string, content: string) => Promise<void>;
    getNoteById: (id: string) => Note | null;
    deleteNote: (id: string) => Promise<void>;
    updateNoteImage: (id: string, image_url: string) => Promise<void>;
    removeNoteImage: (id: string) => Promise<void>;
    fetchNotes: (start?: number, append?: boolean) => Promise<void>;
}

const Notes = React.createContext<NoteValues | null>(null);
export default function NotesProvider({ children }: { children: React.ReactNode }) {
    const [notes, setNotes] = React.useState<Note[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [loadingMore, setLoadingMore] = React.useState(false);
    const [hasMore, setHasMore] = React.useState(true);
    const { session } = useAuth();

    const PAGE_SIZE = 5;

    const fetchNotes = React.useCallback(async (start = 0, append = false) => {
        if (!session?.user.id) {
            setNotes([]);
            setHasMore(false);
            setLoading(false);
            setLoadingMore(false);
            return;
        }

        if (append) {
            setLoadingMore(true);
        } else {
            setLoading(true);
        }

        const { data, error } = await supabase
            .from('Notes')
            .select('*')
            .eq('user_id', session.user.id)
            .order('updated_at', { ascending: false })
            .range(start, start + PAGE_SIZE - 1);

        if (!error && data) {
            setNotes((prev) => (append ? [...prev, ...data] : data));
            setHasMore(data.length === PAGE_SIZE);
        }

        setLoading(false);
        setLoadingMore(false);
    }, [session]);

    // Fetch first page when user logs in
    React.useEffect(() => {
        if (session) {
            fetchNotes(0, false);
        } else {
            setNotes([]);
            setHasMore(false);
            setLoading(false);
            setLoadingMore(false);
        }
    }, [session, fetchNotes])

    // Delete Notes
    const deleteNote = async (id: string) => {
        await supabase.from('Notes').delete().eq('id', id);
        setNotes(prev => prev.filter(n => n.id !== id))
    };

    // Edit Notes
    const editNote = async (id: string, title: string, content: string) => {
        const { data, error } = await supabase
            .from('Notes')
            .update({ title, content, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            return;
        }

        setNotes(prev => prev.map(n => n.id === id ? data : n));
    };

    // Add Notes
    const addNote = async (title: string, content: string, author_name: string) => {
        const { data, error } = await supabase
            .from('Notes')
            .insert({ title, content, author_name })
            .select()
            .single()

        if (error) {
            return null;
        }

        setNotes(prev => [data, ...prev])
        return data.id;
    };

    // Update note image
    const updateNoteImage = async (id: string, image_url: string) => {
        const { data, error } = await supabase
            .from('Notes')
            .update({ image_url })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            return;
        }
        setNotes(prev => prev.map(n => n.id === id ? data : n));
    }

    // Remove note image
    const removeNoteImage = async (id: string) => {
        const note = getNoteById(id);

        if (note?.image_url) {
            const rawPath = note.image_url.split('/object/public/Media/')[1];
            if (rawPath) {
                const imagePath = decodeURIComponent(rawPath);
                const { data, error: storageError } = await supabase.storage
                    .from('Media')
                    .remove([imagePath]);

                if (storageError) {
                    return;
                }
            }
        }

        const { data, error } = await supabase
            .from('Notes')
            .update({ image_url: null })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            return;
        }
        setNotes(prev => prev.map(n => n.id === id ? data : n));
    }

    const getNoteById = (id: string) => notes.find((n) => n.id === id) || null;

    return (
        <Notes.Provider value={{ notes, loading, loadingMore, hasMore, addNote, getNoteById, deleteNote, editNote, updateNoteImage, removeNoteImage, fetchNotes }}>{children}</Notes.Provider>
    )
}

export function useNotes() {
    const context = React.useContext(Notes);
    if (!context) {
        throw new Error("useNotes must be used within a NotesProvider");
    }
    return context;
}