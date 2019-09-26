
const getErrorCode = (error) => {

	// If response does exist must be network error	
	if (!error.response) {
		return 'NETWORK_ERROR'
	}

	// Handle server side error codes 400 and 500
	if (error.hasOwnProperty('response') && error.response.hasOwnProperty('data')) {
		if (error.response.data.hasOwnProperty('code') && error.response.data.code.length > 0) {
			return error.response.data.code;
		}
	}

	// Catch all unknowns
	return 'UNKNOWN_ERROR';
}


const sorter = (sort) => {
	return function (a, b) {
		if (a < b) return sort ? (sort == 'desc' ? -1 : 1) : -1;
		if (a > b) return sort ? (sort == 'desc' ? 1 : -1) : 1;
		return 0;
	}
}

const objectSorter = (property, sort) => {
	return function (a, b) {
		if (!!a[property] && !!b[property]) {
			if (a[property] < b[property]) return sort ? (sort == 'desc' ? -1 : 1) : -1;
			if (a[property] > b[property]) return sort ? (sort == 'desc' ? 1 : -1) : 1;
		}
		return 0;
	}
}

const tsExtremes = (arr) => {
	const min = arr[0][0]
	const minValue = arr[0][1]
	const max = arr[arr.length - 1][0]
	const maxValue = arr[arr.length - 1][1]

	return { min: min, max: max, minValue: minValue, maxValue: maxValue }
}

const closestNeighbour = (arr, value) => {
	return arr.reduce((prev, curr) => {
		return (Math.abs(curr[0] - value) < Math.abs(prev[0] - value) ? curr : prev);
	});
}

const dataPointsBetween = (arr, start, end) => {
	const startPoint = closestNeighbour(arr, start)
	const endPoint = closestNeighbour(arr, end)

	return arr.indexOf(endPoint) - arr.indexOf(startPoint);
}

const trimData = (arr, startDate, endDate) => {
	if (arr.length) {
		let minNeighbour = closestNeighbour(arr, startDate)
		let maxNeighbour = closestNeighbour(arr, endDate)
		let minBound = arr.findIndex(elm => elm[0] === minNeighbour[0])
		let maxBound = arr.findIndex(elm => elm[0] === maxNeighbour[0])

		return arr.slice(minBound, maxBound)
	}

	return arr;
}

const diff = (tsA, tsB) => {
	const bucketsA = {};
	const bucketsB = {};
	const diff = []

	for (let i = 0; i < tsA.length; i++) {
		bucketsA[tsA[i][0]] = tsA[i][1];
	}

	for (let i = 0; i < tsB.length; i++) {
		bucketsB[tsB[i][0]] = tsB[i][1];
	}

	for (let p in bucketsA) {
		if (bucketsB[p]) {
			diff.push([
				parseInt(p),
				bucketsA[p] - bucketsB[p]
			]);
		}
	}

	return diff;
}

const seedGen = () => {
	return parseInt(Math.random().toString().slice(2, 11))
}

const isEmpty = (value) => {
	return value === null || value === undefined;
}

/**
 * Using simple for loop to iterate over the large
 * arrays because it faster than new ES5/ES6/ES7 forEach, map etc...
 */

const std = (arr) => {
	let avg = mean(arr), temp = [], sum = 0;

	// Note that the map incurs stack overhead dur the function call
	// Could use reduce which seems to be implemented using a while loop
	for (let i = 1, len = arr.length; i < len; i++) {
		temp.push(Math.pow(arr[i][1] - avg, 2))
	}
	for (let i = 0, len = temp.length; i < len; i++) {
		sum += temp[i]
	}

	return Math.sqrt(sum / temp.length);
}

const mean = (data) => {
	let sum = 0
	for (let i = 0, len = data.length; i < len; i++) {
		sum += data[i][1]
	}
	return sum / data.length;
}

const gaussionData = (mean, std, bins) => {
	const data = [];

	for (let i = 0, len = bins.length; i < len; i++) {
		let x = bins[i][0];
		let y = (1 / (std * Math.sqrt(2 * Math.PI))) * (Math.exp(-0.5 * Math.pow((x - mean) / std, 2)));
		data.push([x, y]);
	}

	return data;
}

const getMinMax = (arr) => {
	let min = arr[0][1], max = arr[0][1], v;

	for (let i = 1, len = arr.length; i < len; i++) {
		v = arr[i][1];
		min = (v < min) ? v : min;
		max = (v > max) ? v : max;
	}
	return [min, max]
}

const stats = (arr) => {
	let minMax = getMinMax(arr)
	return {
		min: minMax[0],
		max: minMax[1],
		std: std(arr),
		mean: mean(arr)
	}
}

const getPlotBand = (from, to, id = "plot-band") => {
	return {
		from,
		to,
		color: 'rgba(255, 152, 0, 0.05)',
		id
	}
}

/**
 * Return a plotline to be used by highcharts
 * 
 * @param {*} value The value on the char to place the plotLine
 * @param {*} id The id of the plotline so as to ba able to remove it later
 * @param {*} className A class used to style the plot away from the default
 */
const getPlotLine = (value, id = 'plot-line', className = 'axis-label') => {
	return {
		value,
		color: '#AEEA00',
		width: 0.5,
		label: {
			align: 'center',
			useHTML: true,
			text: `<span class="${className} ${id}"></span>`
		},
		id: `${id}`,
		zIndex: 999
	}
}

const getAtIndex = (data, index) => {
	if (data.length - 1 < index) {
		return data[0]
	}

	return data[data.length - 1 - index]
}

const MAX_BIN_NUMBER = 50;

const createBins = (series) => {
	const data = [];

	for (let i = 0; i < series.length; i++) {
		let v = series[i][1];
		if (Math.abs(v) <= 3) {
			data.push(v);
		}
	}
	const hData = []; //the output array
	let size = data.length; //how many data points
	let bins = Math.round(Math.sqrt(size)); //determine how many bins we need
	bins = bins > MAX_BIN_NUMBER ? MAX_BIN_NUMBER : bins; //adjust if more than 50 cells
	let max = Math.max.apply(null, data); //lowest data value
	let min = Math.min.apply(null, data); //highest data value
	let range = max - min; //total range of the data
	let width = range / bins; //size of the bins
	let bin_bottom; //place holders for the bounds of each bin
	let bin_top;

	//loop through the number of cells
	for (let i = 0; i < bins; i++) {
		//set the upper and lower limits of the current cell
		bin_bottom = min + i * width;
		bin_top = bin_bottom + width;

		//check for and set the x value of the bin
		if (!hData[i]) {
			hData[i] = new Array();
			hData[i][0] = bin_bottom + width / 2;
		}

		//loop through the data to see if it fits in this bin
		for (let j = 0; j < size; j++) {
			var x = data[j];

			//adjust if it's the first pass
			if (i == 0 && j == 0) {
				bin_bottom -= 1;
			}

			//if it fits in the bin, add it
			if (x > bin_bottom && x <= bin_top) {
				!hData[i][1] ? (hData[i][1] = 1) : hData[i][1]++;
			}
		}
	}

	for (let i = 0; i < hData.length; i++) {
		if (typeof hData[i][1] == "undefined") {
			hData[i][1] = 0;
		}

		hData[i][1] = hData[i][1] / (size * width);
	}
	hData.sort((a, b) => {
		if (a[0] < b[0]) return -1;
		if (a[0] > b[0]) return 1;
		return 0;
	});

	return hData;
}

export {
	getErrorCode,
	sorter,
	objectSorter,
	tsExtremes,
	trimData,
	closestNeighbour,
	seedGen,
	isEmpty,
	std,
	mean,
	gaussionData,
	getMinMax,
	stats,
	getPlotBand,
	getPlotLine,
	getAtIndex,
	dataPointsBetween,
	diff,
	createBins
}