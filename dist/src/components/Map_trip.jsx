import React, { useEffect, useRef, useState, forwardRef } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import { Icon } from 'leaflet';
/* 
    Implementar: 
    - Atualização automática da posição vindo da Home;
    - Controles de visualização do mapa 
*/


const Map = ({ onMapRef, position }) => {
    const zoomLevel = 13;
    const [map, setMap] = useState('')
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
        lat: '',
        longi: ''
    }]);

    var Markers = [];
    data.map(marker => {
        Markers.push({ geocode: position, Popup: "Latitude: " + marker.lat + ", Longitude: " + marker.longi })
    })
    if (map !== null && map !== '') {
        map.setView(position, 15)
    }

    var customIcon = new Icon({
        iconUrl: "../src/images/bait-icon.png",
        iconSize: [38, 38]
    })

    return (
        <>
            <MapContainer ref={setMap} center={position} zoom={5} scrollWheelZoom={true}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <Marker position={position} icon={customIcon}>
                </Marker>
            </MapContainer>
        </>
    )

};

export default Map;
