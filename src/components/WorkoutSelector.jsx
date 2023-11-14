import React, { useState } from 'react';
import Card from './Card';
import SuccessModal from './SuccessModal';

const WorkoutSelector = () => {
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const cardsData = [
        { title: 'Supino Reto', content: '', category: 'Peito', backgroundImage: '../src/images/Supino_Reto.png', video: 'example' },
        { title: 'Voador', content: '', category: 'Peito', backgroundImage: '../src/images/Voador.png', video: 'example' },
        { title: 'Supino Inclinado', content: '', category: 'Peito', backgroundImage: '../src/images/Supino_inclinado.png', video: 'example' },
        { title: 'CrossOver', content: '', category: 'Peito', backgroundImage: '../src/images/Crossover.png', video: 'example' },
        { title: 'Flexão', content: '', category: 'Perna', backgroundImage: '../src/images/Flexao.png', video: 'example' },
        { title: 'PullOver', content: '', category: 'Costas', backgroundImage: '../src/images/Pullover.jpeg', video: 'example' },
    ];

    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState(cardsData);
    const [selectedWorkouts, setSelectedWorkouts] = useState([]);
    const [workoutName, setWorkoutName] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const [series, setSeries] = useState('');
    const [isModalSubmitOpen, setIsModalSubmitOpen] = useState(false);
    const [nome, setNome] = useState('');
    const openModalSubmit = (card) => {
        setIsModalSubmitOpen(true);
    };
    const closeModalSubmit = () => {
        setIsModalSubmitOpen(false);
    };






    const openModal = (card) => {
        setSelectedCard(card);
        setIsModalOpen(true);
    };
    const closeModal = () => {
        setIsModalOpen(false);
        setIsModalSubmitOpen(false);
    };
    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);

        const results = cardsData.filter((card) =>
            card.title.toLowerCase().includes(term) || card.category.toLowerCase().includes(term)
        );

        setSearchResults(results);
    };

    const handleCardClick = (selectedCard) => {
        setSelectedWorkouts((prevSelectedWorkouts) => {
            if (!prevSelectedWorkouts.some((card) => card.title === selectedCard.title)) {
                return [...prevSelectedWorkouts, selectedCard];
            } else {
                return prevSelectedWorkouts.filter((card) => card.title !== selectedCard.title);
            }
        });
    };

    const saveSelectedWorkouts = () => {
        const id = localStorage.getItem('id');
        const dataToSave = {
            id,
            selectedWorkouts,
            nome
        };
        fetch('http://localhost:5000/salvar-treinos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToSave),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data.message); // A mensagem de sucesso do servidor
                setShowSuccessModal(true);
            })
            .catch((error) => {
                console.error('Erro ao salvar treinos:', error);
            });
        setIsModalSubmitOpen(false);
    };
    const selectedWorkoutsGrouped = [];
    for (let i = 0; i < selectedWorkouts.length; i += 3) {
        //selectedWorkoutsGrouped.push(selectedWorkouts.slice(i, i + 3));
    }
    const searchResultsGrouped = [];
    for (let i = 0; i < searchResults.length; i += 5) {
        searchResultsGrouped.push(searchResults.slice(i, i + 5));
    }
    return (
        <div className='treinos'>
            <input
                className='input-search'
                type="text"
                placeholder="Pesquisar treinos..."
                value={searchTerm}
                onChange={(e) => handleSearch(e)}
            />
            {searchResultsGrouped.map((line, lineIndex) => (
                <div className='row' key={lineIndex}>
                    {line.map((card, cardIndex) => (
                        <div key={cardIndex} onClick={() => openModal(card)} className={`column ${selectedWorkouts.find(workout => card.title === workout.title) ? 'highlighted-card' : ''}`}>
                            <div className="card-background " style={{ backgroundImage: `url(${card.backgroundImage})` }} onClick={() => handleCardClick(card)}></div>
                            <Card
                                title={card.title}
                                content={card.content}
                                backgroundImage={card.backgroundImage}
                                onCardClick={() => handleCardClick(card)}
                            />
                        </div>
                    ))}
                </div>
            ))}
            <button onClick={openModalSubmit}>Salvar Treinos</button>
            <SuccessModal
                isOpen={showSuccessModal}
                onRequestClose={() => setShowSuccessModal(false)}
            />
            {isModalOpen && selectedCard && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeModal}>&times;</span>
                        <h3>{selectedCard.title}</h3>
                        <label htmlFor='series'>Séries:</label>
                        <input
                            id='series'
                            type="text"
                            placeholder="Ex: 5 x 10"
                            onChange={(e) => selectedCard.content = (e.target.value)}
                        />
                        <button onClick={() => { setIsModalOpen(false) }}>Salvar</button>
                    </div>
                </div>
            )
            }
            {isModalSubmitOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeModal}>&times;</span>
                        <label htmlFor='series'>Nome do treino:</label>
                        <input
                            id='series'
                            type="text"
                            placeholder="Treino A"
                            onChange={(e) => setNome(e.target.value)}
                        />
                        <button onClick={saveSelectedWorkouts}>Salvar</button>
                    </div>
                </div>
            )
            }
        </div >
    );
};

export default WorkoutSelector;
