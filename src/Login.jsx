import { useState, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { SignedInContext } from './hooks/Context';
import { CgGym } from 'react-icons/cg';
import Navbar from './components/Navbar';
export default function Login() {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();
  const { handleSignIn } = useContext(SignedInContext);

  const handleLogin = async (e, user, pass) => {
    e.preventDefault();

    const response = await fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user, pass }),
    });

    if (response.ok) {
      const { token, user, nome, sobrenome, id, role, idade, sexo, altura } = await response.json();
      localStorage.setItem('user', nome + ' ' + sobrenome);
      localStorage.setItem('token', token);
      localStorage.setItem('id', id)
      localStorage.setItem('role', role);
      localStorage.setItem('idade', idade);
      localStorage.setItem('sexo', sexo);
      localStorage.setItem('height', altura);
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
        <CgGym id="icone-login" />
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
        <h5>Não tem uma conta? <a href="/register">Registre-se</a> agora mesmo!</h5>
      </div>
    </>
  )
}