import { useContext, useEffect, useState } from 'react';
import { SignedInContext } from '../hooks/Context';
import Sidebar from '../components/Sidebar';
import TableUser from '../components/Table_user';
import Modal, { setAppElement } from 'react-modal';
import { BsPersonFillGear, BsFillPinMapFill, BsPersonBadgeFill } from 'react-icons/bs'
import { FaTruck } from 'react-icons/fa';
import TableTruck from '../components/Table_truck';
import TableTrip from '../components/Table_trip';
import InputMask from 'react-input-mask'
import TableDriver from '../components/Table_driver';

export default function Configuration() {
    const { handleSignIn } = useContext(SignedInContext);
    const [data, setData] = useState([]);
    const [activeTab, setActiveTab] = useState('Usuario');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [serverResponse, setServerResponse] = useState('');
    const [contentType, setContentType] = useState('');
    const [selectedCellType, setSelectedCellType] = useState('operador');
    const [photo, setPhoto] = useState(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const [options, setOptions] = useState([]);
    const [options_motorista, setOptionsMotorista] = useState([]);
    const [editData, setEditData] = useState([]);
    console.log(editData);


    const handleCellTypeChange = (event) => {
        setSelectedCellType(event.target.value);
    };

    const handlePhotoChange = (event) => {
        const photoFile = event.target.files[0];
        setPhoto(photoFile);
    };

    const handleDragOver = (event) => {
        event.preventDefault();
        setIsDragOver(true);
    };

    const handleCancelDriver = () => {
        setIsModalOpen(false);
        setPhoto(null);
        setEditData([])
    };
    const HandleCancelTrip = () => {
        setIsModalOpen(false);
        setEditData([])

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

    function openModalEdit(data) {
        console.log(data);
        setEditData(data);
        setIsModalOpen(true);
    }

    function openModal() {
        setIsModalOpen(true);
    }

    const handleTabChange = (tabName) => {
        setActiveTab(tabName);
    };

    useEffect(() => {
        fetch('http://20.226.34.88:5000/config/get_truck', {
            method: 'GET',
        }).then(response => response.json())
            .then(data => setOptions(data))
            .catch(err => console.error(err));

    }, []);

    useEffect(() => {
        fetch('http://20.226.34.88:5000/config/get_driver', {
            method: 'GET',
        }).then(response => response.json())
            .then(data => setOptionsMotorista(data))
            .catch(err => console.error(err));

    }, []);
    //console.log(options);
    const submitForm = async (event) => {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const pass = document.getElementById('password').value;
        const role = document.querySelector('input[name="operador"]:checked') ? 'operador' : 'admin';
        const icon = username.charAt(0).toUpperCase();

        const userData = {
            user: username,
            pass: pass,
            role: role,
            icon: icon
        };

        try {
            const response = await fetch('http://20.226.34.88:5000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });
            setIsModalOpen(false);
        } catch (error) {
            console.error('Erro ao enviar os dados:', error);
        }
    };

    const submitFormTruck = async (event) => {
        event.preventDefault();
        const placa = document.getElementById('placa').value;
        const id_central = document.getElementById('id_central').value;

        const userData = {
            placa: placa,
            id_central: id_central
        };
        try {
            const response = await fetch('http://20.226.34.88:5000/set_truck', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });
            setIsModalOpen(false);
        } catch (error) {
            console.error('Erro ao enviar os dados:', error);
        }
    };

    const submitFormTrip = async (event, type) => {
        event.preventDefault();
        const origin = document.getElementById('origin').value;
        const destiny = document.getElementById('destiny').value;
        const placa_select = document.getElementById('placa_select').value;
        const driver_select = document.getElementById('driver_select').value;

        const userData = {
            origem: origin,
            destino: destiny,
            placa: placa_select,
            motorista: driver_select
        };

        if (editData.length != 0) {
            userData.id = editData.id;
        }
        if (type !== 'edit') {
            try {
                const response = await fetch('http://20.226.34.88:5000/set_trip', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(userData)
                });
                setIsModalOpen(false);
                setEditData([])

            } catch (error) {
                console.error('Erro ao enviar os dados:', error);
            }
        } else {
            try {
                const response = await fetch('http://20.226.34.88:5000/update_trip', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(userData)
                });
                setIsModalOpen(false);
                setEditData([])

            } catch (error) {
                console.error('Erro ao enviar os dados:', error);
            }
        }
    };

    const submitFormDriver = async (event, type) => {
        event.preventDefault();
        const first_name = document.getElementById('first_name').value;
        const last_name = document.getElementById('last_name').value;
        const cpf = document.getElementById('cpf').value;
        //const photo = document.getElementById('photo').value;

        const userData = {
            nome: first_name + ' ' + last_name,
            cpf: cpf,
            file: photo,

        };

        const formData = new FormData();
        formData.append('file', photo);
        formData.append('nome', userData.nome);
        formData.append('cpf', userData.cpf);
        if (editData.length != 0) {
            formData.append('id', editData.id);
        }
        console.log(type);

        if (type !== 'edit') {
            console.log('aqui');

            try {
                const response = await fetch('http://20.226.34.88:5000/set_driver', {
                    method: 'POST',
                    body: formData
                });
                setIsModalOpen(false);
                setPhoto(null);
                setEditData([])
            } catch (error) {
                console.error('Erro ao enviar os dados:', error);
            }
        } else {
            try {
                const response = await fetch('http://20.226.34.88:5000/update_driver', {
                    method: 'POST',
                    body: formData
                });
                setIsModalOpen(false);
                setPhoto(null);
                setEditData([])
            } catch (error) {
                console.error('Erro ao enviar os dados:', error);
            }
        }
    };


    const renderActiveTable = () => {
        switch (activeTab) {
            case 'Usuario':
                return (
                    <>
                        <div className="col">
                            <h2>Cadastro de usuários</h2>
                            <span>
                                O cadastro de usuário é restrito a administradores, responsáveis
                                por adicionar novos membros e gerenciar usuários. Administradores também
                                têm acesso total aos dados das páginas. Já os operadores têm apenas permissão de visualização,
                                sem poder de cadastro ou gerenciamento.
                            </span>
                            <button onClick={openModal}>Cadastrar usuário</button>
                        </div>
                        <div className="table">
                            <TableUser />
                        </div>
                        <Modal
                            isOpen={isModalOpen}
                            onRequestClose={() => setIsModalOpen(false)}
                            contentLabel="Exemplo Modal"
                            className={'config'}
                        >
                            <form action="" id='setup'>
                                <h2>Cadastro de usuário</h2>
                                <div className="row">
                                    <div className="col">
                                        <div className="form-control">
                                            <label htmlFor="username">Username</label>
                                            <input type="text" id='username' />
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="form-control">
                                            <label htmlFor="password">Senha</label>
                                            <input type="password" id='password' />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col" style={{ width: '100%' }}>
                                        <div className="radio-control">
                                            <input type="radio" id='operador' name="operador" value="operador" checked={selectedCellType === 'operador'} onChange={handleCellTypeChange} />
                                            <label htmlFor="operador">Operador</label>
                                        </div>
                                        <span className='explication'>
                                            Operadores não podem editar informações ou administrar usuários.
                                            Operadores podem somente ver aplicações relacionadas aos operadores.
                                        </span>
                                    </div>

                                </div>
                                <div className="row">
                                    <div className="col" style={{ width: '100%' }}>
                                        <div className="radio-control">
                                            <input type="radio" id='admin' name="admin" value="admin" checked={selectedCellType === 'admin'} onChange={handleCellTypeChange} />
                                            <label htmlFor="admin">Administrador</label>
                                        </div>
                                        <span className='explication'>
                                            Administradores podem fazer tudo, incluindo administrar operadores e
                                            excluir outros administradores.
                                        </span>
                                    </div>
                                </div>

                            </form>
                            <div className="modal-footer">
                                <button id='cancelar' onClick={() => setIsModalOpen(false)}>Cancelar</button>
                                <button form="setup" type="submit" onClick={submitForm}>Cadastrar</button>
                            </div>
                        </Modal>

                    </>
                );
            case 'truck':
                return (
                    <>
                        <div className="col">
                            <h2>Cadastro de Veículos</h2>
                            <span>
                                Edite ou cadastre novos veículos para monitoramento pela plataforma. Para novos cadastros, será necessário associar o ID da central de controle para o veículo.
                            </span>
                            <button onClick={openModal}>Cadastrar veículo</button>
                        </div>
                        <div className="table">
                            <TableTruck />
                        </div>
                        <Modal
                            isOpen={isModalOpen}
                            onRequestClose={() => setIsModalOpen(false)}
                            contentLabel="Exemplo Modal"
                            className={'config'}
                        >
                            <form action="" id='setup'>
                                <h2>Cadastro de Caminhão</h2>
                                <div className="row">
                                    <div className="col">
                                        <div className="form-control">
                                            <label htmlFor="placa">Placa</label>
                                            <input type="text" id='placa' />
                                            <span className='explication'>Exemplo: EMB12345N</span>
                                        </div>
                                    </div>

                                </div>

                                <div className="row">
                                    <div className="col" style={{ width: '100%' }}>
                                        <div className="form-control">
                                            <label htmlFor="id_central">ID da Central</label>
                                            <input type="text" id='id_central' />
                                            <span className='explication'>
                                                Obs.: Somente números e letras, sem caracteres especiais.
                                            </span>
                                        </div>
                                    </div>
                                </div>

                            </form>
                            <div className="modal-footer">
                                <button id='cancelar' onClick={() => setIsModalOpen(false)}>Cancelar</button>
                                <button form="setup" type="submit" onClick={submitFormTruck}>Cadastrar</button>
                            </div>
                        </Modal>

                    </>
                );
            case 'trip':
                return (
                    <>
                        <div className="col">
                            <h2>Cadastro de Viagem</h2>
                            <span>
                                Registre novas viagens para acompanhamento. Cada viagem estará associada a um veículo e a um motorista.
                            </span>
                            <button onClick={openModal}>Cadastrar viagem</button>
                        </div>
                        <div className="table">
                            <TableTrip onEdit={openModalEdit} />
                        </div>
                        <Modal
                            isOpen={isModalOpen}
                            onRequestClose={() => setIsModalOpen(false)}
                            contentLabel="Exemplo Modal"
                            className={'config'}
                        >
                            <form action="" id='setup'>
                                <h2>Cadastro de viagem</h2>

                                <div className="row">
                                    <div className="col" style={{ width: '100%' }}>
                                        <div className="form-control">
                                            <label htmlFor="origin">Origem</label>
                                            <input type="text" id='origin' defaultValue={editData.length != 0 ? editData.origem : ``} />
                                            <span className='explication'>
                                                Obs.: Saída do caminhão.
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col" style={{ width: '100%' }}>
                                        <div className="form-control">
                                            <label htmlFor="destiny">Destino</label>
                                            <input type="text" id='destiny' defaultValue={editData.length != 0 ? editData.destino : ``} />
                                            <span className='explication'>
                                                Obs.: Entrega da carga.
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col">
                                        <div className="form-control">
                                            <label htmlFor="placa_select">Placa</label>
                                            <select name="placa" id="placa_select" >
                                                <option style={{ color: '#000' }} value="">Selecione uma placa</option>
                                                {options.map(option => (
                                                    <option style={{ color: '#000' }} key={option.id} value={option.id}>{option.placa}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="form-control">
                                            <label htmlFor="driver_select">Motorista</label>
                                            <select name="placa" id="driver_select">
                                                <option style={{ color: '#000' }} value="">Selecione um motorista</option>
                                                {options_motorista.map(option => (
                                                    <option style={{ color: '#000' }} key={option.id} value={option.id}>{option.nome}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                            </form>
                            <div className="modal-footer">
                                <button id='cancelar' onClick={HandleCancelTrip}>Cancelar</button>
                                <button form="setup" type="submit" onClick={(e) => editData.length != 0 ? submitFormTrip(e, `edit`) : submitFormTrip(e, `cadastrar`)}>Cadastrar</button>
                            </div>
                        </Modal>

                    </>
                );
            case 'driver':
                return (
                    <>
                        <div className="col">
                            <h2>Cadastro de motorista</h2>
                            <span>
                                O cadastro de usuário é restrito a administradores, responsáveis
                                por adicionar novos membros e gerenciar usuários. Administradores também
                                têm acesso total aos dados das páginas. Já os operadores têm apenas permissão de visualização,
                                sem poder de cadastro ou gerenciamento.
                            </span>
                            <button onClick={openModal}>Cadastrar motorista</button>
                        </div>
                        <div className="table">
                            <TableDriver onEdit={openModalEdit} />
                        </div>
                        <Modal
                            isOpen={isModalOpen}
                            onRequestClose={() => setIsModalOpen(false)}
                            contentLabel="Exemplo Modal"
                            className={'config'}
                        >
                            <form action="" id='setup'>
                                <h2>Cadastro de motorista</h2>
                                <div className="row">
                                    <div className="col">
                                        <div className="form-control">
                                            <label htmlFor="first_name">Nome</label>
                                            <input type="text" id='first_name' defaultValue={editData.length != 0 ? editData.nome.split(` `)[0] : ``} />
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="form-control">
                                            <label htmlFor="last_name">Sobrenome</label>
                                            <input type="text" id='last_name' defaultValue={editData.length != 0 ? editData.nome.split(` `)[1] : ``} />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col" style={{ width: '100%' }}>
                                        <div className="form-control">
                                            <label htmlFor="cpf">CPF</label>
                                            <InputMask
                                                type="text"
                                                placeholder='___.___.___-__'
                                                mask={'999.999.999-99'}
                                                id='cpf'
                                                defaultValue={editData.length != 0 ? editData.cpf : ``}
                                            />
                                        </div>
                                    </div>

                                </div>
                                <div className="row">
                                    <div className="col" style={{ width: '100%' }}>
                                        <div className="form-control">
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
                                                    accept="image/*"
                                                    className="file-upload-input"
                                                    onChange={handlePhotoChange}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </form>
                            <div className="modal-footer">
                                <button id='cancelar' onClick={handleCancelDriver}>Cancelar</button>
                                <button form="setup" type="submit" onClick={(e) => editData.length != 0 ? submitFormDriver(e, `edit`) : submitFormDriver(e, `cadastrar`)}>Cadastrar</button>
                            </div>
                        </Modal>

                    </>
                );
            default:
                return null;
        }
    };

    return (
        <>
            <Sidebar />
            <div className="page configurations">
                <div className="divConfig">
                    <div className="lateral">
                        <ul>
                            <img src="./src/images/logoEmbeddo.webp" alt="" width={120} />
                            <li onClick={() => handleTabChange('Usuario')}>
                                <i><BsPersonFillGear /></i>
                                <span>Usuário</span>
                            </li>
                            <li onClick={() => handleTabChange('truck')}>
                                <i><FaTruck /></i>
                                <span>Caminhão</span>
                            </li>
                            <li onClick={() => handleTabChange('trip')}>
                                <i><BsFillPinMapFill /></i>
                                <span>Viagem</span>
                            </li>
                            <li onClick={() => handleTabChange('driver')}>
                                <i><BsPersonBadgeFill /></i>
                                <span>Motorista</span>
                            </li>
                        </ul>
                        <span id="version">EM310 © v1.0.0</span>
                    </div>

                    <div className="config">
                        {renderActiveTable()}
                    </div>
                </div>


            </div>


        </>
    )
}