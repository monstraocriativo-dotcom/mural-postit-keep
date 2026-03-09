import { useState, useEffect } from 'react';
import { motion, useMotionValue } from 'framer-motion';

export default function PostIt({ note, updatePosition, updateContent }) {
    const x = useMotionValue(note.position.x);
    const y = useMotionValue(note.position.y);
    const [localText, setLocalText] = useState(note.text);

    // Sync with prop if it changes externally
    useEffect(() => {
        setLocalText(note.text);
    }, [note.text]);

    const handleBlur = () => {
        if (localText !== note.text) {
            updateContent(note.id, localText);
        }
    };

    return (
        <motion.div
            style={{ x, y, backgroundColor: note.color }}
            drag
            dragMomentum={false}
            onDragEnd={() => {
                updatePosition(note.id, { x: x.get(), y: y.get() });
            }}
            whileDrag={{
                scale: 1.05,
                boxShadow: "0px 15px 25px rgba(0,0,0,0.2)",
                cursor: "grabbing",
                zIndex: 50
            }}
            className="absolute w-56 h-56 flex flex-col shadow-md transition-shadow rounded-sm z-10 focus-within:z-20 border border-black/5 overflow-hidden"
        >
            {/* Drag Handle Top Bar */}
            <div
                className="w-full h-8 bg-black/5 cursor-grab active:cursor-grabbing hover:bg-black/10 transition-colors flex justify-end p-2"
                onPointerDown={(e) => {
                    // ensure child inputs lose focus to drag cleanly
                    e.target.focus();
                }}
            />

            {/* Content Area */}
            <div className="flex-1 p-4 pb-4">
                <textarea
                    className="w-full h-full bg-transparent resize-none outline-none text-gray-800 font-medium placeholder-gray-500/50"
                    placeholder="Escreva algo..."
                    value={localText}
                    onChange={(e) => setLocalText(e.target.value)}
                    onBlur={handleBlur}
                    // Impede que o evento de mousedown no textarea acione o drag do framer motion
                    onPointerDownCapture={(e) => e.stopPropagation()}
                />
            </div>
        </motion.div>
    );
}
