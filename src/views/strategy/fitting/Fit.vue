<template>
	<div>
		<div class="mrt-fit--details">
			<div class="selection">
				<v-text-field
					v-model="strategy.name"
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
						<div class="graph">
							<mrt-fitchart 
								@dateRangeChange="setDateRange">
							</mrt-fitchart>
						</div>
					</div>
					<div class="panel strategy-result elevation-1">	
						<div class="fittings">
							<div class="header">
								<label>Parameters</label>
								<div>Selection</div>
								<div>Full</div>
							</div>
							<div>
								<label class="input-param">
									<span>kappa</span>
									<v-menu 
										bottom 
										v-model="kappaMenu"
										offset-y
										:close-on-content-click="false"
										origin="center center"
										transition="scale-transition">
										<v-icon slot="activator" class="elevation-3" :class="userKappa ? 'on' : 'off'" size=16>{{userKappa ? 'lock' : 'lock_open'}}</v-icon>
										<div style="background-color:#37474F">
											<v-text-field
												v-model="kappa"
												:rules="[rules.isNumber]"
												:append-icon="'refresh'"
												:loading="isFittingTS"
												label="kappa"
												box
												hide-details
												clearable
												maxlength="10"
												placeholder="Fix Kappa"
												@keyup.enter="fixParamaters"
												@click:clear="clearKappa"
												@click:append="fixParamaters">
											</v-text-field>
										</div>
									</v-menu>
								</label>
								<div v-if="isFittingTS">...</div>
								<div v-else>{{strategy.fit.kappa | number}}</div>
								<div v-if="isLoadingTS">...</div>
								<div v-else>{{strategy.fit.kappa_full | number}}</div>
							</div>
							<div>
								<label class="input-param">
									<span>Sigma</span>
									<v-menu 
										bottom 
										v-model="sigmaMenu"
										offset-y
										:close-on-content-click="false"
										origin="center center"
										transition="scale-transition">
										<v-icon slot="activator" class="elevation-3" :class="userSigma ? 'on' : 'off'" size=16>{{userSigma ? 'lock' : 'lock_open'}}</v-icon>
										<div style="background-color:#37474F">
											<v-text-field
												v-model="sigma"
												:rules="[rules.isNumber]"
												:append-icon="'refresh'"
												:loading="isFittingTS"
												label="sigma"
												box
												hide-details
												clearable
												maxlength="10"
												placeholder="Fix Sigma"
												@keyup.enter="fixParamaters"
												@click:clear="clearSigma"
												@click:append="fixParamaters">
											</v-text-field>
										</div>
									</v-menu>
								</label>
								<div v-if="isFittingTS">...</div>
								<div v-else>{{strategy.fit.sigma | number}}</div>
								<div v-if="isLoadingTS">...</div>
								<div v-else>{{strategy.fit.sigma_full | number}}</div>
							</div>
							<div>
								<label class="input-param">
									<span>Theta</span>
									<v-menu 
										bottom 
										v-model="thetaMenu"
										offset-y
										:close-on-content-click="false"
										origin="center center"
										transition="scale-transition">
										<v-icon slot="activator" class="elevation-3" :class="userTheta ? 'on' : 'off'" size=16>{{userTheta ? 'lock' : 'lock_open'}}</v-icon>
										<div style="background-color:#37474F">
											<v-text-field
												v-model="theta"
												:rules="[rules.isNumber]"
												:append-icon="'refresh'"
												:loading="isFittingTS"
												label="theta"
												box
												hide-details
												clearable
												maxlength="10"
												placeholder="Fix Theta"
												@keyup.enter="fixParamaters"
												@click:clear="clearTheta"
												@click:append="fixParamaters">
											</v-text-field>
										</div>
									</v-menu>
								</label>
								<div v-if="isFittingTS">...</div>
								<div v-else>{{strategy.fit.theta | number}}</div>	
								<div v-if="isLoadingTS">...</div>
								<div v-else>{{strategy.fit.theta_full | number}}</div>
							</div>
						</div>
						<div class="fittings">
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
						<div class="fittings">
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
					<div class="header">
						<h3>Simulations</h3>
					</div>
					<div class="simulation-graph">
						<mrt-simchart
							@startdate="loadSimsForDate">
						</mrt-simchart>
					</div>
					<div class="controls">
						<div class="horizon">
							<v-select
								v-model="horizon"
								:items="horizonTypes"
								:loading="isLoadingSims"
								@change="horizonChange"
								dense
								box
								hide-details
								flat
								label="Horizon">
							</v-select>
						</div>
						<div class="play">
							<div class="thumb-slider">
								<v-slider
									v-model="slider"
									:thumb-size="28"
									label="Interval"
									:min=0.5
									:max=8
									step=0.5
									ticks="always"
									tick-size="1"
									thumb-label="always">
									<template slot="thumb-label" slot-scope="props">
										<span>
											{{ `${props.value}s` }}
										</span>
									</template>
								</v-slider>
							</div>
							<div class="mrt-fit--actions">
								<div>
									<v-btn small fab color="#0091EA" :loading="isLoadingSims" @click="autoPlaySims"><v-icon>{{isPlaying ? 'pause' : 'play_arrow'}}</v-icon></v-btn>
									<label>{{isPlaying ? 'Stop' : 'Animate'}}</label>
								</div>
							</div>
						</div>
						<div class="updates">
							<div class="mrt-fit--actions">
								<div>
									<v-btn small fab color="#0091EA" :loading="isLoadingSims" @click="reset"><v-icon>settings_backup_restore</v-icon></v-btn>
									<label>Reset</label>
								</div>
							</div>
							<div class="mrt-fit--actions">
								<div>
									<v-btn small fab color="#0091EA" :loading="isLoadingSims" @click="getMoreSims"><v-icon>autorenew</v-icon></v-btn>
									<label>New Sims</label>
								</div>
							</div>
						</div>
					</div>
					<div class="sparklines-graph">
						<mrt-sims-sparkline-chart v-for="sim in sims" :key="sim.id" :sim="sim" :isSelected="sim.id === selectedSim"></mrt-sims-sparkline-chart>
					</div>
				</div>
			</div>
		</fullscreen>
	</div>
</template>

<script>
import mrtSimsSparklineChart from '@/components/SimsSparklineChart'
import mrtFitchart from '@/components/FitChart'
import mrtRisdualschart from '@/components/RisdualsChart'
import mrtHistogramchart from '@/components/HistogramChart'
import mrtSimchart from '@/components/SimsChart'
import mrtBreadcrumb from '@/components/Breadcrumb'
import {EventBus} from '@/events'
import {mapState, mapGetters} from 'vuex'
import {tsExtremes, closestNeighbour, seedGen} from '@/utils/sorting'

export default {
	data() {
		return {
			kappaMenu: false,
			sigmaMenu: false,
			thetaMenu: false,
			fullscreen: false,
			isPlaying: false,
			isPlayingTimeout: '',
			slider: 5,
			kappa: this.$store.state.fit.userKappa,
			sigma: this.$store.state.fit.userSigma,
			theta: this.$store.state.fit.userTheta,
			rules: {
				isNumber: value => {
					if(value) {
						const pattern = /^((-)?(0|([1-9][0-9]*))(\.[0-9]+)?)$/
						return pattern.test(value) || 'Not a number!';
					}
					return true;
				}
			},
			proctype: { value: 'OU', text: 'Ornstein-Uhlenbeck' },
			proctypes: [
				{value: 'OU', text: 'Ornstein-Uhlenbeck'},
				{value: 'BMD', text: 'Brownian Motion with Drift', disabled: true},
				{value: 'GBMD', text: 'Geometric Brownian Motion with Drift', disabled: true},
				{value: 'HUFT', text: 'Hyperbolic Ornstein-Uhlenbeck', disabled: false},
				{value: 'CEV', text: 'Constant Elasticity of Variance', disabled: true},
			],
			horizon: { value: '780', text: '3 Years' },
			horizonTypes: [
				{value: '130', text: '6 months'},
				{value: '260', text: '1 year'},
				{value: '520', text: '2 years'},
				{value: '780', text: '3 years'},
				{value: '1300', text: '5 years'},
				{value: '-1', text: 'Match Base'}, /* Special Case to match slider and end of timeseries */
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
		mrtBreadcrumb,
		mrtSimchart,
		mrtSimsSparklineChart
	},
	computed: {
		...mapState('fit', ['strategy', 'isFittingTS', 'isLoadingTS', 'isLoadingSims','isSavingFit', 'userKappa', 'userSigma', 'userTheta', 'sims', 'selectedSim']),
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
			const extremes = tsExtremes(this.strategy.ts.data)
			await this.$store.dispatch('fit/loadSims', {
				value: extremes.maxValue,
				date: extremes.max,
				horizon: this.horizon.value
			})
		},

		async save() {
			const strategy = await this.$store.dispatch('fit/save', {id: this.id});
			this.$store.commit('strategies/updateStrategy', strategy);
			EventBus.$emit('api-strategy-save', `${strategy.name} Strategy Saved`);
			this.$router.push('/library')
		},

		async setDateRange(dates) {
			if(!isNaN(dates.startDate) && !isNaN(dates.endDate)) {
				await this.$store.dispatch('fit/fit', dates)	
				await this.$store.dispatch('fit/loadSims', {})
			}
		},

		async getMoreSims() {
			const extremes = tsExtremes(this.strategy.ts.data)
			await this.$store.dispatch('fit/loadSims', {
				seed: seedGen()
			})
		},

		async loadSimsForDate(date) {
			const closest = closestNeighbour(this.strategy.ts.data, date)
			await this.$store.dispatch('fit/loadSims', {
				value: closest[1],
				date: closest[0]
			})
		},

		async reset() {
			this.isPlaying = false;
			clearTimeout(this.isPlayingTimeout)
			this.horizon = {value: '780', text: '3 Years'}
			this.slider = 5;
			await this.$store.dispatch('fit/loadSims', {
				horizon: this.horizon.value,
				seed: seedGen()
			})
		},

		autoPlaySims() {
			this.isPlaying = !this.isPlaying
			if(this.isPlaying) {
				this.autoPlay();
			}
			else {
				clearTimeout(this.isPlayingTimeout)
			}
		},

		autoPlay() {
			this.$store.commit('fit/setNextSim');
			this.isPlayingTimeout = setTimeout(() => {
				this.autoPlay()
			}, this.slider * 1000)
		},

		clearKappa() {
			this.kappa = null;
			this.fixParamaters();
		},

		clearSigma() {
			this.sigma = null;
			this.fixParamaters();
		},

		clearTheta() {
			this.theta = null;
			this.fixParamaters();
		},

		async fixParamaters() {
			this.kappaMenu = false
			this.sigmaMenu = false
			this.thetaMenu = false
			const params = {
				kappa: this.kappa ? parseFloat(this.kappa) : null,
				sigma: this.sigma ? parseFloat(this.sigma) : null,
				theta: this.theta ? parseFloat(this.theta) : null
			}
			await this.$store.dispatch('fit/fixFit', params);
		},

		horizonChange() {
			this.$store.dispatch('fit/loadSims', {
				horizon: this.horizon
			})
		},

		toggle () {
			this.$refs['fullscreen'].toggle()
		}
	}
}
</script>

<style lang="less">

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
		.fittings {
			background-color:var(--bg-color);
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
