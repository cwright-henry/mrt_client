<template>
	<highcharts :options="options" ref="sltpchart"></highcharts>
</template>

<script>
import ChartSlider from '@/utils/dualslider'
import {mapState} from 'vuex'

const STOP_LOSS_COLOR 	= '#EF5350'
const TAKE_PROFIT_COLOR = '#42A5F5'
const OPTIMAL_COLOR 		= '#FFA726'

const MAIN_CHART 				= 'main_chart'
const OPT_SL_CHART 			= 'opt_sl_chart'
const OPT_TP_CHART 			= 'opt_tp_chart'
const OPT_EXT_CHART 		= 'opt_ext_chart'

const ONE_YEAR 					= 1000*60*60*24*365

const createSeries = (lastDate, series) => {
	const arr = []
	for(let prop in series) {
		let date = lastDate + (prop * ONE_YEAR)
		arr.push([date, series[prop]])
	}

	return arr;
}

const options = (vm) => {
	return {
		chart: {
			height:300,
			backgroundColor: vm._props.backgroundColor
		},
		rangeSelector: {
			enabled: false
		},
		title: {
			text: null
		},
		credits: {
			enabled: false
		},
		xAxis: {
			type: 'datetime',
			title: {
				text: null
			}
		},
		yAxis: {
			title: {
				text: null
			}
		},
		legend: {
			enabled: false
		},
		tooltip: {
			enabled: true
		},
		plotOptions: {
			series: {
				cursor: 'pointer',
				zIndex: 1,
				states: {
					hover: {
						enabled: false
					}
				}
			},
			area: {
				fillColor: '#00B0FF',
				color: '#FFFFFF',
				lineWidth: 0.5
			},
			line: {
				lineWidth: 0.5,
				color:'#AEEA00'
			}
		}
	}
}

export default {
	data() {
		return {
			options: options(this)
		}
	},
	props: {
		height: {
			type: Number,
			default: 280
		},
		backgroundColor: {
			type: String,
			default: 'rgba(0, 0, 0, 0.0)'
		},
	},
	computed: {
		...mapState('fit', ['strategy', 'opt_SL', 'opt_TP', 'opt_Ext', 'userDate'])
	},
	watch: {
		strategy() {
			this.drawStrategyChart();
		},
		opt_SL() {
			this.drawOptLSChart();
		},
		opt_TP() {
			this.drawOptTPChart();
		},
		opt_Ext() {
			this.drawOptExtChart();
		}
	},
	mounted() {
		this.drawStrategyChart();
	},
	methods: {

		drawStrategyChart() {
			const chart = this.$refs.sltpchart.chart
			const existing = chart.get(MAIN_CHART)
			if(existing) {
				existing.remove();
			}
			if(this.strategy.ts.data) {
				chart.addSeries({
					type: 'line',
					data: this.strategy.ts.data,
					id: MAIN_CHART,
					color: '#2196F3'
				});
			}
			chart.reflow()
		},

		drawOptLSChart() {
			const chart = this.$refs.sltpchart.chart
			const existing = chart.get(OPT_SL_CHART)
			if(existing) {
				existing.remove();
			}
			if(this.opt_SL) {
				chart.addSeries({
					type: 'line',
					data: createSeries(this.userDate, this.opt_SL),
					id: OPT_SL_CHART,
					name: 'opt_SL',
					color: STOP_LOSS_COLOR
				});
			}
			chart.reflow()
		},

		drawOptTPChart() {
			const chart = this.$refs.sltpchart.chart
			const existing = chart.get(OPT_TP_CHART)
			if(existing) {
				existing.remove();
			}
			if(this.opt_TP) {
				chart.addSeries({
					type: 'line',
					data: createSeries(this.userDate, this.opt_TP),
					name: 'opt_TP',
					id: OPT_TP_CHART,
					color: TAKE_PROFIT_COLOR
				});
			}
			chart.reflow()
		},

		drawOptExtChart() {
			const chart = this.$refs.sltpchart.chart
			const existing = chart.get(OPT_EXT_CHART)
			if(existing) {
				existing.remove();
			}
			if(this.opt_Ext) {
				chart.addSeries({
					type: 'line',
					data: createSeries(this.userDate, this.opt_Ext),
					id: OPT_EXT_CHART,
					name: 'opt_Ext',
					color: OPTIMAL_COLOR
				});
			}
			chart.reflow()
		},

		report(e) {
			const payload = {
				min: e.min,
				max: e.max
			}
			this.$emit('extreme', payload)
		}
	}
}
</script>

<style scoped>
.axis-label {
	width: 22px;
	height: 22px;
	border-radius: 50%;
	display: inline-block;
	overflow: hidden;
	cursor: ew-resize;
	background-color:#42A5F5;
	position: relative;
	top:6px;
	left:120px;
}
</style>