<template>
	<highcharts :options="options" :ts="ts" :mean="mean" :std="std" ref="histogram"></highcharts>
</template>

<script>
import {gaussionData} from '@/utils/stats'
const MAX_BIN_NUMBER = 20;

const options = (vm) => {
	return {
		chart: {
			height: vm._props.height,
			zoomType: 'x',
			backgroundColor: vm._props.backgroundColor,
			type: 'bar',
			width:'280'
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
			reversed: false
		},
		yAxis: {
      title: {
        text: ''
			},
			min: 0
    },
		plotOptions: {
			series: {
				borderWidth: 0.5,
				borderColor: 'rgba(255,255,255,0.5)',
				groupPadding: 0,
				pointPadding: 0
			},
			areaspline: {
				lineWidth: 0.5,
				fillColor: 'rgba(76, 175, 80, 0.15)',
				color: '#00B0FF'
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
		mean: {
			type: Number,
			default: 0
		},
		std: {
			type: Number,
			default: 1
		},
		height: {
			type: Number,
			default: 180
		},
		backgroundColor: {
			type: String,
			default: 'rgba(0, 0, 0, 0.0)'
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
			const chart = this.$refs.histogram.chart;
			this.clearSeries()
			
			if(this.ts) {
				const bins = this.createBins()

				chart.addSeries({
					name: 'Distribution',
					data: bins,
					color: '#00B0FF'
				});

				chart.addSeries({
					name: 'Normal Distribution',
					type: 'areaspline',
					data: gaussionData(0, 1, bins)
				});
			}
			chart.reflow()	
		},

		clearSeries() {
      const chart = this.$refs.histogram.chart
      while(chart.series.length > 0) {
        chart.series[0].remove(false);
      }
		},

		createBins() {
			const data = [];
			
			for(let i = 0; i < this.ts.length; i++) {
				data.push(this.ts[i][1])
			}
			const hData = []; //the output array
			let size = data.length; //how many data points
			let bins = Math.round(Math.sqrt(size)); //determine how many bins we need
			bins = bins > MAX_BIN_NUMBER ? MAX_BIN_NUMBER : bins; //adjust if more than 50 cells
			let max = Math.max.apply(null, data) //lowest data value
			let min = Math.min.apply(null, data) //highest data value
			let range = max - min //total range of the data
			let width = range / bins //size of the bins
			let bin_bottom //place holders for the bounds of each bin
			let bin_top;

			//loop through the number of cells
			for (let i = 0; i < bins; i++) {

				//set the upper and lower limits of the current cell
				bin_bottom = min + (i * width);
				bin_top = bin_bottom + width;

				//check for and set the x value of the bin
				if (!hData[i]) {
					hData[i] = new Array();
					hData[i][0] = bin_bottom + (width / 2);
				}

				//loop through the data to see if it fits in this bin
				for (let j = 0; j < size; j++) {
					var x = data[j];

					//adjust if it's the first pass
					if(i == 0 && j == 0) {
						bin_bottom -= 1 
					}

					//if it fits in the bin, add it
					if (x > bin_bottom && x <= bin_top) {
						!hData[i][1] ? hData[i][1] = 1 : hData[i][1]++;
					}
				}
			}

			for (let i = 0; i < hData.length; i++) {
				if (typeof hData[i][1] == 'undefined') {
					hData[i][1] = 0;
				}

				hData[i][1] = hData[i][1] / size
			}
			hData.sort((a, b) => {
				if (a[0] < b[0]) return -1;
				if (a[0] > b[0]) return 1;
				return 0;
			})

			return hData;
		}
	}
}
</script>

<style>

</style>

