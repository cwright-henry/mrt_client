<template>
	<highcharts :options="options" :ts="ts" :name="name" ref="residuals"></highcharts>
</template>

<script>
import {mapState} from 'vuex'

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
		width: 0.5,
		label: {
			align:'center',
			useHTML: true,
			text: `<span class="axis-label ${type}"></span>`
		},
		id:`${type}-plotline`,
		zIndex:999
	}
}

const options = (vm) => {
	return {
		chart: {
			height: vm._props.height,
			backgroundColor: vm._props.backgroundColor
		},
		title: {
			text: null
		},
		credits: {
			enabled: false
		},
		legend: {
			enabled: false
		},
		tooltip: {
			enabled: true
		},
		xAxis: {
			title: { 
				text: '' 
			},
			alignTicks: true,
			type: 'datetime'
		},
		yAxis: {
			title: { 
				text: '' 
			},
			opposite: true
		},
		plotOptions: {
			scatter: {
				clip: false
			}
		},
		series: []
	}
}

export default {
	props: {
		ts: {
			type: Array,
			default: () => {
				return []
			}
		},
		name: {
			type: String,
			default: ''
		},
		height: {
			type: Number,
			default: 180
		},
		backgroundColor: {
			type: String,
			default: 'rgba(0, 0, 0, 0)'
		}
	},
	data() {
		return {
			options: options(this)
		}
	},
	computed: {
		...mapState('fit', ['startDate' ,'endDate'])
	},
	watch: {
		startDate() {
			this.updateRange()
		},
		endDate() {
			this.updateRange()
		},
		ts() {
			this.update()
		}
	},
	mounted() {
		this.update()
	},
	methods: {
		update() {
			const chart = this.$refs.residuals.chart;
			this.clearSeries()
			if(this.name) {
				this.updateRange()
				chart.addSeries({
					type: 'scatter',
					color: '#00B0FF',
					marker: {
						radius: 1.5
					},
					data: this.ts,
					name: this.name,
					clip: false
				});
			}
			chart.reflow()	
		},

		updateRange() {
			const chart = this.$refs.residuals.chart;
			chart.xAxis[0].removePlotLine(`min-plotline`);
			chart.xAxis[0].removePlotLine(`max-plotline`);
			chart.xAxis[0].removePlotBand('plot-band');
			chart.xAxis[0].addPlotBand(getPlotBand(this.startDate, this.endDate))
			chart.xAxis[0].addPlotLine(getPlotLine(this.startDate, 'min'))
			chart.xAxis[0].addPlotLine(getPlotLine(this.endDate, 'max'))
		},

		clearSeries() {
      const chart = this.$refs.residuals.chart
      while(chart.series.length > 0) {
        chart.series[0].remove(false);
      }
		}
	}
}
</script>

<style>
.axis-label {
	width: 0px;
	height: 0px;
	border-radius: 50%;
	display: inline-block;
	overflow: hidden;
	cursor: ew-resize;
	background-color: #FF9800;
	position: relative;
	top:6px;
	left:158px;
}
</style>

