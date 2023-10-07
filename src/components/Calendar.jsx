import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Calendar() {
    const [selectedDates, setSelectedDates] = useState([]);
    const currentDate = new Date();
    const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
    const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formatedDate, setFormatedDate] = useState('')
    const [selectedDate, setSelectedDate] = useState('')
    const [modalData, setModalData] = useState({
        day: null,
        formattedDate: '',
    });
    const [duration, setDuration] = useState('');
    const [calories, setCalories] = useState('');

    useEffect(() => {
        // Busque as datas marcadas no servidor e atualize o estado
        axios.post('http://localhost:5000/get-date', { user: localStorage.getItem(`id`) })
            .then((response) => {
                setSelectedDates(response.data.map(date => new Date(date.data)));
            })
            .catch((error) => {
                console.error('Erro ao buscar as datas:', error);
            });
    }, []); // Executar apenas uma vez no carregamento inicial

    const handleDateClick = (day) => {
        const selectedDate = new Date(currentYear, currentMonth, day);
        setSelectedDate(selectedDate)
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
        console.log(isSelected)
        if (isSelected) {
            // Se estiver selecionada, remova-a da lista de datas selecionadas
            setSelectedDates(selectedDates.filter(date =>
                date.getDate() !== selectedDate.getDate() ||
                date.getMonth() !== selectedDate.getMonth() ||
                date.getFullYear() !== selectedDate.getFullYear()
            ));

            axios.post('http://localhost:5000/delete-date', { selectedDate: formattedDate, user: localStorage.getItem(`id`) })
                .then((response) => {
                    // A data foi salva com sucesso no servidor
                    console.log(response.data.message);
                })
                .catch((error) => {
                    // Ocorreu um erro ao salvar a data
                    console.error('Erro ao salvar a data:', error);
                });
        } else {
            // Se não estiver selecionada, configure os dados da modal e abra a modal
            setModalData({ day, formattedDate });
            setIsModalOpen(true);
            // Se não estiver selecionada, adicione-a à lista de datas selecionadas


        }
    };

    // Função para avançar para o próximo mês
    const nextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    // Função para retroceder para o mês anterior
    const prevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    // Função para criar uma matriz de dias do mês atual
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
        axios.post('http://localhost:5000/save-date', { selectedDate: formatedDate, user: localStorage.getItem(`id`), duration: duration, calories: calories })
            .then((response) => {
                // A data foi salva com sucesso no servidor
                console.log(response.data.message);
                setIsModalOpen(false)
                setDuration('')
                setCalories('')
                setSelectedDates([...selectedDates, selectedDate]);
                // Envia a data formatada para o servidor
            })
            .catch((error) => {
                // Ocorreu um erro ao salvar a data
                console.error('Erro ao salvar a data:', error);
            });
    }
    return (
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
                        <p>Dia: {modalData.day}</p>
                        <label htmlFor="duration">Tempo de D    uração (minutos):</label>
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
    );
}

export default Calendar;
