import GrahamScan from '@lucio/graham-scan';

//function to reorder coordinates
export function orderCoordsForPolygon(coordArray){
	let grahamScan = new GrahamScan();
	console.log(coordArray.length);

	//Needs a 2D array. An array of an array of points
	for(let index = 0; index < coordArray.length; ++index){
		const element = coordArray[index];
		console.log("Element " + element.latitude + ", " + element.longitude);
		grahamScan.addPoint([element.latitude, element.longitude]);
	}

	let hull = grahamScan.getHull();
	console.log("length of hull " + hull.length);
	hull.push(hull[0]);

	//convert hull to json objects
	console.log("After ");
	//hull length can be different than original length
	for(let m = 0; m < hull.length; ++m){
		hull[m] = {latitude: hull[m][0], longitude: hull[m][1]}
	}
	console.log(hull);
	return hull;
}
