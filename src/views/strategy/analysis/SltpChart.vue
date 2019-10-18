<template>
	<highcharts :options="options" :constructor-type="'stockChart'" ref="sltpchart"></highcharts>
</template>

<script>
import { mapState } from "vuex";
import moment from "moment";
import OptHelper from "@/utils/opthelper";

const ONE_YEAR = 1000 * 60 * 60 * 24 * 365;
const SERIES_COLOR = "#26A69A";

const OPT = {
	MAIN: {
		id: "main_chart",
		color: SERIES_COLOR,
		axis: 0
	},
	SL: {
		id: "opt_sl_line",
		color: "#EF9A9A",
		dashStyle: "",
		axis: 0,
		name: "Opt SL",
		showInNavigator: true
	},
	TP: {
		id: "opt_tp_line",
		color: "#4CAF50",
		dashStyle: "",
		axis: 0,
		name: "Opt TP",
		showInNavigator: true
	},
	EXT: {
		id: "opt_ext_line",
		color: "#64B5F6",
		dashStyle: "",
		axis: 0,
		name: "Opt E[x_0] NBC",
		showInNavigator: true
	},
	MAX: {
		id: "opt_max_Line",
		color: "yellow",
		dashStyle: "Dot",
		axis: 1,
		name: "Opt Max EIR",
		showInNavigator: false
	},
	TRADE: {
		id: "opt_trade_line",
		color: "#E1BEE7",
		dashStyle: "Dot",
		axis: 2,
		name: "Opt Trad P/L Ratio",
		showInNavigator: false
	},
	PLOT_BAND: {
		id: "plotband",
		color: "rgba(0, 0, 0, 0.15)" // Dark Grey
	}
};

const startTypes = ["pointerdown"];
const moveTypes = ["pointermove"];
const stopTypes = ["pointerup"];

const addListeners = (container, types, fn) => {
	types.forEach(type => {
		container.addEventListener(type, fn, {
			capture: false,
			passive: true
		});
	});
};

const removeListeners = (container, types, fn) => {
	types.forEach(type => {
		container.removeEventListener(type, fn, {
			capture: false,
			passive: true
		});
	});
};

const options = vm => {
	return {
		chart: {
			height: 500,
			backgroundColor: "rgba(0, 0, 0, 0.0)",
			events: {
				load: function() {
					const legendPaths = document.querySelectorAll(
						".highcharts-legend-item path"
					);
					legendPaths.forEach(item => {
						item.setAttribute("stroke-width", 12);
					});
				},
				redraw: function() {
					const legendPaths = document.querySelectorAll(
						".highcharts-legend-item path"
					);
					legendPaths.forEach(item => {
						item.setAttribute("stroke-width", 12);
					});
				}
			}
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
		title: {
			text: null
		},
		credits: {
			enabled: false
		},
		xAxis: {
			type: "datetime",
			crosshair: true,
			ordinal: false,
			title: {
				text: null
			}
		},
		yAxis: [
			{
				title: {
					text: ""
				},
				events: {
					afterSetExtremes: function() {
						// $("#chart_container").trigger("main-chart:setExtremes", e);
					}
				},
				crosshair: false,
				opposite: true,
				visible: true,
				offset: 28,
				tickWidth: 0,
				plotLines: []
			},
			{
				title: {
					text: "Max EIR",
					style: {
						color: "yellow"
					}
				},
				crosshair: false,
				visible: false,
				opposite: true,
				tickWidth: 0,
				offset: 28,
				labels: {
					style: {
						color: "yellow"
					}
				}
			},
			{
				title: {
					text: "trad P/L ratio",
					style: {
						color: "#E1BEE7"
					}
				},
				crosshair: false,
				visible: false,
				opposite: true,
				tickWidth: 0,
				labels: {
					style: {
						color: "#E1BEE7"
					}
				}
			}
		],
		legend: {
			enabled: true,
			symbolPadding: 5,
			symbolWidth: 12
		},
		tooltip: {
			useHTML: true,
			shared: true,
			split: true,
			distance: 30,
			padding: 5,
			formatter: function() {
				const data = vm.optHelper.getTooltip(this.x);
				const date = moment.utc(this.x).format("DD MMM YYYY");
				const value = Number.parseFloat(this.y).toFixed(4);
				const series = this.points[0].series;
				let html = `<table class="tooltip">
								<tr><td colspan="2"><h1>${date}</h1></td></tr>`;

				// I know its strange to identify series by color
				//  but they are unique!
				if (series.color == OPT.MAIN.color) {
					html += `<tr><td style="color:${series.color}">${series.name}</td><td>${value}</td></tr>`;
				}
				// Check if we are on SLTP charts
				if (data) {
					for (const { name, value, color } of data) {
						html += `<tr><td style="color:${color}">${name}</td><td>${Number.parseFloat(
							value
						).toFixed(4)}</td></tr>`;
					}
				}

				html += "</table>";

				return html;
			}
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
				}
			},
			line: {
				lineWidth: 1,
				boostThreshold: 0,
				color: SERIES_COLOR,
				marker: {
					enabled: false
				}
			}
		},
		responsive: {
			rules: [
				{
					condition: {
						maxWidth: 500
					},
					chartOptions: {
						chart: {
							height: 300
						},
						subtitle: {
							text: null
						},
						navigator: {
							enabled: true
						},
						rangeSelector: {
							inputEnabled: false
						}
					}
				}
			]
		}
	};
};

export default {
	data() {
		return {
			options: options(this)
		};
	},
	computed: {
		...mapState("fit", ["strategy", "activeTab"]),
		...mapState("fit/sltp", [
			"opt",
			"slValue",
			"tpValue",
			"start",
			"isLong",
			"slRange",
			"tpRange"
		])
	},
	created() {
		this.optHelper = new OptHelper(OPT); // Non-reactive data
	},
	watch: {
		/**
		 * When the strategy changes
		 */
		strategy() {
			this.drawStrategyChart();
		},
		/**
		 * When we run SLTP and also a capture when it gets
		 * reset to null similiar to selectedSIM
		 */
		opt() {
			this.drawOptChart();
		},
		/**
		 * When the tab is viewed
		 */
		activeTab() {
			const chart = this.$refs.sltpchart.chart;
			chart.reflow();
		}
	},
	mounted() {
		this.drawStrategyChart();
	},
	methods: {
		drawStrategyChart() {
			const chart = this.$refs.sltpchart.chart;

			setTimeout(() => {
				const existing = chart.get(OPT.MAIN.id);
				if (existing) {
					existing.remove();
				}
				if (this.strategy.ts.data) {
					chart.addSeries({
						type: "line",
						data: this.strategy.ts.data,
						id: OPT.MAIN.id,
						color: OPT.MAIN.color,
						yAxis: 0,
						showInNavigator: true,
						name: this.strategy.name
					});
				}
				chart.reflow();
			}, 0);
		},

		drawOptChart() {
			if (this.opt.SL) {
				this.optHelper.build(this.start.date, this.opt);
				this.drawOptLine(OPT.SL, this.optHelper.sl);
				this.drawOptLine(OPT.TP, this.optHelper.tp);
				this.drawOptLine(OPT.EXT, this.optHelper.ext);
				this.drawOptLine(OPT.MAX, this.optHelper.maxVal);
				this.drawOptLine(OPT.TRADE, this.optHelper.tradePL);
				this.addPlotBand(this.start.date, this.optHelper.horizon);
				this.addPlotLines(this.slValue, this.tpValue);

				this.$nextTick(() => {
					const chart = this.$refs.sltpchart.chart;
					chart.yAxis[1].update({ visible: true });
					chart.yAxis[2].update({ visible: true });

					// FIXME
					chart.xAxis[0].setExtremes(
						this.start.date - 4 * ONE_YEAR,
						this.optHelper.horizon
					);
				});
			} else {
				this.clearOptChart();
			}
		},

		clearOptChart() {
			const chart = this.$refs.sltpchart.chart;
			this.clearFromChart(OPT.SL.id);
			this.clearFromChart(OPT.TP.id);
			this.clearFromChart(OPT.EXT.id);
			this.clearFromChart(OPT.MAX.id);
			this.clearFromChart(OPT.TRADE.id);
			this.clearFromChart(OPT.PLOT_BAND.id);
			chart.yAxis[1].update({ visible: false });
			chart.yAxis[2].update({ visible: false });
			chart.yAxis[0].removePlotLine("sl-plotline");
			chart.yAxis[0].removePlotLine("tp-plotline");
			chart.xAxis[0].removePlotBand(OPT.PLOT_BAND.id);
			chart.rangeSelector.clickButton(6, true);
		},

		clearFromChart(id) {
			const chart = this.$refs.sltpchart.chart;
			const existing = chart.get(id);
			if (existing) {
				existing.remove();
			}
		},

		drawOptLine(opts, data) {
			const chart = this.$refs.sltpchart.chart;
			const existing = chart.get(opts.id);
			if (existing) {
				existing.remove();
			}

			chart.addSeries({
				type: "line",
				data: data,
				id: opts.id,
				name: opts.name,
				lineWidth: 2,
				color: opts.color,
				showInNavigator: true,
				yAxis: opts.axis,
				dashStyle: opts.dashStyle
			});
		},

		addPlotBand(from, to) {
			const chart = this.$refs.sltpchart.chart;
			chart.xAxis[0].removePlotBand(OPT.PLOT_BAND.id);
			chart.xAxis[0].addPlotBand({
				from: from,
				to: to,
				color: OPT.PLOT_BAND.color,
				id: OPT.PLOT_BAND.id,
				events: {
					click: () => {}
				}
			});
		},

		addRangeBand(from, to, type) {
			const chart = this.$refs.sltpchart.chart;
			chart.yAxis[0].removePlotBand(type);
			chart.yAxis[0].addPlotBand({
				from: from,
				to: to,
				color:
					type == "sl"
						? "rgba(255, 0, 0, 0.1)"
						: "rgba(0, 255, 0, 0.1)",
				id: type
			});
		},

		addPlotLines(sl, tp) {
			const chart = this.$refs.sltpchart.chart;

			chart.yAxis[0].removePlotLine("sl-plotline");
			chart.yAxis[0].removePlotLine("tp-plotline");

			/**
			 * If we are long then green line on top and red line on the bottom
			 * If we short then green line on bottom and red on top
			 */
			chart.yAxis[0].addPlotLine({
				value: tp,
				color: "#4CAF50",
				width: 2,
				yAxis: OPT.MAIN.axis,
				label: {
					align: "left",
					useHTML: true,
					text: `<span class="sltp-grippy takeProfit"></span>`
				},
				id: "tp-plotline"
			});

			chart.yAxis[0].addPlotLine({
				value: sl,
				color: "#F44336",
				width: 2,
				yAxis: OPT.MAIN.axis,
				label: {
					align: "left",
					useHTML: true,
					text: `<span class="sltp-grippy stopLoss"></span>`
				},
				id: "sl-plotline"
			});

			// Wait until Vue has attached the graphs
			// to the DOM
			setTimeout(() => {
				const extremes = chart.yAxis[0].getExtremes();
				chart.yAxis[0].setExtremes(
					Math.min(extremes.dataMin, Math.min(tp, sl)),
					Math.max(extremes.dataMax, Math.max(tp, sl))
				);
				this.addPlotLineListeners();
			}, 0);
		},

		addPlotLineListeners: function() {
			const chart = this.$refs.sltpchart.chart;
			let takeProfitLine = chart.yAxis[0].plotLinesAndBands[0].svgElem.translate(
				0,
				0
			);
			let stopLossLine = chart.yAxis[0].plotLinesAndBands[1].svgElem.translate(
				0,
				0
			);
			let takeProfitValue =
				chart.yAxis[0].plotLinesAndBands[0].options.value;
			let stopLossValue =
				chart.yAxis[0].plotLinesAndBands[1].options.value;
			let range = chart.yAxis[0].max - chart.yAxis[0].min; // TODO: determine the best range to use (other max etc)
			let height = chart.yAxis[0].height;
			//
			// Note to self:
			// Only declarations (variable and function, but not assignment) are hoisted dumbo!
			//

			let initial = 0;

			const grippyTakeProfit = document.querySelector(
				".sltp-grippy.takeProfit"
			);
			const grippyStopLoss = document.querySelector(
				".sltp-grippy.stopLoss"
			);

			const translate = (lim, value) => {
				return lim - (range / height) * value;
			};

			const [slMin, slMax] = this.slRange;
			const [tpMin, tpMax] = this.tpRange;

			/**
			 *	TAKE PROFIT
			 */
			const startTakeProfit = e => {
				initial = e.pageY - takeProfitLine.translateY;
				addListeners(this.$el, moveTypes, moveTakeProfit);
				addListeners(this.$el, stopTypes, endTakeProfit);
			};
			const moveTakeProfit = e => {
				let diff = e.pageY - initial;
				let actual = translate(takeProfitValue, diff);
				if (actual >= tpMin && actual <= tpMax) {
					takeProfitLine.translate(0, diff);
					grippyTakeProfit.style.transform = `translate(0px, ${diff}px`;
				}
			};
			const endTakeProfit = () => {
				let value = translate(
					takeProfitValue,
					takeProfitLine.translateY
				);
				this.$store.commit("fit/sltp/setTPValue", value);
				removeListeners(this.$el, moveTypes, moveTakeProfit);
				removeListeners(this.$el, stopTypes, endTakeProfit);
			};

			/**
			 *	STOP LOSS
			 */
			const startStopLoss = e => {
				initial = e.pageY - stopLossLine.translateY;
				addListeners(this.$el, moveTypes, moveStopLoss);
				addListeners(this.$el, stopTypes, endStopLoss);
			};
			const moveStopLoss = e => {
				let diff = e.pageY - initial;
				let actual = translate(stopLossValue, diff);
				if (actual >= slMin && actual <= slMax) {
					stopLossLine.translate(0, diff);
					grippyStopLoss.style.transform = `translate(0px, ${diff}px`;
				}
			};
			const endStopLoss = () => {
				let value = translate(stopLossValue, stopLossLine.translateY);
				this.$store.commit("fit/sltp/setSLValue", value);
				removeListeners(this.$el, moveTypes, moveStopLoss);
				removeListeners(this.$el, stopTypes, endStopLoss);
			};

			/**
			 *	SETUP LISTENERS
			 */
			addListeners(grippyTakeProfit, startTypes, startTakeProfit);
			addListeners(grippyStopLoss, startTypes, startStopLoss);
		}
	}
};
</script>

<style lang="less">
span.sltp-grippy {
	position: relative;
	top: 7px;
	left: -10px;
	content: "";
	width: 33px;
	height: 16px;
	display: inline-block;
	line-height: 5px;
	padding: 5px 4px;
	cursor: row-resize;
	vertical-align: top;
	font-size: 16px;
	font-family: sans-serif;
	letter-spacing: 2px;
	color: white;
	letter-spacing: -1px;
	border-radius: 3px;
}
span.sltp-grippy::after {
	content: ":::::::";
}
span.sltp-grippy.takeProfit::before {
	content: "TP";
	position: absolute;
	top: 24px;
	left: 8px;
	font-size: 11px;
	color: #bdbdbd;
}
span.sltp-grippy.stopLoss::before {
	content: "SL";
	position: absolute;
	top: 24px;
	left: 8px;
	font-size: 11px;
	color: #bdbdbd;
}
span.sltp-grippy.takeProfit {
	background-color: #4caf50;
}
span.sltp-grippy.stopLoss {
	background-color: #f44336;
}
table.tooltip {
	tr td {
		&:nth-child(2) {
			text-align: right;
		}
		h1 {
			font-size: 14px;
			font-weight: 300;
			margin: 0 0 2px;
		}
	}
}
</style>