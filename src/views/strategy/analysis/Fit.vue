<template>
	<div class="mrt-fit">
		<div class="panel-2">

			<div class="panel strategy">
				<div class="fit-manager">
					<v-select
						v-model="proctype"
						:items="proctypes"
						:loading="isFittingTS || isLoadingTS"
						dense
						box
						hide-details
						flat
						label="Fit Process">
					</v-select>
					<div class="auto-fit">
						<v-switch v-model="autoFit" color="#0091EA" hide-details label="Auto Fit"></v-switch>
					</div>
				</div>
				<div class="graph">
					<mrt-fitchart 
						@dateRangeChange="setDateRange">
					</mrt-fitchart>
				</div>
			</div>
			<div class="panel strategy-result">	
				<mrt-parameters/>
			</div>
		</div>

		<div class="panel residuals">
			<h3>Residuals</h3>
			<div class="graphs">
				<div class="residual-graph">
					<mrt-risdualschart 
						:ts="strategy.fit.resid"
						:name="strategy.name">
					</mrt-risdualschart>
				</div>
				<div class="histogram-graph">
					<mrt-histogramchart 
						:ts="strategy.fit.resid"
						:mean="strategy.fit.resid_mean"
						:std="strategy.fit.resid_std">
					</mrt-histogramchart>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import mrtParameters from './FitParameters'
import mrtFitchart from './FitChart'
import mrtRisdualschart from './FitRisdualsChart'
import mrtHistogramchart from './FitHistogramChart'
import {mapState, mapGetters} from 'vuex'

export default {
	name: 'MRT_FIT_PROCESS',
	data() {
		return {
			autoFit: true,
			proctypes: [
				{value: 'OU', text: 'Ornstein-Uhlenbeck'},
				{value: 'BMD', text: 'Brownian Motion with Drift', disabled: true},
				{value: 'GBMD', text: 'Geometric Brownian Motion with Drift', disabled: true},
				{value: 'hypOU', text: 'Hyperbolic Ornstein-Uhlenbeck', disabled: false},
				{value: 'CEV', text: 'Constant Elasticity of Variance', disabled: true},
			]
		}
	},
	watch: {
		async autoFit(fit) {
			if(fit) {
				await this.$store.dispatch('fit/fit');
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
		...mapState('fit', ['strategy', 'isFittingTS', 'isLoadingTS', 'isSavingFit']),
		...mapGetters('strategies', ['findStrategy']),
		proctype: {
			get() {
				return this.$store.state.fit.proctype;
			},

			async set(value) {
				this.$store.commit('fit/setProctype', value);
				await this.$store.dispatch('fit/fit')
			}
		}
	},
	methods: {

		async setDateRange(dates) {
			if(!isNaN(dates.startDate) && !isNaN(dates.endDate) && this.autoFit) {
				this.$store.commit('fit/setStartDate', dates.startDate);
				this.$store.commit('fit/setEndDate', dates.endDate);
				await this.$store.dispatch('fit/fit')	
			}
		},

		toggle () {
			this.$refs['fullscreen'].toggle()
		}
	}
}
</script>

<style lang="less">

.mrt-analysis {
	.fit-manager {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		margin: 0 16px 24px 4px;
		.v-select {
			max-width:400px;
			flex: initial;
		}
	}
}

@media screen and (max-width: 600px) {
}
</style>
