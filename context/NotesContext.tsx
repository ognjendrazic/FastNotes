import { supabase } from '@/lib/supabase';
import React from 'react';
import { useAuth } from './AuthContext';

export interface Note {
  id: string;
  title: string;
  content: string;
  updated_at: string;
}

interface NoteValues {
    notes: Note[];
    loading: boolean;
    addNote: (title: string, content: string) => Promise<string | null>;
    getNoteById: (id: string) => Note | null;
    deleteNote: (id: string) => Promise<void>;
}

const Notes = React.createContext<NoteValues | null>(null);
export default function NotesProvider({ children }: { children: React.ReactNode }) {
    const [notes, setNotes] = React.useState<Note[]>([]);
    const [loading, setLoading] = React.useState(true);
    const { session } = useAuth();

    // Fetch notes 
    const fetchNotes = async() => {
        setLoading(true);
        const {data, error} = await supabase
        .from('Notes')
        .select('*')
        .order('updated_at', { ascending: false })
        if(!error && data){
            setNotes(data);
        }else{
            setLoading(false);
            console.log("Error fetching notes:", error);
        }
        setLoading(false)
    }

    // Fetch notes when user logs in
    React.useEffect(() => {
        if(session){
            fetchNotes();
        }else{
            setNotes([]);
            setLoading(false);
        }
    }, [session])

    // Delete Notes
    const deleteNote = async (id: string) => {
        await supabase.from('Notes').delete().eq('id', id);
        setNotes(prev => prev.filter(n => n.id !== id))
    };

    // Add Notes
    const addNote = async (title: string, content: string) => {
        const { data, error } = await supabase
        .from('Notes')
        .insert({title, content})
        .select()
        .single()

        if (error) {
            console.log('Error adding note', error)
            return null;
        }

        setNotes(prev => [data, ...prev])
        return data.id;
    };

    const getNoteById = (id: string) => notes.find((n) => n.id === id) || null;

    return (
        <Notes.Provider value={{ notes, loading, addNote, getNoteById, deleteNote }}>{children}</Notes.Provider>
    )
}

export function useNotes(){
    const context = React.useContext(Notes);
    if(!context){
        throw new Error("useNotes must be used within a NotesProvider");
    }
    return context;
}