import React from 'react';
import { useTheme } from '../context/ThemeContext'; // Importe o hook useTheme
import { FiSun, FiMoon } from 'react-icons/fi';

const Slider = () => {
    var { theme, toggleTheme } = useTheme(); // Use o hook useTheme
    if (theme == 'light') {
        theme = true;
    } else {
        theme = false;
    }
    return (
        <div className="slider-container">
            <label className={`slider ${theme ? 'dark' : 'light'}`}>
                <input
                    type="checkbox"
                    checked={theme}
                    onChange={toggleTheme}
                />
                <span className="slider-switch">
                    {theme ? <FiMoon /> : <FiSun />}
                </span>
            </label>
        </div>
    );
};

export default Slider;
