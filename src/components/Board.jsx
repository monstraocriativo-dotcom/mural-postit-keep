import { useState, useEffect } from 'react';
import PostIt from './PostIt';
import { Plus } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../lib/supabase';
import { useUser } from '@clerk/clerk-react';

export default function Board() {
    const { user } = useUser();
    const [notes, setNotes] = useState([]);

    useEffect(() => {
        if (!user) return;

        // Fetch initial notes
        const fetchNotes = async () => {
            const { data, error } = await supabase
                .from('notes')
                .select('*')
                .eq('user_id', user.id);

            if (error) {
                console.error("Erro ao buscar notas no Supabase:", error);
                return;
            }

            if (data) {
                const formattedNotes = data.map(dbNote => ({
                    id: dbNote.id,
                    text: dbNote.text || '',
                    color: dbNote.color,
                    position: { x: dbNote.position_x, y: dbNote.position_y }
                }));
                setNotes(formattedNotes);
            }
        };

        fetchNotes();
    }, [user]);

    const updatePosition = async (id, newPos) => {
        setNotes((prev) =>
            prev.map((note) => (note.id === id ? { ...note, position: newPos } : note))
        );

        if (user) {
            const { error } = await supabase
                .from('notes')
                .update({ position_x: newPos.x, position_y: newPos.y })
                .eq('id', id)
                .eq('user_id', user.id);
            if (error) console.error("Erro ao atualizar posição no Supabase:", error);
        }
    };

    const updateContent = async (id, newText) => {
        setNotes((prev) =>
            prev.map((note) => (note.id === id ? { ...note, text: newText } : note))
        );

        if (user) {
            const { error } = await supabase
                .from('notes')
                .update({ text: newText })
                .eq('id', id)
                .eq('user_id', user.id);
            if (error) console.error("Erro ao atualizar texto no Supabase:", error);
        }
    };

    const addNote = async () => {
        if (!user) {
            console.error("Erro: Tentativa de criar nota sem usuário logado no Clerk.");
            return;
        }

        const newNote = {
            id: uuidv4(),
            text: '',
            color: ['#fef08a', '#fbcfe8', '#bbf7d0', '#bfdbfe', '#e5e7eb'][Math.floor(Math.random() * 5)],
            position: { x: window.innerWidth / 2 - 100, y: window.innerHeight / 2 - 100 },
        };

        setNotes((prev) => [...prev, newNote]);

        console.log("Tentando inserir no Supabase a nota:", {
            id: newNote.id,
            user_id: user.id,
            color: newNote.color,
            position_x: newNote.position.x,
            position_y: newNote.position.y
        });

        const { error, data, status } = await supabase
            .from('notes')
            .insert({
                id: newNote.id,
                user_id: user.id,
                text: newNote.text,
                color: newNote.color,
                position_x: newNote.position.x,
                position_y: newNote.position.y
            });

        if (error) {
            console.error("Erro Fatal do Supabase ao tentar INSERIR nota:", error);
            console.error("Detalhes do erro:", error.message, error.details, error.hint);
        } else {
            console.log("Supabase Insert Success. Status:", status, data);
        }
    };

    return (
        <div className="relative w-full h-full overflow-hidden">
            {notes.map((note) => (
                <PostIt
                    key={note.id}
                    note={note}
                    updatePosition={updatePosition}
                    updateContent={updateContent}
                />
            ))}
            <button
                onClick={addNote}
                className="absolute bottom-8 right-8 bg-black hover:bg-neutral-800 text-white p-4 rounded-full shadow-lg hover:scale-105 transition-all z-50 flex items-center gap-2 group"
            >
                <Plus size={24} className="group-hover:rotate-90 transition-transform" />
                <span className="font-semibold pr-2">Novo Post-it</span>
            </button>
        </div>
    );
}
