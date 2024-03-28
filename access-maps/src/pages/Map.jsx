import { useMemo, useState } from 'react';
import React from 'react';
import { GoogleMap, useLoadScript, Marker, DirectionsRenderer  } from '@react-google-maps/api';

import Report from "../components/Report";

import { Chip, Button } from "@mui/material";

const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const libraries = ['places'];
const mapContainerStyle = {
  width: '100vw',
  height: '80vh',
};

function Map() {
  const clemson = { lat: 34.6834, lng: -82.8374 };  
  const greenville = { lat: 34.8526, lng: -82.3940};

  const [startPos, setStartMarkerPosition] = useState();
  const [endPos, setEndMarkerPosition] = useState();
  const [directions, setDirections] = useState();
  const [center, setCenter] = useState({ lat: 34.5034, lng: -82.6501 });
  const [centerName, setCenterName] = useState();

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

  const toggleCenter = () => {
    if(centerName === "Clemson")
    {
      setCenterName("Greenville");
      setCenter(greenville);
    }
    else
    {
      setCenterName("Clemson");
      setCenter(clemson);
    }
  }

  const clearDirections = () => {
    if(!directions) return;
    setStartMarkerPosition(null);
    setEndMarkerPosition(null);
    setDirections(null);
  }

  const handleStartDeleteMarker = (event) => {
    setStartMarkerPosition(null);
  }

  const handleEndDeleteMarker = (event) => {
    setEndMarkerPosition(null);
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
          {startPos && endPos && <Button
              onClick={() => fetchDirections()}
              style={{
                  border: '2px solid black',
                  padding: '10px 20px', // Increase padding to make the button bigger
                  fontSize: '1.2rem', // Increase font size
                  marginRight: 'auto', // Pushes the GO button to the left
              }}
          >
              GO!
          </Button>}
          {<Button
              onClick={() => toggleCenter()}
              style={{
                  border: '2px solid black',
                  padding: '10px 20px', // Increase padding to make the button bigger
                  fontSize: '1.2rem', // Increase font size
                  marginRight: 'auto', // Pushes the GO button to the left
              }}
          >
              Toggle Center
          </Button>}
          {directions && <Button
              onClick={() => clearDirections()}
              style={{
                  border: '2px solid black',
                  padding: '10px 20px', // Increase padding to make the button bigger
                  fontSize: '1.2rem', // Increase font size
                  marginRight: 'auto', // Pushes the GO button to the left
              }}
          >
              Clear Directions
          </Button>}
          {startPos && !directions && <Chip label="Start" variant="outlined" onDelete={handleStartDeleteMarker} />}
          {endPos && !directions && <Chip label="End" variant="outlined" onDelete={handleEndDeleteMarker} />}
          <div style={{ marginLeft: 'auto' }}> {/* Aligns the Report button all the way to the right */}
              <Report />
          </div>
      </div>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={12}
        center={center}
        options={options}
        onClick={handleMapClick}
      >
        {startPos && !directions && <Marker position={startPos}></Marker> }
        {endPos && !directions && <Marker position={endPos}></Marker>}
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