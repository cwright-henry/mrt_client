
const startTypes = ['mousedown', 'touchstart']
const moveTypes = ['mousemove', 'touchmove']
const endTypes = ['mouseup', 'touchend']

/**
 * Carefull here - noticed that container is sometimes undefined
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
		color: '#AEEA00',
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

    this.lowerLine = this.chart.yAxis[0].plotLinesAndBands[0].svgElem.translate(0,0)
    this.upperLine = this.chart.yAxis[0].plotLinesAndBands[1].svgElem.translate(0,0)
    this.lowerValue = this.chart.yAxis[0].plotLinesAndBands[0].options.value;
    this.upperValue = this.chart.yAxis[0].plotLinesAndBands[1].options.value;
    this.range = this.chart.yAxis[0].max - this.chart.yAxis[0].min; // TODO: determine the best range to use (other max etc)
    this.height = this.chart.yAxis[0].height;
    this.currentLowerValue = this.lowerValue;
    this.currentUpperValue = this.upperValue;
    this.currentRange = this.range;
  }
}