import React from 'react';
import { GoogleMap, useLoadScript, Marker, Polygon} from '@react-google-maps/api';
import elevatorSVG from '../images/Elevator.png';

const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
const libraries = ['places'];
const mapContainerStyle = {
  width: '100vw',
  height: '100vh',
};

//const center = { lat: 34.6834, lng: -82.8374 };
const center = {lat: 34.67746801796802, lng: -82.83621206595672};

const polygonCoords = require("../coordinates/polygons.json");
const elevatorCoords = require("../coordinates/elevators.json");

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

/*
const elevatorMarker = {
	icon:"../images/Elevator.svg",
	scale: 1
}
*/

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
        zoom={16}
        center={center}
        mapId={"a4620df1fed5e14e"}
	   onClick={handleMapClick}
      >
        <Marker position={center}></Marker>
		{elevatorCoords.coords.map(mark => <Marker key={mark.lat} icon={elevatorSVG} position={mark}/>)}

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

export default Map;

//{elevatorCoords.coords.map(mark => <Marker key={mark.lat} position={mark}/>)}
//{elevatorCoords.coords.map(mark => <Marker key={mark.lat} icon={elevatorSVG} position={mark}/>)}

