import React from 'react';
import { GoogleMap, useLoadScript, Marker, Polygon} from '@react-google-maps/api';

const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const libraries = ['places'];
const mapContainerStyle = {
  width: '100vw',
  height: '100vh',
};

const center = { lat: 34.6834, lng: -82.8374 };

const elevatorMarkers = [
	{lat: 34.677309892334335, lng: -82.83709680406795},
	{lat: 34.675319675177256, lng: -82.83689295618282},
];

function parseCordinates(){
	const rectangleCoordinates = [
		{ lat: 34.67722643146838, lng: -82.8373681675465},
		{ lat: 34.67718011030858, lng: -82.83707312455486},
		{ lat: 34.67724407761767, lng: -82.83705703130077},
		{ lat: 34.67729922181002, lng: -82.8373869430096},
		{ lat: 34.67722643146838, lng: -82.8373681675465}
	];

	/*
	var coords = [];
	for (var index = 0; index < coordinates.length - 1; index++) {
	result.push({
		lat: Number(coordinates[index].lat),
		lng: Number(coordinates[index].lng),
	});
	}
	return coords;
	*/
	return rectangleCoordinates;
}

const stairHazard = {
	strokeOpacity:0.8,
	strokeWeight:2,
	clickable:false,
	draggable:false,
	editable:false,
	visible:true,
	strokeColor: "#FFFF00",
	fillColor: "#000000",
};

function handleMapClick (event){
	console.log('Clicked coordinates:', event.latLng.lat(), event.latLng.lng());
};

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
        zoom={15}
        center={center}
        mapId={"a4620df1fed5e14e"}
	   onClick={handleMapClick}
      >
        <Marker position={center}></Marker>
		//read as for every mark in elevatorMarkers
		//make a marker with its position
		{elevatorMarkers.map(mark => <Marker key={mark.lat} position={mark}/>)}
	   <Polygon path={parseCordinates()} options={stairHazard}/>

      </GoogleMap>
    </div>
  );
};

//{( coordList=> <Polygon path{<>} options={stairHazard}/>)}
//<Circle center={center} radius={6} options={stairHazard}/>
export default Map;
