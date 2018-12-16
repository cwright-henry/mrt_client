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

export {
  sorter,
	objectSorter,
	tsExtremes
}