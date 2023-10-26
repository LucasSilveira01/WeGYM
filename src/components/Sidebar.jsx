import React, { useState, useContext } from 'react';
import { FaUser } from 'react-icons/fa';
import { FiMenu, FiLogOut } from 'react-icons/fi';
import { AiFillHome } from 'react-icons/ai'
import { BsGearFill } from 'react-icons/bs'
import { SignedInContext } from '../hooks/Context'
import { CgGym } from 'react-icons/cg'
export default function Sidebar() {
    const user = localStorage.getItem('user');
    const { handleSignIn } = useContext(SignedInContext);
    const signed = useContext(SignedInContext);
    const [isClicked, setClick] = useState(false);

    const showMenu = () => {
        setClick(!isClicked);
        const titleElements = document.querySelectorAll('.titleNav');

        titleElements.forEach(title => {
            title.classList.toggle('open');
        });

        const titleB = document.querySelector('#titleLog');
        const logout = document.querySelector('#logoutButton');
        titleB.classList.toggle('open');
        logout.classList.toggle('open');

        console.log(isClicked);
    }

    if (signed.signedIn === false) return (<></>)

    const handleSignOut = () => {
        handleSignIn(false);
    };

    return (
        <div className={isClicked ? 'sidebar open' : 'sidebar'}>
            <ul>
                <li className='toggle' onClick={showMenu}>
                    <FiMenu />
                </li>
                <a href="/principal">
                    <li>
                        <i><AiFillHome /></i>
                        <span className='titleNav'>Principal</span>
                    </li>
                </a>
                <a href="/metrics">
                    <li>
                        <i><BsGearFill /></i>
                        <span className='titleNav'>Métricas</span>
                    </li>
                </a>
                <a href="/treinos">
                    <li>
                        <i><CgGym /></i>
                        <span className='titleNav'>Treinos</span>
                    </li>
                </a>
            </ul>
            <div className="logout" id="logout">
                <li>
                    <i><FaUser /></i>
                    <span id='titleLog'>{user}</span>
                    <a href="/" onClick={handleSignOut} id="logoutButton"><FiLogOut /></a>
                </li>
            </div>
        </div>
    );
};