<template>
	<transition-group name="flip" tag="div">
		<div v-show="isLoading" class="mrt-strategy-loading" key="loading">Loading {{strategy.name}}...</div>
		<div v-show="!isLoading" key="not_loading">
			<highcharts :constructor-type="'stockChart'" :options="options" ref="linechart"></highcharts>
		</div>
	</transition-group>
</template>

<script>
import { mean } from "@/utils";

const PLOT_LINE_COLOR = "#FFEB3B";
const PLOT_BAND_COLOR = "rgba(237, 237, 37, 0.1)";
const START_PLOT_LINE = "plot-line-start";
const END_PLOT_LINE = "plot-line-end";
const PLOT_BAND = "plot_band";
const SERIES_COLOR = "#26A69A";

const getPlotBand = (from, to, id) => {
	return {
		from,
		to,
		color: PLOT_BAND_COLOR,
		id: id
	};
};

const getPlotLine = (value, id) => {
	return {
		value,
		color: "#FFEB3B",
		dashStyle: "dash",
		width: 1,
		id: id,
		zIndex: 999
	};
};

const options = vm => {
	return {
		chart: {
			height: vm._props.height,
			zoomType: "x",
			backgroundColor: vm._props.backgroundColor,
			spacingRight: 70
		},
		title: {
			text: null
		},
		credits: {
			enabled: false
		},
		xAxis: {
			type: "datetime",
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
		},
		navigator: {
			maskFill: "rgba(255, 152, 0, 0.05)",
			outlineWidth: 0.5,
			series: {
				fillColor: SERIES_COLOR,
				color: "#FFF",
				lineWidth: 0.5,
				marker: {
					enabled: false
				}
			}
		},
		rangeSelector: {
			selected: 1,
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
		plotOptions: {
			series: {
				dataGrouping: {
					enabled: false /* By default highstocks groups data into weeks */
				},
				states: {
					hover: {
						enabled: false
					}
				},
				dataLabels: {
					enabled: true,
					align: "left",
					color: "#FFF",
					borderRadius: 4,
					backgroundColor: SERIES_COLOR,
					borderWidth: 1,
					borderColor: "#FFF",
					fontWeight: 300,
					x: 10,
					formatter: function() {
						if (this.point.index == this.series.data.length - 1) {
							return this.y.toFixed(2);
						} else {
							return null;
						}
					},
					style: {
						textOutline: false,
						fontSize: "13px"
					},
					crop: false,
					overflow: false
				}
			},
			line: {
				color: SERIES_COLOR,
				lineWidth: 2
			}
		}
	};
};

export default {
	data() {
		return {
			options: options(this),
			isLoading: false
		};
	},
	props: {
		strategy: {
			type: Object,
			default: () => {
				return {
					ts: {},
					fit: {}
				};
			}
		},
		height: {
			type: Number,
			default: 350
		},
		backgroundColor: {
			type: String,
			default: "rgba(0, 0, 0, 0.0)"
		}
	},
	watch: {
		// Called when the strategy gets updated i.e. after fitting
		strategy: {
			handler: function() {
				this.update();
			},
			deep: true
		}
	},
	/**
	 * Is this only called from hot-update
	 */
	mounted() {
		this.update();
	},
	methods: {
		update() {
			this.isLoading = true;
			if (this.strategy.ts) {
				this.isLoading = false;
				this.$nextTick(() => {
					const chart = this.$refs.linechart.chart;
					this.clearSeries();
					chart.addSeries({
						type: "line",
						data: this.strategy.ts.data,
						name: this.strategy.name
					});

					this.addLinesAndBands(chart);
					chart.reflow();
				});
			}
		},

		addLinesAndBands(chart) {
			chart.xAxis[0].addPlotLine(
				getPlotLine(this.strategy.fit.start_date, START_PLOT_LINE)
			);
			chart.xAxis[0].addPlotLine(
				getPlotLine(this.strategy.fit.end_date, END_PLOT_LINE)
			);
			chart.xAxis[0].addPlotBand(
				getPlotBand(
					this.strategy.fit.start_date,
					this.strategy.fit.end_date,
					PLOT_BAND
				)
			);
			chart.navigator.xAxis.addPlotLine(
				getPlotLine(this.strategy.fit.start_date, START_PLOT_LINE)
			);
			chart.navigator.xAxis.addPlotLine(
				getPlotLine(this.strategy.fit.end_date, END_PLOT_LINE)
			);
			chart.navigator.xAxis.addPlotBand(
				getPlotBand(
					this.strategy.fit.start_date,
					this.strategy.fit.end_date,
					PLOT_BAND
				)
			);
		},

		clearSeries() {
			const chart = this.$refs.linechart.chart;
			while (chart.series.length > 0) {
				chart.series[0].remove(false);
			}
			chart.xAxis[0].removePlotBand(PLOT_BAND);
			chart.xAxis[0].removePlotLine(START_PLOT_LINE);
			chart.xAxis[0].removePlotLine(END_PLOT_LINE);
			chart.navigator.xAxis.removePlotBand(PLOT_BAND);
			chart.navigator.xAxis.removePlotLine(START_PLOT_LINE);
			chart.navigator.xAxis.removePlotLine(END_PLOT_LINE);
		}
	}
};
</script>

<style lang="less">
.mrt-strategy-loading {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 0px;
}
.flip-enter-active {
	transition: all 0.2s cubic-bezier(0.55, 0.085, 0.68, 0.53); //ease-in-quad
}

.flip-leave-active {
	transition: all 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94); //ease-out-quad
}

.flip-leave-to {
}

.flip-enter,
.flip-leave-to {
	transform: scaleY(0) translateZ(0);
	opacity: 0;
}
</style>