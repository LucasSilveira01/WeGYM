import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import { useEffect, useState } from 'react';

export default function Chart({ chartType }) {
    const [data, setData] = useState([]);
    const borderColor = chartType === 'bf' ? '#f3a93b' : '#54c2d8';
    const backgroundColor = chartType === 'bf' ? '#f3a93b' : '#54c2d8';

    useEffect(() => {
        const id = localStorage.getItem('id');
        const apiUrl = 'http://localhost:5000/get_all_measures/' + id;

        function fetchData() {
            fetch(apiUrl)
                .then(response => response.json())
                .then(apiData => {
                    if (apiData && Array.isArray(apiData)) {
                        const labels = apiData.map(item => item.data);
                        const datasetLabel = chartType === 'bf' ? 'BF' : 'Peso';
                        const datasetData = apiData.map(item => chartType === 'bf' ? item.percentage : item.weight);

                        const borderColor = chartType === 'bf' ? '#f3a93b' : '#54c2d8';
                        const backgroundColor = chartType === 'bf' ? '#f3a93b' : '#54c2d8';

                        const formattedData = {
                            labels: labels,
                            datasets: [
                                {
                                    label: datasetLabel,
                                    data: datasetData,
                                    fill: false,
                                    borderColor: borderColor,
                                    backgroundColor: backgroundColor,
                                },
                            ]
                        };

                        setData(formattedData);
                    } else {
                        console.error('Dados da API inválidos.');
                    }
                })
                .catch(err => console.error(err));
        }

        fetchData();
        const interval = setInterval(fetchData, 5000);

        return () => {
            clearInterval(interval);
        }
    }, [chartType]);

    return (
        <div>
            {data && data.labels && data.labels.length > 0 ? (
                <Line
                    id={chartType == 'bf' ? 'bf' : 'peso'}
                    data={data}
                    options={{
                        plugins: {
                            title: {
                                display: true,
                                text: chartType === 'bf' ? 'Percentual de Gordura (BF em %)' : 'Peso (em kg)',
                                font: {
                                    size: 16,
                                },
                                color: '#FFFDFA'
                            },
                            legend: {
                                labels: {
                                    color: '#FFFDFA'
                                }
                            }
                        },
                        scales: {
                            x: {
                                ticks: {
                                    color: '#FFFDFA',
                                },
                            },
                            y: {
                                ticks: {
                                    color: '#FFFDFA',
                                },
                            },
                        },
                    }}
                    height={'auto'}
                    width={'auto'}
                />
            ) : (
                <Line

                    data={{
                        datasets: [
                            {
                                label: '',
                                data: [12, 19, 3, 5, 2, 3],
                                fill: false,
                                borderColor: borderColor,
                                backgroundColor: backgroundColor,
                            },
                        ]
                    }}
                    options={{
                        plugins: {
                            title: {
                                display: true,
                                text: chartType === 'bf' ? 'Percentual de Gordura (BF em %)' : 'Peso (em kg)',
                                font: {
                                    size: 16,
                                },
                                color: '#FFFDFA'
                            },
                            legend: {
                                labels: {
                                    color: '#FFFDFA'
                                }
                            }
                        },
                        scales: {
                            x: {
                                ticks: {
                                    color: '#FFFDFA',
                                },
                            },
                            y: {
                                ticks: {
                                    color: '#FFFDFA',
                                },
                            },
                        },
                    }}
                    height={'auto'}
                    width={'auto'}
                />
            )}
        </div>
    );



}
