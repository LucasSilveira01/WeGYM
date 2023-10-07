import { useState, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { SignedInContext } from './hooks/Context';

export default function Login() {
    const [user, setUser] = useState('');
    const [pass, setPass] = useState('');
    const [erro, setErro] = useState('');
    const navigate = useNavigate();
    const { handleSignIn } = useContext(SignedInContext);

    const handleLogin = async (e, user, pass) => {
        e.preventDefault();

        const response = await fetch('http://20.226.34.88:5000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user, pass }),
        });

        if (response.ok) {
            const { token, data } = await response.json();
            localStorage.setItem('token', token);
            localStorage.setItem('user', data[0]);
            handleSignIn(true);
            setErro('');
            navigate('/principal')
        } else {
            setErro('Usuário/Senha inválido!');
        }
    };


    const checkInputs = () => {
        const user = document.querySelector('#user');
        const pass = document.querySelector('#pass');
        const button = document.querySelector('#submitDiv');
        const passwordDiv = document.getElementById('passwordDiv');

        if (user.value.trim() !== '') {
            passwordDiv.classList.add('show');

            if (pass.value.trim() !== '') {
                button.classList.add('show');
            } else {
                button.classList.remove('show');
            }
        } else {
            passwordDiv.classList.remove('show');
            button.classList.remove('show');
            pass.value = '';
        }
    }

    const handleOnChange = () => {
        const user = document.querySelector('#user');
        const pass = document.querySelector('#pass');

        setUser(user.value);
        setPass(pass.value);
    }

    return (
        <>
            <div className="login">
                <img src="./src/images/utf8mb4_unicode_ci" alt="" width={80} />
                <h2>Faça login na plataforma</h2>
                <span id="error">{erro}</span>
                <form action="" onSubmit={e => handleLogin(e, user, pass)}>
                    <div className="form-control">
                        <input onChange={handleOnChange} onInput={checkInputs} id="user" type="text" placeholder="Entre com o usuário" />
                    </div>

                    <div className="form-control hidden" id="passwordDiv" >
                        <input onChange={handleOnChange} onInput={checkInputs} id="pass" type="password" placeholder="Senha" />
                    </div>
                    <div className="form-control hidden" id="submitDiv">
                        <button id="login">Entrar</button>
                    </div>
                </form>
            </div>
        </>
    )
}