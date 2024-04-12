import { useMemo, useState, useEffect } from 'react';
import React from 'react';
import { GoogleMap, useLoadScript, Marker, DirectionsRenderer , Polygon} from '@react-google-maps/api';
import Report from "../components/Report";
import AccessibilityRouter from '../components/AccessibilityRouter';
import { Chip, Button } from "@mui/material";
import { useParams } from 'react-router-dom';
import elevatorIcon from "../images/Elevator.svg"
import elevatorDropperIcon from "../images/ElevatorPlaceMarker.svg"
import stairDropperIcon from "../images/StairsPlaceMarker.svg"
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient } from '../util/http';
import { fetchMapFeatures, saveMapFeature } from '../util/features';

const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
const libraries = ['places'];
const mapContainerStyle = {
  width: '100vw',
  height: '80vh',
};
//const clemson = { lat: 34.6834, lng: -82.8374 };
const clemson = { lat: 34.6775, lng: -82.8362};
const greenville = { lat: 34.8526, lng: -82.3940};
const testPos = {lat: 34.677692944796476, lng: -82.83357787606501}

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
const reportIcon = "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png";
const reportPolygonLimit = 10;
const reportingStairsCue = "Reporting: Stairs. Place markers outlining the hazard."
const reportingRampsCue = "Reporting: Ramps. Place markers outlining the hazard."
const reportingElevCue = "Reporting: Elevators. Place the marker where the elevator is."


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
  const [getDirections, setGetDirections] = useState(false);
  const [polygons, setPolygons] = useState(require("../coordinates/polygons.json"));
  const [elevators, setElevators] = useState(require("../coordinates/elevators.json"));
  const [elevatorPos, setElevatorPosition] = useState();
  const [stairs, setStairs] = useState(Array(reportPolygonLimit).fill(null));
  const [stairIndex, setStairIndex] = useState(0);
  const [stairsSet, setStairsSet] = useState(false);
  const [ramp, setRamp] = useState(Array(reportPolygonLimit).fill(null));
  const [rampIndex, setRampIndex] = useState(0);
  const [rampSet, setRampSet] = useState(false);
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
		const label = document.getElementById("report_label");
      if(reportMode === "Elevator")
      {
        setElevatorPosition({
          lat: event.latLng.lat(),
          lng: event.latLng.lng(),
        });
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
            updatedStairs[stairIndex] = {lat: event.latLng.lat(), lng: event.latLng.lng()};
            return updatedStairs;
          });

		// Increment stair index
		//for what ever reason the index only updates after method termination
		//so a temp variable is used
		var newIndex = stairIndex + 1;
		setStairIndex(newIndex);
		label.textContent = reportingStairsCue + ` Markers left (${reportPolygonLimit - newIndex})`;
      }
      else if(reportMode === "Ramp" && rampIndex < reportPolygonLimit)
      {
          setRamp(ramp => {
            const updatedRamp = [...ramp];
            updatedRamp[rampIndex] = {lat: event.latLng.lat(), lng: event.latLng.lng()};
            return updatedRamp;
          });

		// Increment ramp index
		//for what ever reason the index only updates after method termination
		//so a temp variable is used
		var newIndex = rampIndex + 1;
		setRampIndex(newIndex);
		label.textContent = reportingRampsCue + ` Markers left (${reportPolygonLimit - newIndex})`;
      }
    }
  };

  const fetchDirections = () => {
    setGetDirections(true);
  }

  const handleStartDeleteMarker = (event) => {
    setStartMarkerPosition(null);
  }

  const handleEndDeleteMarker = (event) => {
    setEndMarkerPosition(null);
  }

	const handleReportTypeChange = (type) => {
		if(reportType == null){
			setCenter(clemson);

			//draw circle
		}
		// Update reportType state in the Map component
		setReportType(type);
		console.log("setting type");

		var label = document.getElementById("report_label");
		if(type === "Ramp"){
			label.textContent = reportingRampsCue + ` Markers left (${reportPolygonLimit})`;

			//remove opposing markers if any
			for (var i = 0; i < stairIndex; ++i) stairs[i] = null;
			setStairIndex(0);
			setElevatorPosition(null);
		}
		else if(type === "Stair"){
			label.textContent = reportingStairsCue + ` Markers left (${reportPolygonLimit})`;

			//remove opposing markers if any
			for (var i = 0; i < rampIndex; ++i) ramp[i] = null;
			setRampIndex(0);
			setElevatorPosition(null);
		}
		else if(type === "Elevator"){
			label.textContent = reportingElevCue;

			//remove opposing markers if any
			for (var i = 0; i < stairIndex; ++i) stairs[i] = null;
			setStairIndex(0);
			for (var i = 0; i < rampIndex; ++i) ramp[i] = null;
			setRampIndex(0);
		}
	};


	const handleReportTypeAction = (type) => {
		const label = document.getElementById("report_label");
		if(type === "Cancel"){
			console.log("Cancel");
			//set everything to their zero
			setReportType(null);
			setElevatorPosition(null);
			//removes markers if any
			for (var i = 0; i < stairIndex; ++i) stairs[i] = null;
			for (var i = 0; i < rampIndex; ++i) ramp[i] = null;

			setRampIndex(0);
			setStairIndex(0);
			label.textContent= ""
			document.getElementById("hidden_div").style.visibility = "hidden";
			//remove markers
		}else if(type === "Undo"){
			console.log("Undo");
			if(reportType === "Ramp"){
				if(rampIndex >= 1){
					ramp[rampIndex - 1] = null;
					var newIndex = rampIndex - 1;
					setRampIndex(newIndex);
					label.textContent = reportingRampsCue + ` Markers left (${reportPolygonLimit - newIndex})`;
					console.log("Undo: " + rampIndex);
				}
			}
			else if(reportType === "Stair"){
				if(stairIndex >= 1){
					stairs[stairIndex - 1] = null;
					var newIndex = stairIndex - 1;
					setStairIndex(newIndex);
					label.textContent = reportingStairsCue + ` Markers left (${reportPolygonLimit - newIndex})`;
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
				if(rampIndex >= 4){
					setReportType(null);
					setRampIndex(0);
					setRampSet(true);
					//INSERT polygon to database
					validReport = true;
					for (var i = 0; i < rampIndex; ++i) ramp[i] = null;
				}
				//validate if proper polygon
			}
			else if(reportType === "Stair"){
				// Reset stair and turn off reporting
				//validate if proper polygon
				if(stairIndex >= 4){
					setReportType(null);
					setStairIndex(0);
					setStairsSet(true);
					//INSERT stair coord to database
					validReport = true;
					for (var i = 0; i < stairIndex; ++i) stairs[i] = null;
				}
			}
			else if(reportType === "Elevator"){
				if(elevatorPos != null){
					validReport = true;
					//INSERT Elevator coord to database
					setElevatorPosition(null);
				}
			}
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
          {startPos && !getDirections && <Chip label="Start" variant="outlined" style={{ marginRight: '5px', backgroundColor: 'pink' }} onDelete={handleStartDeleteMarker} />}
          {endPos && !getDirections && <Chip label="End" variant="outlined" style={{ marginRight: '5px', backgroundColor: 'lightgreen' }} onDelete={handleEndDeleteMarker} />}
          //report has an implicit outer div
        <Report
          onReportTypeChange={handleReportTypeChange}
          onReportActionClicked={handleReportTypeAction}
        />
        </div>
        <AccessibilityRouter
          polygons={polygons}
          startPos={startPos}
          endPos={endPos}
          getDirections={getDirections}
        >
        </AccessibilityRouter>
        {!isLoading && dbMarkers}
      </GoogleMap>
    </div>
  );
};



export default Map;

//<div style={{ display: 'flex', alignItems: 'left',  justifyContent: 'left'  }}>
//{elevatorCoords.coords.map(mark => <Marker key={mark.lat} position={mark} icon={{url: "https://upload.wikimedia.org/wikipedia/commons/7/73/Aiga_elevator.png", scaledSize: new window.google.maps.Size(50, 80)}}/>)}
