import React from 'react';

// Componente de Card
function Card({ title, content, backgroundImage }) {
    const cardStyle = {
        backgroundImage: `url(${backgroundImage})`,
    };
    return (
        <div className="card" >
            <h2>{title}</h2>
            <p>{content}</p>

        </div>
    );
}
export default Card