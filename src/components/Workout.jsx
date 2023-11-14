import React, { useState } from 'react';
import PreCreatedWorkouts from './PreCreatedWorkouts';
import CustomWorkout from './CustomWorkouts';

function WorkoutPage() {
    const [showPreCreated, setShowPreCreated] = useState(true);

    return (
        <div>
            <h1>Escolha um Treino</h1>
            <button onClick={() => setShowPreCreated(true)}>Treinos Pré-Criados</button>
            <button onClick={() => setShowPreCreated(false)}>Criar Treino Personalizado</button>

            {showPreCreated ? <PreCreatedWorkouts /> : <CustomWorkout />}
        </div>
    );
}

export default WorkoutPage;
