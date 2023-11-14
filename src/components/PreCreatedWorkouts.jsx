import React, { useState } from 'react';

function PreCreatedWorkouts() {
    const [selectedWorkout, setSelectedWorkout] = useState(null);

    // Lista de treinos pré-criados (poderiam ser recuperados de um servidor)
    const preCreatedWorkouts = [
        { id: 1, name: 'Treino A', exercises: ['Agachamento', 'Supino', 'Puxada'] },
        { id: 2, name: 'Treino B', exercises: ['Leg Press', 'Rosca', 'Desenvolvimento'] },
        // Adicione mais treinos pré-criados conforme necessário
    ];

    const handleSelectWorkout = (workout) => {
        setSelectedWorkout(workout);
    };

    return (
        <div className="workout-container">
            <h2>Treinos Pré-Criados</h2>
            <ul>
                {preCreatedWorkouts.map((workout) => (
                    <li key={workout.id} onClick={() => handleSelectWorkout(workout)}>
                        {workout.name}
                    </li>
                ))}
            </ul>
            {selectedWorkout && (
                <div className="selected-workout">
                    <h3>Treino Selecionado: {selectedWorkout.name}</h3>
                    <h4>Exercícios:</h4>
                    <ul>
                        {selectedWorkout.exercises.map((exercise, index) => (
                            <li key={index}>{exercise}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default PreCreatedWorkouts;
