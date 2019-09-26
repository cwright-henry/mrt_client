<template>
	<highcharts :options="options" ref="histogram"></highcharts>
</template>

<script>
import { trimData, createBins } from "@/utils";
import { mapState } from "vuex";

const FULL_COLOR = "#FFEB3B";
const FULL_FILL_COLOR = "rgba(255,255,0, 0.2)";
const SELECTION_COLOR = "#BBDEFB";
const SELECTION_FILL_COLOR = "rgba(33,150,243, 0.6)";

const options = vm => {
	return {
		chart: {
			height: vm._props.height,
			zoomType: "x",
			backgroundColor: vm._props.backgroundColor,
			type: "bar",
			width: "280"
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
			split: true,
			distance: 30,
			padding: 5,
			formatter: function() {
				return `<span style="color:${this.series.color}">${
					this.series.name
				}</span>    <span>${this.y.toFixed(2)}</span>`;
			}
		},
		xAxis: {
			title: {
				text: ""
			},
			reversed: false
		},
		yAxis: {
			title: {
				text: ""
			},
			min: 0
		},
		plotOptions: {
			areaspline: {
				lineWidth: 1,
				marker: {
					enabled: false
				}
			}
		},
		series: []
	};
};

export default {
	props: {
		height: {
			type: Number,
			default: 320
		},
		backgroundColor: {
			type: String,
			default: "rgba(0, 0, 0, 0.0)"
		}
	},
	data() {
		return {
			options: options(this)
		};
	},
	computed: {
		...mapState("fit", [
			"strategy",
			"originalResids",
			"startDate",
			"endDate",
			"activeTab",
			"showFull"
		])
	},
	watch: {
		"strategy.fit"() {
			this.update();
		},
		originalResids() {
			this.update();
		},
		showFull() {
			this.toggleFull();
		},
		activeTab() {
			const chart = this.$refs.histogram.chart;
			chart.reflow();
		}
	},
	mounted() {
		this.update();
	},
	methods: {
		update() {
			if (this.strategy.fit.resid && this.originalResids) {
				const chart = this.$refs.histogram.chart;
				this.clearSeries();

				this.$nextTick(() => {
					const series = trimData(
						this.strategy.fit.resid,
						this.startDate,
						this.endDate
					);

					chart.addSeries({
						name: "Full",
						type: "areaspline",
						data: createBins(this.originalResids),
						color: FULL_COLOR,
						fillColor: FULL_FILL_COLOR,
						id: "full",
						visible: this.showFull
					});

					chart.addSeries({
						name: "Selection",
						data: createBins(series),
						type: "areaspline",
						color: SELECTION_COLOR,
						fillColor: SELECTION_FILL_COLOR,
						id: "selection"
					});

					chart.reflow();
				});
			}
		},

		toggleFull() {
			const chart = this.$refs.histogram.chart;
			const series = chart.get("full");
			if (this.showFull) {
				series.show();
			} else {
				series.hide();
			}
		},

		clearSeries() {
			const chart = this.$refs.histogram.chart;
			while (chart.series.length > 0) {
				chart.series[0].remove(false);
			}
		}
	}
};
</script>
