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
					color="#90CAF9"
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
			<h3>
				Residuals
				<div class="radios">
					<v-radio-group v-model="aggregator" :column="false" :height="20">
						<v-radio color="#FFEB3B" value="selected" label="Selected"></v-radio>
						<v-radio color="#FFEB3B" value="full" label="Full"></v-radio>
						<v-radio color="#FFEB3B" value="diff" label="Both"></v-radio>
					</v-radio-group>
				</div>
			</h3>
			<div class="mrt-senfit--residuals-graphs">
				<div class="mrt-senfit--residuals-graphs__residuals">
					<mrt-risdualschart :ts="strategy.fit.resid" :aggregator="aggregator" :name="strategy.name"></mrt-risdualschart>
				</div>
				<div class="mrt-senfit--residuals-graphs__histogram">
					<mrt-histogramchart
						:ts="strategy.fit.resid"
						:mean="strategy.fit.resid_mean"
						:std="strategy.fit.resid_std"
					></mrt-histogramchart>
				</div>
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
			autoFit: true,
			aggregator: "selected",
			proctypes: [
				{ value: "OU", text: "Ornstein-Uhlenbeck" },
				{
					value: "BMD",
					text: "Brownian Motion with Drift",
					disabled: true
				},
				{
					value: "GBMD",
					text: "Geometric Brownian Motion with Drift",
					disabled: true
				},
				{
					value: "hypOU",
					text: "Hyperbolic Ornstein-Uhlenbeck",
					disabled: false
				},
				{
					value: "CEV",
					text: "Constant Elasticity of Variance",
					disabled: true
				}
			]
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
			"isSavingFit"
		]),
		...mapGetters("strategies", ["findStrategy"]),
		proctype: {
			get() {
				return this.$store.state.fit.proctype;
			},

			async set(value) {
				this.$store.commit("fit/setProctype", value);
				await this.$store.dispatch("fit/fit");
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
	.mrt-senfit--controls {
		display: flex;
		justify-content: space-between;
		padding: 8px;
		margin: 0 0 16px;
	}
	.mrt-senfit--data {
		display: flex;
		.mrt-senfit--data-graph {
			width: calc(100% - 330px);
			background-color: #404040;
			margin: 0 16px 0 0;
			border-radius: 4px;
		}
		.mrt-senfit--data-params {
			width: 330px;
		}
	}
	.mrt-senfit--residuals {
		background-color: #424242;
		margin: 16px 0 8px 0;
		border-radius: 4px;
		h3 {
			font-weight: 300;
			font-size: 22px;
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin: 0 0 0 8px;
		}
		.mrt-senfit--residuals-graphs {
			display: flex;
			.mrt-senfit--residuals-graphs__residuals {
				width: calc(100% - 330px);
			}
			.mrt-senfit--residuals-graphs__histogram {
				width: 330px;
			}
		}
	}
}

@media screen and (max-width: 600px) {
}
</style>
