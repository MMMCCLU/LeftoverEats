export function orderCoordsForPolygon(coordArray){
	//only works if given 4 or more points
	if(coordArray.length >= 4){
		const concaveHull = require("../../node_modules/@markroland/concave-hull/src/concaveHull.js");

		let points = [];
		//Needs a 2D array. An array of an array of points
		for(let index = 0; index < coordArray.length; ++index){
			const element = coordArray[index];
			console.log("Element " + index + ") " + element.latitude + ", " + element.longitude);
			points.push([element.latitude, element.longitude]);
		}
		let hull = concaveHull.concaveHull.calculate(points, 3);
		console.log(hull);
		for(let m = 0; m < hull.length; ++m){
			hull[m] = {latitude: hull[m][0], longitude: hull[m][1]}
		}
		console.log(hull);
		return hull;
	}else{
		return coordArray;
	}
}
