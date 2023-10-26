import { useContext, useRef, useState } from 'react';
import Sidebar from '../components/Sidebar';
import WorkoutSelector from '../components/WorkoutSelector';

export default function Treinos() {
    return (
        <>
            <Sidebar />
            <div className="page">
                <WorkoutSelector />
            </div>
        </>
    )
}