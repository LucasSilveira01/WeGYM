import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';


ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);
const DoughnutChart = (calories, labels, render) => {
    const { theme } = useTheme();

    const data = {
        labels: calories.labels,
        datasets: [
            {
                label: 'Calorias Gastas',
                backgroundColor: ["#FCA311"], // Cor de fundo das áreas sob a linha
                data: calories.calories,
                borderColor: '#FCA311',
            },
        ],
    };


    var options = [];
    if (theme == 'light') {
        options = {
            plugins: {
                legend: {
                    display: true,
                    position: "top", // Posição da legenda (top, bottom, left, right)
                },
                title: {
                    display: true,
                    text: 'Calorias Gastas',
                    color: '#000'
                },

                animation: {
                    onComplete: (chart) => {
                        render(chart);
                    }
                }
            },
            scales: {
                y: {
                    ticks: {
                        color: '#000',
                    }
                },
                x: {
                    ticks: {
                        color: '#000',
                    }
                }
            },
        };
    } else {
        options = {
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
            scales: {
                y: {
                    ticks: {
                        color: '#fff',
                    }
                },
                x: {
                    ticks: {
                        color: '#fff',
                    }
                }
            },
        };
    }
    return (
        <div>
            <Line data={data} options={options} width={750} height={350} />
        </div>
    );
};

export default DoughnutChart;