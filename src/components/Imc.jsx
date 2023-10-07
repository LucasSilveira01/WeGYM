import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Importe o Axios
function CalculadoraIMC() {
    const [altura, setAltura] = useState('');
    const [peso, setPeso] = useState('');
    const [resultadoIMC, setResultadoIMC] = useState(null);
    const [resultadoIGC, setResultadoIGC] = useState(null);
    const idade = localStorage.getItem('idade');
    const user = localStorage.getItem('id');
    const sexo = localStorage.getItem('sexo');
    const [pesoIdeal, setPesoIdeal] = useState('')
    function calcularPesoIdeal(sexo, altura) {
        let pesoIdeal;

        if (sexo === 'M') {
            pesoIdeal = altura - 100 - ((altura - 150) / 4);
        } else if (sexo === 'F') {
            pesoIdeal = altura - 100 - ((altura - 150) / 2.5);
        }

        setPesoIdeal(pesoIdeal)

        return pesoIdeal;
    }







    useEffect(() => {
        // Função para calcular o IMC
        const calcularIMC = () => {
            if (altura && peso) {
                const alturaMetros = altura / 100;
                const imc = peso / (alturaMetros * alturaMetros);
                setResultadoIMC(imc.toFixed(2));
            } else {
                setResultadoIMC(null); // Limpar resultado do IMC se altura ou peso estiverem vazios
            }
        };

        // Função para calcular o IGC
        const calcularIGC = () => {
            if (altura && peso) {
                const alturaMetros = altura / 100;
                const imc = resultadoIMC ? parseFloat(resultadoIMC) : 0;
                const igc = 1.2 * imc + 0.23 * idade - 10.8 * 1 - 5.4;
                setResultadoIGC(igc.toFixed(2));
            } else {
                setResultadoIGC(null); // Limpar resultado do IGC se altura ou peso estiverem vazios
            }
        };

        calcularIMC();
        calcularIGC();
        const pesoIdeal = calcularPesoIdeal(sexo, altura)
    }, [altura, peso, resultadoIMC]);

    return (
        <div className="page">
            <div className="metrics">

                <h1>Calculadora de IMC e IGC</h1>
                <div>
                    <label>Altura (cm):</label>
                    <input
                        type="number"
                        value={altura}
                        onChange={(e) => setAltura(e.target.value)}
                    />
                </div>
                <div>
                    <label>Peso (kg):</label>
                    <input
                        type="number"
                        value={peso}
                        onChange={(e) => setPeso(e.target.value)}
                    />
                </div>

                {resultadoIMC !== null && (
                    <div>
                        <h2>Resultado IMC:</h2>
                        <p>Seu IMC é: {resultadoIMC}</p>
                        <h2>Peso Ideal</h2>
                        <p>Seu peso ideal é de: {pesoIdeal}</p>
                    </div>
                )}
                {resultadoIGC !== null && (
                    <div>
                        <h2>Resultado IGC:</h2>
                        <p>Seu IGC é: {resultadoIGC}</p>
                    </div>
                )}


            </div>
        </div>
    );
}

export default CalculadoraIMC;
