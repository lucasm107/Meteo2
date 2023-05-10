import React, { useEffect, useLayoutEffect } from 'react';

import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import * as am5radar from "@amcharts/amcharts5/radar";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

import mapa_neco from './mapa_neco.png';
import { ICurrentData } from '../../types';
import useStoreWeatherHistory from '../../store';

interface WindCompassProps {
    forecastWeather: ICurrentData | undefined;
    loadingForecastWeather: boolean;
}

const WindCompassAmchart = ({ forecastWeather, loadingForecastWeather }: WindCompassProps) => {

    //   const { data: forecastWeather, loading: loadingForecastWeather, reload: reloadForecast } = GetForecastWeather();
    // const dataStorage = localStorage.getItem('data');
    // const data = dataStorage !== null ? JSON.parse(dataStorage) : null;
    // const data = forecastWeather.
    const { dataWeather } = useStoreWeatherHistory((state) => state)


    useEffect(() => {
        console.log('loadingForecastWeather', loadingForecastWeather)
        console.log('forecastWeather', forecastWeather)
    }, [forecastWeather]);

    useEffect(() => {
        const interval = setInterval(() => {
            console.log('ini reload..')
            // reloadForecast()
        }, (1000 * 60 * 10));

        return () => clearInterval(interval)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useLayoutEffect(() => {

        let root = am5.Root.new("chartdiv");
        root.setThemes([
            am5themes_Animated.new(root)
        ]);

        // secondsDataItem.set("value", currentWeather?.current?.wind_degree);

        // Create chart
        // https://www.amcharts.com/docs/v5/charts/radar-chart/
        var chart = root.container.children.push(am5radar.RadarChart.new(root, {
            panX: false,
            panY: false
        }));

        // Create axis and its renderer
        // https://www.amcharts.com/docs/v5/charts/radar-chart/gauge-charts/#Axes
        var axisRenderer = am5radar.AxisRendererCircular.new(root, {
            innerRadius: -15,
            strokeOpacity: 0,
            strokeWidth: 0,
            minGridDistance: 360,

        });

        var xAxis = chart.xAxes.push(am5xy.ValueAxis.new(root, {
            maxDeviation: 0,
            min: 0,
            max: 360,
            strictMinMax: true,
            renderer: axisRenderer,

            maxPrecision: 0
        }));

        axisRenderer.grid.template.setAll({
            forceHidden: true
        });
        axisRenderer.labels.template.setAll({
            forceHidden: true
        });


        // second axis
        // https://www.amcharts.com/docs/v5/charts/radar-chart/gauge-charts/#Axes
        var secondAxisRenderer = am5radar.AxisRendererCircular.new(root, {
            innerRadius: -10,
            radius: am5.percent(95),
            strokeOpacity: 0,
            minGridDistance: 10
        });

        var secondXAxis = chart.xAxes.push(am5xy.ValueAxis.new(root, {
            maxDeviation: 0,
            min: 0,
            max: 360,
            strictMinMax: true,
            renderer: secondAxisRenderer,
            maxPrecision: 0
        }));


        // hides 0 value
        axisRenderer.labels.template.setAll({
            minPosition: 0.02,
            // textType: "adjusted",
            inside: true,
            radius: 25
        });
        axisRenderer.grid.template.set("strokeOpacity", 1);


        secondAxisRenderer.labels.template.setAll({
            forceHidden: true
        });
        secondAxisRenderer.grid.template.setAll({
            forceHidden: true
        });
        secondAxisRenderer.ticks.template.setAll({
            strokeOpacity: 1,
            minPosition: 0.01,
            visible: true,
            inside: true,
            length: 20
        });


        // seconds
        var secondsDataItem = xAxis.makeDataItem({});
        var secondsHand = am5radar.ClockHand.new(root, {
            radius: am5.percent(98),
            innerRadius: -60,
            topWidth: 5,
            bottomWidth: 5,
            pinRadius: 0,
            layer: 10
        })

        // secondsHand.hand.set("fill", am5.color('#5E33FF'));
        // secondsHand.pin.set("fill", am5.color(0xff0000));

        secondsDataItem.set("bullet", am5xy.AxisBullet.new(root, {
            sprite: secondsHand
        }));

        xAxis.createAxisRange(secondsDataItem);

        secondsDataItem.get("grid")?.set("visible", false);



        var label = chart.radarContainer.children.push(am5.Label.new(root, {
            fontSize: "4em",
            centerX: am5.p50,
            centerY: 75,
            fill: am5.color("#FF0000"),

        }));
        var labelSpeed = chart.radarContainer.children.push(am5.Label.new(root, {
            fontSize: "1.5em",
            centerX: am5.p50,
            centerY: -10,
            background: am5.Rectangle.new(root, {
                fill: am5.color('#333333'),
                fillOpacity: 0.5
            })
        }));
        var labelWindGust = chart.radarContainer.children.push(am5.Label.new(root, {
            fontSize: "0.75em",
            centerX: am5.p50,
            centerY: -40
        }));


        if (loadingForecastWeather === false) {
            //     //////////////////////////////////////////////////////////////////
            // label.set("text", data[data.length - 1].wind_dir)
            label.set("text", forecastWeather?.current.wind_dir)
            // labelSpeed.set("text", "[bold]" + data[data.length - 1].wind_kph + "[/] km/h");
            labelSpeed.set("text", "[bold]" + forecastWeather?.current.wind_kph + "[/] km/h");
            labelWindGust.set("text", "[bold]" + forecastWeather?.current.gust_kph + "[/] km/h");

            secondsDataItem.animate({
                key: "value",
                from: 0,
                // to: forecastWeather?.current?.wind_degree,
                to: forecastWeather?.current.wind_degree,
                duration: 500
            });
            //     ////////////////////////////////////////////////////////////////////
        }




        if (dataWeather.length > 0) {
            const cantHistoryLength = 100;
            let i = 0;
            for (let history of dataWeather.slice(-cantHistoryLength).reverse()) {
                console.log('history wind_kph', history.wind_kph);
                createSeries(history, xAxis, root, i, cantHistoryLength, '#FF9C33')
                i++;
            }
        }


        const arr_Future_hours = 6;
        const currentHour = new Date().getHours();

        for (let i = 0; i < arr_Future_hours; i++) {
            const hourIndex = (currentHour + i) % 24;
            if (forecastWeather?.forecast?.forecastday) {
                console.log('history fut wind_kph', i, forecastWeather?.forecast?.forecastday[0].hour[hourIndex]);
                console.log('history fut wind_kph', forecastWeather?.forecast?.forecastday[0].hour[hourIndex].wind_kph);
                createSeriesFuture(
                    forecastWeather?.forecast?.forecastday[0].hour[hourIndex],
                    xAxis,
                    root,
                    i,
                    arr_Future_hours,
                    '#00B300'
                );
            }
        }


        return () => {
            root.dispose();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loadingForecastWeather]);


    const createSeries = (data: any, xAxis: any, root: any, i: number, total: number, color: string = '#cecece') => {

        var dataItem = xAxis.makeDataItem({});
        var dataItemHand = am5radar.ClockHand.new(root, {
            radius: am5.percent(98),
            // innerRadius: -5,
            innerRadius: (-50) + data.wind_kph,
            topWidth: 5,
            bottomWidth: 5,
            pinRadius: 0,
            layer: 6
        })


        // var positiveColor = root.interfaceColors.get("positive");
        var negativeColor = root.interfaceColors.get("negative");
        if (negativeColor) {
            dataItemHand.hand.set("fill", am5.Color.lighten(am5.color('#5a00b3'), (i / total)));
        }
        // dataItemHand.pin.set("fill", am5.color(color));
        // dataItemHand.pin.set("fill", am5.Color.lighten(negativeColor, (i / total)));
        // dataItemHand.pin.set("fill", am5.color('#5E33FF'));
        // dataItemHand.pin.set("fill", am5.color('#00FF00'));
        dataItemHand.pin.set("fill", am5.color('#00B300'));

        dataItem.set("bullet", am5xy.AxisBullet.new(root, {
            sprite: dataItemHand
        }));

        xAxis.createAxisRange(dataItem);
        dataItem.get("grid")?.set("visible", false);
        dataItem.set("value", data.wind_degree);

    }
    const createSeriesFuture = (data: any, xAxis: any, root: any, i: number, total: number, color: string = '#cecece') => {

        if (!data.wind_kph) {
            console.error(data)
            return false
        }
        var dataItem = xAxis.makeDataItem({});
        var dataItemHand = am5radar.ClockHand.new(root, {
            radius: am5.percent(98),
            // innerRadius: -5,
            innerRadius: (-50) + data.wind_kph,
            topWidth: 5,
            bottomWidth: 5,
            pinRadius: 0,
            layer: 7
        })


        var positiveColor = root.interfaceColors.get("positive");
        // var negativeColor = root.interfaceColors.get("negative");
        if (positiveColor) {
            dataItemHand.hand.set("fill", am5.Color.lighten(positiveColor, (i / total)));
        }
        dataItemHand.pin.set("fill", am5.color('#00B300'));

        dataItem.set("bullet", am5xy.AxisBullet.new(root, {
            sprite: dataItemHand
        }));

        xAxis.createAxisRange(dataItem);
        dataItem.get("grid")?.set("visible", false);
        dataItem.set("value", data.wind_degree);

    }


    return (
        <>
            <div id="chartdiv" style={{ height: "100%" }} className=""></div>
        </>

    );
}

export default WindCompassAmchart;
