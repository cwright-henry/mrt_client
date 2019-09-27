<template>
	<div class="mrt-senfit">
		<div class="mrt-senfit--controls">
			<div class="mrt-senfit--controls__proctype">
				<v-select
					v-model="proctype"
					:items="proctypes"
					:loading="isFittingTS || isLoadingTS"
					dense
					box
					hide-details
					flat
					color="#ce93d8"
					background-color="#323232"
					label="Fit Process"
				></v-select>
			</div>
			<div class="mrt-senfit--controls__auto-fit">
				<v-switch v-model="autoFit" color="#2196F3" hide-details label="Auto Fit"></v-switch>
			</div>
		</div>
		<div class="mrt-senfit--data">
			<div class="mrt-senfit--data-graph">
				<mrt-fitchart @dateRangeChange="setDateRange"></mrt-fitchart>
			</div>
			<div class="mrt-senfit--data-params">
				<mrt-parameters />
			</div>
		</div>

		<div class="mrt-senfit--residuals">
			<div class="mrt-senfit--residuals-graphs">
				<div class="mrt-senfit--residuals-graphs__header">
					<h3>Residuals</h3>
					<div class="mrt-senfit--residuals-graphs__header-legend">
						<div>
							<div class="mrt-circle selected"></div>
							<div>Selection</div>
						</div>
						<div>
							<div class="mrt-circle full"></div>
							<div>Full</div>
						</div>
					</div>
					<div>
						<v-switch v-model="aggregator" color="#2196F3" hide-details label="Full vs Selection"></v-switch>
					</div>
				</div>
				<div>
					<mrt-risdualschart :ts="strategy.fit.resid" :name="strategy.name"></mrt-risdualschart>
				</div>
			</div>
			<div class="mrt-senfit--residuals-graphs__histogram">
				<h3>
					Histogram
					<span>(Capped at 3 STD)</span>
				</h3>
				<mrt-histogramchart />
			</div>
		</div>
	</div>
</template>

<script>
import mrtParameters from "./FitParameters";
import mrtFitchart from "./FitChart";
import mrtRisdualschart from "./FitRisdualsChart";
import mrtHistogramchart from "./FitHistogramChart";
import { mapState, mapGetters } from "vuex";

export default {
	name: "MRT_FIT_PROCESS",
	data() {
		return {
			autoFit: true
		};
	},
	watch: {
		async autoFit(fit) {
			if (fit) {
				await this.$store.dispatch("fit/fit");
			}
		}
	},
	components: {
		mrtParameters,
		mrtFitchart,
		mrtRisdualschart,
		mrtHistogramchart
	},
	computed: {
		...mapState("fit", [
			"strategy",
			"isFittingTS",
			"isLoadingTS",
			"isSavingFit",
			"proctypes"
		]),
		...mapGetters("strategies", ["findStrategy"]),
		proctype: {
			get() {
				return this.$store.state.fit.proctype;
			},

			async set(value) {
				await this.$store.dispatch("fit/setProcType", value);
			}
		},
		aggregator: {
			get() {
				return this.$store.state.fit.showFull;
			},

			set(value) {
				this.$store.commit("fit/setShowFull", value);
			}
		}
	},
	methods: {
		async setDateRange(dates) {
			if (
				!isNaN(dates.startDate) &&
				!isNaN(dates.endDate) &&
				this.autoFit
			) {
				this.$store.commit("fit/setStartDate", dates.startDate);
				this.$store.commit("fit/setEndDate", dates.endDate);
				await this.$store.dispatch("fit/fit");
			}
		},

		toggle() {
			this.$refs["fullscreen"].toggle();
		}
	}
};
</script>

<style lang="less">
.mrt-senfit {
	background-color: #252525;
	padding: 16px;
	.mrt-senfit--controls {
		display: flex;
		justify-content: space-between;
		padding: 8px;
		margin: 0 0 16px;
		.v-select__selection {
			color: #ce93d8;
		}
		.mrt-senfit--controls__proctype {
			max-width: 320px
		}
	}
	.mrt-senfit--data {
		display: flex;
		.mrt-senfit--data-graph {
			width: calc(100% - 330px);
			border-radius: 4px;
		}
		.mrt-senfit--data-params {
			width: 330px;
			background-color: #2e2e2e;
		}
	}
	.mrt-senfit--residuals {
		margin: 24px 0 0 0;
		display: flex;
		.mrt-senfit--residuals-graphs {
			display: flex;
			flex-direction: column;
			width: calc(100% - 330px);
			.mrt-senfit--residuals-graphs__header {
				display: flex;
				justify-content: space-between;
				margin: 0 32px 0 8px;
				align-items: baseline;
				font-weight: 300;
				h3 {
					font-weight: 300;
					font-size: 16px;
					color: #e0e0e0;
					margin: 0 0 0 8px;
					text-transform: uppercase;
				}
			}
			.mrt-senfit--residuals-graphs__header-legend {
				display: flex;
				> div {
					display: flex;
					align-items: center;
				}
				> div:nth-child(1) {
					margin: 0 32px 0 0;
				}
				.mrt-circle {
					width: 11px;
					height: 11px;
					background-color: #2196f3;
					margin: 0 5px 0 0;
					border-radius: 50%;
					&.full {
						background-color: #ffeb3b;
					}
				}
			}
		}
		.mrt-senfit--residuals-graphs__histogram {
			width: 330px;
			margin: 20px 0 0 0;
			h3 {
				font-weight: 300;
				font-size: 16px;
				color: #e0e0e0;
				margin: 0 0 0 16px;
				text-transform: uppercase;
				span {
					font-size: 11px;
					margin: 0 0 0 8px;
				}
			}
		}
	}
}

@media screen and (max-width: 600px) {
}
</style>
