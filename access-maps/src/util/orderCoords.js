import GrahamScan from '@lucio/graham-scan';

//function to reorder coordinates
export function orderCoordsForPolygon(coordArray){
	console.log("Passed " + coordArray);

	//a 2D array. An array of an array of points
	var rawPoints = [];
	console.log(coordArray.length);
	for (let index = 0; index < coordArray.length; ++index){
		const element = coordArray[index];
		console.log("Element " + element.latitude + ", " + element.longitude);
		var pair = [element.latitude, element.longitude];
		rawPoints.push(pair);
	}
	console.log("raw " + rawPoints);
	const grahamScan = new GrahamScan();
	grahamScan.setPoints(rawPoints);
	const hull = grahamScan.getHull();
	//console.log("Graham " + hull);
	return coordArray;
}
