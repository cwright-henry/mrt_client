<template>
	<highcharts :options="options" :ts="ts" :name="name" ref="linechart"></highcharts>
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
			options: options(this),
			observer: null,
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
			default: 'rgba(0, 0, 0, 0.1)'
		}
	},
	watch: {
		ts(data) {
			this.clearSeries()
			const chart = this.$refs.linechart.chart
			chart.addSeries({
				type: 'line',
				data: data
			})
		}
	},
	mounted() {
		const chart = this.$refs.linechart.chart
		chart.addSeries({
			type: 'line',
			data: this.ts,
			name: this.name
		});

		if(this.lazyload) {
			this.observer = new IntersectionObserver(([entry], self) => {
				if (entry && entry.isIntersecting) {
					this.load()
					self.unobserve(entry.target)
				}
			}, options);

			this.observer.observe(this.$el);
		}

		// Weird effect based on load time
		// Not sure if this is gone
		setTimeout(() => {this.redraw},  2000)
	},
	methods: {
		load: function() {
			const payload = {
				id: this.id
			}
			this.$store.dispatch('library/findTs', payload)
			.then((data) => {
				this.clearSeries()
				const chart = this.$refs.linechart.chart;
				chart.addSeries({
					type: 'line',
					data: data,
					name: this.name
				});
				chart.xAxis[0].update({visible:true})
			})
		},

		redraw() {
			const chart = this.$refs.linechart.chart;
			chart.redraw();
			chart.reflow();
		},

		clearSeries() {
      const chart = this.$refs.linechart.chart
      while(chart.series.length > 0) {
        chart.series[0].remove(false);
      }
		}
	},
	destroyed() {
		if(this.lazyload) {
			this.observer.disconnect();
		}
  }
}
</script>

<style scoped>

</style>