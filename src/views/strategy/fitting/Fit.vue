<template>
	<div>
		<v-card>
			<v-toolbar dense flat>
				<v-toolbar-title class="mrt--header-color">{{isLoadingTS ? '...' : strategy.name}}</v-toolbar-title>
				<v-spacer></v-spacer>
			</v-toolbar>
			<div class="mrt-fit--process">
				<div>
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
				</div>
			</div>
			<v-divider></v-divider>
			<div class="mrt-fit--process-ou">
				<div class="panel">
					<div class="timestrategy">
						<mrt-fitchart 
							@startdate="setStartDate"
							@enddate="setEndDate">
						</mrt-fitchart>
					</div>
					<div class="result">
						<div class="fittings elevation-1">
							<div class="header">
								<label>Parameters</label>
								<div>Selection</div>
								<div>Full</div>
							</div>
							<div>
								<label>kappa</label>
								<div v-if="isFittingTS">...</div>
								<div v-else>{{strategy.fit.kappa | number}}</div>
								<div v-if="isLoadingTS">...</div>
								<div v-else>{{strategy.fit.kappa_full | number}}</div>
							</div>
							<div>
								<label>Sigma</label>
								<div v-if="isFittingTS">...</div>
								<div v-else>{{strategy.fit.sigma | number}}</div>
								<div v-if="isLoadingTS">...</div>
								<div v-else>{{strategy.fit.sigma_full | number}}</div>
							</div>
							<div>
								<label>Theta</label>
								<div v-if="isFittingTS">...</div>
								<div v-else>{{strategy.fit.theta | number}}</div>	
								<div v-if="isLoadingTS">...</div>
								<div v-else>{{strategy.fit.theta_full | number}}</div>
							</div>
						</div>
						<div class="fittings elevation-1">
							<div class="header">
								<label>Goodness of Fit</label>
								<div>Selection</div>
								<div>Full</div>
							</div>
							<div>
								<label>ADF Stat</label>
								<div v-if="isFittingTS">...</div>
								<div v-else>{{strategy.fit.adf_stat | number}}</div>
								<div v-if="isLoadingTS">...</div>
								<div v-else>{{strategy.fit.adf_stat_full | number}}</div>
							</div>
							<div>
								<label>ADF Sig Level</label>
								<div v-if="isFittingTS">...</div>
								<div v-else>{{strategy.fit.sig_lev}}</div>
								<div v-if="isLoadingTS">...</div>
								<div v-else>{{strategy.fit.sig_lev_full}}</div>
							</div>
							<div>
								<label>P value</label>
								<div v-if="isFittingTS">...</div>
								<div v-else>{{strategy.fit.p_val | number}}</div>
								<div v-if="isLoadingTS">...</div>
								<div v-else>{{strategy.fit.p_val_full | number}}</div>
							</div>
						</div>
						<div class="fittings elevation-1">
							<div class="header">
								<label>Residuals</label>
								<div>Selection</div>
								<div>Full</div>
							</div>
							<div>
								<label>R2</label>
								<div v-if="isFittingTS">...</div>
								<div v-else>{{strategy.fit.R2 | number }}</div>
								<div v-if="isLoadingTS">...</div>
								<div v-else>{{strategy.fit.R2_full | number }}</div>
							</div>
							<div>
								<label>Mean</label>
								<div v-if="isFittingTS">...</div>
								<div v-else>{{strategy.fit.resid_mean | number }}</div>
								<div v-if="isLoadingTS">...</div>
								<div v-else>{{strategy.fit.resid_mean_full | number }}</div>
							</div>
							<div>
								<label>Std</label>
								<div v-if="isFittingTS">...</div>
								<div v-else>{{strategy.fit.resid_std | number }}</div>
								<div v-if="isLoadingTS">...</div>
								<div v-else>{{strategy.fit.resid_std_full | number }}</div>
							</div>
							<div>
								<label>Skew</label>
								<div v-if="isFittingTS">...</div>
								<div v-else>{{strategy.fit.resid_skew | number }}</div>
								<div v-if="isLoadingTS">...</div>
								<div v-else>{{strategy.fit.resid_skew_full | number }}</div>
							</div>
							<div>
								<label>Kurtosis</label>
								<div v-if="isFittingTS">...</div>
								<div v-else>{{strategy.fit.resid_kurt | number }}</div>
								<div v-if="isLoadingTS">...</div>
								<div v-else>{{strategy.fit.resid_kurt_full | number }}</div>
							</div>
						</div>
					</div>
				</div>
				<h3>Residuals</h3>
				<div class="panel">
					<div class="timestrategy">
						<mrt-risdualschart 
							:ts="strategy.fit.resid"
							:name="strategy.name">
						</mrt-risdualschart>
					</div>
					<div class="histogram">
						<mrt-histogramchart 
							:ts="strategy.fit.resid"
							:mean="strategy.fit.resid_mean"
							:std="strategy.fit.resid_std">
						</mrt-histogramchart>
					</div>
				</div>
				<div class="actions">
					<v-btn outline small color="primary" :loading="isSavingFit" flat @click="save">Save Fitting</v-btn>
					<v-btn outline small color="primary" flat to="fit/sim">Run Simulations</v-btn>
					<v-btn outline small color="primary" flat @click="reset">Reset</v-btn>
				</div>
			</div>
		</v-card>
	</div>
</template>

<script>
import mrtFitchart from '@/components/FitChart'
import mrtRisdualschart from '@/components/RisdualsChart'
import mrtHistogramchart from '@/components/HistogramChart'
import mrtBreadcrumb from '@/components/Breadcrumb'
import {EventBus} from '@/events'
import {mapState, mapGetters} from 'vuex'

export default {
	data() {
		return {
			proctype: { value: 'OU', text: 'Ornstein-Uhlenbeck' },
			proctypes: [
				{value: 'OU', text: 'Ornstein-Uhlenbeck'},
				{value: 'BMD', text: 'Browian Motion with Drift', disabled: true},
				{value: 'GBMD', text: 'Geometric Browian Motion with Drift', disabled: true},
				{value: 'HUFT', text: 'Hyperbolic Ornstein-Uhlenbeck', disabled: true},
				{value: 'CEV', text: 'Constant Elasticity of Variance', disabled: true},
			]
		}
	},
	props: {
		id: {
			type: String,
			default: ''
		}
	},
	watch: {
		// Only triggered by route change - not refresh
    '$route' (to) {
			if(to.name == 'fit') {
				this.load()
			}
		}
	},
	activated() {
		this.load()
	},
	components: {
		mrtFitchart,
		mrtRisdualschart,
		mrtHistogramchart,
		mrtBreadcrumb
	},
	computed: {
		...mapState('fit', ['strategy', 'isFittingTS', 'isLoadingTS', 'isSavingFit']),
		...mapGetters('strategies', ['findStrategy'])
	},
	methods: {
		/**
		 * Look in cache, if not there then load strategy and
		 * Async load all stratgies
		 */
		async load() {
			if(this.id) {
				const strategy = this.findStrategy(this.id)
				if(strategy) {
					await this.$store.dispatch('fit/setStrategy', strategy)
				}
				else {
					await this.$store.dispatch('fit/loadStrategy', {id: this.id})
					this.$store.dispatch('strategies/load', {})
				}
			}
		},

		async reset() {
			await this.$store.dispatch('fit/reset')
		},

		async save() {
			const strategy = await this.$store.dispatch('fit/save', {id: this.id});
			this.$store.commit('strategies/updateStrategy', strategy);
			EventBus.$emit('api-strategy-save', `${strategy.name} Strategy Saved`);
			this.$router.push('/strategy')
		},

		async setStartDate(d) {
			this.$store.commit('fit/setStartDate', d)
			await this.$store.dispatch('fit/fit')
		},

		async setEndDate(d) {
			this.$store.commit('fit/setEndDate', d)
			await this.$store.dispatch('fit/fit')
		}
	}
}
</script>

<style scoped lang="less">
.mrt-fit--process {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin: 16px;
	> div {
		width:300px;
	}
}
.mrt-fit--process-ou {
	margin: 16px;
	h3 {
		font-size: 18px;
		font-weight:400;
		color: var(--light-gray); 
		margin: 0 0 16px 0;
	}
	.panel {
		display: flex;
		align-items: stretch;
		margin:0px 0 16px 0;
		.timestrategy {
			width: calc(100% - 300px);
		}
		.histogram {
			width: 300px;
		}
		.result {
			width: 300px;
			.fittings {
				margin: 0px 8px 12px 16px;
				background-color: rgba(0, 0, 0, 0.1);
				padding: 4px 8px;
				border-radius: 2px;
				h1 {
					font-weight: 400;
					font-size: 16px;
				}
				> div {
					display: flex;
					margin: 0 0 2px 0;
					align-items: baseline;
					label {
						width: 120px;
						color: var(--light-gray);
						font-size: 13px;
					}
					> div {
						flex: 1;
						text-align: right;
					}
					&.header {
						margin: 0;
						label {
							color:#FF9800;
							font-size: 16px;
						}
						> div {
							color: #FFE0B2;
							font-size: 12px;
						}
					}
				}
			}
		}
	}
	.actions {
		text-align: center;
		padding: 16px;
		background-color: rgba(0, 0, 0, 0.2);
		margin: 0 -16px;
		border-top: 1px solid #616161;
	}
}

@media screen and (max-width: 600px) {
}
</style>
