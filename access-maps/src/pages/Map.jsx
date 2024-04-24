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
import { orderCoordsForDatabase } from '../util/orderCoords.js'
import { orderCoordsForGoogle } from '../util/orderCoords.js'

const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
const libraries = ['places'];
const mapContainerStyle = {
  width: '100vw',
  height: '80vh',
};
//const clemson = { lat: 34.6834, lng: -82.8374 };
const clemson = { lat: 34.6775, lng: -82.8362};
const greenville = { lat: 34.8526, lng: -82.3940};
//const testPos = {lat: 34.677692944796476, lng: -82.83357787606501}
;

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
const REPORT_POLYGON_LIMIT = 10;
const MIN_REPORT_LIMIT = 4;
const reportingStairsCue = "Reporting: Stairs. Place markers outlining the hazard."
const reportingRampsCue = "Reporting: Ramps. Place markers outlining the area."
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
  const [elevatorPos, setElevatorPosition] = useState();

  const [rawReport, setRawReport] = useState([]);
  const [reportIndex, setReportIndex] = useState(0);
  const [reporting, setReporting] = useState(false);
  const [renderStyle, setRenderStyle] = useState({});
  const [needsRefresh, setRefreshNeed] = useState(true);

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
            latitude: event.latLng.lat(),
            longitude: event.latLng.lng(),
          });
		}else{
			console.log("Raw");
			let clickedCoord = {lat: event.latLng.lat(), lng: event.latLng.lng()};
			if(reportIndex < REPORT_POLYGON_LIMIT){
				setRawReport(rawReport => {
					const updatedReport = [...rawReport];
					updatedReport.push(clickedCoord);
					console.log(updatedReport);
					return updatedReport;
				});
			}
			let newIndex = reportIndex + 1;
			setReportIndex(newIndex);
			if( reportMode === "Stair"){
				label.textContent = reportingStairsCue + ` Markers left (${REPORT_POLYGON_LIMIT - newIndex})`;
			}else if(reportMode === "Ramp"){
				label.textContent = reportingRampsCue + ` Markers left (${REPORT_POLYGON_LIMIT - newIndex})`;
			}
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
		// Update reportType state in the Map component
		setReportType(type);
		setReporting(true);

		var label = document.getElementById("report_label");
		if(type === "Ramp"){
			label.textContent = reportingRampsCue + ` Markers left (${REPORT_POLYGON_LIMIT})`;
			//reset other report progress
			setElevatorPosition(null);
			setRawReport([]);
			setReportIndex(0);
			setRenderStyle(rampPath);
		}
		else if(type === "Stair"){
			label.textContent = reportingStairsCue + ` Markers left (${REPORT_POLYGON_LIMIT})`;
			//reset other report progress
			setElevatorPosition(null);
			setRawReport([]);
			setReportIndex(0);
			setRenderStyle(stairHazard);
		}
		else if(type === "Elevator"){
			label.textContent = reportingElevCue;
			//reset other report progress
			setRawReport([]);
			setReportIndex(0);
			setRenderStyle({});
		}
	};

	const handleReportTypeAction = (type) => {
    const label = document.getElementById("report_label");
    if (type === "Cancel") {
      // Reset all state variables
      setReportType(null);
      setElevatorPosition(null);
      setRawReport([]);
      setReportIndex(0);
      setReporting(false);
      setRenderStyle({});

      label.textContent = "";
      document.getElementById("hidden_div").style.visibility = "hidden";
    } else if (type === "Undo") {

      if (reportType === "Elevator") {
        setElevatorPosition(null);
      }else{
		if(reportIndex >= 1){
			//pop off the most recent coordinate clicked
			setRawReport(rawReport => {
				const updatedReport = [...rawReport];
				updatedReport.pop();
				return updatedReport;
			});
			setReportIndex(prevIndex => prevIndex - 1);
		}

		if(reportType === "Ramp"){
			label.textContent = reportingRampsCue + ` Markers left (${REPORT_POLYGON_LIMIT - (reportIndex - 1)})`;
		}else if(reportType === "Stair"){
			label.textContent = reportingStairsCue + ` Markers left (${REPORT_POLYGON_LIMIT - (reportIndex - 1)})`;
		}
      }
    } else if (type === "Confirm") {
      let validReport = false;
      if (reportType === "Ramp" && reportIndex >= MIN_REPORT_LIMIT) {
        const rampFeatureToBackend = {
          featureType: "ramp",
          coordinates: orderCoordsForDatabase(rawReport)
        }

        //INSERT ramp coords to database
        mutate(rampFeatureToBackend);
        dbMarkers.push(rampFeatureToBackend.coordinates);
        validReport = true;
      } else if (reportType === "Stair" && reportIndex >= MIN_REPORT_LIMIT) {
        const stairsFeatureToBackend = {
          featureType: "stairs",
          coordinates: orderCoordsForDatabase(rawReport)
        }

        //INSERT stair coords to database
        mutate(stairsFeatureToBackend)
        dbMarkers.push(stairsFeatureToBackend.coordinates);
        validReport = true;
      } else if (reportType === "Elevator" && elevatorPos != null) {
        const elevatorFeatureToBackend = {
          featureType: "elevator",
          coordinates: [elevatorPos]
        }

        //INSERT Elevator coord to database
        mutate(elevatorFeatureToBackend);
        dbMarkers.push(elevatorFeatureToBackend.coordinates);
        setElevatorPosition();
        validReport = true;
      }

      if (validReport) {
		//TODO set it so it can see new report
		//can force fetch of database
		//can force reload the page
		//can remain local until next reload (least prefered)
        setReportType(null);
        setReporting(false);
        setReportIndex(0);
        setRenderStyle({});
        setRawReport([]);
        setRefreshNeed(true);
        document.getElementById("hidden_div").style.visibility = "hidden";
        label.textContent = "Report Sent!";
        setTimeout(() => label.textContent = "", 3000);
      } else {
        let currentContent = label.textContent;
        label.textContent = "Invalid report!";
        setTimeout(() => label.textContent = currentContent, 2500);
      }
    }
  };
  
function initDBMarkers (data){

data.map(item =>{
    
    if(item.featureType === "elevator"){
      
      return <Marker 
        key={item.featureId}
        position={{lat: item.coordinates[0].latitude, lng: item.coordinates[0].longitude}}
        icon={{url: "https://upload.wikimedia.org/wikipedia/commons/7/73/Aiga_elevator.png", scaledSize: new window.google.maps.Size(50, 80)}}
      />
    }

    else if(item.featureType === "stairs"){
      const stairCoords = item.coordinates.map(coords=>{
        return {lat: coords.latitude, lng: coords.longitude}
      })
      
      return <Polygon
        key={item.featureId}
        path={stairCoords}
        options={stairHazard}
      />
    }
    else if(item.featureType === "ramp"){
      const rampCoords = item.coordinates.map(coords=>{
        return {lat: coords.latitude, lng: coords.longitude}
      })
      
      return <Polygon
        key={item.featureId}
        path={rampCoords}
        options={rampPath}
      /> 
    }
  })
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
          {/* report has an implicit outer div */}
        <Report
          onReportTypeChange={handleReportTypeChange}
          onReportActionClicked={handleReportTypeAction}
        />
        </div>

        <AccessibilityRouter
          polygons={dbMarkers}
          startPos={startPos}
          endPos={endPos}
          getDirections={getDirections}
        >

        </AccessibilityRouter>
        {!isLoading && dbMarkers}
        {elevatorPos && <Marker
        position={elevatorPos}
          icon={{url: elevatorDropperIcon, scaledSize: new window.google.maps.Size(50, 80)}}></Marker>}

        {reporting && reportType !== "Elevator" && <Polygon
          paths={orderCoordsForGoogle(rawReport)}
          options={renderStyle}
        />}
      </GoogleMap>
    </div>
  );
};


export default Map;
/*
        {stairs.map((position, index) => (
                position && (
                    <Marker key={index} position={position} icon={{url: stairDropperIcon, scaledSize: new window.google.maps.Size(50, 80)}} />
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
*/
