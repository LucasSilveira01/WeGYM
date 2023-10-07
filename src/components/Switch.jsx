import React from 'react';
import { useTheme } from '../context/ThemeContext'; // Importe o hook useTheme
const Slider = () => {
    const { isDarkTheme, toggleTheme } = useTheme(); // Use o hook useTheme

    return (
        <div className="slider-container">
            <label className={`slider ${isDarkTheme ? 'dark' : 'light'}`}>
                <input
                    type="checkbox"
                    checked={isDarkTheme}
                    onChange={toggleTheme}
                />
                <span className="slider-switch"></span>
            </label>
        </div>
    );
};

export default Slider;
