<template>
	<div>
		<highcharts :options="options" ref="simchart"></highcharts>
	</div>
</template>

<script>
import SimSlider from "@/utils/simslider";
import { tsExtremes } from "@/utils";
import { mapState } from "vuex";

const MIN_PLOTLINE_ID = "SIM_MIN_PLOTLINE";
const MAX_PLOTLINE_ID = "SIM_MAX_PLOTLINE";
const PLOTBAND_ID = "SIM_PLOTBAND";
const SERIES_COLOR = "#26A69A";

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
			zoomType: "x"
		},
		title: {
			text: null
		},
		credits: {
			enabled: false
		},
		xAxis: {
			type: "datetime",
			title: {
				text: null
			},
			crosshair: false
		},
		yAxis: {
			title: {
				text: null
			},
			opposite: true
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
					enabled: false /* By default highstocks groups data into weeks using average over the week for large datasets */
				},
				states: {
					hover: {
						enabled: false
					}
				},
				enableMouseTracking: false /* This is important else we will get pointer errors - hmmm, also lose acesss to tooltip and click events*/
			},
			line: {
				lineWidth: 1,
				boostThreshold: 0,
				color: SERIES_COLOR,
				marker: {
					enabled: false
				}
			}
		}
	};
};

export default {
	data() {
		return {
			options: options(this),
			secondaries: [],
			simSlider: null,
			graphInitialized: false
		};
	},
	props: {
		height: {
			type: Number,
			default: 280
		},
		backgroundColor: {
			type: String,
			default: "rgba(0, 0, 0, 0.0)"
		}
	},
	computed: {
		...mapState("fit", [
			"strategy",
			"sims",
			"selectedSim",
			"isLoadingSims",
			"activeTab",
			"startDate",
			"endDate"
		])
	},
	watch: {
		"strategy.ts"() {
			this.update();
		},
		startDate(value) {
			if (value && this.graphInitialized) this.updateRange();
		},
		endDate(value) {
			if (value && this.graphInitialized) this.updateRange();
		},
		selectedSim(value) {
			if (value !== null) {
				this.drawSim();
			}
		},
		activeTab() {
			const chart = this.$refs.simchart.chart;
			chart.reflow();
		}
	},
	mounted() {
		this.simSlider = new SimSlider(this, this.$refs.simchart.chart);
		this.update();
	},
	methods: {
		/**
		 * Update is called when a new ts has been loaded through watch
		 *
		 * 1. Show main timeseries
		 * 2. Set the initial position of slider
		 * 3. Load the sims for this timeseries
		 */
		async update() {
			const chart = this.$refs.simchart.chart;
			if (this.strategy.ts.data.length) {
				this.$nextTick(() => {
					const existing = chart.get("sim-chart");
					this.graphInitialized = false;
					if (existing) {
						existing.remove();
					}

					chart.addSeries({
						type: "line",
						data: this.strategy.ts.data,
						name: this.strategy.name,
						color: SERIES_COLOR,
						id: "sim-chart"
					});

					this.updateRange();
					chart.reflow();
					this.graphInitialized = true;
				});
			}
		},

		updateRange() {
			const chart = this.$refs.simchart.chart;
			chart.xAxis[0].removePlotLine(`min-plotline`);
			chart.xAxis[0].removePlotLine(`max-plotline`);
			chart.xAxis[0].removePlotBand("plot-band");
			chart.xAxis[0].addPlotBand(
				getPlotBand(this.startDate, this.endDate)
			);
			chart.xAxis[0].addPlotLine(getPlotLine(this.startDate, "min"));
			chart.xAxis[0].addPlotLine(getPlotLine(this.endDate, "max"));
			let extremes = tsExtremes(this.strategy.ts.data);

			this.simSlider.setPos(this.startDate, extremes.min, extremes.max);
		},

		resetPos() {
			let extremes = tsExtremes(this.strategy.ts.data);
			this.simSlider.updatePos(extremes.max);
		},

		drawSim() {
			const chart = this.$refs.simchart.chart;
			const existing = chart.get("sim-sparkline");
			if (existing) {
				existing.remove();
			}
			for (let i = 0; i < this.sims.length; i++) {
				if (this.selectedSim == this.sims[i].id) {
					chart.addSeries({
						type: "line",
						id: "sim-sparkline",
						data: this.sims[i].data,
						color: "#FFEB3B"
					});
					chart.reflow();
					break;
				}
			}
		},

		drawMinArea() {
			const chart = this.$refs.simschart.chart;
			chart.xAxis[0].removePlotLine(MIN_PLOTLINE_ID);
			chart.xAxis[0].removePlotBand(PLOTBAND_ID);
			chart.xAxis[0].addPlotLine(
				getPlotLine(this.startDate, MIN_PLOTLINE_ID, "sim-chart")
			);
			chart.xAxis[0].addPlotBand(
				getPlotBand(this.startDate, this.endDate, PLOTBAND_ID)
			);
		},

		drawMaxArea() {
			const chart = this.$refs.simschart.chart;
			chart.xAxis[0].removePlotLine(MAX_PLOTLINE_ID);
			chart.xAxis[0].removePlotBand(PLOTBAND_ID);
			chart.xAxis[0].addPlotLine(
				getPlotLine(this.endDate, MAX_PLOTLINE_ID, "sim-chart")
			);
			chart.xAxis[0].addPlotBand(
				getPlotBand(this.startDate, this.endDate, PLOTBAND_ID)
			);
		},

		clearSeries() {
			const chart = this.$refs.simschart.chart;
			chart.xAxis[0].removePlotLine(MIN_PLOTLINE_ID);
			chart.xAxis[0].removePlotLine(MAX_PLOTLINE_ID);
			chart.xAxis[0].removePlotBand(PLOTBAND_ID);

			while (chart.series.length > 0) {
				chart.series[0].remove(false);
			}
			chart.reflow();
		}
	}
};
</script>

<style>
.axis-label {
	width: 22px;
	height: 22px;
	border-radius: 50%;
	display: inline-block;
	overflow: hidden;
	cursor: ew-resize;
	background-color: #ffeb3b;
	position: relative;
	top: 16px;
	left: 108px;
}
</style>