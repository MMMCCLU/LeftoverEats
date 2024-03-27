import React from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';

const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
console.log("Key: " + GOOGLE_MAPS_API_KEY)

const libraries = ['places'];
const mapContainerStyle = {
  width: '100vw',
  height: '100vh',
};

const center = { lat: 34.6834, lng: -82.8374 };
/*
const stairMarkers = [
	{lat: 34.6834, lng: -82.8374},
	{lat: 34.6834, lng: -82.8374},
	{lat: 34.6834, lng: -82.8374},
	{lat: 34.6834, lng: -82.8374},
	{lat: 34.6834, lng: -82.8374},
	{lat: 34.6834, lng: -82.8374},
	{lat: 34.6834, lng: -82.8374},
	{lat: 34.6834, lng: -82.8374},
	{lat: 34.6834, lng: -82.8374},
	{lat: 34.6834, lng: -82.8374},
	{lat: 34.6834, lng: -82.8374},
	{lat: 34.6834, lng: -82.8374},
	{lat: 34.6834, lng: -82.8374},
	{lat: 34.6834, lng: -82.8374},
	{lat: 34.6834, lng: -82.8374},
];

const slopeMarkers = [
	{lat: 34.6834, lng: -82.8374},
	{lat: 34.6834, lng: -82.8374},
	{lat: 34.6834, lng: -82.8374},
	{lat: 34.6834, lng: -82.8374},
	{lat: 34.6834, lng: -82.8374},
	{lat: 34.6834, lng: -82.8374},
	{lat: 34.6834, lng: -82.8374},
	{lat: 34.6834, lng: -82.8374},
	{lat: 34.6834, lng: -82.8374},
	{lat: 34.6834, lng: -82.8374},
];
*/

const elevatorMarkers = [
	{lat: 34.6834, lng: -82.8374},
	{lat: 34.6834, lng: -82.8374},
	{lat: 34.6834, lng: -82.8374},
	{lat: 34.6834, lng: -82.8374},
	{lat: 34.6834, lng: -82.8374},
	{lat: 34.6834, lng: -82.8374},
	{lat: 34.6834, lng: -82.8374},
	{lat: 34.6834, lng: -82.8374},
	{lat: 34.6834, lng: -82.8374},
	{lat: 34.6834, lng: -82.8374}
];

const stairPolygon = {
	strokeWeight=2,
	clickable=false,
	draggable=false,
	editable=false,
	visible=true,
	strokeColor = "#FFFF00"
	fillColor = "#000000"
}

function Map() {
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

  return (
    <div>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={5}
        center={center}
        mapId={"5db02d594e3ba962"}
      >
        <Marker position={center}></Marker>
      </GoogleMap>
    </div>
  );
};

export default Map;
