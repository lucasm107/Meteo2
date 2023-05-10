import { useState } from "react";
import { FaBeer } from "react-icons/fa";
import useStoreWeatherHistory from "../../store";

const DrawerConfig = () => {
    const [open, setOpen] = useState(false);

    const { showConfig, updateShowConfig } = useStoreWeatherHistory((state) => state)

    return (
        <>
            <div
                className={`fixed top-0 left-0 h-full w-80 bg-gradient-to-r from-slate-900 to-black shadow-lg transform transition-transform ${showConfig ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                {/* Contenido del Drawer */}
                <div className="p-2">

                    <h1>Setup</h1>
                    <p className="text-sm ">Setup app</p>
                    <p>
                        <a href="https://www.weatherapi.com/" title="Free Weather API"><img src='//cdn.weatherapi.com/v4/images/weatherapi_logo.png' alt="Weather data by WeatherAPI.com" /></a>
                    </p>
                </div>
            </div>

            {/* <button type="button" className="text-white bg-pink-700 hover:bg-pink-800 focus:ring-4 focus:outline-none focus:ring-pink-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center mr-2 dark:bg-pink-600 dark:hover:bg-pink-700 dark:focus:ring-pink-800"
                onClick={() => updateShowConfig(!showConfig)}>
                <FaBeer />
                <span className="sr-only">Config</span>
            </button> */}
        </>
    );
};

export default DrawerConfig;