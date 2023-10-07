import React, { useEffect, useRef, useState, forwardRef } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet'
import MarkerEmb from './MarkerEmb';
import { useSelector, useDispatch } from 'react-redux';
import L from 'leaflet'; // Import L from leaflet
/* 
    Implementar: 
    - Atualização automática da posição vindo da Home;
    - Controles de visualização do mapa 
*/


const Map = ({ onMapRef, position }) => {
    const [map, setMap] = useState('')
    const zoomLevel = 13;
    const mapRef = useRef(null);

    useEffect(() => {
        onMapRef(mapRef.current);
    }, [onMapRef]);

    const [data, setData] = useState([{
        placa: '',
        viagem: '',
        motorista: '',
        status: '',
        endereco: '',
        sider: '',
        reconhecimento: '',
        att: '',
        lat: '-23.478641507948286',
        longi: '-46.44902005810236'
    }]);

    useEffect(() => {
        function update() {
            fetch('http://20.226.34.88:5000/get_caminhao')
                .then(response => response.json())
                .then(data => setData(data))
                .catch(err => console.error(err));
        }
        update();
        const interval = setInterval(update, 5000);
        return () => {
            clearInterval(interval);
        }
    }, []);

    var Markers = [];
    data.map(marker => {
        Markers.push({ geocode: [marker.lat, marker.longi], Popup: "Latitude: " + marker.lat + ", Longitude: " + marker.longi, viagem: marker.viagem })
    })

    if (map !== null && map !== '') {
        map.setView(position, 15)
    }

    return (
        <>
            <MapContainer ref={mapRef} center={[data[0].lat, data[0].longi]} zoom={5} scrollWheelZoom={true}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {Markers.map((marker, index) => (
                    <MarkerEmb key={index} position={marker.geocode} name={marker.Popup} viagem={marker.viagem}>

                    </MarkerEmb>
                ))}
            </MapContainer>
        </>
    )

};

export default Map;
