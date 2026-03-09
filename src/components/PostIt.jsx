import { useState, useEffect } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import { Palette } from 'lucide-react';

export default function PostIt({ note, updatePosition, updateContent, updateColor }) {
    const x = useMotionValue(note.position.x);
    const y = useMotionValue(note.position.y);
    const [localText, setLocalText] = useState(note.text);
    const [localColor, setLocalColor] = useState(note.color);

    // Sync with prop if it changes externally
    useEffect(() => {
        setLocalText(note.text);
    }, [note.text]);

    useEffect(() => {
        setLocalColor(note.color);
    }, [note.color]);

    const handleBlur = () => {
        if (localText !== note.text) {
            updateContent(note.id, localText);
        }
    };

    const handleColorBlur = () => {
        if (localColor !== note.color) {
            updateColor(note.id, localColor);
        }
    };

    return (
        <motion.div
            style={{ x, y, backgroundColor: localColor }}
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
            className="absolute w-56 h-56 flex flex-col shadow-md transition-shadow rounded-sm z-10 focus-within:z-20 border border-black/5 overflow-visible"
        >
            {/* Drag Handle Top Bar */}
            <div
                className="w-full h-8 bg-black/5 cursor-grab active:cursor-grabbing hover:bg-black/10 transition-colors flex justify-between items-center px-3"
                onPointerDown={(e) => {
                    // ensure child inputs lose focus to drag cleanly
                    if (e.target.tagName !== 'INPUT') {
                        e.target.focus();
                    }
                }}
            >
                {/* Color Picker Button Area */}
                <div
                    title="Personalizar Cor"
                    className="relative w-5 h-5 rounded-full overflow-hidden flex items-center justify-center hover:scale-110 transition-transform bg-white/50 shadow-sm border border-black/10 cursor-pointer"
                    onPointerDownCapture={(e) => e.stopPropagation()}
                >
                    <Palette size={12} className="absolute text-black/60 pointer-events-none" />
                    <input
                        type="color"
                        value={localColor}
                        onChange={(e) => setLocalColor(e.target.value)}
                        onBlur={handleColorBlur}
                        className="opacity-0 w-[300%] h-[300%] absolute top-[-50%] left-[-50%] cursor-pointer"
                    />
                </div>
            </div>

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
