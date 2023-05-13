import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface CurrentTempProps {
    items: Itemp[];
}
interface Itemp {
    id: number,
    value: number,
    type: 'st' | 'c'
}


const CurrentTemp = ({ items }: CurrentTempProps) => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const id = setInterval(() => {
            setIndex((state) => {
                if (state >= items.length - 1) return 0;
                return state + 1;
            });
        }, 10000);
        return () => clearInterval(id);
    }, []);

    return (
        <div style={{ position: "relative" }} className='w-full pb-5 h-40 '>
            <AnimatePresence>
                <motion.div
                    key={items[index].id}
                    initial={{ x: 60, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -30, opacity: 0 }}
                    transition={{ ease: "circIn", duration: 0.5 }}
                    style={{ position: "absolute", width: '100%' }}
                >
                    <h1 className='bg-gradient-to-r from-transparent to-slate-700 sm:text-8xl ' >
                        {items[index].value}°<span className="text-lg">{items[index].type}</span>
                    </h1>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default CurrentTemp;