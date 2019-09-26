<template>
	<highcharts :options="options" :ts="ts" :name="name" ref="mrtchart"></highcharts>
</template>

<script>
import { mapState } from "vuex";

const FULL_COLOR = "#FDD835";
const SELECTION_COLOR = "#2196F3";
const PLOTLINE_COLOR = "#FFEB3B";
const PLOTBAND_COLOR = "rgba(255,255,0,0.02)";

const getPlotBand = (from, to) => {
	return {
		from,
		to,
		color: PLOTBAND_COLOR,
		id: "plot-band"
	};
};

const getPlotLine = (value, type) => {
	return {
		value,
		color: PLOTLINE_COLOR,
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
				var ret = `<span style="color:${this.series.color}">${
					this.series.name
				}</span> : ${this.y.toFixed(3)}<br/>`;

				if (this.series.chart.series[1]) {
					if (this.series.name == "Full") {
						ret +=
							"<span style='color:#2196F3'>Selection</span>" +
							": " +
							vm.$options.seriesData[this.x][1] +
							"<br/>";
					} else {
						ret +=
							"<span style='color:#FDD835'>Full</span>" +
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
			labels: {
				align: "right"
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
		}
	},
	data() {
		return {
			options: options(this)
		};
	},
	seriesData: {},
	computed: {
		...mapState("fit", [
			"startDate",
			"endDate",
			"originalResids",
			"activeTab",
			"showFull"
		])
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
		showFull() {
			this.toggleFull();
		},
		originalResids() {
			this.update();
		},
		activeTab() {
			const chart = this.$refs.mrtchart.chart;
			chart.reflow();
		}
	},
	mounted() {
		this.update();
	},
	methods: {
		update() {
			const chart = this.$refs.mrtchart.chart;
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
					chart.addSeries({
						type: "scatter",
						color: FULL_COLOR,
						data: this.originalResids,
						name: "Full",
						id: "full",
						visible: this.showFull
					});

					chart.addSeries({
						type: "scatter",
						color: SELECTION_COLOR,
						data: this.ts,
						name: "Selection",
						id: "selection"
					});
					chart.reflow();
				});
			}
		},

		toggleFull() {
			const chart = this.$refs.mrtchart.chart;
			const series = chart.get("full");
			if (this.showFull) {
				series.show();
			} else {
				series.hide();
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
			const chart = this.$refs.mrtchart.chart;
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
			const chart = this.$refs.mrtchart.chart;
			while (chart.series.length > 0) {
				chart.series[0].remove(false);
			}
		}
	}
};
</script>

