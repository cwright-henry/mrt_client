<template>
	<div>
		<div class="mrt-fit--details">
			<div class="selection">
				<v-text-field
					v-model="name"
					@keyup.native.enter="upload"
					label="Name"
					box
					hide-details
					ref="namefield"
					required>
				</v-text-field>
				<v-select
					v-model="proctype"
					:items="proctypes"
					:loading="isFittingTS || isLoadingTS"
					dense
					box
					hide-details
					return-object
					flat
					label="Fit Process">
				</v-select>
			</div>
			<div class="mrt-fit--actions">
				<div>
					<v-btn small fab color="#0091EA" :loading="isSavingFit" @click="save"><v-icon>cloud_upload</v-icon></v-btn>
					<label>Save Fitting</label>
				</div>
				<div>
					<v-btn small fab color="#0091EA" @click="toggle"><v-icon>fullscreen</v-icon></v-btn>
					<label>Full Screen</label>
				</div>
			</div>
		</div>
		<fullscreen :fullscreen.sync="fullscreen" ref="fullscreen">
			<div class="mrt-fit">
				<div class="panel-2">
					<div class="panel strategy elevation-1">
						<div class="auto-fit">
							<v-switch v-model="autoFit" color="#0091EA" hide-details label="Auto Fit"></v-switch>
						</div>
						<div class="graph">
							<mrt-fitchart 
								@dateRangeChange="setDateRange">
							</mrt-fitchart>
						</div>
					</div>
					<div class="panel strategy-result elevation-1">	
						<mrt-parameters/>
					</div>
				</div>
				<div class="panel residuals elevation-1">
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
				<div class="panel simulations elevation-1">
					<mrt-sims/>
				</div>
			</div>
		</fullscreen>
	</div>
</template>

<script>
import mrtParameters from './Parameters'
import mrtSims from './Sim'
import mrtFitchart from './FitChart'
import mrtRisdualschart from './RisdualsChart'
import mrtHistogramchart from './HistogramChart'
import mrtBreadcrumb from '@/components/Breadcrumb'
import {EventBus} from '@/events'
import {mapState, mapGetters} from 'vuex'

export default {
	data() {
		return {
			autoFit: true,
			fullscreen: false,
			proctype: { value: 'OU', text: 'Ornstein-Uhlenbeck' },
			proctypes: [
				{value: 'OU', text: 'Ornstein-Uhlenbeck'},
				{value: 'BMD', text: 'Brownian Motion with Drift', disabled: true},
				{value: 'GBMD', text: 'Geometric Brownian Motion with Drift', disabled: true},
				{value: 'HUFT', text: 'Hyperbolic Ornstein-Uhlenbeck', disabled: false},
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
		async autoFit(fit) {
			if(fit) {
				await this.$store.dispatch('fit/fit')	
				await this.$store.dispatch('fit/loadSims')
			}
		}
	},
	activated() {
		this.load()
	},
	components: {
		mrtParameters,
		mrtFitchart,
		mrtRisdualschart,
		mrtHistogramchart,
		mrtBreadcrumb,
		mrtSims
	},
	computed: {
		...mapState('fit', ['strategy', 'isFittingTS', 'isLoadingTS', 'isSavingFit']),
		...mapGetters('strategies', ['findStrategy']),
		name: {
			get () {
        return this.$store.state.fit.strategy.name
      },
      set (value) {
        this.$store.commit('fit/setStrategyName', value);
      }
		}
	},
	methods: {
		/**
		 * Look in cache, if not there then load strategy and
		 * Async load all stratgies
		 */
		async load() {
			if(this.id) {
				this.autoFit = true;
				const strategy = this.findStrategy(this.id)
				if(strategy) {
					await this.$store.dispatch('fit/setStrategy', strategy)
				}
				else {
					await this.$store.dispatch('fit/loadStrategy', {id: this.id})
					this.$store.dispatch('strategies/load', {})
				}

				await this.$store.dispatch('fit/loadSims')
			}
		},

		async save() {
			const strategy = await this.$store.dispatch('fit/save', {id: this.id});
			this.$store.commit('strategies/updateStrategy', strategy);
			EventBus.$emit('api-strategy-save', `${strategy.name} Strategy Saved`);
			this.$router.push('/library')
		},

		async setDateRange(dates) {
			if(!isNaN(dates.startDate) && !isNaN(dates.endDate) && this.autoFit) {
				this.$store.commit('fit/setStartDate', dates.startDate);
				this.$store.commit('fit/setEndDate', dates.endDate);
				await this.$store.dispatch('fit/fit')	
				await this.$store.dispatch('fit/loadSims')
			}
		},

		toggle () {
			this.$refs['fullscreen'].toggle()
		}
	}
}
</script>

<style lang="less">

.mrt-text-field {
	background-color: #37474F;
	.v-input__slot {
		margin-bottom: 0px !important;
	}
	.v-text-field__details {
		display:none;
		margin-bottom: 0px !important;
	}
	.error--text {
		.v-text-field__details {
			display:block;
			margin-bottom: 8px !important;
		}
		.v-input__slot {
			margin-bottom: 8px !important;
		}
	}
}

.fullscreen {
	padding: 0 12px;
}

.mrt-fit--details {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin: 16px 0;
	.selection {
		display:flex;
		> div {
			width:300px;
			&:nth-child(1) {
				margin: 0 16px 0 0;
			}
		}
	}
}
.mrt-fit--actions {
	display:flex;
	> div {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 0 16px;
		label {
			font-size:11px;
			font-weight: 300;
			color: #fff;
		}
	}
}

.mrt-fit {
	.auto-fit {
		display:flex;
		justify-content: flex-end;
		> div {
			flex: inherit;
			margin-top: -4px;
		}
	}
	.panel-2 {
		display:flex;
		margin: 12px 0;
		.panel {
			margin: 0;
		}
		.panel:nth-child(1)  {
			margin-right: 12px;
		}
	}
	.panel {
		border: solid #546E7A;
		border-width: 1px 1px 0px 1px;
		padding:12px;
		border-radius:2px;
		background-color: #455A64;
		margin: 12px 0;
		h3 {
			text-transform: uppercase;
			font-weight:400;
			margin: 0 0 16px 0;
			color: var(--light-gray)
		}
	}
	.strategy {
		width: calc(100% - 300px);
		.graph {
			background-color:var(--bg-color);
		}
	}
	.strategy-result {
		width:300px;
		> div {
			height: 100%;
			display:flex;
			flex-direction: column;
			justify-content: stretch;
		}
		.fittings {
			background-color:var(--bg-color);
			height:100%;
			padding: 8px 0px;
			border-radius: 2px;
			h1 {
				font-weight: 400;
				font-size: 16px;
			}
			> div {
				display: flex;
				margin: 0 0 4px 0;
				align-items: baseline;
				label {
					width: 120px;
					color: var(--light-gray);
					font-size: 13px;
					&.input-param {
						display:flex;
						justify-content: space-between;
						align-items: center;
						cursor: pointer;
						.v-icon {
							font-size: 14px !important;
							border-radius: 50%;
							background-color:#0091EA;
							height:24px;
							width:24px;
							&.on {
								background-color:#AEEA00;
								color:#424242;
							}
						}
					}
				} 
				> div {
					flex: 1;
					text-align: right;
					&:nth-child(3) {
						font-size:13px;
						color: var(--light-gray);
					}
				}
				&.header {
					padding: 2px 8px;
					margin: 0 -8px 0px -8px;
					label {
						color:#fff;
						font-size: 14px;
						font-weight: 400;
					}
					&:nth-child(1) {
						color:#AEEA00;
					}
				}
			}
		}
	}
	.residuals {
		.graphs {
			display: flex;
			.residual-graph {
				width: calc(100% - 300px);
			}
			.histogram-graph {
				width: 100px;
			}
		}
	}
	.simulations {
		.simulation-graph {
			width: calc(100% - 0px);
		}
		.controls {
			display: flex;
			justify-content: space-between;
			border-bottom: 1px solid #546E7A;
			padding: 0 16px 12px 16px;
			margin: 0 0 12px;
			.play {
				display: flex;
			}
			.horizon {
				width:180px;
			}
			.updates {
				display:flex;
			}
		}
		.sparklines-graph {
			display: flex;
			justify-content: center;
			flex-wrap: wrap;
		}
	}
}


@media screen and (max-width: 600px) {
}
</style>
