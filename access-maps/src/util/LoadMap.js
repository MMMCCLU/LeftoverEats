// Generates a map
export async function getMap(){
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
 