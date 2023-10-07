import { useContext, useRef, useState, useEffect } from 'react';
import { MdLocationPin, MdGpsFixed } from 'react-icons/md'
import Sidebar from '../components/Sidebar';
import Map from '../components/Map_trip';
import { useParams } from 'react-router-dom';
import TableGeral from '../components/TableGeral';
import Detecçao from '../components/Deteccao';
import Sider from '../components/Sider';
import Modal from 'react-modal';
import { GrClose } from 'react-icons/gr'

export default function Trip() {
    const [mapRef, setMapRef] = useState([-23.4757956, -46.44894713]);
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState('VisaoGeral');
    const [contentType, setContentType] = useState('');
    const [path, setPath] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);



    const [data, setData] = useState([{
        id: '',
        placa: '',
        nome: '',
        origem: '',
        destino: '',
        endereco: '',
        att: '',
        lat: '',
        longi: ''
    }]);


    useEffect(() => {

        function update() {
            fetch('http://20.226.34.88:5000/trip/' + id)
                .then(response => response.json())
                .then(data => setData(data))
                .catch(err => console.error(err));
        }
        update();
        const interval = setInterval(update, 10000);
        return () => {
            clearInterval(interval);
        }
    }, []);

    const position = [data[0].lat, data[0].longi];

    function openModal() {
        setIsModalOpen(true);
    }

    const handleMapRef = (map) => {
        setMapRef(map);
    };

    const handleTabChange = (tabName) => {
        setActiveTab(tabName);
    };


    const handleModal = (path, type) => {
        openModal();
        setContentType(type);
        setPath('https://em800bucket.s3.sa-east-1.amazonaws.com/' + path.value);
    }

    const renderActiveTable = () => {
        switch (activeTab) {
            case 'VisaoGeral':
                return <TableGeral handleClickRow={handleModal} />;

            case 'Detecao':
                return <Detecçao />;
            case 'Sider':
                return <Sider />;
            default:
                return null;
        }
    };

    return (
        <>
            <Sidebar />
            <div className="page">
                <a href="/principal" id='backPage'>Voltar</a>
                <div className="details">
                    <div className="col">
                        <div className="header">
                            <h2>VIAGEM {data[0].id}</h2>
                            {/*  <h2>Status: <span>TERMINADA</span></h2> */}
                        </div>

                        <h2>Placa: <span>{data[0].placa}</span></h2>
                        <h2>Motorista: <span>{data[0].nome}</span></h2>

                        <div className="itinerario">
                            <div className="control">
                                <MdGpsFixed />
                                <input type="text" disabled value={data[0].origem} />
                            </div>
                            <div className="control">
                                <MdLocationPin fill='#f93535' />
                                <input type="text" disabled value={data[0].destino} />
                            </div>
                        </div>

                        <hr />

                        <div className="last">
                            <h2>Última localização</h2>
                            <span>{data[0].endereco}</span>
                            <h2 id='lastUpdate'>Ultima atualização: <span>{data[0].att}</span></h2>
                        </div>
                    </div>

                    <div className="col">
                        <div className="map">
                            <Map onMapRef={handleMapRef} position={position} />

                        </div>
                    </div>
                </div>

                <div className="alertas">
                    <div className="header">
                        <button className={activeTab === 'VisaoGeral' ? 'active' : ''} onClick={() => handleTabChange('VisaoGeral')}>Visão geral</button>
                        <button className={activeTab === 'Detecao' ? 'active' : ''} onClick={() => handleTabChange('Detecao')}>Status Detecção</button>
                        <button className={activeTab === 'Sider' ? 'active' : ''} onClick={() => handleTabChange('Sider')}> Status Sider</button>
                    </div>

                    <div className="row">
                        {renderActiveTable()}
                    </div>
                </div>

                <Modal
                    isOpen={isModalOpen}
                    onRequestClose={() => setIsModalOpen(false)}
                    contentLabel='Jorge'
                >
                    <button onClick={() => setIsModalOpen(false)}><GrClose /> </button>

                    <>
                        {contentType === 'Foto' ? (
                            <img src={path} alt="Foto" />
                        ) : contentType === 'Video' ? (
                            <video controls>
                                <source src={path} type="video/mp4" />
                                Seu navegador não suporta o elemento de vídeo.
                            </video>
                        ) : (
                            <p>{''}</p>
                        )}
                    </>

                </Modal>

            </div>
        </>
    )
}
