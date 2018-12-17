<template>
	<div class="mrt-simulation elevation-2"  @click="toggleSparkLine">
		<div class="mrt-simulation--sparkline">
			<highcharts :options="options" :ts="ts" :id="id" ref="sparkchart"></highcharts>
		</div>
	</div>
</template>

<script>
import { EventBus } from '@/events.js';
import {mean} from '@/utils/stats'

const options = (vm) => {
	return {
		chart: {
			height: vm._props.height,
			width: vm._props.width,
			backgroundColor: vm._props.backgroundColor
		},
		title: {
			text: null
		},
		credits: {
			enabled: false
		},
		xAxis: {
			labels: {
				enabled: false
			},
			title: {
				text: null
			},
			startOnTick: false,
			endOnTick: false,
			tickPositions: [],
			lineWidth: 0,
			minorGridLineWidth: 1,
			type: 'datetime',
			plotBands: []
		},
		yAxis: {
			endOnTick: false,
			startOnTick: false,
			labels: {
				enabled: false
			},
			title: {
				text: null
			},
			tickPositions: [0]
		},
		legend: {
			enabled: false
		},
		tooltip: {
			enabled: false
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
			options: options(this),
			clicked: false
		}
	},
	props: {
		ts: {
			type: Array,
			default: () => {
				return []
			}
		},
		id: {
			type: String,
			default: ''
		},
		height: {
			type: Number,
			default: 60
		},
		width: {
			type: Number,
			default: 150
		},
		backgroundColor: {
			type: String,
			default: 'rgba(0,0,0, 0.1)'
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
			setTimeout(() => {
				this.draw()
			}, 0)
		},

		draw() {
			if(this.ts.length) {
				const chart = this.$refs.sparkchart.chart
				this.clearSeries();
				chart.addSeries({
					type: 'area',
					data: this.ts,
					threshold: mean(this.ts),
				});
				chart.reflow();
				this.clicked = false
				this.$emit('loaded', this.id)
			}
		},

		clearSeries() {
      const chart = this.$refs.sparkchart.chart
      while(chart.series.length > 0) {
        chart.series[0].remove(false);
      }
		},

		toggleSparkLine() {
			this.clicked = !this.clicked;
			const payLoad = {
				id: this.id,
				ts: this.ts,
				show: this.clicked
			}
			EventBus.$emit('toggleSpark', payLoad);
		}
	}
}
</script>

<style scoped lang="less">
.mrt-simulation {
	border-radius: 2px;
	cursor: pointer;
}
</style>