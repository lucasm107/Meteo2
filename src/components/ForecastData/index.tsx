import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Hour } from '../../types';

interface ForecastDataProps {
    items: Hour[];
}



const ForecastData = ({ items }: ForecastDataProps) => {
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
        <div style={{ position: "relative", overflow: "hidden" }} className='w-full h-48  '>
            <AnimatePresence>
                <motion.div
                    // key={items[index].id}
                    key={index}
                    initial={{ x: 90, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -60, opacity: 0 }}
                    transition={{ ease: "easeInOut" }}
                    style={{ position: "absolute", width: '100%' }}
                >
                    <div className="flex bg-slate-700 text-white items-center justify-center m-4 rounded-md "
                        key={items[index].time}>
                        <div className="flex items-center justify-center h-10">
                            <div className="w-24 flex items-center justify-center">
                                <img src={items[index].condition.icon} alt={items[index].condition.text} />
                            </div>
                            <div className="bg-slate-900 p-3 shadow-lg">
                                {new Date(items[index].time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                            <div className="bg-slate-800 p-3 w-16  shadow-lg">
                                {items[index].temp_c}°
                            </div>
                            <div className="bg-slate-700 p-3 w-16 shadow-lg">
                                {items[index].wind_dir}
                            </div>
                            <div className="bg-slate-600 p-3 w-24 shadow-lg">
                                {items[index].wind_kph} <span className="text-xs">km/h</span>
                            </div>
                        </div>
                    </div>
                    {(index + 1) <= (items.length - 1) && (
                        <div className="flex bg-slate-700 text-white items-center justify-center m-4 rounded-md "
                            key={items[index + 1].time}>
                            <div className="flex items-center justify-center h-10">
                                <div className="w-24 flex items-center justify-center">
                                    <img src={items[index + 1].condition.icon} alt={items[index + 1].condition.text} />
                                </div>
                                <div className="bg-slate-900 p-3 shadow-lg">
                                    {new Date(items[index + 1].time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                                <div className="bg-slate-800 p-3 w-16  shadow-lg">
                                    {items[index + 1].temp_c}°
                                </div>
                                <div className="bg-slate-700 p-3 w-16 shadow-lg">
                                    {items[index + 1].wind_dir}
                                </div>
                                <div className="bg-slate-600 p-3 w-24 shadow-lg">
                                    {items[index + 1].wind_kph} <span className="text-xs">km/h</span>
                                </div>
                            </div>
                        </div>
                    )}

                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default ForecastData;