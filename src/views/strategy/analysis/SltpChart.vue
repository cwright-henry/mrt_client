<template>
	<highcharts :options="options" :constructor-type="'stockChart'" ref="sltpchart"></highcharts>
</template>

<script>
import { mapState } from "vuex";
import moment from "moment";

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

const createSeries = (lastDate, series) => {
	const arr = [];
	for (let prop in series) {
		let date = lastDate + prop * ONE_YEAR;
		arr.push([date, series[prop]]);
	}

	return arr;
};

const moveTypes = ["mousemove", "touchmove"];

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
				crosshair: false,
				events: {
					afterSetExtremes: function(e) {
						// $("#chart_container").trigger("main-chart:setExtremes", e);
					}
				},
				opposite: true,
				visible: true,
				offset: 28,
				tickWidth: 0,
				id: "yA0",
				plotLines: []
			},
			{
				title: {
					text: "Max EIR",
					style: {
						color: "yellow"
					}
				},
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
			enabled: false
		},
		tooltip: {
			pointFormat:
				'<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> <br><br/>',
			valueDecimals: 2,
			shared: true
		},
		plotOptions: {
			series: {
				dataGrouping: {
					enabled: false /* By default highstocks groups data into weeks using average over the week for large datasets */
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
	watch: {
		/**
		 * When the strategy changes
		 */
		strategy() {
			this.drawStrategyChart();
		},
		/**
		 * When we run SLTP
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
					showInNavigator: true,
					name: this.strategy.name
				});
			}
			chart.reflow();
		},

		drawOptChart() {
			let maxHorizon = this.start.date;

			if (this.opt.SL) {
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
				this.addPlotLines(this.optSLValue, this.optTPValue);
				removeListeners(this.$el, moveTypes, this.toolTipListner);
				addListeners(this.$el, moveTypes, this.toolTipListner);

				this.$nextTick(() => {
					const chart = this.$refs.sltpchart.chart;
					chart.yAxis[1].update({ visible: true });
					chart.yAxis[2].update({ visible: true });
					chart.xAxis[0].setExtremes(
						this.start.date - 4 * ONE_YEAR,
						maxHorizon
					);
				});
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
				lineWidth: 3,
				color: opts.color,
				showInNavigator: opts.showInNavigator,
				yAxis: opts.axis,
				dashStyle: opts.dashStyle
			});
		},

		addPlotBand(from, to) {
			const chart = this.$refs.sltpchart.chart;
			const existing = chart.get(OPT.PLOT_BAND.id);
			if (existing) {
				existing.remove();
			}
			chart.xAxis[0].addPlotBand({
				from: from,
				to: to,
				color: OPT.PLOT_BAND.color,
				id: OPT.PLOT_BAND.id,
				zIndex: 20,
				events: {
					click: () => {}
				}
			});
		},

		addPlotLines(sl, tp) {
			const chart = this.$refs.sltpchart.chart;

			chart.yAxis[0].removePlotLine("sl-plotline");
			chart.yAxis[0].removePlotLine("tp-plotline");

			chart.yAxis[0].addPlotLine({
				value: sl, // orig: min
				color: "red",
				width: 2,
				yAxis: OPT.MAIN.axis,
				label: {
					align: "left",
					useHTML: true,
					text: '<span class="sltp-grippy upper"></span>'
				},
				id: "sl-plotline"
			});

			chart.yAxis[0].addPlotLine({
				value: tp, // orig: max
				color: "green",
				width: 2,
				yAxis: OPT.MAIN.axis,
				label: {
					align: "left",
					useHTML: true,
					text: '<span class="sltp-grippy lower"></span>'
				},
				id: "tp-plotline"
			});
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
	width: 32px;
	height: 16px;
	display: inline-block;
	overflow: hidden;
	line-height: 5px;
	padding:4px 3px;
	cursor: move;
	vertical-align: top;
	font-size: 18px;
	font-family: sans-serif;
	letter-spacing: 2px;
	color: white;
	background-color: red;
}
span.sltp-grippy::after {
	content: '::::';
}
span.sltp-grippy.upper {
	background-color: red;
}
span.sltp-grippy.lower {
	background-color: green;
}
</style>