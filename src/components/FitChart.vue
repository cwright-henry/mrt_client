<template>
	<highcharts :constructor-type="'stockChart'" :options="options" :strategy="strategy" ref="fitchart"></highcharts>
</template>

<script>
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
			},
			events: {
				setExtremes: function (e) {
					switch(e.trigger) {
						case 'rangeSelectorButton':
							vm.$emit('dateRangeChange', {
								startDate: e.min,
								endDate: e.max
							})
							break;
						case 'navigator' :
							if(e.DOMEvent.type === 'mouseup') {
								vm.$emit('dateRangeChange', {
									startDate: e.min,
									endDate: e.max
								})
							}
							break;
					}
				}
			}
		},
		navigator: {
			maskFill: 'rgba(255, 152, 0, 0.05)',
			outlineColor: '#FF9800',
			outlineWidth: 0.5,
			handles: {
				borderColor: '#FF9800',
				lineWidth: 0.5
			}
    },
		yAxis: {
			title: {
				text: null
			},
			offset: 30,
			tickWidth: 0
		},
		legend: {
			enabled: false
		},
		tooltip: {
			enabled: true
		},
		plotOptions: {
			series: {
				dataGrouping: {
					enabled: false /* By default highstocks groups data into weeks */
				},
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
				color:'#00B0FF',
				lineWidth: 1
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
			default: 370
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
		strategy() {
			this.update()
		},
		isLoadingTS(isLoading) {
			if(isLoading) {
				this.clearSeries();
			}
		}
	},
	mounted() {
		this.update()
	},
	methods: {
		/**
		 * The strategy should have been fitted after load
		 */
		update() {
			const chart = this.$refs.fitchart.chart
			if(this.strategy.name) {
				this.clearSeries()

				chart.addSeries({
					type: 'line',
					data: this.strategy.ts,
					name: this.strategy.name
				});

			//	chart.rangeSelector.clickButton(5, true);
			}
			setTimeout(() => {
				chart.reflow()
			}, 1000)
		},

		clearSeries() {
      const chart = this.$refs.fitchart.chart
      while(chart.series.length > 0) {
        chart.series[0].remove(false);
      }
		}
	}
}
</script>
