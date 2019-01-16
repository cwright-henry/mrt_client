
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
	const minValue = arr[0][1]
	const max = arr[arr.length - 1][0]
	const maxValue = arr[arr.length - 1][1]

	return {min: min, max: max, minValue: minValue, maxValue: maxValue}
}

const closestNeighbour = (arr, value) => {
	return arr.reduce(function(prev, curr) {
		return (Math.abs(curr[0] - value) < Math.abs(prev[0] - value) ? curr : prev);
	});
}

const trimData = (arr, startDate, endDate) => {
	if(arr.length) {
		let minNeighbour = closestNeighbour(arr, startDate)
		let maxNeighbour = closestNeighbour(arr, endDate)
		let minBound = arr.findIndex(elm => elm[0] === minNeighbour[0])
		let maxBound = arr.findIndex(elm => elm[0] === maxNeighbour[0])

		return arr.slice(minBound, maxBound)
	}

	return arr;
}


const seedGen = () => {
	return parseInt(Math.random().toString().slice(2,11))
}

export {
  sorter,
	objectSorter,
	tsExtremes,
	trimData,
	closestNeighbour,
	seedGen
}