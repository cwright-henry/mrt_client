<template>
	<highcharts :options="options" :ts="ts" :name="name" ref="residuals"></highcharts>
</template>

<script>
const options = (vm) => {
	return {
		chart: {
			height: vm._props.height,
			zoomType: 'x',
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
			}
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
	watch: {
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

</style>

