<template>
	<highcharts :options="options" :ts="ts" :name="name" ref="simschart"></highcharts>
</template>

<script>
import {tsExtremes} from '@/utils/sorting'
import { EventBus } from '@/events.js'
import {mean} from '@/utils/stats'

const getPlotBand = (from, to) => {
	return  {
		from,
		to,
		color: 'rgba(76, 175, 80, 0.15)',
		id: 'plot-band'
	}
}

const getPlotLine = (value) => {
	return {
		value,
		color: '#00E676',
		width: 2,
		id:'plot-line',
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
		xAxis: {
			type: 'datetime',
			title: {
				text: null
			},
			crosshair: true
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
				point: {
					events: {
						click: function () {
							let data = {
								date: this.category,
								value: this.y
							}
							vm.selectPoint(data)
							vm.$emit('fetchsims', data)
						}
					}
				}
			},
			area: {
				fillColor: '#00B0FF',
				color: '#FFFFFF',
				lineWidth: 0.5
			}
		}
	}
}

export default {
	data() {
		return {
			options: options(this),
			average: 0,
			secondaries: []
		}
	},
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
			default: 220
		},
		backgroundColor: {
			type: String,
			default: 'rgba(0, 0, 0, 0.0)'
		}
	},
	watch: {
		ts() {
			this.update()
		}
	},
	mounted() {
		this.update()

		EventBus.$on('toggleSpark', (data) => {
			this.toggleSpark(data)
    });
	},
	methods: {
		update() {
			const chart = this.$refs.simschart.chart
			if(this.ts.length) {
				this.clearSeries()
				this.average = mean(this.ts)
				chart.addSeries({
					type: 'area',
					data: this.ts,
					name: this.name,
					threshold: this.average
				});
				chart.reflow()
			}
		},

		/**
		 * Keep array of sparks
		 * add / remove as they request come in
		 * Remove all chart is updated
		 */
		toggleSpark(sparkLine) {
			const chart = this.$refs.simschart.chart
			const existing = chart.get('sim-sparkline')
			if(existing) {
				existing.remove();
			}
			chart.addSeries({
				type: 'area',
				id: 'sim-sparkline',
				data: sparkLine.ts,
				threshold: this.average,
				fillColor: '#0277BD',
				zIndex: 0,
				states: {
					hover: {
						enabled: false
					}
				}
			});
		},

		selectPoint(data) {
			const chart = this.$refs.simschart.chart
			const primary = []
			const secondary = []

			this.clearSeries()
			for(let i = 0; i < this.ts.length; i++) {
				if(this.ts[i][0] <= data.date) {
					primary.push(this.ts[i])
				}
				else {
					secondary.push(this.ts[i])
				}
			}
			chart.xAxis[0].addPlotLine(getPlotLine(data.date))
			const extremes = tsExtremes(secondary)
			chart.xAxis[0].addPlotBand(getPlotBand(extremes.min, extremes.max))
			chart.addSeries({
				type: 'area',
				data: primary,
				threshold:this.average
			});
			chart.addSeries({
				type: 'area',
				data: secondary,
				fillColor:'rgba(0, 0, 0, 0.0)',
				color: '#BDBDBD',
				threshold: this.average
			});
		},

		clearSeries() {
      const chart = this.$refs.simschart.chart
      while(chart.series.length > 0) {
        chart.series[0].remove(false);
			}
			chart.xAxis[0].removePlotBand('plot-band');
			chart.xAxis[0].removePlotLine('plot-line');
		}
	}
}
</script>