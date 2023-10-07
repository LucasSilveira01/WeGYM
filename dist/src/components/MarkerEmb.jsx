import { useMap, Marker, Popup } from 'react-leaflet'
import { Icon } from 'leaflet';
import React, { useEffect, useState } from 'react';

var customIcon = new Icon({
  iconUrl: "./src/images/bait-icon.png",
  iconSize: [38, 38]
})



const MarkerEmb = ({ position, name, viagem }) => {
  const map = useMap();
  const [originalZoom, setOriginalZoom] = useState(map.getZoom()); // Armazena o zoom original

  const handleMarkerClick = () => {
    if (map.getZoom() === originalZoom) {
      map.panTo(position);
      map.setZoom(15);
    } else
      map.setView(position, originalZoom); // Volta para o zoom original
  };

  return (
    <Marker position={position} eventHandlers={{ click: handleMarkerClick }} icon={customIcon}>
      <Popup>{name} Alertas: <a href={'/trip/' + viagem}>Detalhamento</a></Popup>
    </Marker>
  );
};

export default MarkerEmb;