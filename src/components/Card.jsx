import React from 'react';

// Componente de Card
function Card({ title, content, backgroundImage, onCardClick }) {
    const cardStyle = {
        backgroundImage: `url(${backgroundImage})`,
    };
    const handleClick = () => {
        onCardClick({ title, content, backgroundImage });
    };
    return (
        <div className="card" onClick={handleClick} >
            <h2>{title}</h2>
            <p>{content}</p>

        </div>
    );
}
export default Card