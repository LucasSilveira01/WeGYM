import React, { useState } from 'react';
import Card from './Card';
import SuccessModal from './SuccessModal';

const WorkoutSelector = () => {
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const cardsData = [
        { title: 'Supino Reto', content: '5 x 10', category: 'Peito', backgroundImage: '../src/images/Supino_Reto.png' },
        { title: 'Voador', content: '5 x 10', category: 'Peito', backgroundImage: '../src/images/Voador.png' },
        { title: 'Supino Inclinado', content: '5 x 10', category: 'Peito', backgroundImage: '../src/images/Supino_inclinado.png' },
        { title: 'CrossOver', content: '5 x 10', category: 'Peito', backgroundImage: '../src/images/Crossover.png' },
        { title: 'Flexão', content: '5 x 10', category: 'Perna', backgroundImage: '../src/images/Flexao.png' },
        { title: 'PullOver', content: '5 x 10', category: 'Costas', backgroundImage: '../src/images/Pullover.jpeg' },
    ];

    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState(cardsData);
    const [selectedWorkouts, setSelectedWorkouts] = useState([]);

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
    };
    const selectedWorkoutsGrouped = [];
    for (let i = 0; i < selectedWorkouts.length; i += 3) {
        //selectedWorkoutsGrouped.push(selectedWorkouts.slice(i, i + 3));
    }
    const searchResultsGrouped = [];
    for (let i = 0; i < searchResults.length; i += 3) {
        searchResultsGrouped.push(searchResults.slice(i, i + 3));
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
                        console.log(selectedWorkouts),
                        <div key={cardIndex} className={`column ${selectedWorkouts.find(workout => card.title === workout.title) ? 'highlighted-card' : ''}`}>
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
            {/* <div>
                <h2>Treinos Selecionados</h2>
                {selectedWorkoutsGrouped.map((line, lineIndex) => (
                    <div className='row' key={lineIndex}>
                        {line.map((card, cardIndex) => (
                            <div key={cardIndex} className="column">
                                <div className="card-background" style={{ backgroundImage: `url(${card.backgroundImage})` }} onClick={() => handleCardClick(card)}></div>
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
               
            </div> */}
            <button onClick={saveSelectedWorkouts}>Salvar Treinos</button>
            <SuccessModal
                isOpen={showSuccessModal}
                onRequestClose={() => setShowSuccessModal(false)}
            />
        </div>
    );
};

export default WorkoutSelector;
