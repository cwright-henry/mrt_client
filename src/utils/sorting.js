
const sorter = (sort) => {
	return function(a, b) {
		if (a < b) return sort ? (sort == 'desc' ? -1 : 1) : -1;
		if (a > b) return sort ? (sort == 'desc' ? 1 : -1) : 1;
		return 0;
	}
}

const objectSorter = (property, sort) => {
	return function(a, b) {
		if(!!a[property] && !!b[property]) {
				if (a[property] < b[property]) return sort ? (sort == 'desc' ? -1 : 1) : -1;
				if (a[property] > b[property]) return sort ? (sort == 'desc' ? 1 : -1) : 1;
		}
		return 0;
	}
}

const tsExtremes = (arr) => {
	const min = arr[0][0]
	const max = arr[arr.length - 1][0]

	return {min: min, max: max}
}

const closestNeighbour = (arr, value) => {
	return arr.reduce(function(prev, curr) {
		return (Math.abs(curr[0] - value) < Math.abs(prev[0] - value) ? curr : prev);
	})[0];
}

const trimData = (arr, startDate, endDate) => {
	let minNeighbour = closestNeighbour(arr, startDate)
	let maxNeighbour = closestNeighbour(arr, endDate)
	let minBound = arr.findIndex(elm => elm[0] === minNeighbour)
	let maxBound = arr.findIndex(elm => elm[0] === maxNeighbour)

	console.log(minBound)
	console.log(maxBound)

	return arr.slice(minBound, maxBound)
}

export {
  sorter,
	objectSorter,
	tsExtremes,
	trimData
}