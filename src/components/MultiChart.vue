<template>
	<highcharts :options="options" ref="multichart"></highcharts>
</template>

<script>
import ChartSlider from '../utils/chartslider'
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
		primary: {
			type: Object,
			default: () => {
				return {}
			}
		},
		backgroundColor: {
			type: String,
			default: 'rgba(0, 0, 0, 0.1)'
		},
		secondarys: {
			type: Array,
			default: () => {
				return []
			}
		}
	},
	mounted() {

		const chart = this.$refs.multichart.chart;
		chart.addSeries({
			type: 'line',
			data: this.primary.ts,
			name: this.primary.name,
			color: this.primary.color
		});

		if(this.primary.ts.length > 0) {
			const start = this.primary.ts[0][0]
			const end = this.primary.ts[this.primary.ts.length - 1][0]

			new ChartSlider(this, chart, start, end, false)
		}

		// Weird effect based on load time
		// Not sure if this is gone
		setTimeout(() => {this.redraw()},  2000)
	},
	watch: {
		secondarys(v) {
			this.clearSeries() 
			const chart = this.$refs.multichart.chart
			for(let i = 0; i < v.length; i++) {
				chart.addSeries({
					type: 'spline',
					data: v[i].ts,
					name: v[i].name,
					color: v[i].color
				});
			}
			chart.addSeries({
				type: 'line',
				data: this.primary.ts,
				name: this.primary.name,
				color: this.primary.color
			});
		}
	},
	methods: {
		report(e) {
			const payload = {
				min: e.min,
				max: e.max
			}
			this.$emit('extreme', payload)
		},

		redraw() {
			// Seems to get mounted 2 times!!!
			if(this.$refs.multichart) {
				const chart = this.$refs.multichart.chart;
				chart.redraw();
				chart.reflow();
			}
		},

		clearSeries() {
      const chart = this.$refs.multichart.chart
      while(chart.series.length > 0) {
        chart.series[0].remove(false);
			}
			chart.xAxis[0].setExtremes();
		}
	}
}
</script>

<style>
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