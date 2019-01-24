<template>
	<div>
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
						<v-icon slot="activator" class="elevation-3" :class="userKappa !== null ? 'on' : 'off'" size=16>{{userKappa !== null ? 'lock' : 'lock_open'}}</v-icon>
						<div class="mrt-text-field">
							<v-text-field
								v-model="kappa"
								:append-icon="'refresh'"
								:loading="isFittingTS"
								:disabled="isFittingTS"
								:error-messages="kappaErrors"
								label="kappa"
								box
								clearable
								maxlength="10"
								placeholder="Fix Kappa"
								@keyup.enter="fixKappa"
								@click:clear="resetKappa"
								@click:append="fixKappa">
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
						<v-icon slot="activator" class="elevation-3" :class="userSigma !== null ? 'on' : 'off'" size=16>{{userSigma !== null ? 'lock' : 'lock_open'}}</v-icon>
						<div class="mrt-text-field">
							<v-text-field
								v-model="sigma"
								:append-icon="'refresh'"
								:loading="isFittingTS"
								:disabled="isFittingTS"
								:error-messages="sigmaErrors"
								label="sigma"
								box
								clearable
								maxlength="10"
								placeholder="Fix Sigma"
								@keyup.enter="fixSigma"
								@click:clear="resetSigma"
								@click:append="fixSigma">
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
						<v-icon slot="activator" class="elevation-3" :class="userTheta !== null ? 'on' : 'off'" size=16>{{userTheta !== null ? 'lock' : 'lock_open'}}</v-icon>
						<div class="mrt-text-field">
							<v-text-field
								v-model="theta"
								:append-icon="'refresh'"
								:loading="isFittingTS"
								:disabled="isFittingTS"
								:error-messages="thetaErrors"
								label="theta"
								box
								clearable
								maxlength="10"
								placeholder="Fix Theta"
								@keyup.enter="fixTheta"
								@click:clear="resetTheta"
								@click:append="fixTheta">
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
				<label>R<sup>2</sup></label>
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
				<label>Kurt</label>
				<div v-if="isFittingTS">...</div>
				<div v-else>{{strategy.fit.resid_kurt | number }}</div>
				<div v-if="isLoadingTS">...</div>
				<div v-else>{{strategy.fit.resid_kurt_full | number }}</div>
			</div>
		</div>
	</div>
</template>

<script>
import {mapState} from 'vuex'

const isNumber = /^(\-)?(\d+)?((\.)?(\d+)?)?$/

export default {
	data() {
		return {
			kappaMenu: false,
			sigmaMenu: false,
			thetaMenu: false,
			kappa: this.$store.state.fit.userKappa,
			sigma: this.$store.state.fit.userSigma,
			theta: this.$store.state.fit.userTheta,
			kappaErrors: [],
			sigmaErrors: [],
			thetaErrors: [],
			tsRange: this.$store.state.fit.range,
			tsAvg: this.$store.state.fit.avg
		}
	},
	watch: {
		kappa(value) {
			this.kappaErrors = []
			if(value !== '' && value !== null) {
				if(value === '-') {
					this.kappaErrors.push('Must be positive!')
					return;
				}

				if(!isNumber.test(value)) {
					this.kappaErrors.push('Not a number!')
					return;
				}

				let t = parseFloat(value)
				if(t < 0.001 || t > 1000) {
					this.kappaErrors.push('Must be between 0.001 and 1000')
					return
				}
			}
		},
		sigma(value) {
			this.sigmaErrors = []
			if(value !== '' && value !== null) {
				if(!isNumber.test(value)) {
					this.sigmaErrors.push('Not a number!')
					return;
				}

				let t = parseFloat(value)
				if(t < 0.001 || t > this.sigmaMax) {
					this.sigmaErrors.push(`Must be between 0.001 and ${this.$options.filters.number(this.sigmaMax)}`)
					return
				}
			}
		},
		theta(value) {
			this.thetaErrors = []
			if(value !== '' && value !== null) {
				if(!isNumber.test(value)) {
					this.thetaErrors.push('Not a number!')
					return;
				}

				let t = parseFloat(value)
				if(t < this.thetaMin || t > this.thetaMax) {
					this.thetaErrors.push(`Must be between ${this.$options.filters.number(this.thetaMin)} and ${this.$options.filters.number(this.thetaMax)}`)
					return
				}
			}
		}
	},
	computed: {
		...mapState('fit', ['strategy', 'isFittingTS', 'isLoadingTS', 'isSavingFit', 'userKappa', 'userTheta', 'userSigma', 'range', 'avg']),
		thetaMin() {
			return this.avg - (2 * this.range);
		},
		thetaMax() {
			return this.avg + (2 * this.range);
		},
		sigmaMax() {
			return this.range;
		}
	},
	methods: {
		resetKappa() {
			const isDirty = this.userKappa !== null
			this.kappaMenu = false;
			this.$store.commit('fit/setKappa', null);
			if(isDirty) {
				this.fit();
			}
		},

		resetSigma() {
			const isDirty = this.sigmaKappa !== null
			this.sigmaMenu = false;
			this.$store.commit('fit/setSigma', null);
			if(isDirty) {
				this.fit();
			}
		},

		resetTheta() {
			const isDirty = this.sigmaTheta !== null
			this.thetaMenu = false;
			this.$store.commit('fit/setTheta', null);
			if(isDirty) {
				this.fit();
			}
		},

		fixKappa() {
			if(this.kappaErrors.length === 0 && this.kappa !== null && this.kappa !== '') {
				this.kappaMenu = false;
				this.$store.commit('fit/setKappa', this.kappa);
				this.fit();
			}
		},

		fixSigma() {
			if(this.sigmaErrors.length === 0 && this.sigma !== null && this.sigma !== '') {
				this.sigmaMenu = false;
				this.$store.commit('fit/setSigma', this.sigma);
				this.fit();
			}
		},

		fixTheta() {
			if(this.thetaErrors.length === 0 && this.theta !== null && this.theta !== '') {
				this.thetaMenu = false;
				this.$store.commit('fit/setTheta', this.theta);
				this.fit();
			}
		},

		async fit() {
			await this.$store.dispatch('fit/fit', {});
			await this.$store.dispatch('fit/loadSims', {})
		}
	}
}
</script>

<style>

</style>
