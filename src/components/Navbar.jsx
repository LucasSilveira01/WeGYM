import { useEffect, useContext } from "react";
import { SignedInContext } from '../hooks/Context'
import Slider from './Switch';
import { useTheme } from '../context/ThemeContext'

export default function Navbar(className) {
    const signed = useContext(SignedInContext);
    const { isDarkTheme, toggleTheme } = useTheme(); // Use o hook useTheme

    if (signed.signedIn === false) {
        return (<></>)
    }
    return (
        <div className={`navbar-container ${className.className}`}>
            <nav >
                <div className={`navbar-container`}>
                    <span>Treino+</span>
                    <div style={{ display: 'flex' }}>
                        <Slider isChecked={isDarkTheme} onToggle={toggleTheme} />

                    </div>
                </div>
            </nav>
        </div>
    )


}