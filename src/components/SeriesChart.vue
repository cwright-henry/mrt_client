<template>
	<highcharts :options="options" :ts="ts" ref="linechart"></highcharts>
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
		xAxis: {
			type: 'datetime',
			visible: true,
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
		ts: {
			type: Object,
			default: () => {
				return {}
			}
		},
		height: {
			type: Number,
			default: 200
		},
		backgroundColor: {
			type: String,
			default: 'rgba(0, 0, 0, 0.0)'
		}
	},
	watch: {
		ts(ts) {
			this.update()
		}
	},
	mounted() {
		this.update()
	},
	methods: {
		update() {
			const chart = this.$refs.linechart.chart
			if(this.ts.name) {
				this.clearSeries()
				chart.addSeries({
					type: 'line',
					data: this.ts.data,
					name: this.ts.name
				});
			}
			chart.reflow()
		},

		clearSeries() {
      const chart = this.$refs.linechart.chart
      while(chart.series.length > 0) {
        chart.series[0].remove(false);
      }
		}
	}
}
</script>

<style scoped>

</style>