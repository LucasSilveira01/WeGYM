import React from "react";
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';



ChartJS.register(ArcElement, Tooltip, Legend);
const DoughnutChart = (calories, render) => {
    console.log(render)
    const data = {
        labels: ['Calorias Gastas'],
        datasets: [
            {
                backgroundColor: ["#FCA311", "#000"], // Cor de fundo das áreas sob a linha
                data: [calories.calories, calories.calories - 200],
                borderWidth: 0,
            },
        ],
    };

    const options = {
        plugins: {
            legend: {
                display: true,
                position: "top", // Posição da legenda (top, bottom, left, right)
            },
            title: {
                display: true,
                text: 'Calorias Gastas',
                color: '#fff'
            },
            animation: {
                onComplete: (chart) => {
                    render(chart);
                }
            }
        },
    };


    return (
        <div>
            <Doughnut data={data} options={options} />
        </div>
    );
};

export default DoughnutChart;