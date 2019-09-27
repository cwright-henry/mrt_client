
const startTypes = ['mousedown', 'touchstart']
const moveTypes = ['mousemove', 'touchmove']
const endTypes = ['mouseup', 'touchend']

/**
 * Carefull here - noticed that 'container' is sometimes undefined - this happens
 * when we try to draw into an uninitialized container when the event firing reactive system
 * has not be properly setup.
 * 
 * @param {*} container 
 * @param {*} types 
 * @param {*} fn 
 */
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

const getPlotLine = (value, type) => {
	return {
		value,
		color: '#FFEB3B',
		width: 1,
		label: {
			align: 'top',
			useHTML: true,
			text: `<span class="axis-label ${type}"></span>`
		},
		id: `${type}-plotline`,
		zIndex: 999
	}
}

export default class {

	/**
	 * Create a slider to be used on a Vue instance.
	 * 
	 * @param {Vue} vm The Vue instance
	 * @param {Highcharts} chart The chart
	 */
	constructor(vm, chart) {
		this.vm = vm
		this.container = vm.$el;
		this.chart = chart;
	}

	setPos(pos, min, max) {
		this.pos = pos;
		this.min = min;
		this.max = max;
		this.currentWidth = this.width()

		this.updatePlotLine(this.pos, 'pos');

		let line = document.querySelector('.axis-label.pos')
		addListeners(line, startTypes, () => {
			this.move()
		})
	}

	updatePos(pos) {
		this.pos = pos;
		this.updatePlotLine(this.pos, 'pos');
		let line = document.querySelector('.axis-label.pos')
		addListeners(line, startTypes, () => {
			this.move()
		})
	}

	addPlotLine(value, type) {
		this.chart.xAxis[0].addPlotLine(getPlotLine(value, type))
	}

	updatePlotLine(value, type) {
		this.chart.xAxis[0].removePlotLine(`${type}-plotline`);
		this.chart.xAxis[0].addPlotLine(getPlotLine(value, type))
		let line = document.querySelector('.axis-label.pos')
		addListeners(line, startTypes, () => {
			this.move()
		})
	}

	move() {
		const step = (e) => {
			this.pos = this.toCoords(e.chartX)
			this.maxPos = this.scale(this.maxPos)
			if (this.pos >= this.min && this.pos < this.max) {
				this.updatePlotLine(this.pos, 'pos')
			}
		}
		const stop = () => {
			removeListeners(this.container, moveTypes, step)
			removeListeners(this.container, endTypes, stop)
			this.vm.$emit('startdate', this.pos)
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
