import React from 'react';
import { GoogleMap, useLoadScript, Marker, Polygon} from '@react-google-maps/api';

const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
const libraries = ['places'];
const mapContainerStyle = {
  width: '100vw',
  height: '100vh',
};

//const center = { lat: 34.6834, lng: -82.8374 };
const center = {lat: 34.67746801796802, lng: -82.83621206595672};

const elevatorMarkers = [
	{lat: 34.677309892334335, lng: -82.83709680406795},
	{lat: 34.675319675177256, lng: -82.83689295618282},
];

const polygonCoords = require("../polygons.json");
const elevatorCoords = require("../elevators.json");

const stairHazard = {
	strokeOpacity:0.9,
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

	{polygonCoords.polygons.map((polygonCoordinates, index) => (
		<Polygon
			key={index}
			paths={polygonCoordinates}
			options={stairHazard}
		/>))
	}
      </GoogleMap>
    </div>
  );
};


//{polygonCoords.polygons.map((coordList, index) => <Polygon key={index} path={coordList} options{stairHazard}/>)}
//<Polygon path={parseCoordinates()} options={stairHazard}/>
//{( coordList=> <Polygon path{<>} options={stairHazard}/>)}
//<Circle center={center} radius={6} options={stairHazard}/>
export default Map;
