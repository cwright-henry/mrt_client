<template>
	<div class="mrt-simulation" @click="toggleSparkLine" :class="isSelected ? 'selected' : ''">
		<div class="stats">
			<div class="stat">
				<label>Min.</label>
				<span>{{min | number}}</span>
			</div>
			<div class="stat">
				<label>Max.</label>
				<span>{{max | number}}</span>
			</div>
			<div class="stat">
				<label>Mean</label>
				<span>{{mean | number}}</span>
			</div>
			<div class="stat">
				<label>Std.</label>
				<span>{{std | number}}</span>
			</div>
		</div>
		<div class="graph">
			<highcharts :options="options" ref="sparkchart"></highcharts>
		</div>
	</div>
</template>

<script>
import { stats } from "@/utils";
import { mapState } from "vuex";

const options = () => {
	return {
		chart: {
			height: 50,
			backgroundColor: "transparent",
			margin: 0
		},
		title: {
			text: null
		},
		credits: {
			enabled: false
		},
		boost: {
			useGPUTranslations: true
		},
		xAxis: {
			labels: {
				enabled: false
			},
			title: {
				text: null
			},
			startOnTick: false,
			endOnTick: false,
			tickPositions: [],
			lineWidth: 0,
			minorGridLineWidth: 1,
			type: "datetime",
			plotBands: [],
			visible: false
		},
		yAxis: {
			endOnTick: false,
			startOnTick: false,
			labels: {
				enabled: false
			},
			title: {
				text: null
			},
			gridLineColor: "#B0BEC5",
			gridLineWidth: "0.5px",
			tickPositions: [0],
			visible: false
		},
		legend: {
			enabled: false
		},
		tooltip: {
			enabled: false
		},
		plotOptions: {
			series: {
				dataGrouping: {
					enabled: true /* By default highstocks groups data into weeks using average over the week for large datasets */
				},
				states: {
					hover: {
						enabled: false
					}
				}
			},
			spline: {
				boostThreshold: 1,
				lineWidth: 0.5,
				color: "#ffeb3b"
			}
		}
	};
};

export default {
	data() {
		return {
			options: options(this),
			clicked: false,
			min: 0,
			max: 0,
			mean: 0,
			std: 0
		};
	},
	props: {
		sim: {
			type: Object,
			default: () => {
				return {
					id: null,
					data: []
				};
			}
		}
	},
	computed: {
		...mapState("fit", ["selectedSim"]),
		isSelected() {
			if (this.selectedSim) {
				return this.selectedSim === this.sim.id;
			}
			return false;
		}
	},
	watch: {
		"sim.id"() {
			this.draw();
		},
		/**
		 * If the strategy is reset then clear the card
		 */
		selectedSim(value) {
			if (value == null) {
				this.clearSeries();
			}
		}
	},
	methods: {
		draw() {
			this.clearSeries();
			if (this.sim.data.length) {
				const chart = this.$refs.sparkchart.chart;

				this.$nextTick(() => {
					const statistics = stats(this.sim.data);
					this.min = statistics.min;
					this.max = statistics.max;
					this.mean = statistics.mean;
					this.std = statistics.std;
					chart.addSeries({
						type: "spline",
						data: this.sim.data
					});
					chart.reflow();
					this.clicked = false;
					this.$emit("loaded", this.id);
				});
			}
		},

		clearSeries() {
			const chart = this.$refs.sparkchart.chart;
			while (chart.series.length > 0) {
				chart.series[0].remove(false);
			}
			this.min = 0;
			this.max = 0;
			this.mean = 0;
			this.std = 0;
		},

		toggleSparkLine() {
			this.$store.commit("fit/setSelectedSim", this.sim.id);
		}
	}
};
</script>

<style scoped lang="less">
.mrt-simulation {
	border-radius: 2px;
	border: 1px solid #757575;
	cursor: pointer;
	margin: 12px 24px;
	min-width: 250px;
	.stats {
		display: flex;
		justify-content: space-between;
		background-color: #424242;
		padding: 4px 8px;
		.stat {
			display: flex;
			flex-direction: column;
			label {
				color: var(--light-gray);
				font-size: 11px;
			}
			span {
				font-size: 11px;
				min-height: 18px;
			}
		}
	}
	.graph {
		padding: 8px;
		min-height: 60px;
	}
	&.selected {
		.stats {
			background-color: #ffeb3b;
			span {
				color: #121212;
			}
		}
	}
}
</style>