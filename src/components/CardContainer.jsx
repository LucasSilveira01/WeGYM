import React, { useState, useEffect } from 'react';
import Card from './Card';
import axios from 'axios';

function CardContainer() {
    /* const cardsData = [
        { title: 'Supino Reto', content: '5 x 10', category: 'Peito', backgroundImage: '../src/images/Supino_Reto.png' },
        { title: 'Voador', content: '5 x 10', category: 'Peito', backgroundImage: '../src/images/Voador.png' },
        { title: 'Supino Inclinado', content: '5 x 10', category: 'Peito', backgroundImage: '../src/images/Supino_inclinado.png' },
        { title: 'CrossOver', content: '5 x 10', category: 'Peito', backgroundImage: '../src/images/Crossover.png' },
        { title: 'Flexão', content: '5 x 10', category: 'Perna', backgroundImage: '../src/images/Flexao.png' },
        { title: 'PullOver', content: '5 x 10', category: 'Costas', backgroundImage: '../src/images/Pullover.jpeg' },
    ]; */
    const [cardsData, setCardsData] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);

    const openModal = (card) => {
        setSelectedCard(card);
        setIsModalOpen(true);
    };
    const closeModal = () => {
        setIsModalOpen(false);
    };
    const userid = localStorage.getItem('id')
    useEffect(() => {
        // Faça a solicitação GET para obter os treinos do usuário
        fetch('http://localhost:5000/obter-treinos/' + userid) // Substitua 'seu-user-id' pelo ID do usuário atual
            .then((response) => response.json())
            .then((data) => {
                setCardsData(data);
            })
            .catch((error) => {
                console.error('Erro ao obter treinos:', error);
            });
    }, []);

    const [filteredCategory, setFilteredCategory] = useState('Peito');

    const handleCategoryClick = (category) => {
        setFilteredCategory(category);
    };

    const filteredCards = filteredCategory === 'Peito'
        ? cardsData.filter(card => card.category === filteredCategory)
        : cardsData.filter(card => card.category === filteredCategory);
    const filters = [

        { title: 'Peito', backgroundImage: '../src/images/Peito.jpeg' },
        { title: 'Perna', backgroundImage: '../src/images/Perna.jpeg' },
        { title: 'Costas', backgroundImage: '../src/images/Costas.jpeg' },
        { title: 'Biceps', backgroundImage: '../src/images/Biceps.jpeg' },
        { title: 'Ombro', backgroundImage: '../src/images/Ombro.webp' }]




    return (
        <div>

            <div className="card-container col">
                <h2>Hoje: Peito</h2>
                {cardsData.length > 0 ? (

                    <>

                        <div className="row">
                            {filteredCards.length > 0 ? (
                                filteredCards.slice(0, 3).map((card, index) => (
                                    <div key={index} className="column" onClick={() => openModal(card)}>
                                        <div className="card-background" style={{ backgroundImage: `url(${card.backgroundImage})` }}></div>
                                        <Card title={card.title} content={card.content} backgroundImage={card.backgroundImage} />
                                    </div>
                                ))

                            ) : (
                                <h5>Ainda não possui Treinos? <a href='/treinos'>Selecione</a> alguns agora mesmo!</h5>

                            )}
                        </div>
                        <div className="row">
                            {filteredCards.slice(3).map((card, index) => (
                                <div key={index} className="column">
                                    <div className="card-background" style={{ backgroundImage: `url(${card.backgroundImage})` }}></div>
                                    <Card title={card.title} content={card.content} backgroundImage={card.backgroundImage} />
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <>
                        <h5>Ainda não possui Treinos? <a href='/treinos'>Selecione</a> alguns agora mesmo!</h5>
                    </>
                )}
            </div >
            <div className="card-container category-filter">
                <h2>Outros Treinos</h2>

                <div className="row">
                    {filters.slice(0, 3).map((category, index) => (
                        <>
                            <div className="column">

                                <div className="card-background" style={{ backgroundImage: `url(${category.backgroundImage})` }} onClick={() => handleCategoryClick(category.title)}></div>
                                <Card title={category.title} content={category.content} backgroundImage={category.backgroundImage} />
                            </div>
                        </>
                    ))}
                </div>
                <div className="row-filter">
                    {filters.slice(3).map((category, index) => (
                        <>
                            <div className="column">

                                <div className="card-background" style={{ backgroundImage: `url(${category.backgroundImage})` }} onClick={() => handleCategoryClick(category.title)}></div>
                                <Card title={category.title} content={category.content} backgroundImage={category.backgroundImage} />
                            </div>
                        </>
                    ))}
                </div>
            </div>
            {isModalOpen && selectedCard && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeModal}>&times;</span>
                        <h3>{selectedCard.title}</h3>
                        <p>{selectedCard.content}</p>
                        <video src={selectedCard.video} controls width={300} height={300} autoPlay></video>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CardContainer;
