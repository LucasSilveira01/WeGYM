import { useState, useEffect } from 'react'
import Modal from 'react-modal'
import Table from './Table'
import Chart from './chart';

function Principal() {
    const [data, setData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [photo, setPhoto] = useState(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const [measureDate, setMeasureDate] = useState('');
    const [weight, setWeight] = useState('');
    const [neck, setNeck] = useState('');
    const [abdomen, setAbdomen] = useState('');
    const [hips, setHips] = useState('');
    const [leftArm, setLeftArm] = useState('');
    const [rightArm, setRightArm] = useState('');
    const [leftForearm, setLeftForearm] = useState('');
    const [rightForearm, setRightForearm] = useState('');
    const [leftThigh, setLeftThigh] = useState('');
    const [rightThigh, setRightThigh] = useState('');
    const [leftCalf, setLeftCalf] = useState('');
    const [rightCalf, setRightCalf] = useState('');
    const id = localStorage.getItem('id');
    const name = localStorage.getItem('name');
    const username = localStorage.getItem('user');
    const sex = localStorage.getItem('sexo');

    useEffect(() => {
        const apiUrl = 'http://localhost:5000/get_last_measures/' + id;
        fetch(apiUrl).then(response => response.json())
            .then(data => setData(data[0]))
            .catch(err => console.error(err));

    }, []);

    const setMeasurement = async (id) => {
        const apiUrl = 'http://localhost:5000/get_espec_measures/' + id;
        fetch(apiUrl).then(response => response.json())
            .then(data => setData(data[0]))
            .catch(err => console.error(err));

        console.log(data);
    }

    function formatarData(dataISO) {
        const data = new Date(dataISO);
        const dia = data.getDate().toString().padStart(2, '0');
        const mes = (data.getMonth() + 1).toString().padStart(2, '0');
        const ano = data.getFullYear();
        return `${dia}/${mes}/${ano}`;
    }

    function openModal() {
        setIsModalOpen(true);
    }

    const handlePhotoChange = (event) => {
        const photoFile = event.target.files[0];
        setPhoto(photoFile);
    };

    const handleDragOver = (event) => {
        event.preventDefault();
        setIsDragOver(true);
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const photoFile = event.dataTransfer.files[0];
        setPhoto(photoFile);
        setIsDragOver(false);
    };

    const handleDragLeave = () => {
        setIsDragOver(false);
    };

    const calculateBodyfat = (abdomen, necks, hips) => {
        const height = parseFloat(localStorage.getItem('height'));
        const weist = parseFloat(abdomen);
        const hip = parseFloat(hips);
        const neck = parseFloat(necks);


        if (sex == 'M') {
            return ((((495) / (1.0324 - (0.19077 * Math.log10(weist - neck)) + (0.15456 * Math.log10(height))))) - 450).toFixed(2)
        }
        return (495 / (1.29579 - 0.35004 * Math.log10(weist + hip - neck) + 0.22100 * Math.log10(height)) - 450).toFixed(2);
    }

    const calculateIMC = (peso) => {
        const height = parseFloat(localStorage.getItem('height')) / 100;
        const weight = parseFloat(peso);

        return (weight / Math.pow(height, 2)).toFixed(1);
    }

    const calculateFM = (abdomen, neck, hips, peso) => {
        const bf = calculateBodyfat(abdomen, neck, hips) / 100;
        const weight = parseFloat(peso);

        return (bf * weight).toFixed(2);
    }

    const classification = (bodyfat) => {
        if (sex == 'M') {
            if (bodyfat < 11) {
                return (<span>(Atleta)</span>)
            } else if (bodyfat >= 11 && bodyfat < 13) {
                return (<span>(Bom)</span>)
            } else if (bodyfat >= 13 && bodyfat < 20) {
                return (<span>(Normal)</span>)
            } else if (bodyfat >= 20 && bodyfat < 23) {
                return (<span>(Elevado)</span>)
            } else {
                return (<span>(Muito Elevado)</span>)
            }
        } else {
            if (bodyfat < 16) {
                return (<span>(Atleta)</span>)
            } else if (bodyfat >= 16 && bodyfat < 19) {
                return (<span>(Bom)</span>)
            } else if (bodyfat >= 19 && bodyfat < 28) {
                return (<span>(Normal)</span>)
            } else if (bodyfat >= 29 && bodyfat < 31) {
                return (<span>(Elevado)</span>)
            } else {
                return (<span>(Muito Elevado)</span>)
            }
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('person', id);
        formData.append('measureDate', measureDate);
        formData.append('weight', weight);
        formData.append('neck', neck);
        formData.append('abdomen', abdomen);
        formData.append('hips', hips);
        formData.append('leftArm', leftArm);
        formData.append('rightArm', rightArm);
        formData.append('leftForearm', leftForearm);
        formData.append('rightForearm', rightForearm);
        formData.append('leftThigh', leftThigh);
        formData.append('rightThigh', rightThigh);
        formData.append('leftCalf', leftCalf);
        formData.append('rightCalf', rightCalf);
        formData.append('IMC', calculateIMC(weight));
        formData.append('BF', calculateBodyfat(abdomen, neck, hips));
        formData.append('photo', photo); // Certifique-se de que 'photo' seja um objeto File ou Blob

        fetch('http://localhost:5000/set_measure/' + username, {
            method: 'POST',
            body: formData,
        })
            .then((response) => {
                if (response.ok) {
                    console.log('Dados enviados com sucesso!');
                    setIsModalOpen(false);
                } else {
                    console.error('Erro ao enviar os dados');
                }
            })
            .catch((error) => {
                console.error('Erro ao enviar os dados:', error);
            });
    };


    return (
        <>
            <div className="container-metrics">

                <div className="nav">
                    <button onClick={openModal}>Nova Medição</button>
                </div>

                <div className="row">
                    <div className="col basicInfos">
                        {data && data.measureDate ? (
                            <>
                                <h3>Medição {formatarData(data.measureDate)}</h3>
                                <div className="details">
                                    <span><strong>Peso:</strong> {data.weight.toFixed(2)} kg</span>
                                    <span><strong>Massa Magra:</strong> {(data.weight - ((data.percentage * data.weight) / 100)).toFixed(2)} kg</span>
                                    <span><strong>Gordura:</strong> {((data.percentage * data.weight) / 100).toFixed(2)} kg</span>
                                </div>
                                <div className="card-group">
                                    <div className="card">
                                        <h4>Medição</h4>
                                        <span> Peso (em kg): {data.weight.toFixed(2)} kg</span>
                                        <span>Bf (em %): {data.percentage.toFixed(2)} %</span>
                                    </div>
                                    {/* <div className="card">
                                            <h4>Metas</h4>
                                            <span>Peso (em kg): {data.weightGoal.toFixed(2)} kg</span>
                                            <span>Bf (em %): {data.fatPercentageGoal.toFixed(2)} %</span>
                                        </div> */}
                                    {/* <div className="card">
                                        <h4>Restante</h4>
                                        <span>Peso (em kg): {(data.weight - data.weightGoal).toFixed(2)} kg</span>
                                        <span>Bf (em %): {(data.percentage - data.fatPercentageGoal).toFixed(2)} %</span>
                                    </div> */}
                                </div>
                                <h4 style={{ margin: '22px 0px 10px 0px' }}>Últimas Medições detalhadas</h4>
                                <div className="more">
                                    <div className="col-more">
                                        <span>Braço esquerdo: {data.leftArm} cm</span>
                                        <span>Braço direito: {data.rightArm} cm</span>
                                        <span>Antebraço esquerdo: {data.leftForearm} cm</span>
                                        <span>Antebraço direito: {data.rightForearm} cm</span>
                                    </div>
                                    <div className="col-more">
                                        <span>Coxa esquerdo: {data.leftThigh} cm</span>
                                        <span>Coxa direito: {data.rightThigh} cm</span>
                                        <span>Panturrilha esquerdo: {data.leftCalf} cm</span>
                                        <span>Panturrilha direito: {data.rightCalf} cm</span>
                                    </div>
                                    <div className="col-more">
                                        <span>Pescoço: {data.neck} cm</span>
                                        <span>Peitoral: {data.chest} cm</span>
                                        <span>Abdome: {data.abdomen} cm</span>
                                        <span>Quadril: {data.hips} cm</span>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <h3>Nenhuma medição selecionada</h3>
                                <div className="details">
                                    <span><strong>Peso:</strong> -- kg</span>
                                    <span><strong>Massa Magra:</strong> -- kg</span>
                                    <span><strong>Gordura:</strong> -- kg</span>
                                </div>
                                <div className="card-group">
                                    <div className="card">
                                        <h4>Medição</h4>
                                        <span> Peso (em kg): -- kg</span>
                                        <span>Bf (em %): -- %</span>
                                    </div>
                                    <div className="card">
                                        <h4>Metas</h4>
                                        <span>Peso (em kg): -- kg</span>
                                        <span>Bf (em %): -- %</span>
                                    </div>
                                    <div className="card">
                                        <h4>Restante</h4>
                                        <span>Peso (em kg): -- kg</span>
                                        <span>Bf (em %): -- %</span>
                                    </div>
                                </div>
                                <h4 style={{ margin: '22px 0px 10px 0px' }}>Últimas Medições detalhadas</h4>
                                <div className="more">
                                    <div className="col-more">
                                        <span>Braço esquerdo: -- cm</span>
                                        <span>Braço direito: -- cm</span>
                                        <span>Antebraço esquerdo: -- cm</span>
                                        <span>Antebraço direito: -- cm</span>
                                    </div>
                                    <div className="col-more">
                                        <span>Coxa esquerdo: -- cm</span>
                                        <span>Coxa direito: -- cm</span>
                                        <span>Panturrilha esquerdo: -- cm</span>
                                        <span>Panturrilha direito: -- cm</span>
                                    </div>
                                    <div className="col-more">
                                        <span>Pescoço: -- cm</span>
                                        <span>Peitoral: -- cm</span>
                                        <span>Abdome: -- cm</span>
                                        <span>Quadril: -- cm</span>
                                    </div>
                                </div>
                            </>
                        )}

                    </div>
                    <div className="col chartCol">
                        <div className="container-col">
                            <Chart chartType='weight'></Chart>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col tableColumn">
                        <div className="table">
                            <Table setMeasure={setMeasurement}></Table>
                        </div>
                    </div>
                    <div className="col chartCol">
                        <div className="container-col">
                            <Chart chartType='bf'></Chart>
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                contentLabel="Exemplo Modal"
                className={'config'}
            >
                <form onSubmit={handleSubmit} id="setup" enctype="multipart/form-data">
                    <div className="header">
                        <h2>Nova medição</h2>
                        <input type="date" name="measureDate" id="measureDate" onChange={e => setMeasureDate(e.target.value)} />
                    </div>
                    <div className="row">
                        <div className="col">
                            <div className="form-control">
                                <label htmlFor="weight">Peso</label>
                                <input type="text" name="weight" id="weight" onChange={e => setWeight(e.target.value)} />
                            </div>
                            <div className="form-control">
                                <label htmlFor="neck">Pescoço</label>
                                <input type="text" name="neck" id="neck" onChange={e => setNeck(e.target.value)} />
                            </div>
                            <div className="form-control">
                                <label htmlFor="abdomen">Abdome</label>
                                <input type="text" name="abdomen" id="abdomen" onChange={e => setAbdomen(e.target.value)} />
                            </div>
                            <div className="form-control">
                                <label htmlFor="hips">Quadril</label>
                                <input type="text" name="hips" id="hips" onChange={e => setHips(e.target.value)} />
                            </div>
                        </div>

                        <div className="col colCalc">
                            <div className="form-control">
                                <span>Percentual de Gordura calculado</span>
                                <h2>{calculateBodyfat(abdomen, neck, hips)} % <span style={{ fontSize: 18, fontWeight: 100 }}>{classification(calculateBodyfat(abdomen, neck, hips))}</span></h2>
                            </div>
                            <div className="div" style={{ display: 'Flex' }}>
                                <div className="form-control" style={{ marginRight: '30px' }}>
                                    <span>Massa magra calculada</span>
                                    <h2>{weight - calculateFM(abdomen, neck, hips, weight)} kg</h2>
                                </div>
                                <div className="form-control">
                                    <span>Gordura calculada</span>
                                    <h2>{calculateFM(abdomen, neck, hips, weight)} kg</h2>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div
                            className={`file-upload ${isDragOver ? 'drag-over' : ''}`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        >
                            {photo ? (
                                <img
                                    src={URL.createObjectURL(photo)}
                                    alt="Foto"
                                />
                            ) : (
                                <div>Arraste e solte a foto aqui</div>
                            )}
                            <input
                                type="file"
                                id="photo"
                                name="photo"
                                accept="image/*"
                                className="file-upload-input"
                                onChange={handlePhotoChange}
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col colBottom">
                            <div className="form-control">
                                <label htmlFor="leftArm">Braço Esquerdo</label>
                                <input type="text" name="leftArm" id="leftArm" onChange={e => setLeftArm(e.target.value)} />
                            </div>
                            <div className="form-control">
                                <label htmlFor="rightArm">Braço Direito</label>
                                <input type="text" name="rightArm" id="rightArm" onChange={e => setRightArm(e.target.value)} />
                            </div>
                            <div className="form-control">
                                <label htmlFor="leftForearm">Antebraço Esquerdo</label>
                                <input type="text" name="leftForearm" id="leftForearm" onChange={e => setLeftForearm(e.target.value)} />
                            </div>
                            <div className="form-control">
                                <label htmlFor="rightForearm">Antebraço Direito</label>
                                <input type="text" name="rightForearm" id="rightForearm" onChange={e => setRightForearm(e.target.value)} />
                            </div>

                        </div>

                        <div className="col colBottom">
                            <div className="form-control">
                                <label htmlFor="leftThigh">Coxa Esquerdo</label>
                                <input type="text" name="leftThigh" id="leftThigh" onChange={e => setLeftThigh(e.target.value)} />
                            </div>
                            <div className="form-control">
                                <label htmlFor="rightThigh">Coxa Direito</label>
                                <input type="text" name="rightThigh" id="rightThigh" onChange={e => setRightThigh(e.target.value)} />
                            </div>
                            <div className="form-control">
                                <label htmlFor="leftCalf">Panturrilha Esquerdo</label>
                                <input type="text" name="leftCalf" id="leftCalf" onChange={e => setLeftCalf(e.target.value)} />
                            </div>
                            <div className="form-control">
                                <label htmlFor="rightCalf">Panturrilha Direito</label>
                                <input type="text" name="rightCalf" id="rightCalf" onChange={e => setRightCalf(e.target.value)} />
                            </div>
                        </div>
                    </div>
                </form>
                <div className="modal-footer">
                    <button id='cancelar' onClick={() => setIsModalOpen(false)}>Cancelar</button>
                    <button form="setup" type="submit">Cadastrar</button>
                </div>
            </Modal>
        </>
    )
}

export default Principal
