<template>
	<highcharts :constructor-type="'stockChart'" :options="options" ref="simchart"></highcharts>
</template>

<script>
import SimSlider from "@/utils/simslider";
import { tsExtremes } from "@/utils";
import { mapState } from "vuex";

const NAV_PLOTLINE_ID = "NAV_PLOTLINE";
const MIN_PLOTLINE_ID = "MIN_PLOTLINE";
const MAX_PLOTLINE_ID = "MAX_PLOTLINE";
const PLOTBAND_ID = "PLOTBAND";
const SERIES_COLOR = "#26A69A";

const PLOTLINE_COLOR = "#FFEB3B";
const PLOTBAND_COLOR = "rgba(255,255,0,0.02)";
const PLOTBAND_COLOR_NAV = "rgba(255,255,0,0.2)";

const getPlotBand = (from, to, color = PLOTBAND_COLOR) => {
	return {
		from,
		to,
		color: color,
		id: PLOTBAND_ID
	};
};

const getPlotLine = (value, id, width = 0.5, style = "dash") => {
	return {
		value,
		color: PLOTLINE_COLOR,
		width: width,
		dashStyle: style,
		id,
		zIndex: 999
	};
};

const options = vm => {
	return {
		chart: {
			height: vm._props.height,
			backgroundColor: vm._props.backgroundColor,
			panning: false
		},
		title: {
			text: null
		},
		credits: {
			enabled: false
		},
		rangeSelector: {
			selected: 6,
			buttons: [
				{
					type: "month",
					count: 6,
					text: "6m"
				},
				{
					type: "year",
					count: 1,
					text: "1y"
				},
				{
					type: "year",
					count: 2,
					text: "2y"
				},
				{
					type: "year",
					count: 3,
					text: "3y"
				},
				{
					type: "year",
					count: 4,
					text: "4y"
				},
				{
					type: "year",
					count: 5,
					text: "5y"
				},
				{
					type: "all",
					text: "All"
				}
			]
		},
		xAxis: {
			type: "datetime",
			title: {
				text: null
			},
			crosshair: false,
			events: {
				afterSetExtremes: function() {
					// Reset position in case slider
					// is navigated off the graph - re-enable events
					vm.resetPos();
				}
			}
		},
		yAxis: {
			title: {
				text: null
			},
			opposite: true,
			offset: 20,
			tickWidth: 0
		},
		navigator: {
			maskFill: "rgba(255, 152, 0, 0.05)",
			outlineWidth: 0.5,
			series: {
				fillColor1: SERIES_COLOR,
				color: SERIES_COLOR,
				lineWidth: 0.5,
				marker: {
					enabled: false
				}
			},
			xAxis: {
				labels: {
					style: {
						color: "#fff"
					}
				}
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
			default: 400
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
			"endDate",
			"simStart"
		])
	},
	watch: {
		"strategy.ts"() {
			this.update();
		},
		selectedSim() {
			this.drawSim();
		},
		activeTab() {
			const chart = this.$refs.simchart.chart;
			chart.reflow();
		},
		"simStart.date"() {
			this.drawNavSlider();
		},
		startDate(value) {
			if (value && this.graphInitialized) this.updateRange();
		},
		endDate(value) {
			if (value && this.graphInitialized) this.updateRange();
		}
	},
	mounted() {
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

					chart.reflow();
					this.graphInitialized = true;
					if (this.simSlider === null) {
						this.simSlider = new SimSlider(
							this,
							this.$refs.simchart.chart // Chart needs to be created for ref to work
						);
					}
					this.updateRange();
				});
			}
		},

		updateRange() {
			const chart = this.$refs.simchart.chart;

			// Remove plotbands
			chart.xAxis[0].removePlotLine(MIN_PLOTLINE_ID);
			chart.xAxis[0].removePlotLine(MAX_PLOTLINE_ID);
			chart.xAxis[0].removePlotBand(PLOTBAND_ID);
			chart.navigator.xAxis.removePlotLine(MIN_PLOTLINE_ID);
			chart.navigator.xAxis.removePlotLine(MAX_PLOTLINE_ID);
			chart.navigator.xAxis.removePlotBand(PLOTBAND_ID);

			// Add at new positions to chart and navigator
			chart.xAxis[0].addPlotLine(
				getPlotLine(this.startDate, MIN_PLOTLINE_ID)
			);
			chart.xAxis[0].addPlotLine(
				getPlotLine(this.endDate, MAX_PLOTLINE_ID)
			);
			chart.xAxis[0].addPlotBand(
				getPlotBand(this.startDate, this.endDate)
			);

			chart.navigator.xAxis.addPlotLine(
				getPlotLine(this.startDate, MIN_PLOTLINE_ID)
			);
			chart.navigator.xAxis.addPlotLine(
				getPlotLine(this.endDate, MAX_PLOTLINE_ID)
			);
			chart.navigator.xAxis.addPlotBand(
				getPlotBand(this.startDate, this.endDate, PLOTBAND_COLOR_NAV)
			);

			// Dont allow slider past last point in the series
			const extremes = tsExtremes(this.strategy.ts.data);
			this.simSlider.setPos(this.endDate, extremes.min, extremes.max);
			chart.xAxis[0].setExtremes(extremes.min, extremes.max);
		},

		resetPos() {
			if (this.simSlider) {
				let extremes = tsExtremes(this.strategy.ts.data);
				this.simSlider.setPos(
					this.simStart.date,
					extremes.min,
					extremes.max
				);
			}
		},

		drawNavSlider() {
			const chart = this.$refs.simchart.chart;
			chart.navigator.xAxis.removePlotLine(NAV_PLOTLINE_ID);
			chart.navigator.xAxis.addPlotLine(
				getPlotLine(this.simStart.date, NAV_PLOTLINE_ID, 1, "solid")
			);
		},

		drawSim() {
			const chart = this.$refs.simchart.chart;
			const existing = chart.get("sim-sparkline");
			if (existing) {
				existing.remove();
			}
			if (this.selectedSim) {
				for (let i = 0; i < this.sims.length; i++) {
					if (this.selectedSim == this.sims[i].id) {
						chart.addSeries({
							type: "line",
							id: "sim-sparkline",
							data: this.sims[i].data,
							color: PLOTLINE_COLOR,
							showInNavigator: true
						});
						const currentExtremes = chart.xAxis[0].getExtremes();
						const seriesExtremes = tsExtremes(
							this.strategy.ts.data
						);
						const simExtremes = tsExtremes(this.sims[i].data);
						chart.xAxis[0].setExtremes(
							currentExtremes.min,
							Math.max(seriesExtremes.max, simExtremes.max)
						);
						break;
					}
				}
			}
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
	box-shadow: 0 0 2px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.1);
	transition: box-shadow 0.2s cubic-bezier(0.4, 0, 0.2, 1) 0s,
		background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1) 0s;
}
.axis-label:hover {
	box-shadow: 0 0 2px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.2),
		0 0 50px rgba(0, 0, 0, 0.12) inset;
}
</style>