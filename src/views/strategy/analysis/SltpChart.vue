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
		name: "E[x_0] NBC",
		showInNavigator: true
	},
	MAX: {
		id: "opt_max_Line",
		color: "yellow",
		dashStyle: "Dot",
		axis: 1,
		name: "Max EIR",
		showInNavigator: false
	},
	TRADE: {
		id: "opt_trade_line",
		color: "#E1BEE7",
		dashStyle: "Dot",
		axis: 2,
		name: "Trad P/L Ratio",
		showInNavigator: false
	},
	PLOT_BAND: {
		id: "plotband",
		color: "rgba(0, 0, 0, 0.15)" // Dark Grey
	}
};

/**
 * Need to fill in the missing dates so that when you
 * go back in time the tooltip picks up all series draw.
 * I think the date need to be aligned on the same date
 */
const createSeries = (lastDate, series) => {
	const arr = [];
	for (let prop in series) {
		let date = moment.utc(lastDate + prop * ONE_YEAR).format("DD MMM YYYY");
		let t = moment.utc(date, "DD MMM YYYY").valueOf();
		arr.push([t, series[prop]]);
	}

	return arr;
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
			backgroundColor: "rgba(0, 0, 0, 0.0)"
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
			enabled: true
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
				const value = Number.parseFloat(this.y).toFixed(2);
				const series = this.points[0].series;
				let html = `<table class="tooltip">
								<tr><td colspan="2"><h1>${date}</h1></td></tr>`;

				// I know its strange to identify series by color
				//  but they are unique!
				if (series.color == OPT.MAIN.color) {
					html += `<tr><td>${series.name}</td><td>${value}</td></tr>`;
				}
				// Check if we are on SLTP charts
				if (data) {
					for (const { name, value } of data) {
						html += `<tr><td>${name}</td><td>${Number.parseFloat(
							value
						).toFixed(2)}</td></tr>`;
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
		...mapState("fit/sltp", ["opt", "optSLValue", "optTPValue", "start"])
	},
	created() {
		this.optHelper = new OptHelper(); // Non-reactive data
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
		},

		drawOptChart() {
			let maxHorizon = this.start.date;

			if (this.opt.SL) {
				this.optHelper.init(this.start.date, this.opt);
				let data = createSeries(this.start.date, this.opt.SL);
				maxHorizon = Math.max(maxHorizon, data[data.length - 1][0]);
				this.drawOptLine(OPT.SL, data);

				data = createSeries(this.start.date, this.opt.TP);
				maxHorizon = Math.max(maxHorizon, data[data.length - 1][0]);
				this.drawOptLine(OPT.TP, data);

				data = createSeries(this.start.date, this.opt.Ext);
				maxHorizon = Math.max(maxHorizon, data[data.length - 1][0]);
				this.drawOptLine(OPT.EXT, data);

				data = createSeries(this.start.date, this.opt.maxVal);
				maxHorizon = Math.max(maxHorizon, data[data.length - 1][0]);
				this.drawOptLine(OPT.MAX, data);

				data = createSeries(this.start.date, this.opt.tradePL);
				maxHorizon = Math.max(maxHorizon, data[data.length - 1][0]);
				this.drawOptLine(OPT.TRADE, data);

				this.addPlotBand(this.start.date, maxHorizon);
				this.addPlotLines(this.optTPValue, this.optSLValue);
				// removeListeners(this.$el, moveTypes, this.toolTipListner);
				// addListeners(this.$el, moveTypes, this.toolTipListner);
				this.$nextTick(() => {
					const chart = this.$refs.sltpchart.chart;
					chart.yAxis[1].update({ visible: true });
					chart.yAxis[2].update({ visible: true });
					chart.xAxis[0].setExtremes(
						this.start.date - 4 * ONE_YEAR,
						maxHorizon
					);
				});
			} else {
				this.clearOptChart();
			}
		},

		clearOptChart() {
			const chart = this.$refs.sltpchart.chart;
			//removeListeners(this.$el, moveTypes, this.toolTipListner);
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

		addPlotLines(sl, tp) {
			const chart = this.$refs.sltpchart.chart;

			chart.yAxis[0].removePlotLine("sl-plotline");
			chart.yAxis[0].removePlotLine("tp-plotline");

			// Have to be carefull here - could be shorting the stock
			chart.yAxis[0].addPlotLine({
				value: tp,
				color: "#4CAF50",
				width: 2,
				yAxis: OPT.MAIN.axis,
				label: {
					align: "left",
					useHTML: true,
					text: '<span class="sltp-grippy upper"></span>'
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
					text: '<span class="sltp-grippy lower"></span>'
				},
				id: "sl-plotline"
			});

			// Seems to be inner workings of VUE and interactions
			// with highcharts!
			this.$nextTick(() => {
				this.addPlotLineListeners();
			});
		},

		addPlotLineListeners: function() {
			const chart = this.$refs.sltpchart.chart;
			let upperLine = chart.yAxis[0].plotLinesAndBands[0].svgElem.translate(
				0,
				0
			);
			let lowerLine = chart.yAxis[0].plotLinesAndBands[1].svgElem.translate(
				0,
				0
			);

			let upperValue = chart.yAxis[0].plotLinesAndBands[0].options.value;
			let lowerValue = chart.yAxis[0].plotLinesAndBands[1].options.value;
			let range = chart.yAxis[0].max - chart.yAxis[0].min; // TODO: determine the best range to use (other max etc)
			let height = chart.yAxis[0].height;
			let currentLowerValue = lowerValue;
			let currentUpperValue = upperValue;
			let currentRange = range;
			// Only declarations (variable and function, but not assignment) are hoisted dumbo!

			let initial = 0;

			const grippyUpper = document.querySelector(".sltp-grippy.upper");
			const grippyLower = document.querySelector(".sltp-grippy.lower");
			const translate = (lim, value) => {
				return lim - (range / height) * value;
			};
			const startUpper = e => {
				initial = e.pageY - upperLine.translateY;
				addListeners(this.$el, moveTypes, moveUpper);
				addListeners(this.$el, stopTypes, endUpper);
			};
			const moveUpper = e => {
				let diff = e.pageY - initial;
				let t = translate(upperValue, diff);
				if (t > currentLowerValue) {
					upperLine.translate(0, diff);
					grippyUpper.style.transform = `translate(0px, ${diff}px`;
				}
			};
			const endUpper = e => {
				removeListeners(this.$el, moveTypes, moveUpper);
				removeListeners(this.$el, stopTypes, endUpper);
			};
			const startLower = e => {
				initial = e.pageY - lowerLine.translateY;
				addListeners(this.$el, moveTypes, moveLower);
				addListeners(this.$el, stopTypes, endLower);
			};
			const moveLower = e => {
				let diff = e.pageY - initial;
				let t = translate(lowerValue, diff);
				if (t < currentUpperValue) {
					lowerLine.translate(0, diff);
					grippyLower.style.transform = `translate(0px, ${diff}px`;
				}
			};
			const endLower = e => {
				removeListeners(this.$el, moveTypes, moveLower);
				removeListeners(this.$el, stopTypes, endLower);
			};
			addListeners(grippyUpper, startTypes, startUpper);
			addListeners(grippyLower, startTypes, startLower);
		},

		toolTipListner() {
			const toolTips = this.$el.querySelectorAll(
				".highcharts-tooltip text"
			);
			for (let tip of toolTips) {
				let txt = tip.textContent;
				if (txt && txt.indexOf(":") != -1) {
					let str = txt.split(":");
					switch (str[0]) {
						case "Opt SL":
							this.$store.commit(
								"fit/sltp/setOptSLValue",
								str[1]
							);
							break;

						case "Opt TP":
							this.$store.commit(
								"fit/sltp/setOptTPValue",
								str[1]
							);
							break;

						case "Max EIR":
							this.$store.commit(
								"fit/sltp/setOptIRValue",
								str[1]
							);
							break;

						case "Trad P/L Ratio":
							this.$store.commit(
								"fit/sltp/setOptTradPLValue",
								str[1]
							);
							break;
					}
				} else {
					const t = moment(txt, "DD MMM YYYY");
					var diff = moment(this.start.date).diff(t, "days");
					if (diff < 0) {
						this.$store.commit(
							"fit/sltp/setOptHorizonValue",
							-1 * diff
						);
					} else {
						this.$store.commit("fit/sltp/setOptSLValue", null);
						this.$store.commit("fit/sltp/setOptTPValue", null);
						this.$store.commit("fit/sltp/setOptIRValue", null);
						this.$store.commit("fit/sltp/setOptTradPLValue", null);
						this.$store.commit("fit/sltp/setOptHorizonValue", null);
					}
				}
			}
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
	overflow: hidden;
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
span.sltp-grippy.upper {
	background-color: #4caf50;
}
span.sltp-grippy.lower {
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