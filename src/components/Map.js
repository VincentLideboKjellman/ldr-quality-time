import React, { useRef, useEffect, useMemo } from 'react';
import { GoogleMap, StreetViewPanorama } from '@react-google-maps/api';
import io from 'socket.io-client';

function Map() {
  const mapRef = useRef();
  const panoRef = useRef();
  const socket = io();

  useEffect(() => {
    // listen for a "position" event and update the panorama position
    socket.on('position', function(position) {
      panoRef.current.setPosition(position);
    });
  
    // listen for a "pov" event and update the panorama point of view
    socket.on('pov', function(pov) {
      panoRef.current.setPov(pov);
    });
  }, [socket]); // include the socket dependency here
  

  return useMemo(() => {
    return (
      <GoogleMap
        ref={mapRef}
        defaultZoom={8}
        defaultCenter={{lat: -34.397, lng: 150.644}}
        onClick={e => {
          // send a message to the server with the new position and pov
          socket.emit('move', {
            position: panoRef.current.getPosition(),
            pov: panoRef.current.getPov()
          });
        }}
        googleMapURL={`https://maps.googleapis.com/maps/api/js?key=INSERT_KEY`}
      >
        <StreetViewPanorama
          ref={panoRef}
          defaultPosition={{lat: -34.397, lng: 150.644}}
          defaultPov={{heading: 165, pitch: 0}}
          onPovChanged={() => {
            // send a message to the server with the new position and pov
            socket.emit('move', {
              position: panoRef.current.getPosition(),
              pov: panoRef.current.getPov()
            });
          }}
        />
      </GoogleMap>
    );
  }, [mapRef, panoRef, socket]); // list the dependencies here
}

export default Map;