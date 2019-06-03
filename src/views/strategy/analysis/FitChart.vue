<template>
	<highcharts :constructor-type="'stockChart'" :options="options" :strategy="strategy" ref="fitchart"></highcharts>
</template>

<script>
import {mapState} from 'vuex'
import {mean} from '@/utils'

const options = (vm) => {
	return {
		chart: {
			height: vm._props.height,
			backgroundColor: vm._props.backgroundColor
		},
		rangeSelector: {
			selected: 6,
			buttons: [{
				type: 'year',
				count: 1,
				text: '1y'
			},{
				type: 'year',
				count: 2,
				text: '2y'
			},{
				type: 'year',
				count: 3,
				text: '3y'
			},{
				type: 'year',
				count: 4,
				text: '4y'
			},
			{
				type: 'year',
				count: 5,
				text: '5y'
			},{
				type: 'all',
				text: 'All'
			}]
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
							if(e.DOMEvent && e.DOMEvent.type === 'mouseup') {
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
			outlineColor: '#BA68C8',
			outlineWidth: 0.5,
			handles: {
				borderColor: '#BA68C8',
				lineWidth: 0.5
			},
			series: {
				type: 'spline',
				color: '#00B0FF',
				lineWidth: 1
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
				fillColor: '#1976D2',
				color: '#FFFFFF',
				lineWidth: 0.5,
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
			default: 470
		},
		backgroundColor: {
			type: String,
			default: 'rgba(0, 0, 0, 0.0)'
		}
	},
	computed: {
		...mapState('fit', ['strategy', 'startDate', 'endDate', 'isLoadingTS'])
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
				setTimeout(()=> {
					this.clearSeries()
					chart.addSeries({
						type: 'area',
						data: this.strategy.ts.data,
						name: this.strategy.name,
						threshold: mean(this.strategy.ts.data)
					});

					//chart.rangeSelector.clickButton(5, true);
					chart.xAxis[0].setExtremes(this.startDate, this.endDate)
					chart.reflow()
				}, 0)
			}
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
