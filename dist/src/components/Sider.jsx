import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BsFillCircleFill } from 'react-icons/bs'
import TableSider from "./TableSider";

export default function Sider() {
    const [data, setData] = useState('');
    const { id } = useParams();
    const [sensor_status, setSensorStatus] = useState('');

    function formatarDataHora(dataString) {
        const data = new Date(dataString);

        const dia = String(data.getDate()).padStart(2, '0');
        const mes = String(data.getMonth() + 1).padStart(2, '0'); // Os meses são indexados a partir de 0
        const ano = data.getFullYear();
        const horas = String(data.getHours()).padStart(2, '0');
        const minutos = String(data.getMinutes()).padStart(2, '0');
        const segundos = String(data.getSeconds()).padStart(2, '0');
        return `${dia}/${mes}/${ano} ${horas}:${minutos}:${segundos}`;
    }


    useEffect(() => {
        function update() {
            fetch('http://20.226.34.88:5000/get_alertas/' + id)
                .then(response => response.json())
                .then(data => {
                    setData(data.sider)
                    setSensorStatus(data.status)
                })
                .catch(err => console.error(err));
        }
        update();

        const interval = setInterval(update, 5000);
        return () => {
            clearInterval(interval);
        }
    }, []);
    return (
        <>
            {/* <div className='NoContent'>
                <img width={30} src="../src/images/Embeddo.png" alt="" />
                <h4>Sem alertas Sider</h4>
            </div> */}

            <div className="sider">
                <div className="col">
                    <TableSider></TableSider>
                </div>
                <div className="col">
                    <div className="truck">

                        <div className="rowTruck">
                            <div className="control">
                                {sensor_status[2] ? (
                                    <>
                                        <div className={sensor_status[2].status !== 1 ? 'circle off' : 'circle active'}>
                                            <span className="tooltip">Ultima Atualização: {formatarDataHora(sensor_status[2].ts)}</span>
                                        </div>
                                        <span>Sensor {sensor_status[2].sensor_id}</span>
                                    </>
                                ) : (
                                    <>
                                        <div className="circle"></div>
                                        <span>Sensor desligado</span>
                                    </>
                                )}
                            </div>
                            <div className="control">
                                {sensor_status[0] ? (
                                    <>
                                        <div className={sensor_status[0].status != 1 ? 'circle off' : 'circle active'}>
                                            <span className="tooltip">Ultima Atualização: {formatarDataHora(sensor_status[0].ts)}</span>

                                        </div>
                                        <span>Sensor {sensor_status[0].sensor_id}</span>
                                    </>
                                ) : (
                                    <>
                                        <div className="circle"></div>
                                        <span>Sensor desligado</span>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="rowTruck">
                            <div className="control">
                                {sensor_status[3] ? (
                                    <>
                                        <div className={sensor_status[3].status != 1 ? 'circle off' : 'circle active'}>
                                            <span className="tooltip">Ultima Atualização: {formatarDataHora(sensor_status[3].ts)}</span>

                                        </div>
                                        <span>Sensor {sensor_status[3].sensor_id}</span>
                                    </>
                                ) : (
                                    <>
                                        <div className="circle"></div>
                                        <span>Sensor desligado</span>
                                    </>
                                )}
                            </div>
                            <div className="control" >
                                {sensor_status[1] ? (
                                    <>
                                        <div className={sensor_status[1].status != 1 ? 'circle off' : 'circle active'}>
                                            <span className="tooltip">Ultima Atualização: {formatarDataHora(sensor_status[1].ts)}</span>

                                        </div>
                                        <span>Sensor {sensor_status[1].sensor_id}</span>
                                    </>
                                ) : (
                                    <>
                                        <div className="circle"></div>
                                        <span>Sensor desligado</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </>

    )
}