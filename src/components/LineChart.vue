<template>
	<highcharts :options="options" :ts="ts" :name="name" ref="linechart"></highcharts>
</template>

<script>
import {mean} from '@/utils/stats'

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
		},
		plotOptions: {
			series: {
				states: {
					hover: {
						enabled: false
					}
				}
			},
			area: {
				fillColor: '#00B0FF',
				negativeFillColor: '#1E88E5',
				negativeColor: '#FFFFFF',
				color: '#FFFFFF',
				lineWidth: 0.5,
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
		ts: {
			type: Array,
			default: () => {
				return []
			}
		},
		height: {
			type: Number,
			default: 200
		},
		name: {
			type: String,
			default: 'Series'
		},
		lazyload: {
			type: Boolean,
			default: false
		},
		id: {
			type: String,
			default: null
		},
		backgroundColor: {
			type: String,
			default: 'rgba(0, 0, 0, 0.0)'
		}
	},
	watch: {
		ts(data) {
			this.clearSeries()
			const chart = this.$refs.linechart.chart
			chart.addSeries({
				type: 'area',
				data: data,
				name: this.name,
				threshold: mean(data)
			})
			chart.reflow()
		}
	},
	methods: {
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