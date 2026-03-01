import React from 'react';

export type Note = {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
}

type NoteValues = {
    notes: Note[];
    addNote: (title: string, content: string) => string;
    getNoteById: (id: string) => Note | null;
}

const Notes = React.createContext<NoteValues | null>(null);
export default function NotesProvider({ children }: { children: React.ReactNode }) {
    const [notes, setNotes] = React.useState<Note[]>([]);

    const addNote = (title: string, content: string) => {
        const newId = (Date.now()).toString();
        
        const now = new Date();
        const newUpdate = now.toLocaleDateString();
        const newTime = now.toLocaleTimeString();
        
        setNotes(prevNotes => [{
            id: newId,
            title,
            content,
            updatedAt: newUpdate + " " + newTime
        }, ...prevNotes]);
        return newId;
    }

    const getNoteById = (id: string) => notes.find((n) => n.id === id) || null;

    return (
        <Notes.Provider value={{ notes, addNote, getNoteById }}>{children}</Notes.Provider>
    )
}

export function useNotes(){
    const context = React.useContext(Notes);
    if(!context){
        throw new Error("useNotes must be used within a NotesProvider");
    }
    return context;
}