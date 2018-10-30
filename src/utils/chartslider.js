
const getPlotBand = (from, to) => {
	return  {
		from,
		to,
		color: 'rgba(0,0,0, 0.1)',
		id: 'plot-band'
	}
}

const getPlotLine = (value, type) => {
	return {
		value,
		color: '#42A5F5',
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

	constructor(vm, chart, min, max, isFixed) {
		this.vm = vm
		this.container = vm.$el;
		this.chart = chart;
		this.min = min;
		this.max = max;
		this.isFixed = isFixed

		this.minPos = min;
		this.maxPos = max;
		this.currentWidth = this.width()

		this.init()
	}

	init() {
		this.addPlotLine(this.min, 'min')
		this.addPlotLine(this.max, 'max')
		this.addPlotBand(this.min, this.max)

		if(!this.isFixed) {
			let line = document.querySelector('.axis-label.min')
			line.addEventListener('mousedown', () => {
				this.moveMin()
			});

			line = document.querySelector('.axis-label.max')
			line.addEventListener('mousedown', () => {
				this.moveMax()
			});
		}
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
			this.container.removeEventListener('mousemove', step);
			this.container.removeEventListener('mouseup', stop);
			let line = document.querySelector('.axis-label.min')
			line.addEventListener('mousedown', () => {
				this.moveMin()
			})
			this.vm.$emit('startdate', this.minPos)
		}
	
		this.container.addEventListener('mousemove', step);
		this.container.addEventListener('mouseup', stop);
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
			this.container.removeEventListener('mousemove', step);
			this.container.removeEventListener('mouseup', stop);
			let line = document.querySelector('.axis-label.max')
			line.addEventListener('mousedown', () => {
				this.moveMax()
			})

			this.vm.$emit('enddate', this.maxPos)
		}
	
		this.container.addEventListener('mousemove', step);
		this.container.addEventListener('mouseup', stop);
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
