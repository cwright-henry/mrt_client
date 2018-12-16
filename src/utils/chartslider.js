
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
	return  {
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
			align:'center',
			useHTML: true,
			text: `<span class="axis-label ${type}"></span>`
		},
		id:`${type}-plotline`,
		zIndex:999
	}
}

export default class {

	constructor(vm, chart) {
		this.vm = vm
		this.container = vm.$el;
		this.chart = chart;
	}

	setRange(currentMin, currentMax, start, end) {
		this.minPos = currentMin;
		this.maxPos = currentMax;
		this.min = start;
		this.max = end;
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
			if(this.minPos >= this.min && this.minPos < this.max) {
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
			
			this.vm.$emit('startdate', this.minPos)
		}
	
		addListeners(this.container, moveTypes, step)
		addListeners(this.container, endTypes, stop)
	}

	moveMax() {
		const step = (e) => {
			this.maxPos = this.toCoords(e.chartX);
			this.minPos = this.scale(this.minPos)
			if(this.maxPos <= this.max && this.maxPos > this.minPos) {
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

			this.vm.$emit('enddate', this.maxPos)
		}

		addListeners(this.container, moveTypes, step)
		addListeners(this.container, endTypes, stop)
	}

	scale(value) {
		const width = this.width()
		if(this.currentWidth !== width) {
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
