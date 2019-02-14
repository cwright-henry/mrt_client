<template>
	<transition-group name="flip" tag="div">
		<div v-show="isLoading" class="mrt-strategy-loading" key='loading'>
			Loading {{strategy.name}}...
		</div>
		<div v-show="!isLoading" key="not_loading">
		<highcharts :options="options" ref="linechart" ></highcharts>
		</div>
	</transition-group>
</template>

<script>
import {mean} from '@/utils'

const getPlotBand = (from, to) => {
	return  {
		from,
		to,
		color: 'rgba(255, 152, 0, 0.05)',
		id: 'plot-band'
	}
}

const getStartPlotLine = (value) => {
	return {
		value,
		color: '#FF9800',
		dashStyle: 'Dash',
		width: 1,
		id:'plot-line-start',
		zIndex:999
	}
}

const getEndPlotLine = (value) => {
	return {
		value,
		color: '#FF9800',
		dashStyle: 'Dash',
		width: 1,
		id:'plot-line-end',
		zIndex:999
	}
}

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
				marker: {
					enabled: false
				}
			}
		}
	}
}

export default {
	data() {
		return {
			options: options(this),
			isLoading: false
		}
	},
	props: {
		strategy: {
			type: Object,
			default: () => {
				return {
					ts: {},
					fit: {}
				}
			}
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
		// Called when the strategy gets updated i.e. after fitting
		strategy: {
			handler: function() {
				this.update()
			},
			deep: true
		}
	},
	/**
	 * Is this only called from hot-update
	 */
	mounted() {
		this.update()
	},
	methods: {
		update() {
			this.isLoading = true;
			if(this.strategy.ts) {
					this.isLoading = false;
					this.$nextTick(() => {
						const chart = this.$refs.linechart.chart
						this.clearSeries()
						chart.addSeries({
							type: 'area',
							data: this.strategy.ts.data,
							name: this.strategy.name,
							threshold: mean(this.strategy.ts.data),
							clip: false
						});

						chart.xAxis[0].addPlotLine(getStartPlotLine(this.strategy.fit.start_date))
						chart.xAxis[0].addPlotLine(getEndPlotLine(this.strategy.fit.end_date))
						chart.xAxis[0].addPlotBand(getPlotBand(this.strategy.fit.start_date, this.strategy.fit.end_date))

						chart.reflow()
				});
			}
		},

		clearSeries() {
      const chart = this.$refs.linechart.chart
      while(chart.series.length > 0) {
        chart.series[0].remove(false);
			}
			chart.xAxis[0].removePlotBand('plot-band');
			chart.xAxis[0].removePlotLine('plot-line-start');
			chart.xAxis[0].removePlotLine('plot-line-end');
		}
	}
}
</script>

<style lang="less">
.mrt-strategy-loading {
	display:flex;
	justify-content: center;
	align-items: center;
	height:0px;
}
.flip-enter-active {
  transition: all .2s cubic-bezier(0.55, 0.085, 0.68, 0.53); //ease-in-quad
}

.flip-leave-active {
  transition: all .25s cubic-bezier(0.25, 0.46, 0.45, 0.94); //ease-out-quad
}

.flip-leave-to {
	
}

.flip-enter, .flip-leave-to {
  transform: scaleY(0) translateZ(0);
  opacity: 0;
}
</style>