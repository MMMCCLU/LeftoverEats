import { useMemo, useState, useEffect } from 'react';
import React from 'react';
import { GoogleMap, useLoadScript, Marker, DirectionsRenderer , Polygon} from '@react-google-maps/api';
import Report from "../components/Report";
import { Chip, Button } from "@mui/material";
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient } from '../util/http';
import { fetchMapFeatures, saveMapFeature } from '../util/features';

const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
const libraries = ['places'];
const mapContainerStyle = {
  width: '100vw',
  height: '80vh',
};

const clemson = { lat: 34.6834, lng: -82.8374 };  
const greenville = { lat: 34.8526, lng: -82.3940};

const PostFeatureDummyData = {
  featureType: "ramp",
  coordinates: [
    {
      latitude: 54.6772208204604,
      longitude: -62.8370558471691
    },
    {
      latitude: 54.6771733964104,
      longitude: -62.8370588646541
    },
    {
      latitude: 54.6771971084388,
      longitude: -62.8373559192956
    },
    {
      latitude: 54.6772537820768,
      longitude: -62.8373371163081
    }
  ]
};

const polygonCoords = require("../coordinates/polygons.json");
const elevatorCoords = require("../coordinates/elevators.json");

const stairHazard = {
	strokeOpacity:0.9,
	strokeWeight:2,
	clickable:false,
	draggable:false,
	editable:false,
	visible:true,
	strokeColor: "#000000",
	fillColor: "#FFFF00",
};

const rampPath = {
	strokeOpacity:0.9,
	strokeWeight:2,
	clickable:false,
	draggable:false,
	editable:false,
	visible:true,
	strokeColor: "#000000",
	fillColor: "#00FF00",
};

const elevatorMarker = {
	//icon:"../images/Elevator.svg",
	scale: 1
}

function handleMapClick (event){
	console.log('Clicked coordinates:', event.latLng.lat(), event.latLng.lng());
};

function Map() {
  const { mapName } = useParams();
  const [startPos, setStartMarkerPosition] = useState();
  const [endPos, setEndMarkerPosition] = useState();
  const [elevatorPos, setElevatorPosition] = useState();
  const [stairs, setStairs] = useState(Array(4).fill(null));
  const [stairIndex, setStairIndex] = useState(0);
  const [stairsSet, setStairsSet] = useState(false);
  const [ramp, setRamp] = useState(Array(4).fill(null));
  const [rampIndex, setRampIndex] = useState(0);
  const [rampSet, setRampSet] = useState(false);
  const [directions, setDirections] = useState();
  const [center, setCenter] = useState({ lat: 34.5034, lng: -82.6501 });
  const [reportType, setReportType] = useState(null);

  const { data = [], error, isLoading } = useQuery({
    queryKey: ['features'],
    queryFn: fetchMapFeatures,
  });

  const { mutate, isPending, isSaveError, saveError } = useMutation({
    mutationFn: saveMapFeature,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['saveFeatures'],
      });
    },
    onError: (error) => {
    },
  });

  useEffect(() => {
    // Set Google Maps Center based on mapName
    if (mapName === "Clemson") {
      setCenter(clemson);
    } else if (mapName === "Greenville") {
      setCenter(greenville);
    } else {
      console.log("INVALID MAP LOCATION");
    }
  }, [mapName]);

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

  const handleMapClick = (reportMode) => (event) => {
    // If map was clicked without being in "report" mode
    if(!reportMode)
    {
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
    }

    // Map click should create a report
    else
    {
      if(reportMode === "Elevator")
      {
        setElevatorPosition({
          lat: event.latLng.lat(),
          lng: event.latLng.lng(),
        });

        // Turn off reporting
        setReportType(null);
      }
      else if(reportMode === "Stair")
      {
        if(stairIndex === 4)
        {
            // TEMPORARY: Saves a dummy data ramp  to back-end
            mutate(PostFeatureDummyData);
            // TEMPORARY


          // Reset stair and turn off reporting
          setReportType(null);
          setStairIndex(0);
          setStairsSet(true);
        }
        else
        {
          setStairs(stairs => {
            const updatedStairs = [...stairs];
            updatedStairs[stairIndex] = {lat: event.latLng.lat(),
              lng: event.latLng.lng()};
            return updatedStairs;
          });

          console.log(stairs);
        }

        // Increment stair index
        setStairIndex(stairIndex + 1);
      }
      else if(reportMode === "Ramp")
      {
        if(rampIndex === 4)
        {
          // TEMPORARY: Saves a dummy data ramp  to back-end
          mutate(PostFeatureDummyData);
          // TEMPORARY


          // Reset stair and turn off reporting
          setReportType(null);
          setRampIndex(0);
          setRampSet(true);
        }
        else
        {
          setRamp(ramp => {
            const updatedRamp = [...ramp];
            updatedRamp[rampIndex] = {lat: event.latLng.lat(),
              lng: event.latLng.lng()};
            return updatedRamp;
          });
        }

        // Increment stair index
        setRampIndex(rampIndex + 1);
      }
      else
      {
        // TODO: Implement next milestone
      }
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

  const handleStartDeleteMarker = (event) => {
    setStartMarkerPosition(null);
  }

  const handleEndDeleteMarker = (event) => {
    setEndMarkerPosition(null);
  }

  const handleReportTypeChange = (type) => {
    // Update reportType state in the Map component
    setReportType(type);
    if(type === "Ramp")
    {
      
    }
    else if(type === "Stair")
    {

    }
    else if(type === "Elevator")
    {
      
    }

    // Set Marker elevator
  };

  //const dbMarkers = useMemo(() => generateMarkers(data), [data]);
  const dbMarkers = generateMarkers(data);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'left',  justifyContent: 'left'  }}>
          {startPos && endPos && <Button
              onClick={() => fetchDirections()}
              style={{
                  border: '2px solid black',
                  padding: '10px 20px', // Increase padding to make the button bigger
                  fontSize: '1.2rem', // Increase font size
                  marginRight: '25px', // Pushes the GO button to the left
              }}
          >
              GO!
          </Button>}
          {startPos && !directions && <Chip label="Start" variant="outlined" style={{ marginRight: '5px', backgroundColor: 'pink' }} onDelete={handleStartDeleteMarker} />}
          {endPos && !directions && <Chip label="End" variant="outlined" style={{ marginRight: '5px', backgroundColor: 'lightgreen' }} onDelete={handleEndDeleteMarker} />}
          <div style={{ marginLeft: 'auto' }}> {/* Aligns the Report button all the way to the right */}
            <Report onReportTypeChange={handleReportTypeChange} />
          </div>
      </div>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={18}
        center={center}
        options={options}
        onClick={handleMapClick(reportType)}
      >
        {startPos && !directions && <Marker position={startPos}></Marker> }
        {endPos && !directions && <Marker position={endPos}></Marker>}
        {/* {dbMarkers.map(aPoint => <Marker key={aPoint.lat} pos={aPoint} />)} */}
        {elevatorPos && <Marker 
        position={elevatorPos} 
          icon={{url: "https://upload.wikimedia.org/wikipedia/commons/7/73/Aiga_elevator.png", scaledSize: new window.google.maps.Size(50, 80)}}></Marker>}
        {stairs.map((position, index) => (
                position && (
                    <Marker key={index} position={position} icon="https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png" />
                )
            ))}
        {stairsSet && <Polygon
          paths={stairs}
          options={stairHazard}
        />}
        {ramp.map((position, index) => (
                position && (
                    <Marker key={index} position={position} icon="https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png" />
                )
            ))}
        {rampSet && <Polygon
          paths={ramp}
          options={rampPath}
        />}
        
        {directions && (
          <DirectionsRenderer
            directions={directions}
        />
        )
        }
  {elevatorCoords.coords.map(mark => <Marker key={mark.lat} position={mark} icon={{url: "https://upload.wikimedia.org/wikipedia/commons/7/73/Aiga_elevator.png", scaledSize: new window.google.maps.Size(50, 80)}}/>)}

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

const generateMarkers = (markerData) => {
  const _markers = [];
  // markerData.array.map(element => {
  //   if (element.featureType == 'elevator'){
  //     _markers.push({
  //       lat: element.latitude,
  //       lng: element.longitude,
  //       //urlpng: "https://upload.wikimedia.org/wikipedia/commons/7/73/Aiga_elevator.png",
  //     });
  //   }
  // });
  
  return _markers;
}

export default Map;
