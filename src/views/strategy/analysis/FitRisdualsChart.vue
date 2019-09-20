<template>
	<highcharts :options="options" :ts="ts" :name="name" ref="residuals"></highcharts>
</template>

<script>
import { mapState } from "vuex";

const getPlotBand = (from, to) => {
	return {
		from,
		to,
		color: "rgba(255,255,0,0.02)",
		id: "plot-band"
	};
};

const getPlotLine = (value, type) => {
	return {
		value,
		color: "#FFEB3B",
		width: 0.5,
		dashStyle: "dash",
		id: `${type}-plotline`,
		zIndex: 999
	};
};

const options = vm => {
	return {
		chart: {
			height: vm._props.height,
			backgroundColor: vm._props.backgroundColor,
			zoomType: "x",
			spacingRight: 30,
			animation: false
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
			enabled: true,
			shared: true,
			pointFormatter: function() {
				var ret = this.series.name + ": " + this.y.toFixed(3) + "<br/>";

				if (this.series.chart.series[1]) {
					if (this.series.name == "full") {
						ret +=
							"Selection" +
							": " +
							vm.$options.seriesData[this.x][1] +
							"<br/>";
					} else {
						ret +=
							"Full" +
							": " +
							vm.$options.seriesData[this.x][0] +
							"<br/>";
					}
				}
				return ret;
			}
		},
		xAxis: {
			title: {
				text: ""
			},
			alignTicks: true,
			type: "datetime"
		},
		yAxis: {
			title: {
				text: ""
			},
			opposite: true,
			offset: 0
		},
		plotOptions: {
			scatter: {
				clip: false,
				marker: {
					radius: 2,
					symbol: "circle"
				}
			}
		},
		series: []
	};
};

export default {
	props: {
		ts: {
			type: Array,
			default: () => {
				return [];
			}
		},
		name: {
			type: String,
			default: ""
		},
		height: {
			type: Number,
			default: 320
		},
		backgroundColor: {
			type: String,
			default: "rgba(0, 0, 0, 0)"
		},
		aggregator: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			options: options(this)
		};
	},
	seriesData: {},
	computed: {
		...mapState("fit", ["startDate", "endDate", "originalResids"])
	},
	watch: {
		startDate() {
			this.updateRange();
		},
		endDate() {
			this.updateRange();
		},
		ts() {
			this.update();
		},
		aggregator() {
			this.update();
		},
		originalResids() {
			this.update();
		}
	},
	mounted() {
		this.update();
	},
	methods: {
		update() {
			const chart = this.$refs.residuals.chart;
			//
			//	This is gettiing called multiple times due
			//	setting originalResids and the strategy ts in independent commit in the store!!
			//
			if (
				this.originalResids &&
				this.ts &&
				this.originalResids.length === this.ts.length
			) {
				this.$nextTick(() => {
					this.clearSeries();
					this.updateRange();
					this.fillBuckets(this.originalResids, this.ts);
					if (this.aggregator) {
						chart.addSeries({
							type: "scatter",
							color: "#FDD835",
							data: this.originalResids,
							name: "full",
							index: 1
						});
					}
					chart.addSeries({
						type: "scatter",
						color: "#2196F3",
						data: this.ts,
						name: "selection",
						index: 2
					});
					chart.reflow();
				});
			}
		},

		fillBuckets(full, selected) {
			for (let i = 0; i < full.length; i++) {
				this.$options.seriesData[full[i][0]] = [
					full[i][1].toFixed(3),
					selected[i][1].toFixed(3)
				];
			}
		},

		updateRange() {
			const chart = this.$refs.residuals.chart;
			chart.xAxis[0].removePlotLine(`min-plotline`);
			chart.xAxis[0].removePlotLine(`max-plotline`);
			chart.xAxis[0].removePlotBand("plot-band");
			chart.xAxis[0].addPlotBand(
				getPlotBand(this.startDate, this.endDate)
			);
			chart.xAxis[0].addPlotLine(getPlotLine(this.startDate, "min"));
			chart.xAxis[0].addPlotLine(getPlotLine(this.endDate, "max"));
		},

		clearSeries() {
			const chart = this.$refs.residuals.chart;
			while (chart.series.length > 0) {
				chart.series[0].remove(false);
			}
		}
	}
};
</script>

