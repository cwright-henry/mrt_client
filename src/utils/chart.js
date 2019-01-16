const getPlotBand = (from, to, id="plot-band") => {
	return  {
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
const getPlotLine = (value, id='plot-line', className='axis-label') => {
	return {
		value,
		color: '#AEEA00',
		width: 0.5,
		label: {
			align:'center',
			useHTML: true,
			text: `<span class="${className} ${id}"></span>`
		},
		id:`${id}`,
		zIndex:999
	}
}

export {
	getPlotBand,
	getPlotLine
}