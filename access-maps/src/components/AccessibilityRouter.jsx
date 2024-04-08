import { useMemo, useState, useEffect } from 'react';
import React from 'react';
import { GoogleMap, useLoadScript, Marker, DirectionsRenderer , Polygon} from '@react-google-maps/api';
import Report from "../components/Report";
import { Chip, Button } from "@mui/material";
import { useParams } from 'react-router-dom';

function AccessibilityRouter({ polygons, startPos, endPos, getDirections })
{
    const [directions, setDirections] = useState();
    const [routeIndex, setRouteIndex] = useState();

    useEffect(() => {
        if(getDirections) {
            fetchDirections();
        }
    }, [getDirections]);

    
    const checkForRouteCollisions = (route) => {
        const routePath = route;
        const stairsPolygons = polygons.polygons; // Assuming you have polygons representing stairs
    
        for (let i = 0; i < stairsPolygons.length; i++) {
            const stairsPolygon = new window.google.maps.Polygon({
                paths: stairsPolygons[i],
            });
    
            for (let j = 0; j < routePath.length - 1; j++) {
                const routeSegment = [routePath[j], routePath[j + 1]];
    
                // Check if any midpoint of the route segment lies within the stairs polygon
                const midPoint = getMidpoint(routeSegment[0], routeSegment[1]);

                // Return true if point lies within any stairs polygons
                if (window.google.maps.geometry.poly.containsLocation(midPoint, stairsPolygon)) {
                    return true; // Collision detected
                }
            }
        }
    
        return false; // No collision detected
    };
    
    // Function to calculate midpoint of a line segment
    const getMidpoint = (p1, p2) => {
        return new window.google.maps.LatLng(
            (p1.lat() + p2.lat()) / 2,
            (p1.lng() + p2.lng()) / 2
        );
    };
    

    const fetchDirections = () => {
        // Return if start or end positions are not both defined
        if (!startPos || !endPos) return;
    
        const service = new window.google.maps.DirectionsService();
    
        // Specify options for the route requests
        const request = {
            origin: startPos,
            destination: endPos,
            travelMode: window.google.maps.TravelMode.WALKING,
            provideRouteAlternatives: true, // Request alternative routes
        };
    
        service.route(request, (results, status) => {
            if (status === "OK" && results) {
                // Check each route for collisions
                for (let i = 0; i < results.routes.length; i++) {
                    const route = results.routes[i].overview_path; // Access the overview_path property of each route
                    if (!checkForRouteCollisions(route)) {
                        // If no collision, set the directions and exit loop
                        setDirections(results); // Set the entire route object
                        setRouteIndex(i);
                        return;
                    }
                }
    
                // If all routes have collisions, handle it here (e.g., reroute or alert user)
                console.log("All routes contain collisions. Reroute or alert user.");
            } else {
                console.error("Error fetching directions:", status);
            }
        });
    };

    return (
        <div>
            <div>
                {startPos && <Marker position={startPos}></Marker> }
                {endPos && <Marker position={endPos}></Marker>}
                {getDirections && (
                <DirectionsRenderer
                    directions={directions}
                    routeIndex={routeIndex}
                />)}
            </div>
        </div>
    );
}
export default AccessibilityRouter;