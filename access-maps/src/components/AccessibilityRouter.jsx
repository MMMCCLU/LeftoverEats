import { useMemo, useState, useEffect } from 'react';
import React from 'react';
import { GoogleMap, useLoadScript, Marker, DirectionsRenderer, InfoWindow } from '@react-google-maps/api';
import { Chip, Button } from "@mui/material";
import { useParams } from 'react-router-dom';

function AccessibilityRouter({ polygons, startPos, endPos, getDirections }) {
    const [directions, setDirections] = useState();
    const [routeIndex, setRouteIndex] = useState();
    const [pathNotFound, setPathNotFound] = useState(false); // State to track if path was not found

    const directionsOptions = useMemo(() => ({
        polylineOptions: {
            strokeColor: "#007bff", // Bright blue color
            strokeWeight: 5, // Thickness of the line
            strokeOpacity: 0, // Make the line fully transparent to make it a line of circles
            icons: [{
                icon: {
                    path: window.google.maps.SymbolPath.CIRCLE,
                    fillColor: '#007bff', // Fill color of the circles
                    fillOpacity: 1, // Make the circles fully opaque
                    scale: 8, // Size of the circles
                    strokeWeight: 0, // No stroke
                },
                offset: '0', // Start at the beginning of the polyline
                repeat: '20px' // Repeat the symbol every 20 pixels
            }]
        }
    }), []);

    useEffect(() => {
        if (getDirections) {
            fetchDirections();
        }
    }, [getDirections]);

    const fetchDirections = () => {
        if (!startPos || !endPos) return;

        const service = new window.google.maps.DirectionsService();

        const request = {
            origin: startPos,
            destination: endPos,
            travelMode: window.google.maps.TravelMode.WALKING,
            provideRouteAlternatives: true,
        };

        service.route(request, (results, status) => {
            if (status === "OK" && results) {
                let pathFound = false;
                for (let i = 0; i < results.routes.length; i++) {
                    const route = results.routes[i].overview_path;
                    if (!checkForRouteCollisions(route)) {
                        setDirections(results);
                        setRouteIndex(i);
                        pathFound = true;
                        break;
                    }
                }
                if (!pathFound) {
                    // No valid path found
                    setPathNotFound(true);
                }
            } else {
                console.error("Error fetching directions:", status);
            }
        });
    };

    const checkForRouteCollisions = (route) => {
        const routePath = route;
        const stairsPolygons = polygons;

        for (let i = 0; i < stairsPolygons.length; i++) {
            const stairsPolygon = new window.google.maps.Polygon({
                paths: stairsPolygons[i],
            });

            for (let j = 0; j < routePath.length - 1; j++) {
                const routeSegment = [routePath[j], routePath[j + 1]];
                const midPoint = getMidpoint(routeSegment[0], routeSegment[1]);
                if (window.google.maps.geometry.poly.containsLocation(midPoint, stairsPolygon)) {
                    return true;
                }
            }
        }
        return false;
    };

    const getMidpoint = (p1, p2) => {
        return new window.google.maps.LatLng(
            (p1.lat() + p2.lat()) / 2,
            (p1.lng() + p2.lng()) / 2
        );
    };

    return (
        <div>
            <div>
                {startPos && !getDirections && <Marker position={startPos}></Marker>}
                {endPos && !getDirections && <Marker position={endPos}></Marker>}
                {getDirections && (
                    <>
                        {pathNotFound && <InfoWindow position={startPos}><div>No valid path found.</div></InfoWindow>}
                        <DirectionsRenderer
                            directions={directions}
                            routeIndex={routeIndex}
                            options={directionsOptions}
                        />
                    </>
                )}
            </div>
        </div>
    );
}
export default AccessibilityRouter;
