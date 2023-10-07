import { useContext, useRef, useState } from 'react';
import Sidebar from '../components/Sidebar';
import CardContainer from '../components/CardContainer'
import Calendar from '../components/Calendar'
export default function Home() {
    return (
        <>
            <Sidebar />
            <div className="page">
                <CardContainer />
                <Calendar />
            </div>
        </>
    )
}