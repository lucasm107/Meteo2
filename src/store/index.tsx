import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { WeatherData } from "../types";



interface StoreState {
    firstName: string;
    lastName: string;
    showConfig: boolean;
    dataWeather: WeatherData[],
    updateFirstName: (firstName: string) => void;
    updateLastName: (lastName: string) => void;
    updateDataWeather: (value: WeatherData) => void;
    updateShowConfig: (value: boolean) => void;
    tempDirection: () => 'up' | 'down';
    // addToMyArray: (value: any) => set((state) => ({ myArray: [...state.myArray, value] })),
}

// Create your store, which includes both state and (optionally) actions
// const useStore = create<State & Action>((set) => ({
//     firstName: 'xxxxx',
//     lastName: '',
//     updateFirstName: (firstName) => set(() => ({ firstName: firstName })),
//     updateLastName: (lastName) => set(() => ({ lastName: lastName })),
// }))

const useStoreWeatherHistory = create<StoreState>()(
    persist(
        (set, get) => ({
            firstName: 'xxxxx',
            lastName: '',
            showConfig: false,
            updateShowConfig: (show) => set(() => ({ showConfig: show })),
            dataWeather: [],
            updateFirstName: (firstName) => set(() => ({ firstName: firstName })),
            updateLastName: (lastName) => set(() => ({ lastName: lastName })),
            updateDataWeather: (value: WeatherData) => set((state) => {
                // Realizar validaciones y filtrado antes de agregar el elemento
                console.log(value.last_updated);

                // controlo si no existe otro elemento con last_updated_epoch igual
                const exist = state.dataWeather.find(x => x.last_updated_epoch === value.last_updated_epoch);
                console.log('exist', exist);
                if (exist) {
                    return state;
                }


                // Agregar el elemento al array dataWeather
                return {
                    dataWeather: [...state.dataWeather, value],
                };
            }),
            tempDirection: () => {
                // console.log(get().dataWeather[get().dataWeather.length - 1].temp_c);
                // if (get().dataWeather[get()?.dataWeather.length - 1].temp_c > get()?.dataWeather[get().dataWeather.length - 2].temp_c) {
                //     return 'up'
                // } else {
                //     return 'down'
                // }
                return 'down'
            }




            ,
            // clearDataWeather: (value: WeatherData) => set(() => ({ dataWeather: [] }))
        }),
        {
            name: 'meteo-storage', // name of item in the storage (must be unique)
            storage: createJSONStorage(() => sessionStorage), // (optional) by default the 'localStorage' is used
            // partialize: (state) => ({ bears: state.bears }),
        }
    )
)

export default useStoreWeatherHistory;