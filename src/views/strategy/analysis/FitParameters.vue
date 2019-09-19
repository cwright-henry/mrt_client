<template>
	<div class="mrt-fitparams">
		<div class="mrt-fitparams--section">
			<div class="mrt-fitparams--section__header">
				<label>Parameters</label>
				<div>Selection</div>
				<div>Full</div>
			</div>
			<div class="mrt-fitparams--section__row">
				<label class="input-param">
					<span>Kappa</span>
					<v-icon
						:class="userKappa !== null ? 'on' : 'off'"
					>{{userKappa !== null ? 'lock' : 'lock_open'}}</v-icon>
				</label>
				<div v-if="isFittingTS">...</div>
				<div v-else>
					<v-menu
						left
						v-model="kappaMenu"
						offset-y
						:close-on-content-click="false"
						origin="top right"
						transition="scale-transition"
					>
						<span
							class="mrt-fitparams--section__row-dyna"
							:class="userKappa !== null ? 'on' : 'off'"
							slot="activator"
						>{{strategy.fit.kappa | number}}</span>
						<div class="mrt-text-field">
							<v-text-field
								v-model="kappa"
								:append-icon="'refresh'"
								:loading="isFittingTS"
								:disabled="isFittingTS"
								:error-messages="kappaErrors"
								label="kappa"
								color="#FFEB3B"
								background-color="#484848"
								box
								clearable
								maxlength="10"
								placeholder="Fix Kappa"
								@keyup.enter="fixKappa"
								@click:clear="resetKappa"
								@click:append="fixKappa"
							></v-text-field>
						</div>
					</v-menu>
				</div>
				<div v-if="isLoadingTS">...</div>
				<div v-else>{{strategy.fit.kappa_full | number}}</div>
			</div>
			<div class="mrt-fitparams--section__row">
				<label class="input-param">
					<span>Sigma</span>
					<v-icon
						:class="userSigma !== null ? 'on' : 'off'"
					>{{userSigma !== null ? 'lock' : 'lock_open'}}</v-icon>
				</label>
				<div v-if="isFittingTS">...</div>
				<div v-else>
					<v-menu
						left
						v-model="sigmaMenu"
						offset-y
						:close-on-content-click="false"
						origin="top right"
						transition="scale-transition"
					>
						<span
							class="mrt-fitparams--section__row-dyna"
							:class="userSigma !== null ? 'on' : 'off'"
							slot="activator"
						>{{strategy.fit.sigma | number}}</span>
						<div class="mrt-text-field">
							<v-text-field
								v-model="sigma"
								:append-icon="'refresh'"
								:loading="isFittingTS"
								:disabled="isFittingTS"
								:error-messages="sigmaErrors"
								label="sigma"
								color="#4FC3F7"
								background-color="#484848"
								box
								clearable
								maxlength="10"
								placeholder="Fix Sigma"
								@keyup.enter="fixSigma"
								@click:clear="resetSigma"
								@click:append="fixSigma"
							></v-text-field>
						</div>
					</v-menu>
				</div>
				<div v-if="isLoadingTS">...</div>
				<div v-else>{{strategy.fit.sigma_full | number}}</div>
			</div>
			<div class="mrt-fitparams--section__row">
				<label class="input-param">
					<span>Theta</span>
					<v-icon
						:class="userTheta !== null ? 'on' : 'off'"
					>{{userTheta !== null ? 'lock' : 'lock_open'}}</v-icon>
				</label>
				<div v-if="isFittingTS">...</div>
				<div v-else>
					<v-menu
						left
						v-model="thetaMenu"
						offset-y
						:close-on-content-click="false"
						origin="top right"
						transition="scale-transition"
					>
						<span
							class="mrt-fitparams--section__row-dyna"
							:class="userTheta !== null ? 'on' : 'off'"
							slot="activator"
						>{{strategy.fit.theta | number}}</span>
						<div class="mrt-text-field">
							<v-text-field
								v-model="theta"
								:append-icon="'refresh'"
								:loading="isFittingTS"
								:disabled="isFittingTS"
								:error-messages="thetaErrors"
								label="theta"
								color="#4FC3F7"
								background-color="#484848"
								box
								clearable
								maxlength="10"
								placeholder="Fix Theta"
								@keyup.enter="fixTheta"
								@click:clear="resetTheta"
								@click:append="fixTheta"
							></v-text-field>
						</div>
					</v-menu>
				</div>
				<div v-if="isLoadingTS">...</div>
				<div v-else>{{strategy.fit.theta_full | number}}</div>
			</div>
			<div class="mrt-fitparams--section__row" v-if="proctype === 'hypOU'">
				<label class="input-param">
					<span>Beta</span>
					<v-icon :class="userBeta !== null ? 'on' : 'off'">{{userBeta !== null ? 'lock' : 'lock_open'}}</v-icon>
				</label>
				<div v-if="isFittingTS">...</div>
				<div v-else>
					<v-menu
						left
						v-model="betaMenu"
						offset-y
						:close-on-content-click="false"
						origin="top right"
						transition="scale-transition"
					>
						<span
							class="mrt-fitparams--section__row-dyna"
							:class="userBeta !== null ? 'on' : 'off'"
							slot="activator"
						>{{strategy.fit.nbeta | number}}</span>
						<div class="mrt-text-field">
							<v-text-field
								v-model="beta"
								:append-icon="'refresh'"
								:loading="isFittingTS"
								:disabled="isFittingTS"
								:error-messages="betaErrors"
								label="Beta"
								color="#4FC3F7"
								background-color="#484848"
								box
								clearable
								maxlength="1"
								placeholder="Fix Beta"
								@keyup.enter="fixBeta"
								@click:clear="resetBeta"
								@click:append="fixBeta"
							></v-text-field>
						</div>
					</v-menu>
				</div>
				<div v-if="isLoadingTS">...</div>
				<div v-else>{{strategy.fit.nbeta_full | number}}</div>
			</div>
		</div>
		<div class="mrt-fitparams--section">
			<div class="mrt-fitparams--section__header">
				<label>Goodness of Fit</label>
				<div>Selection</div>
				<div>Full</div>
			</div>
			<div class="mrt-fitparams--section__row">
				<label>ADF Stat</label>
				<div v-if="isFittingTS">...</div>
				<div v-else>{{strategy.fit.adf_stat | number}}</div>
				<div v-if="isLoadingTS">...</div>
				<div v-else>{{strategy.fit.adf_stat_full | number}}</div>
			</div>
			<div class="mrt-fitparams--section__row">
				<label>ADF Sig Level</label>
				<div v-if="isFittingTS">...</div>
				<div v-else>{{strategy.fit.sig_lev}}</div>
				<div v-if="isLoadingTS">...</div>
				<div v-else>{{strategy.fit.sig_lev_full}}</div>
			</div>
			<div class="mrt-fitparams--section__row">
				<label>P value</label>
				<div v-if="isFittingTS">...</div>
				<div v-else>{{strategy.fit.p_val | number}}</div>
				<div v-if="isLoadingTS">...</div>
				<div v-else>{{strategy.fit.p_val_full | number}}</div>
			</div>
		</div>
		<div class="mrt-fitparams--section">
			<div class="mrt-fitparams--section__header">
				<label>Residuals</label>
				<div>Selection</div>
				<div>Full</div>
			</div>
			<div class="mrt-fitparams--section__row">
				<label>
					R
					<sup>2</sup>
				</label>
				<div v-if="isFittingTS">...</div>
				<div v-else>{{strategy.fit.R2 | number }}</div>
				<div v-if="isLoadingTS">...</div>
				<div v-else>{{strategy.fit.R2_full | number }}</div>
			</div>
			<div class="mrt-fitparams--section__row">
				<label>Mean</label>
				<div v-if="isFittingTS">...</div>
				<div v-else>{{strategy.fit.resid_mean | number }}</div>
				<div v-if="isLoadingTS">...</div>
				<div v-else>{{strategy.fit.resid_mean_full | number }}</div>
			</div>
			<div class="mrt-fitparams--section__row">
				<label>Std</label>
				<div v-if="isFittingTS">...</div>
				<div v-else>{{strategy.fit.resid_std | number }}</div>
				<div v-if="isLoadingTS">...</div>
				<div v-else>{{strategy.fit.resid_std_full | number }}</div>
			</div>
			<div class="mrt-fitparams--section__row">
				<label>Skew</label>
				<div v-if="isFittingTS">...</div>
				<div v-else>{{strategy.fit.resid_skew | number }}</div>
				<div v-if="isLoadingTS">...</div>
				<div v-else>{{strategy.fit.resid_skew_full | number }}</div>
			</div>
			<div class="mrt-fitparams--section__row">
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
import { mapState } from "vuex";

const isNumber = /^(-)?(\d+)?((\.)?(\d+)?)?$/;

export default {
	data() {
		return {
			kappaMenu: false,
			sigmaMenu: false,
			thetaMenu: false,
			betaMenu: false,
			kappa: this.$store.state.fit.userKappa,
			sigma: this.$store.state.fit.userSigma,
			theta: this.$store.state.fit.userTheta,
			beta: this.$store.state.fit.userBeta,
			kappaErrors: [],
			sigmaErrors: [],
			thetaErrors: [],
			betaErrors: [],
			tsRange: this.$store.state.fit.range,
			tsAvg: this.$store.state.fit.avg
		};
	},
	watch: {
		kappa(value) {
			this.kappaErrors = [];
			if (value !== "" && value !== null) {
				if (value === "-") {
					this.kappaErrors.push("Must be positive!");
					return;
				}

				if (!isNumber.test(value)) {
					this.kappaErrors.push("Not a number!");
					return;
				}

				let t = parseFloat(value);
				if (t < 0.001 || t > 100) {
					this.kappaErrors.push("Must be between 0.001 and 100");
					return;
				}
			}
		},
		sigma(value) {
			this.sigmaErrors = [];
			if (value !== "" && value !== null) {
				if (!isNumber.test(value)) {
					this.sigmaErrors.push("Not a number!");
					return;
				}

				let t = parseFloat(value);
				if (t < 0.001 || t > this.sigmaMax) {
					this.sigmaErrors.push(
						`Must be between 0.001 and ${this.$options.filters.number(
							this.sigmaMax
						)}`
					);
					return;
				}
			}
		},
		theta(value) {
			this.thetaErrors = [];
			if (value !== "" && value !== null) {
				if (!isNumber.test(value)) {
					this.thetaErrors.push("Not a number!");
					return;
				}

				let t = parseFloat(value);
				if (t < this.thetaMin || t > this.thetaMax) {
					this.thetaErrors.push(
						`Must be between ${this.$options.filters.number(
							this.thetaMin
						)} and ${this.$options.filters.number(this.thetaMax)}`
					);
					return;
				}
			}
		},
		beta(value) {
			this.betaErrors = [];
			if (value !== "" && value !== null) {
				if (!isNumber.test(value)) {
					this.betaErrors.push("Not a number!");
					return;
				}

				let t = parseInt(value);
				if (t !== 1 && t !== 2) {
					this.betaErrors.push("Must be either 1 or 2");
					return;
				}
			}
		}
	},
	computed: {
		...mapState("fit", [
			"strategy",
			"proctype",
			"isFittingTS",
			"isLoadingTS",
			"isSavingFit",
			"userKappa",
			"userTheta",
			"userSigma",
			"userBeta",
			"range",
			"avg"
		]),
		thetaMin() {
			return this.avg - 2 * this.range;
		},
		thetaMax() {
			return this.avg + 2 * this.range;
		},
		sigmaMax() {
			return this.range;
		}
	},
	methods: {
		resetKappa() {
			const isDirty = this.userKappa !== null;
			this.kappaMenu = false;
			this.$store.commit("fit/setKappa", null);
			if (isDirty) {
				this.fit();
			}
		},

		resetSigma() {
			const isDirty = this.userSigma !== null;
			this.sigmaMenu = false;
			this.$store.commit("fit/setSigma", null);
			if (isDirty) {
				this.fit();
			}
		},

		resetTheta() {
			const isDirty = this.userTheta !== null;
			this.thetaMenu = false;
			this.$store.commit("fit/setTheta", null);
			if (isDirty) {
				this.fit();
			}
		},

		resetBeta() {
			const isDirty = this.userBeta !== null;
			this.betaMenu = false;
			this.$store.commit("fit/setBeta", null);
			if (isDirty) {
				this.fit();
			}
		},

		fixKappa() {
			if (
				this.kappaErrors.length === 0 &&
				this.kappa !== null &&
				this.kappa !== ""
			) {
				this.kappaMenu = false;
				this.$store.commit("fit/setKappa", this.kappa);
				this.fit().catch(() => {
					this.$store.commit("fit/setKappa", null);
				});
			}
		},

		fixSigma() {
			if (
				this.sigmaErrors.length === 0 &&
				this.sigma !== null &&
				this.sigma !== ""
			) {
				this.sigmaMenu = false;
				this.$store.commit("fit/setSigma", this.sigma);
				this.fit().catch(() => {
					this.$store.commit("fit/setSigma", null);
				});
			}
		},

		fixTheta() {
			if (
				this.thetaErrors.length === 0 &&
				this.theta !== null &&
				this.theta !== ""
			) {
				this.thetaMenu = false;
				this.$store.commit("fit/setTheta", this.theta);
				this.fit().catch(() => {
					this.$store.commit("fit/setTheta", null);
				});
			}
		},

		fixBeta() {
			if (
				this.betaErrors.length === 0 &&
				this.beta !== null &&
				this.beta !== ""
			) {
				this.betaMenu = false;
				this.$store.commit("fit/setBeta", this.beta);
				this.fit().catch(() => {
					this.$store.commit("fit/setBeta", null);
				});
			}
		},

		async fit() {
			await this.$store.dispatch("fit/fit", {});
			await this.$store.dispatch("fit/loadSims", {});
		}
	}
};
</script>

<style lang="less">
.mrt-text-field {
	.v-input__slot {
		margin-bottom: 0px !important;
	}
	.v-text-field__details {
		display: none;
		margin-bottom: 0px !important;
	}
	.error--text {
		background-color: #484848;
		color: #ff7043;
		.v-text-field__details {
			display: block;
			margin-bottom: 8px !important;
		}
		.v-input__slot {
			margin-bottom: 8px !important;
		}
	}
}
.mrt-fitparams {
	background-color: #2e2e2e;
	padding: 8px 12px;
	border-radius: 4px;
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	height: 100%;
	.mrt-fitparams--section {
		label {
			width: 120px;
			color: #fff;
			font-size: 13px;
			&.input-param {
				display: flex;
				justify-content: space-between;
				align-items: center;
				.v-icon {
					font-size: 18px !important;
					color: #e0e0e0;
					margin: 0 8px 0 0;
					&.on {
						color: #2196f3;
					}
				}
			}
		}
		.mrt-fitparams--section__header {
			text-transform: uppercase;
			font-size: 12px;
			color: #f3e5f5;
			border-bottom: 1px solid #424242;
			padding: 0 0 2px;
			margin: 0 0 4px;
			font-weight: 300;
			display: flex;
			> div {
				flex: 1;
				text-align: right;
			}
		}
		.mrt-fitparams--section__row {
			display: flex;
			margin: 0 0 4px 0;
			padding: 0 0 2px 4px;
			align-items: center;
			> div {
				flex: 1;
				text-align: right;
			}
			.mrt-fitparams--section__row-dyna {
				background-color: #fff;
				color: #121212;
				padding: 1px 4px 1px 4px;
				border-radius: 3px;
				min-width: 100px;
				display: inline-block;
				cursor: pointer;
				&.on {
					background-color: #bbdefb;
				}
			}
		}
	}
}
</style>
