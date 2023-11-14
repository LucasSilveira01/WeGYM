import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DoughnutChart from './DougnutChart';

function Calendar() {
    const [selectedDates, setSelectedDates] = useState([]);
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formatedDate, setFormatedDate] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [modalData, setModalData] = useState({
        day: null,
        formattedDate: '',
    });
    const [duration, setDuration] = useState('');
    const [calories, setCalories] = useState('');
    const [chartData, setChartData] = useState([]);
    const [labels, setLabels] = useState([]);

    useEffect(() => {
        // Busque as datas marcadas no servidor e atualize o estado
        axios.post('http://localhost:5000/get-date', { user: localStorage.getItem('id') })
            .then((response) => {
                setSelectedDates(response.data.map(date => new Date(date.data)));
                var calories_data = [];
                var labels_data = [];
                response.data.map(date => {
                    calories_data.push(date.calories);
                    var nova_data = new Date(date.data);
                    var formattedDay = nova_data.getDate().toString().padStart(2, '0');
                    var formattedMonth = (nova_data.getMonth() + 1).toString().padStart(2, '0');
                    var formattedYear = nova_data.getFullYear();

                    // Combine os componentes formatados em uma única string de data
                    const formattedDate = `${formattedDay}/${formattedMonth}/${formattedYear}`;
                    labels_data.push(formattedDate);
                })
                setChartData(calories_data);
                setLabels(labels_data);
                console.log(chartData);
                console.log(labels);
                /* setChartData({
                    calories: {
                        calories: response.data.calories,
                        labels: response.data.data
                    }
                }); */
                /* var calories_data = [];
                var labels_data = [];
                response.data.map(date => {
                    calories_data.push(date.calories);
                    labels_data.push(date.data);
                })
                setChartData({
                    calories: {
                        calories: calories_data,
                        labels: labels_data
                    }
                }
                ); */
            })
            .catch((error) => {
                console.error('Erro ao buscar as datas:', error);
            });
    }, []); // Executar apenas uma vez no carregamento inicial

    const handleDateClick = (day) => {
        const selectedDate = new Date(currentYear, currentMonth, day);
        setSelectedDate(selectedDate);
        // Formate a data para 'dia/mês/ano' com zero à esquerda, quando necessário
        const formattedDay = selectedDate.getDate().toString().padStart(2, '0');
        const formattedMonth = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
        const formattedYear = selectedDate.getFullYear();

        // Combine os componentes formatados em uma única string de data
        const formattedDate = `${formattedDay}/${formattedMonth}/${formattedYear}`;
        setFormatedDate(formattedDate);

        // Verifica se a data já está selecionada
        // Converte a data selecionada para o mesmo formato das datas no estado selectedDates
        const selectedDateStr = selectedDate.toDateString();

        // Verifica se a data já está selecionada
        const isSelected = selectedDates.some(date => date.toDateString() === selectedDateStr);
        if (isSelected) {
            // Se estiver selecionada, remova-a da lista de datas selecionadas
            setSelectedDates(selectedDates.filter(date =>
                date.getDate() !== selectedDate.getDate() ||
                date.getMonth() !== selectedDate.getMonth() ||
                date.getFullYear() !== selectedDate.getFullYear()
            ));

            axios.post('http://localhost:5000/delete-date', { selectedDate: formattedDate, user: localStorage.getItem('id') })
                .then((response) => {
                    // A data foi removida com sucesso no servidor
                    console.log(response.data.message);

                    const dataAtual = new Date();

                    const dia = String(dataAtual.getDate()).padStart(2, '0');
                    const mes = String(dataAtual.getMonth() + 1).padStart(2, '0'); // Lembre-se de que os meses em JavaScript começam em 0 (janeiro é 0).
                    const ano = dataAtual.getFullYear();

                    const dataFormatada = `${dia}/${mes}/${ano}`;

                    if (dataFormatada == formatedDate) {
                        setChartData(0);

                    }



                })
                .catch((error) => {
                    // Ocorreu um erro ao remover a data
                    console.error('Erro ao remover a data:', error);
                });
        } else {
            // Se não estiver selecionada, configure os dados da modal e abra a modal
            setModalData({ day, formattedDate });
            setIsModalOpen(true);
        }
    };

    const nextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    const prevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const createMonthDays = () => {
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const days = [];
        for (let day = 1; day <= daysInMonth; day++) {
            const selectedDate = new Date(currentYear, currentMonth, day);
            const isSelected = selectedDates.some(date =>
                date.getDate() === selectedDate.getDate() &&
                date.getMonth() === selectedDate.getMonth() &&
                date.getFullYear() === selectedDate.getFullYear()
            );
            days.push(
                <div
                    key={day}
                    className={`calendar-day ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleDateClick(day)}
                >
                    {day}
                </div>
            );
        }
        return days;
    };

    const HandleSubmit = () => {
        axios.post('http://localhost:5000/save-date', {
            selectedDate: formatedDate,
            user: localStorage.getItem('id'),
            duration: duration,
            calories: calories,
        })
            .then((response) => {
                // A data foi salva com sucesso no servidor
                console.log(response.data.message);
                setIsModalOpen(false);
                setDuration('');
                setCalories('');
                setSelectedDates([...selectedDates, selectedDate]);
                // Envia a data formatada para o servidor
                // Atualiza os dados do gráfico de doughnut
                updateChartData(formatedDate);
            })
            .catch((error) => {
                // Ocorreu um erro ao salvar a data
                console.error('Erro ao salvar a data:', error);
            });
    };

    const updateChartData = (formatedDate) => {
        // Aqui você deve criar ou atualizar os dados do gráfico de doughnut
        // Os dados do gráfico devem estar no formato esperado pelo Chart.js
        // Por exemplo, você pode definir um objeto `chartData` com labels e datasets
        // Aqui está um exemplo simples:
        const dataAtual = new Date();

        const dia = String(dataAtual.getDate()).padStart(2, '0');
        const mes = String(dataAtual.getMonth() + 1).padStart(2, '0'); // Lembre-se de que os meses em JavaScript começam em 0 (janeiro é 0).
        const ano = dataAtual.getFullYear();

        const dataFormatada = `${dia}/${mes}/${ano}`;
        const newChartData = [...chartData];
        // Adicione o novo valor de calorias ao novo array
        newChartData.push(calories);
        // Atualize o estado do chartData com o novo array
        setChartData(newChartData);
        const newLabels = [...labels];
        // Adicione o novo valor de calorias ao novo array
        newLabels.push(formatedDate);
        // Atualize o estado do chartData com o novo array
        setLabels(newLabels);
        console.log(chartData);
    };
    // Função para renderizar o texto no centro do gráfico
    const renderCenterText = (chart) => {
        const ctx = chart.ctx;
        const width = chart.width;
        const height = chart.height;

        ctx.restore();
        ctx.font = '24px Arial';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#000'; // Cor do texto
        ctx.fillText(chartText, width / 2, height / 2);
        ctx.save();
    };
    return (
        <div className='calendar-container'>

            <div className="calendar col">
                <h2>Acompanhamento</h2>
                <div className="calendar-header">
                    <div className="calendar-nav">
                        <button onClick={prevMonth}>Mês Anterior</button>
                        <button onClick={nextMonth}>Próximo Mês</button>
                    </div>
                </div>
                <div className="calendar-month">
                    <h3>
                        {new Date(currentYear, currentMonth).toLocaleDateString(undefined, { month: 'long' })} {currentYear}
                    </h3>
                    <div className="calendar-grid">
                        {createMonthDays()}
                    </div>
                </div>
                {isModalOpen && (
                    <div className="modal">
                        <div className="modal-content">
                            <span className="close" onClick={() => setIsModalOpen(false)}>&times;</span>
                            <h2>Detalhes do Treino</h2>
                            <p>Data: {modalData.formattedDate}</p>
                            <label htmlFor="duration">Tempo de Duração (minutos):</label>
                            <input
                                type="text"
                                id="duration"
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                            />
                            <label htmlFor="calories">Calorias:</label>
                            <input
                                type="text"
                                id="calories"
                                value={calories}
                                onChange={(e) => setCalories(e.target.value)}
                            />
                            <button onClick={HandleSubmit}>Salvar</button>
                        </div>
                    </div>
                )}
            </div>
            <div className="chart-container">
                <h2>Calorias</h2>
                <DoughnutChart calories={chartData} labels={labels} render={renderCenterText} />
            </div>
        </div>
    );
}

export default Calendar;
