import { useMemo, useState, useEffect } from 'react';
import React from 'react';
import { GoogleMap, useLoadScript, Marker, DirectionsRenderer , Polygon} from '@react-google-maps/api';
import Report from "../components/Report";
import { Chip, Button } from "@mui/material";
import { useParams } from 'react-router-dom';
import elevatorIcon from "../images/Elevator.svg"
import elevatorDropperIcon from "../images/ElevatorPlaceMarker.svg"

const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
const libraries = ['places'];
const mapContainerStyle = {
  width: '100vw',
  height: '80vh',
};
//const clemson = { lat: 34.6834, lng: -82.8374 };
const clemson = { lat: 34.6775, lng: -82.8362};
const greenville = { lat: 34.8526, lng: -82.3940};

const polygonCoords = require("../coordinates/polygons.json");
const elevatorCoords = require("../coordinates/elevators.json");
const reportIcon = "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png";
const reportPolygonLimit = 10;

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


function Map() {
  const { mapName } = useParams();
  const [startPos, setStartMarkerPosition] = useState();
  const [endPos, setEndMarkerPosition] = useState();
  const [elevatorPos, setElevatorPosition] = useState();
  const [stairs, setStairs] = useState(Array(4).fill(null));
  const [stairIndex, setStairIndex] = useState(0);
  const [stairsSet, setStairsSet] = useState(false);
  const [ramp, setRamp] = useState(Array(reportPolygonLimit).fill(null));
  const [rampIndex, setRampIndex] = useState(0);
  const [rampSet, setRampSet] = useState(false);
  const [directions, setDirections] = useState();
  const [center, setCenter] = useState({ lat: 34.5034, lng: -82.6501 });
  const [reportType, setReportType] = useState(null);
  const [name, setName] = useState("");

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
	console.log('Clicked coordinates:', event.latLng.lat(), event.latLng.lng());
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
	//zoom into current position
	//set circle 15m to say where can report
      if(reportMode === "Elevator")
      {
        setElevatorPosition({
          lat: event.latLng.lat(),
          lng: event.latLng.lng(),
        });
      }
      else if(reportMode === "Stair" && stairIndex < reportPolygonLimit)
      {
          setStairs(stairs => {
            const updatedStairs = [...stairs];
            updatedStairs[stairIndex] = {lat: event.latLng.lat(), lng: event.latLng.lng()};
            return updatedStairs;
          });

		// Increment stair index
		console.log(stairIndex);
		setStairIndex(stairIndex + 1);
      }
      else if(reportMode === "Ramp" && rampIndex < reportPolygonLimit)
      {
          setRamp(ramp => {
            const updatedRamp = [...ramp];
            updatedRamp[rampIndex] = {lat: event.latLng.lat(), lng: event.latLng.lng()};
            return updatedRamp;
          });

		// Increment ramp index
		console.log(rampIndex);
		setRampIndex(rampIndex + 1);
      }
    }
  };

  //console.log(stairs);

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
		var label = document.getElementById("report_label");
		setRampIndex(0);
		setStairIndex(0);
		if(type === "Ramp"){
			label.textContent = "Reporting: Ramps. Place markers outlining the hazard."
		}
		else if(type === "Stair"){
			label.textContent = "Reporting: Stairs. Place markers outlining the hazard."
		}
		else if(type === "Elevator"){
			label.textContent = "Reporting: Elevators. Place the marker where the elevator is."
		}
	};

	const handleReportTypeAction = (type) => {
		if(type === "Cancel"){
			console.log("Cancel");
			//set everything to their zero
			setReportType(null);
			setRampIndex(0);
			setStairIndex(0);
			setElevatorPosition(null);
			document.getElementById("report_label").textContent= "";
			document.getElementById("hidden_div").style.visibility = "hidden";
			//remove markers
		}else if(type === "Undo"){
			console.log("Undo");
			if(reportType === "Ramp"){
				if(rampIndex > 1){
					setRampIndex(rampIndex - 1);
					//remove marker
				}
			}
			else if(reportType === "Stair"){
				if(stairIndex > 1){
					setRampIndex(stairIndex - 1);
					//remove marker
				}
			}
			else if(reportType === "Elevator"){
				setElevatorPosition(null);
				//remove marker
			}
		}else if(type === "Confirm"){
			var validReport = false;
			console.log("Confirm");
			if(reportType === "Ramp"){
				if(rampIndex > 4){
					setReportType(null);
					setRampIndex(0);
					setRampSet(true);
					//INSERT polygon to database
					validReport = true;
				}
				//validate if proper polygon
			}
			else if(reportType === "Stair"){
				// Reset stair and turn off reporting
				//validate if proper polygon
				if(stairIndex > 4){
					setReportType(null);
					setStairIndex(0);
					setStairsSet(true);
					//INSERT stair coord to database
					validReport = true;
				}
			}
			else if(reportType === "Elevator"){
				if(elevatorPos != null){
					validReport = true;
					//INSERT Elevator coord to database
					setElevatorPosition(null);
				}
			}
			var label = document.getElementById("report_label");
			if(validReport === true){
				// Turn off reporting
				setReportType(null);
				document.getElementById("hidden_div").style.visibility = "hidden";
				label.textContent= "Report Sent!";
				setTimeout(() => label.textContent="", 3000);
			}else{
				label.textContent = "Invalid report!";
			}
		}
	}

  return (
    <div>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={18}
        center={center}
        options={options}
        onClick={handleMapClick(reportType)}
      >
		<div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
			<div>
			{startPos && endPos && <Button
				onClick={() => fetchDirections()}
				style={{
					border: '2px solid black',
					padding: '10px 20px', // Increase padding to make the button bigger
					fontSize: '1.2rem', // Increase font size
					marginRight: '25px', // Pushes the GO button to the left
					backgroundColor: 'white',
				}}
			>
			    GO!
			</Button>}
			{startPos && !directions && <Chip label="Start" variant="outlined" style={{ marginRight: '5px', backgroundColor: 'pink' }} onDelete={handleStartDeleteMarker} />}
			{endPos && !directions && <Chip label="End" variant="outlined" style={{ marginRight: '5px', backgroundColor: 'lightgreen' }} onDelete={handleEndDeleteMarker} />}

			//report has an implicit outer div
			<Report onReportTypeChange={handleReportTypeChange} onReportActionClicked={handleReportTypeAction}/>
			</div>
		</div>

        {startPos && !directions && <Marker position={startPos}></Marker> }
        {endPos && !directions && <Marker position={endPos}></Marker>}
        {elevatorPos && <Marker
        position={elevatorPos}
          icon={{url: elevatorDropperIcon, scaledSize: new window.google.maps.Size(50, 80)}}></Marker>}
        {stairs.map((position, index) => (
                position && (
                    <Marker key={index} position={position} icon={reportIcon} />
                )
            ))}
        {stairsSet && <Polygon
          paths={stairs}
          options={stairHazard}
        />}
        {ramp.map((position, index) => (
                position && (
                    <Marker key={index} position={position} icon={reportIcon} />
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
	//get from database
	{
	//setting predefined points
	elevatorCoords.coords.map(mark =>
		<Marker
		key={mark.lat}
		position={mark}
		icon={{
			url: elevatorIcon,
			scaledSize: new window.google.maps.Size(90, 100),
		}}
		/>)
	}

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

//<div style={{ display: 'flex', alignItems: 'left',  justifyContent: 'left'  }}>
//{elevatorCoords.coords.map(mark => <Marker key={mark.lat} position={mark} icon={{url: "https://upload.wikimedia.org/wikipedia/commons/7/73/Aiga_elevator.png", scaledSize: new window.google.maps.Size(50, 80)}}/>)}
