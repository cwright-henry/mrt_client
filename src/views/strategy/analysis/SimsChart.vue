<template>
	<highcharts :options="options" ref="simschart"></highcharts>
</template>

<script>
import SimSlider from "@/utils/simslider";
import { getPlotBand, getPlotLine, tsExtremes, mean } from "@/utils";
import { mapState } from "vuex";

const MIN_PLOTLINE_ID = "SIM_MIN_PLOTLINE";
const MAX_PLOTLINE_ID = "SIM_MAX_PLOTLINE";
const PLOTBAND_ID = "SIM_PLOTBAND";

const options = vm => {
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
				cursor: "pointer",
				zIndex: 1,
				states: {
					hover: {
						enabled: false
					}
				}
			},
			area: {
				fillColor: "#00B0FF",
				color: "#FFFFFF",
				lineWidth: 0.5
			},
			line: {
				lineWidth: 0.5,
				color: "#AEEA00"
			}
		}
	};
};

export default {
	data() {
		return {
			options: options(this),
			average: 0,
			secondaries: [],
			simSlider: null
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
			"startDate",
			"endDate",
			"selectedSim",
			"isLoadingSims"
		])
	},
	watch: {
		"strategy.ts"() {
			this.update();
		},
		selectedSim(value) {
			if (value !== null) {
				this.drawSim();
			}
		}
	},
	mounted() {
		this.simSlider = new SimSlider(this, this.$refs.simschart.chart);
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
			const chart = this.$refs.simschart.chart;
			if (this.strategy.ts.data.length) {
				const existing = chart.get("sim-chart");
				if (existing) {
					existing.remove();
				}
				this.average = mean(this.strategy.ts.data);
				chart.addSeries({
					type: "line",
					data: this.strategy.ts.data,
					name: this.strategy.name,
					threshold: this.average,
					color: "#2196F3",
					id: "sim-chart",
					lineWidth: 0.8
				});
				let extremes = tsExtremes(this.strategy.ts.data);

				// Must call setPos after series has been added to chart - hmmmm makes sense!!
				this.simSlider.setPos(extremes.max, extremes.min, extremes.max);
				chart.reflow();
			}
		},

		resetPos() {
			let extremes = tsExtremes(this.strategy.ts.data);
			this.simSlider.updatePos(extremes.max);
		},

		drawSim() {
			const chart = this.$refs.simschart.chart;
			const existing = chart.get("sim-sparkline");
			if (existing) {
				existing.remove();
			}
			for (let i = 0; i < this.sims.length; i++) {
				if (this.selectedSim == this.sims[i].id) {
					chart.addSeries({
						type: "line",
						id: "sim-sparkline",
						data: this.sims[i].data
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
	background-color: #aeea00;
	position: relative;
	top: 6px;
	left: 108px;
}
</style>