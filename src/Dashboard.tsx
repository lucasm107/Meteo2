import React, { useEffect, useRef, useState } from 'react'
import DrawerConfig from './components/DrawerConfig'
import { WindCompass } from './components/WindCompass'
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import useStoreWeatherHistory from './store';
import { ICurrentData } from './types';
import { FaArrowAltCircleDown, FaArrowAltCircleUp, FaBeer } from 'react-icons/fa';
import WindCompassAmchart from './components/WindCompassAmchart';
import { AnimatePresence, motion } from 'framer-motion';
import CurrentTemp from './components/CurrentTemp';

import imgBgr from './mapa_neco.png';

export const Dashboard = () => {

    const { firstName, updateFirstName, dataWeather, updateDataWeather, tempDirection, showConfig, updateShowConfig } = useStoreWeatherHistory((state) => state)
    // const [firstName, updateFirstName] = useStore(
    //     (state) => [state.firstName, state.updateFirstName]
    // )
    const getCurrentWeather = async (): Promise<ICurrentData> => {
        const response = await axios.get(`http://api.weatherapi.com/v1/forecast.json?key=${import.meta.env.VITE_APP_API}&q=Necochea&aqi=no&days=3`);
        return response.data as ICurrentData;
    };



    const { isLoading, error, data: dataApi, refetch } = useQuery({
        queryKey: ["currentWeather"],
        queryFn: getCurrentWeather,
        // Refetch the data every second
        refetchInterval: 1000 * 60,
    })


    // funcion OK :)= //////////////////////////////////////////////////////////
    // Referencia al intervalo activo
    const refetchIntervalRef = useRef<number | null>(null);

    // Iniciar el refetchInterval
    useEffect(() => {
        refetchIntervalRef.current = setInterval(() => {
            console.log('run refecth');
            refetch();
        }, 1000 * 60 * 15); // Intervalo de 5 segundos

        return () => {
            console.log('clear interval');
            // Limpiar el intervalo cuando el componente se desmonte
            clearInterval(refetchIntervalRef.current ?? undefined);
        };
    }, []);

    // Detener el refetchInterval
    const stopRefetchInterval = () => {
        clearInterval(refetchIntervalRef.current ?? undefined);
    };
    //////////////////////////////////////////////////////////////////////////////////


    useEffect(() => {
        console.log('dataApi', dataApi);
        if (dataApi?.current) {
            updateDataWeather(dataApi?.current)
        }
    }, [dataApi])

    const [currentTab, setCurrentTab] = useState('today'); // Estado para controlar la pestaña actual

    const handleTabChange = (tab: React.SetStateAction<string>) => {
        setCurrentTab(tab);
    };


    if (error) return <div>An error has occurred</div>

    const currentDate = new Date(); // Get the current date



    return (
        <div className=" w-screen h-screen flex flex-col">
            <div className="flex justify-end items-center h-14 ">
                {/* <DrawerConfig /> */}
                <button type="button" className="text-white bg-pink-700 hover:bg-pink-800 focus:ring-4 focus:outline-none focus:ring-pink-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center mr-2 dark:bg-pink-600 dark:hover:bg-pink-700 dark:focus:ring-pink-800"
                    onClick={() => updateShowConfig(!showConfig)}>
                    <FaBeer />
                    <span className="sr-only">Config</span>
                </button>
            </div>

            <div className="flex-grow bg-gradient-to-r from-indigo-900 opacity-80">
                <div className="flex justify-center items-center p-10 bg-slate-900 h-full gap-5">
                    <div className="w-1/2   text-center rounded h-full bg-no-repeat bg-center" style={{ backgroundImage: `url(${imgBgr})` }}>
                        {/* <WindCompass /> */}

                        <WindCompassAmchart forecastWeather={dataApi} loadingForecastWeather={isLoading} />

                    </div>
                    <div className="w-1/2 bg-slate-800 text-center text-white h-full rounded  ">
                        <div className="w-full h-20 flex items-center justify-center">
                            {/* {tempDirection() === 'up' ? (
                                <FaArrowAltCircleUp className="text-4xl" />
                            ) : (
                                <FaArrowAltCircleDown className="text-4xl" />
                            )} */}
                        </div>

                        {!isLoading ? (
                            <>
                                <div className="text-center">

                                    <div className="w-full flex items-center justify-center">
                                        <img src={dataApi?.current?.condition.icon} />
                                    </div>
                                    <p>{dataApi?.location?.name}</p>
                                </div>

                                {dataApi?.current?.temp_c && (
                                    <CurrentTemp items={[
                                        {
                                            id: 1,
                                            value: dataApi?.current?.temp_c,
                                            type: 'c'
                                        },
                                        {
                                            id: 2,
                                            value: dataApi?.current?.feelslike_c,
                                            type: 'st'
                                        }
                                    ]} />
                                )}

                            </>
                        ) : (
                            <h1>Loading...</h1>
                        )}
                        <div>Fase lunar</div>

                        <div className='mt-8'>
                            {currentTab === 'today' && (
                                <div className='p-10'>
                                    <h2><button className='font-bold bg-inherit' onClick={() => handleTabChange('today')}>Today</button> | <button className='bg-inherit font-light' onClick={() => handleTabChange('tomorrow')}>Tomorrow</button></h2>
                                    {dataApi?.forecast.forecastday[0].hour
                                        .filter(hour => new Date(hour.time) > currentDate) // Filter elements based on date comparison
                                        .slice(0, 6)
                                        .map(hour => {
                                            const formattedTime = new Date(hour.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                            return (
                                                <div className="flex bg-slate-700 text-white items-center justify-center m-4 rounded-md"
                                                    key={hour.time}>
                                                    {/* <img src={hour.condition.icon} /> */}
                                                    {/* {formattedTime} | {hour.temp_c}° | {hour.wind_dir} | {hour.wind_kph} */}
                                                    <div className="flex items-center justify-center h-10">
                                                        <div className="w-24 flex items-center justify-center">
                                                            <img src={hour.condition.icon} alt={hour.condition.text} />
                                                        </div>
                                                        <div className="bg-slate-900 p-3 shadow-lg">
                                                            {formattedTime}
                                                        </div>
                                                        <div className="bg-slate-800 p-3 w-16  shadow-lg">
                                                            {hour.temp_c}°
                                                        </div>
                                                        <div className="bg-slate-700 p-3 w-16 shadow-lg">
                                                            {hour.wind_dir}
                                                        </div>
                                                        <div className="bg-slate-600 p-3 w-24 shadow-lg">
                                                            {hour.wind_kph} <span className="text-xs">km/h</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        }
                                        )}
                                </div>
                            )}

                            {currentTab === 'tomorrow' && (
                                <div className='p-10'>
                                    <h2><button className='font-light bg-inherit' onClick={() => handleTabChange('today')}>Today</button> | <button className='bg-inherit font-bold' onClick={() => handleTabChange('tomorrow')}>Tomorrow</button></h2>
                                    {dataApi?.forecast.forecastday[1]?.hour
                                        .filter(hour => new Date(hour.time) > currentDate) // mayores a la hs actual
                                        .filter((_, index) => index % 2 === 0) // Filtrar solo las horas pares
                                        .slice(0, 6)
                                        .map(hour => {
                                            const formattedTime = new Date(hour.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                            return (
                                                <div className="flex bg-slate-700 text-white items-center justify-center m-4 rounded-md"
                                                    key={hour.time}>
                                                    {/* <img src={hour.condition.icon} /> */}
                                                    {/* {formattedTime} | {hour.temp_c}° | {hour.wind_dir} | {hour.wind_kph} */}
                                                    <div className="flex items-center justify-center h-10">
                                                        <div className="w-24 flex items-center justify-center">
                                                            <img src={hour.condition.icon} alt={hour.condition.text} />
                                                        </div>
                                                        <div className="bg-slate-900 p-3  shadow-lg">
                                                            {formattedTime}
                                                        </div>
                                                        <div className="bg-slate-800 p-3 w-16  shadow-lg">
                                                            {hour.temp_c}°
                                                        </div>
                                                        <div className="bg-slate-700 p-3 w-16 shadow-lg">
                                                            {hour.wind_dir}
                                                        </div>
                                                        <div className="bg-slate-600 p-3 w-24 shadow-lg">
                                                            {hour.wind_kph} <span className="text-xs">km/h</span>
                                                        </div>

                                                    </div>
                                                </div>
                                            )
                                        }
                                        )}
                                </div>
                            )}
                        </div>



                    </div>
                </div>
            </div>


            <DrawerConfig />




            <div className=" bg-slate-700 text-center text-white text-xs p-1 font-extralight">
                {dataApi?.current.last_updated}
            </div>


        </div>
    )
}
