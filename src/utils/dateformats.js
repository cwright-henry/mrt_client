const dayFormat = [
	'D',
	'DD'
]

const monthFormat = [
	'M',
	'MM',
	'MMM',
	'MMMM'
]

const yearFormat = [
	'YY',
	'YYYY'
]

const seperators = [
	'-',
	'/',
	' '
]

const createFormats = () => {
	const formats = [];
	seperators.forEach(function(sep) {
		dayFormat.forEach(function(day) {
			monthFormat.forEach(function(month) {
				yearFormat.forEach(function(year) {
					formats.push(`${day}${sep}${month}${sep}${year}`)
					formats.push(`${month}${sep}${day}${sep}${year}`)
					formats.push(`${year}${sep}${month}${sep}${day}`)
				})
			})
		})
	})
	return formats;
}

export const dateFormats = createFormats()
