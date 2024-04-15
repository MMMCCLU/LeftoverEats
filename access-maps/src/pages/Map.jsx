import { useMemo, useState, useEffect } from 'react';
import React from 'react';
import { GoogleMap, useLoadScript, Marker, DirectionsRenderer , Polygon} from '@react-google-maps/api';
import Report from "../components/Report";
import AccessibilityRouter from '../components/AccessibilityRouter';
import { Chip, Button, Drawer } from "@mui/material";
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

const legendItems = [
  { icon: "https://upload.wikimedia.org/wikipedia/commons/7/73/Aiga_elevator.png", label: "Elevator"},
  { color: "#FFFF00", label: "Stairs"},
  { color: "#03F5D4", label: "Ramp"},
];


function Map() {
  const { mapName } = useParams();
  const [startPos, setStartMarkerPosition] = useState();
  const [endPos, setEndMarkerPosition] = useState();
  const [getDirections, setGetDirections] = useState(false);
  const [elevatorPos, setElevatorPosition] = useState();
  const [stairs, setStairs] = useState([]);
  const [stairIndex, setStairIndex] = useState(0);
  const [stairsSet, setStairsSet] = useState(false);
  const [ramp, setRamp] = useState([]);
  const [rampIndex, setRampIndex] = useState(0);
  const [rampSet, setRampSet] = useState(false);
  const [center, setCenter] = useState({ lat: 34.5034, lng: -82.6501 });
  const [reportType, setReportType] = useState(null);
  const [open, setOpen] = useState(false);


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
        }
        else if(reportMode === "Stair" && stairIndex < reportPolygonLimit)
        {
            setStairs(stairs => {
              const updatedStairs = [...stairs];
              updatedStairs[stairIndex] = {latitude: event.latLng.lat(), longitude: event.latLng.lng()};
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
            const updatedRamp = [...ramp];
            updatedRamp[rampIndex] = {latitude: event.latLng.lat(), longitude: event.latLng.lng()};
            setRamp(updatedRamp);

            console.log("RAMP CLICK: ", ramp);
  
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
    if (type === "Cancel") {
      // Reset all state variables
      setReportType(null);
      setElevatorPosition(null);
      setRamp(Array(reportPolygonLimit).fill(null));
      setStairs(Array(reportPolygonLimit).fill(null));
      setRampIndex(0);
      setStairIndex(0);
      label.textContent = "";
      document.getElementById("hidden_div").style.visibility = "hidden";
    } else if (type === "Undo") {
      if (reportType === "Ramp" && rampIndex >= 1) {
        setRamp(prevRamp => {
          const updatedRamp = [...prevRamp];
          updatedRamp[rampIndex - 1] = null;
          return updatedRamp;
        });
        setRampIndex(prevIndex => prevIndex - 1);
        label.textContent = reportingRampsCue + ` Markers left (${reportPolygonLimit - (rampIndex - 1)})`;
      } else if (reportType === "Stair" && stairIndex >= 1) {
        setStairs(prevStairs => {
          const updatedStairs = [...prevStairs];
          updatedStairs[stairIndex - 1] = null;
          return updatedStairs;
        });
        setStairIndex(prevIndex => prevIndex - 1);
        label.textContent = reportingStairsCue + ` Markers left (${reportPolygonLimit - (stairIndex - 1)})`;
      } else if (reportType === "Elevator") {
        setElevatorPosition(null);
      }
    } else if (type === "Confirm") {
      var validReport = false;
      if (reportType === "Ramp" && rampIndex >= 4) {
        const rampFeatureToBackend = {
          featureType: "ramp",
          coordinates: ramp
        }

        //INSERT ramp to database
        mutate(rampFeatureToBackend);
        setRampSet(true);
        setRamp([]);
        setRampIndex(0);
        validReport = true;
      } else if (reportType === "Stair" && stairIndex >= 4) {
        const stairsFeatureToBackend = {
          featureType: "stairs",
          coordinates: stairs
        }

        //INSERT stair coord to database
        mutate(stairsFeatureToBackend)
        setStairsSet(true);
        setStairs([]);
        setStairIndex(0);
        validReport = true;
      } else if (reportType === "Elevator" && elevatorPos != null) {
        const elevatorFeatureToBackend = {
          featureType: "elevator",
          coordinates: [elevatorPos]
        }

        //INSERT Elevator coord to database
        mutate(elevatorFeatureToBackend);
        setElevatorPosition();
        validReport = true;
      }
      if (validReport) {
        setReportType(null);
        document.getElementById("hidden_div").style.visibility = "hidden";
        label.textContent = "Report Sent!";
        setTimeout(() => label.textContent = "", 3000);
      } else {
        label.textContent = "Invalid report!";
      }
    }
  };
  

  // console.log("RAMP DEBUG: ", ramp);

  const dbMarkers = data.map(item =>{
    
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
        <Button onClick={() => setOpen(true)}
                  style={{
                    border: '2px solid black',
                    padding: '10px 20px', // Increase padding to make the button bigger
                    fontSize: '1.2rem', // Increase font size
                    backgroundColor: 'white',
        }}
        >LEGEND</Button>
          <Drawer 
            anchor="right"
            open={open}
            onClose={() => setOpen(false)} 
            BackdropProps={{ invisible: true }}
            PaperProps={{ sx: { height: "33%" } }}>
            <div id="legend" style={{ padding: 10 }}>
            <h3>Legend</h3>
            {legendItems.map((item, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: 5}}>
                {item.icon && <img src={item.icon} alt={item.label} style={{ width: 20, height: 20, backgroundColor: item.color, marginRight: 5}} />}
                {item.color && <div style={{width: 20, height: 20, backgroundColor: item.color, marginRight: 5}}></div>}
                <span>{item.label}</span>
              </div>
           ))}
          </div>
        </Drawer>
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
      </GoogleMap>
    </div>
  );
};



export default Map;

//<div style={{ display: 'flex', alignItems: 'left',  justifyContent: 'left'  }}>
//{elevatorCoords.coords.map(mark => <Marker key={mark.lat} position={mark} icon={{url: "https://upload.wikimedia.org/wikipedia/commons/7/73/Aiga_elevator.png", scaledSize: new window.google.maps.Size(50, 80)}}/>)}
