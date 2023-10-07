import TableDetection from './TableDetection'
import { useState } from 'react';


export default function Detecçao() {
    const [path, setPath] = useState('');
    const [type, setType] = useState('');

    const teste = (path, type) => {
        setPath('https://em800bucket.s3.sa-east-1.amazonaws.com/' + path.value);
        setType(type);
    }

    const renderActivePhoto = () => {
        console.log(path);
        switch (type) {
            case 'Video':
                return (
                    <video controls>
                        <source src={path} type="video/mp4" />
                    </video>
                );

            case 'Foto':
                return (
                    <img src={path} width={750} alt="Foto" />
                );
            default:
                return (
                    <>
                        <h2>Selecione ao lado um evento para visualiza-lo.</h2>
                        <img src="../src/images/Embeddo.png" width={30} alt="" />
                    </>
                );
        }
    };

    return (
        <div className="detection">
            {/* <div className='NoContent'>
                <img width={30} src="../src/images/Embeddo.png" alt="" />
                <h4>Sem alertas Detecção</h4>
            </div> */}

            <div className="col">
                <TableDetection handleClickRow={teste} />
            </div>
            <div className="col">
                <div className="empty">
                    {renderActivePhoto()}
                </div>
            </div>
        </div>
    )
}