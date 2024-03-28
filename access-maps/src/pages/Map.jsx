import { useMemo, useState } from 'react';
import React from 'react';
import { GoogleMap, useLoadScript, Marker, DirectionsRenderer  } from '@react-google-maps/api';

import { Button } from "@mui/material";

const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const libraries = ['places'];
const mapContainerStyle = {
  width: '100vw',
  height: '80vh',
};

function Map() {
  const [startPos, setStartMarkerPosition] = useState();
  const [endPos, setEndMarkerPosition] = useState();
  const [directions, setDirections] = useState();

  const center = { lat: 34.6834, lng: -82.8374 };  

  const options = useMemo(
    () => ({
      mapId: "a4620df1fed5e14e",
      disableDefaultUI: true,
      clickableIcons: false,
    }),
    []
  );

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries,
  });

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading maps</div>;
  }

  const handleMapClick = (event) => {
    if(!startPos)
    {
      setStartMarkerPosition({
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      });
    }
    else if(!endPos)
    {
      setEndMarkerPosition({
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      });
    }
  };

  const fetchDirections = () => {
    // Return if start or end positions are not both defined
    if(!startPos || !endPos) return;

    const service = new window.google.maps.DirectionsService();
    service.route(
      {
        origin: startPos,
        destination: endPos,
        travelMode: window.google.maps.TravelMode.WALKING,
      },
      (result, status) => {
        if (status === "OK" && result) {
          setDirections(result);
        }
      }
    );
  };

  return (
    <div>
      {<Button
            onClick={() => fetchDirections()}
            style={{
                border: '2px solid black',
                padding: '10px 20px', // Increase padding to make the button bigger
                fontSize: '1.2rem', // Increase font size
            }}
            >
                GO!
        </Button>}
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={12}
        center={center}
        options={options}
        onClick={handleMapClick}
      >
        {startPos && <Marker position={startPos}></Marker> }
        {endPos && <Marker position={endPos}></Marker>}
          {directions && (
            <DirectionsRenderer
              directions={directions}
          />
          )
        }
      </GoogleMap>
    </div>
  );
};

export default Map;