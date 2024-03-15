import React, { useEffect } from 'react';
import './App.css';

// Retrieve token frmo env local file
const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

// Generates a map
const myMap = () => {
  const mapProp = {
    center: new window.google.maps.LatLng(0, 0),
    zoom: 5,
  };

  const map = new window.google.maps.Map(document.getElementById("googleMap"), mapProp);

  const marker = new window.google.maps.Marker({
    position: { lat: 34.6834, lng: -82.8374 },
    map: map
  });

  marker.setMap(map);
}

const GoogleMap = () => {
  useEffect(() => {

    if (!window.google) {
      // Load the Google Maps API if not already loaded
      const script = document.createElement('script');

      // This scripts loads the Google Maps API into the browser(window). Once the API is loaded, window.google will be initialized
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&callback=myMap`;
      script.defer = true;
      document.body.appendChild(script);

      // Cleanup function to remove the script
      return () => {
        document.body.removeChild(script);
      };
    } 
    // Google Maps API is already loaded because window.google is initialized, just call myMap directly
    else {
      myMap();
    }
  }, []); // Empty dependency array ensures the effect runs only once

  return (
    <div>
      <h1>Google Map Demo</h1>
      <div id="googleMap" style={{ width: '100%', height: '400px' }}></div>
    </div>
  );
};

export default GoogleMap;