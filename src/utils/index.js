
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
	return arr.reduce(function (prev, curr) {
		return (Math.abs(curr[0] - value) < Math.abs(prev[0] - value) ? curr : prev);
	});
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
	getAtIndex
}