import { useEffect, useContext } from "react";
import { SignedInContext } from '../hooks/Context'
import Slider from './Switch';
import { useTheme } from '../context/ThemeContext'

export default function Navbar(className) {
    const signed = useContext(SignedInContext);
    const { isDarkTheme, toggleTheme } = useTheme(); // Use o hook useTheme


    const handleHours = () => {
        const cData = new Date();
        const hour = cData.getHours();
        const welcome = document.querySelector('#welcome');
        const user = localStorage.getItem('user');

        if (hour >= 6 && hour < 12 && welcome)
            welcome.textContent = 'Bom dia, ' + user + '.'
        else if (hour >= 12 && hour < 18 && welcome)
            welcome.textContent = 'Boa tarde, ' + user + '.'
        else
            if (welcome) welcome.textContent = 'Boa noite, ' + user + '.'
    }

    useEffect(() => {
        handleHours();
    }, [signed])


    if (signed.signedIn === false) {
        return (<></>)
    }
    return (
        <div className={`navbar-container ${className.className}`}>
            <nav >
                <div className={`navbar-container`}>
                    <span>Treino+</span>
                    <div style={{ display: 'flex' }}>
                        <span id="welcome"></span>
                        <Slider isChecked={isDarkTheme} onToggle={toggleTheme} />

                    </div>
                </div>
            </nav>
        </div>
    )


}