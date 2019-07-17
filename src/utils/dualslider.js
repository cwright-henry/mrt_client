
const startTypes = ['mousedown', 'touchstart']
const moveTypes = ['mousemove', 'touchmove']
const endTypes = ['mouseup', 'touchend']

const addListeners = (container, types, fn) => {
	types.forEach(type => {
		container.addEventListener(type, fn, {
			capture: false,
			passive: true
		});
	})
}

const removeListeners = (container, types, fn) => {
	types.forEach(type => {
		container.removeEventListener(type, fn, {
			capture: false,
			passive: true
		});
	})
}

const getPlotBand = (from, to) => {
	return {
		from,
		to,
		color: 'rgba(255, 152, 0, 0.05)',
		id: 'plot-band'
	}
}

const getPlotLine = (value, type) => {
	return {
		value,
		color: '#FF9800',
		width: 1,
		label: {
			align: 'center',
			useHTML: true,
			text: `<span class="axis-label ${type}"></span>`
		},
		id: `${type}-plotline`,
		zIndex: 999
	}
}

/**
 * Highcharts does not support ordinal values so weekend days are on graph
 * but there is no data on the weekends so if user selects one of these points
 * then find the nearest neighbour
 * 
 * @param {Array} arr 
 * @param {timeestamp} value 
 */
const closestNeighbour = (arr, value) => {
	return arr.reduce(function (prev, curr) {
		return (Math.abs(curr[0] - value) < Math.abs(prev[0] - value) ? curr : prev);
	})[0];
}

export default class {

	/**
	 * Create a dual horizontal slider to be used on a Vue instance.
	 * 
	 * @param {Vue} vm The Vue instance
	 * @param {Highcharts} chart The chart
	 */
	constructor(vm, chart) {
		this.vm = vm
		this.container = vm.$el;
		this.chart = chart;
	}

	/**
	 * Set the intial range for the slider. Requires a visible DOM element i.e not display:none
	 * 
	 * @param {timestamp} currentMin User selected current min
	 * @param {timestamp} currentMax User selected current mac
	 * @param {Array} ts Array of [[timestamp, value], ...], required to find closest neighbour
	 */
	setRange(currentMin, currentMax, ts) {
		this.minPos = currentMin;
		this.maxPos = currentMax;
		this.min = ts[0][0];
		this.max = ts[ts.length - 1][0];
		this.ts = ts;
		this.currentWidth = this.width()

		this.updatePlotLine(this.minPos, 'min');
		this.updatePlotLine(this.maxPos, 'max');
		this.updatePlotband(this.minPos, this.maxPos);

		let line = document.querySelector('.axis-label.min')
		addListeners(line, startTypes, () => {
			this.moveMin()
		})

		line = document.querySelector('.axis-label.max')
		addListeners(line, startTypes, () => {
			this.moveMax()
		})
	}

	addPlotLine(value, type) {
		this.chart.xAxis[0].addPlotLine(getPlotLine(value, type))
	}

	addPlotBand(min, max) {
		this.chart.xAxis[0].addPlotBand(getPlotBand(min, max))
	}

	updatePlotLine(value, type) {
		this.chart.xAxis[0].removePlotLine(`${type}-plotline`);
		this.chart.xAxis[0].addPlotLine(getPlotLine(value, type))
	}

	updatePlotband(min, max) {
		this.chart.xAxis[0].removePlotBand('plot-band');
		this.chart.xAxis[0].addPlotBand(getPlotBand(min, max))
	}

	moveMin() {
		const step = (e) => {
			this.minPos = this.toCoords(e.chartX)
			this.maxPos = this.scale(this.maxPos)
			if (this.minPos >= this.min && this.minPos < this.max) {
				this.updatePlotLine(this.minPos, 'min')
				this.updatePlotband(this.minPos, this.maxPos)
			}
		}
		const stop = () => {
			removeListeners(this.container, moveTypes, step)
			removeListeners(this.container, endTypes, stop)
			let line = document.querySelector('.axis-label.min')
			addListeners(line, startTypes, () => {
				this.moveMin()
			})

			this.vm.$emit('startdate', closestNeighbour(this.ts, this.minPos))
		}

		addListeners(this.container, moveTypes, step)
		addListeners(this.container, endTypes, stop)
	}

	moveMax() {
		const step = (e) => {
			this.maxPos = this.toCoords(e.chartX);
			this.minPos = this.scale(this.minPos)
			if (this.maxPos <= this.max && this.maxPos > this.minPos) {
				this.updatePlotLine(this.maxPos, 'max')
				this.updatePlotband(this.minPos, this.maxPos)
			}
		}
		const stop = () => {
			removeListeners(this.container, moveTypes, step)
			removeListeners(this.container, endTypes, stop)
			let line = document.querySelector('.axis-label.max')
			addListeners(line, startTypes, () => {
				this.moveMax()
			})

			this.vm.$emit('enddate', closestNeighbour(this.ts, this.maxPos))
		}

		addListeners(this.container, moveTypes, step)
		addListeners(this.container, endTypes, stop)
	}

	scale(value) {
		const width = this.width()
		if (this.currentWidth !== width) {
			value *= (width / this.currentWidth)
			this.currentWidth = width
		}
		return value
	}

	width() {
		return this.toCoords(this.chart.xAxis[0].width + this.chart.xAxis[0].left);
	}

	toCoords(value) {
		return this.chart.xAxis[0].toValue(value, 0)
	}
}
