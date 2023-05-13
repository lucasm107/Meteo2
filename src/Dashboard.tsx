import React, { useEffect, useRef, useState } from 'react'
import DrawerConfig from './components/DrawerConfig'

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import useStoreWeatherHistory from './store';
import { ICurrentData } from './types';
import { FaBeer } from 'react-icons/fa';
import WindCompassAmchart from './components/WindCompassAmchart';

import CurrentTemp from './components/CurrentTemp';

import imgBgr from './mapa_neco.png';
import ForecastData from './components/ForecastData';

export const Dashboard = () => {

    const { updateDataWeather, showConfig, updateShowConfig } = useStoreWeatherHistory((state) => state)
    // const [firstName, updateFirstName] = useStore(
    //     (state) => [state.firstName, state.updateFirstName]
    // )
    const getCurrentWeather = async (): Promise<ICurrentData> => {
        const response = await axios.get(`https://api.weatherapi.com/v1/forecast.json?key=${import.meta.env.VITE_APP_API}&q=Necochea&aqi=no&days=3`);
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
    // const stopRefetchInterval = () => {
    //     clearInterval(refetchIntervalRef.current ?? undefined);
    // };
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
                <div className="flex flex-col sm:flex-row justify-center items-center p-3 sm:p-10 bg-slate-900 h-full gap-5">
                    <div className="w-full sm:w-1/2 flex-grow  sm:h-full text-center rounded  bg-no-repeat bg-center" style={{ backgroundImage: `url(${imgBgr})` }}>
                        {/* <WindCompass /> */}

                        <WindCompassAmchart forecastWeather={dataApi} loadingForecastWeather={isLoading} />

                    </div>
                    <div className="w-full sm:w-1/2 h-96 sm:h-full bg-slate-800 text-center text-white  rounded flex flex-col items-center justify-center overflow-hidden">

                        {/* <div className="w-full h-20 flex items-center justify-center"> */}
                        {/* {tempDirection() === 'up' ? (
                                <FaArrowAltCircleUp className="text-4xl" />
                            ) : (
                                <FaArrowAltCircleDown className="text-4xl" />
                            )} */}
                        {/* </div> */}

                        {!isLoading ? (
                            <>
                                <div className="text-center">
                                    <div className="w-full flex items-center justify-center">
                                        <img src={dataApi?.current?.condition?.icon} />
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


                        <div className='mt-8 w-full'>
                            {currentTab === 'today' && (
                                <div className='p-4'>
                                    <h2><button className='font-bold bg-inherit' onClick={() => handleTabChange('today')}>Today</button> | <button className='bg-inherit font-light' onClick={() => handleTabChange('tomorrow')}>Tomorrow</button></h2>
                                    <div className=''>
                                        {dataApi?.forecast.forecastday[0].hour && (
                                            <ForecastData items={
                                                dataApi?.forecast.forecastday[0].hour
                                                    .filter(hour => new Date(hour.time) > currentDate) // Filter elements based on date comparison
                                                    .slice(0, 12)} />

                                        )}
                                    </div>
                                </div>
                            )}

                            {currentTab === 'tomorrow' && (
                                <div className='p-4'>
                                    <h2><button className='font-light bg-inherit' onClick={() => handleTabChange('today')}>Today</button> | <button className='bg-inherit font-bold' onClick={() => handleTabChange('tomorrow')}>Tomorrow</button></h2>
                                    <div className=''>
                                        {dataApi?.forecast.forecastday[1].hour && (
                                            <ForecastData items={
                                                dataApi?.forecast.forecastday[1]?.hour
                                                    .filter(hour => new Date(hour.time) > currentDate) // mayores a la hs actual
                                                    .filter((_, index) => index % 2 === 0) // Filtrar solo las horas pares
                                                    .slice(0, 12)} />

                                        )}
                                    </div>
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
