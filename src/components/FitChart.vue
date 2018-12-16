<template>
	<highcharts :options="options" :strategy="strategy" ref="linechart"></highcharts>
</template>

<script>
import ChartSlider from '../utils/chartslider'
import {mean} from '@/utils/stats'
import {mapState} from 'vuex'

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
			slider: null
		}
	},
	props: {
		height: {
			type: Number,
			default: 380
		},
		backgroundColor: {
			type: String,
			default: 'rgba(0, 0, 0, 0.0)'
		}
	},
	computed: {
		...mapState('fit', ['strategy' ,'isLoadingTS'])
	},
	watch: {
		strategy: {
			handler: function() {
				this.update()
			},
			deep: true
		},
		isLoadingTS(isLoading) {
			if(isLoading) {
				this.clearSeries();
			}
		}
	},
	deactivated() {
		
	},
	mounted() {
		const chart = this.$refs.linechart.chart
		this.slider = new ChartSlider(this, chart)
		this.update()
	},
	methods: {
		update() {
			const chart = this.$refs.linechart.chart
			if(this.strategy.name) {
				this.clearSeries()
				chart.addSeries({
					type: 'area',
					data: this.strategy.ts,
					name: this.strategy.name,
					threshold: mean(this.strategy.ts)
				});

				if(this.strategy.fit.start_date && this.strategy.fit.end_date) {
					const start = this.strategy.ts[0][0]
					const end = this.strategy.ts[this.strategy.ts.length - 1][0]
					this.slider.setRange(this.strategy.fit.start_date, this.strategy.fit.end_date, start, end)
				}
				else if (this.strategy.ts.length > 0) {
					const start = this.strategy.ts[0][0]
					const end = this.strategy.ts[this.strategy.ts.length - 1][0]

					this.slider.setRange(start, end, start, end)
				}
			}
			setTimeout(() => {
				chart.reflow()
			}, 1000)
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

<style>
.axis-label {
	width: 22px;
	height: 22px;
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