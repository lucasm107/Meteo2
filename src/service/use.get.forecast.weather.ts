import axios from "axios";

import { useCallback, useEffect, useState } from "react";

export const GetForecastWeather = () => {
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean | null>(null);
  const [error, setError] = useState<string>("");
  const [reloadData, setReloadData] = useState<boolean>(false);

  useEffect(() => {
    
      setLoading(true);

      const source = axios.CancelToken.source();
      var url = `http://api.weatherapi.com/v1/forecast.json?key=${process.env.REACT_APP_API}&q=Necochea&days=3&aqi=no&alerts=no`;

      axios
        .get(url, {
          cancelToken: source.token,
        })
        .then((res) => {
          res.data && setData(res.data);

          const context = localStorage.getItem('data');
          if(context){
            const dataContextObj = context !== null ? JSON.parse(context) : null;

            if( dataContextObj[ dataContextObj.length - 1].last_updated !== res.data.current.last_updated ){
              dataContextObj.push(res.data.current);
              dataContextObj.sort((a: { last_updated_epoch: number; name: number; }, b: { last_updated_epoch: number; name: number; }) => a.last_updated_epoch < b.last_updated_epoch ? - 1 : Number(a.name > b.name))
              localStorage.setItem('data', JSON.stringify(dataContextObj));
            }

          }else{
            localStorage.setItem('data', JSON.stringify([res.data.current]));
          }

          

          setLoading(false);
        })
        .catch((err) => {
          console.log("err GetForecastWeather", err);
          setLoading(false);
          setError("Err loading GetForecastWeather");
        });
        return () => {
          source.cancel();
        };
    

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reloadData]);

  const reload = useCallback(() => {
    console.log("reload..");
    setReloadData((s) => !s);
  }, []);

  return { data, loading, error, reload };
};

export default GetForecastWeather;
