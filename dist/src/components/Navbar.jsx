import { useEffect, useContext } from "react";
import { SignedInContext } from '../hooks/Context'

export default function Navbar() {
    const signed = useContext(SignedInContext);

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
        <nav>
            <div className="navbar-container">
                <img src="../src/images/logoEmbeddo.webp" alt="" width={150} />
                <span id="welcome"></span>
            </div>
        </nav>
    )


}