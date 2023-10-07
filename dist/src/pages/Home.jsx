import { useContext, useRef, useState } from 'react';
import { SignedInContext } from '../hooks/Context';
import Map from '../components/Map';
import Sidebar from '../components/Sidebar';
import Table from '../components/Table';
import Modal from 'react-modal';
import { GrClose } from 'react-icons/gr'

export default function Home() {
    const { handleSignIn } = useContext(SignedInContext);
    const [src, setSrc] = useState('');
    const [mapRef, setMapRef] = useState('');
    const [pic, setPic] = useState(false);
    const [vid, setVid] = useState(false);

    //Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [serverResponse, setServerResponse] = useState('');
    const [contentType, setContentType] = useState('');

    function openModal() {
        setIsModalOpen(true);
    }

    const handleClickRow = (topic, central) => {
        const id = central; // Substitua pelo ID desejado
        const type = 'server'; // Substitua pelo tipo desejado
        setIsLoading(true);
        openModal();

        fetch(`http://20.226.34.88:5000/publish?id=${id}&type=${type}&topic=${topic}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Erro na requisição');
                }
                return response.json();
            })
            .then((data) => {
                console.log(data);
                if (data != '') {

                    setIsLoading(false);
                    setServerResponse(data.message);
                    setContentType(data.contentType);
                } else {
                    setIsLoading(true);
                }
            })
            .catch((error) => {
                console.error('Erro na requisição:', error);
                setIsLoading(true);
            });
    }
    const handleTableRowClick = (lat, long) => {
        if (mapRef.getZoom() === 5) {
            mapRef.setView([lat, long], 15);

        } else {
            mapRef.setView([lat, long], 5);
        }
    };

    const handleMapRef = (map) => {
        setMapRef(map);
    };

    return (
        <>
            <Sidebar />
            <div className="page">
                <div className="divMap">
                    <Map onMapRef={handleMapRef} position={mapRef} />
                </div>

                <div className="divTable">
                    <Table onTableRowClick={handleTableRowClick} handleClickRow={handleClickRow}></Table>
                </div>
                <Modal
                    isOpen={isModalOpen}
                    onRequestClose={() => setIsModalOpen(false)}
                    contentLabel="Exemplo Modal"
                >
                    <button onClick={() => setIsModalOpen(false)}><GrClose /> </button>
                    {isLoading ? (
                        <div className="loading-container">
                            <span>Aguardando resposta do servidor...</span>
                            <div className="loading-spinner"></div>
                        </div>
                    ) : (
                        <>
                            {contentType === 'Foto' ? (
                                <img src={serverResponse} alt="Foto" />
                            ) : contentType === 'Video' ? (
                                <video controls>
                                    <source src={serverResponse} type="video/mp4" />
                                    Seu navegador não suporta o elemento de vídeo.
                                </video>
                            ) : (
                                <p>{serverResponse}</p>
                            )}
                        </>
                    )}

                </Modal>
            </div>
        </>
    )
}