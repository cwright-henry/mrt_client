<template>
	<highcharts :options="options" :ts="ts" ref="residuals"></highcharts>
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
		xAxis: [{
				title: { 
					text: '' 
				},
				alignTicks: true
			},{
				title: { 
					text: '' 
				},
				alignTicks: false,
				type: 'datetime',
				opposite: true,
				visible:false
    }],
		yAxis: [ {
				title: { 
					text: '' 
				},
				opposite: true,
				visible:false
			},{
				title: { 
					text: '' 
				},
				visible:true
		}],
		plotOptions: {
			histogram: {
				binWidth: 0.05
			}
		},
		series: []
	}
}

export default {
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
			if(this.ts.id) {
				chart.addSeries({
					name: 'Histogram',
					type: 'histogram',
					xAxis: 0,
					yAxis: 0,
					baseSeries: this.ts.id,
					zIndex: -1,
					color:'#C8E6C9',
					borderColor:'rgba(0,0,0, 0.2)'
				});
				chart.addSeries({
					type: 'scatter',
					xAxis: 1,
					yAxis: 1,
					color: '#00E676',
					marker: {
						radius: 1.5
					},
					data: this.ts.data,
					id: this.ts.id,
					name: this.ts.name
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

