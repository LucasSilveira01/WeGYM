import React, { useState } from 'react';

function CustomWorkout() {
    const [customWorkout, setCustomWorkout] = useState({ name: '', exercises: [] });

    const handleExerciseChange = (e) => {
        const exercise = e.target.value;
        if (exercise) {
            setCustomWorkout((prevWorkout) => ({
                ...prevWorkout,
                exercises: [...prevWorkout.exercises, exercise],
            }));
        }
    };

    const handleNameChange = (e) => {
        setCustomWorkout({ ...customWorkout, name: e.target.value });
    };

    return (
        <div className="workout-container">
            <h2>Criar Treino Personalizado</h2>
            <input
                type="text"
                placeholder="Nome do Treino"
                value={customWorkout.name}
                onChange={handleNameChange}
                className="input-field"
            />
            <ul>
                {customWorkout.exercises.map((exercise, index) => (
                    <li key={index}>{exercise}</li>
                ))}
            </ul>
            <input
                type="text"
                placeholder="Adicionar Exercício"
                onChange={handleExerciseChange}
                className="input-field"
            />
        </div>
    );
}

export default CustomWorkout;
