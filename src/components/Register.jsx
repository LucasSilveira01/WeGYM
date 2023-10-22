import React, { useState } from 'react';
import { CgGym } from 'react-icons/cg';
import { useNavigate } from 'react-router-dom';
import { FaTimes, FaCheck } from 'react-icons/fa';
const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        senha: '',
        confirmarSenha: '',
        nome: '',
        sobrenome: '',
        sexo: '',
        idade: '',
        altura: '',
    });
    const [senhaDiferente, setSenhaDiferente] = useState(false); // Estado para controlar a mensagem de senha diferente
    const [temLetraMaiuscula, setTemLetraMaiuscula] = useState(false);
    const [temNumero, setTemNumero] = useState(false);
    const [temDigitos, setTemDigitos] = useState(false);
    const [senhaEmFoco, setSenhaEmFoco] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'senha') {
            setTemLetraMaiuscula(false);
            setTemNumero(false);
            setTemDigitos(false);
            // Verifique os requisitos da senha
            const temMaiuscula = /[A-Z]/.test(value);
            setTemLetraMaiuscula(temMaiuscula);
            // Verifique se a senha tem pelo menos um número
            const temNumero = /\d/.test(value);
            setTemNumero(temNumero);
            // Verifique se a senha tem 8 digitos
            const temDigitos = value.length >= 8 ? true : false
            setTemDigitos(temDigitos);
        } else if (name === 'confirmarSenha') {
            // Se o campo de confirmação de senha estiver mudando, verifique se coincide com a senha
            const senha = formData.senha;
            setSenhaDiferente(senha !== value);
        }
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (senhaDiferente || !temLetraMaiuscula || !temNumero || !temDigitos) {
            // Se as senhas ainda forem diferentes ou a senha não atender aos requisitos, não envie o formulário
            return;
        }
        // Aqui você pode adicionar a lógica para enviar os dados do formulário para o servidor ou fazer o que for necessário com eles
        const response = await fetch('http://localhost:5000/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });

        if (response.status == 200) {
            navigate('/login');
        }
    };
    const handleSenhaFocus = () => {
        setSenhaEmFoco(true);
    };

    const handleSenhaBlur = () => {
        setSenhaEmFoco(false);
    };

    return (
        <div className='login'>
            <h2>Formulário de Registro</h2>
            <CgGym id="icone-login" />
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">E-mail:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="senha">Senha:</label>
                    <input
                        type="password"
                        id="senha"
                        name="senha"
                        value={formData.senha}
                        onChange={handleChange}
                        onFocus={handleSenhaFocus}
                        onBlur={handleSenhaBlur}
                        required
                    />
                </div>
                {senhaEmFoco && (
                    <div className='divsenha'>
                        <p className={` ${temLetraMaiuscula ? 'senha-valida' : 'senha-invalida'}`}>
                            {!temLetraMaiuscula ? <FaTimes /> : <FaCheck />} A senha deve conter pelo menos uma letra maiúscula.
                        </p>
                        <p className={` ${temNumero ? 'senha-valida' : 'senha-invalida'}`}>
                            {!temNumero ? <FaTimes /> : <FaCheck />}A senha deve conter pelo menos um número.
                        </p>
                        <p className={` ${temDigitos ? 'senha-valida' : 'senha-invalida'}`}>
                            {!temDigitos ? <FaTimes /> : <FaCheck />}A senha deve conter pelo menos 8 dígitos.
                        </p>
                    </div>
                )}
                <div>
                    <label htmlFor="confirmarSenha">Confirmar Senha:</label>
                    <input
                        type="password"
                        id="confirmarSenha"
                        name="confirmarSenha"
                        value={formData.confirmarSenha}
                        onChange={handleChange}
                        required
                    />
                </div>

                {senhaDiferente && (
                    <div className="divsenha">

                        <p className="senha-invalida"><FaTimes /> As senhas não coincidem.</p>
                    </div>
                )}
                <div>
                    <label htmlFor="nome">Nome:</label>
                    <input
                        type="text"
                        id="nome"
                        name="nome"
                        value={formData.nome}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="sobrenome">Sobrenome:</label>
                    <input
                        type="text"
                        id="sobrenome"
                        name="sobrenome"
                        value={formData.sobrenome}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="sexo">Sexo:</label>
                    <select
                        id="sexo"
                        name="sexo"
                        value={formData.sexo}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Selecione o sexo</option>
                        <option value="M">Masculino</option>
                        <option value="F">Feminino</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="idade">Idade:</label>
                    <input
                        type="text"
                        id="idade"
                        name="idade"
                        value={formData.idade}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="idade">Altura:</label>
                    <input
                        type="text"
                        id="altura"
                        name="altura"
                        value={formData.altura}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <button type="submit">Registrar</button>
                </div>
            </form>
        </div>
    );
};

export default Register;
