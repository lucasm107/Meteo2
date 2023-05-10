import { useEffect, useRef, useState } from "react";
import * as d3 from 'd3';

export const WindCompass = () => {
    const svgRef = useRef();
    const [width, setWidth] = useState();

    useEffect(() => {
        if (!width) return

        const svg = d3.select(svgRef.current);

        // Limpia el lienzo antes de dibujar el nuevo gráfico
        svg.selectAll("*").remove();

        // Definir las constantes
        // const width = 600;
        const height = 400;
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) / 2 - 20;

        // Crear el grupo que contendrá los elementos
        const g = svg.append('g')
            .attr('transform', `translate(${centerX},${centerY})`);

        // Dibujar el círculo exterior
        g.append('circle')
            .attr('r', radius)
            .style('fill', 'none')
            .style('stroke', 'black')
            .style('stroke-width', '1px');

        // Dibujar los puntos cardinales
        const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
        const directionAngles = [0, 45, 90, 135, 180, 225, 270, 315];

        const directionsGroup = g.append('g');
        directionsGroup.selectAll('text')
            .data(directions)
            .join('text')
            .attr('x', (d, i) => {
                const angle = directionAngles[i] * Math.PI / 180;
                return radius * Math.sin(angle);
            })
            .attr('y', (d, i) => {
                const angle = directionAngles[i] * Math.PI / 180;
                return -radius * Math.cos(angle);
            })
            .text(d => d)
            .style('font-size', '24px')
            .style('text-anchor', 'middle')
            .style('dominant-baseline', 'central');

        // Dibujar la aguja
        const needleLength = radius - 20;
        const needleAngle = 30; // Cambiar para simular rotación

        const needleGroup = g.append('g');
        needleGroup.append('line')
            .attr('x1', 0)
            .attr('y1', 0)
            .attr('x2', needleLength * Math.sin(needleAngle))
            .attr('y2', -needleLength * Math.cos(needleAngle))
            .style('stroke', 'blue')
            .style('stroke-width', '8px')
            .style('stroke-linecap', 'round');

        // // Agrega una segunda aguja en rojo
        // const needle2 = g.append('line')
        //     .attr('x1', 0)
        //     .attr('y1', 0)
        //     .attr('x2', 0)
        //     .attr('y2', -centerY * 0.6)
        //     .attr('stroke', 'red')
        //     .attr('stroke-width', 2)
        //     .attr('stroke-linecap', 'round')
        //     .attr('transform', 'rotate(45)');

        // Define las coordenadas de inicio de la aguja
        const startAngle = 45; // Ángulo de inicio en grados
        const startLength = centerY * 0.6; // Longitud desde el centro

        // Calcula las coordenadas x1 y y1
        const startX = centerX + Math.sin(startAngle * Math.PI / 180) * startLength;
        const startY = centerY - Math.cos(startAngle * Math.PI / 180) * startLength;

        // Agrega la segunda aguja en rojo
        const needle2 = g.append('line')
            .attr('x1', startX)
            .attr('y1', startY)
            .attr('x2', centerX)
            .attr('y2', -centerY * 0.6)
            .attr('stroke', 'red')
            .attr('stroke-width', 2)
            .attr('stroke-linecap', 'round')
            .attr('transform', `rotate(${startAngle}, ${centerX}, ${centerY})`);

    }, [width]);


    useEffect(() => {
        const handleResize = () => {
            const parentWidth = svgRef?.current?.parentNode.getBoundingClientRect().width;
            setWidth(parentWidth);
            console.log('resize', parentWidth);
        };


        window.addEventListener('resize', handleResize);

        // Initial width calculation
        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);



    return (
        <>
            <div style={{ width: '100%' }}>
                <svg ref={svgRef} width="100%" height="400" />
            </div>
        </>
    );
}
