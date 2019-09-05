<template>
	<div>
		<div class="fittings parameters">
			<h1>Parameters</h1>
			<div class="underline"></div>
			<div class="header">
				<label></label>
				<div>Selection</div>
				<div>Full</div>
			</div>
			<div class="kappa">
				<label class="input-param">
					<span>Kappa</span>
					<v-menu
						bottom
						v-model="kappaMenu"
						offset-y
						:close-on-content-click="false"
						origin="center center"
						transition="scale-transition"
					>
						<v-icon
							slot="activator"
							class="elevation-3"
							:class="userKappa !== null ? 'on' : 'off'"
							size="16"
						>{{userKappa !== null ? 'lock' : 'lock_open'}}</v-icon>
						<div class="mrt-text-field">
							<v-text-field
								v-model="kappa"
								:append-icon="'refresh'"
								:loading="isFittingTS"
								:disabled="isFittingTS"
								:error-messages="kappaErrors"
								label="kappa"
								color="#4FC3F7"
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
				</label>
				<div v-if="isFittingTS">...</div>
				<div v-else>{{strategy.fit.kappa | number}}</div>
				<div v-if="isLoadingTS">...</div>
				<div v-else>{{strategy.fit.kappa_full | number}}</div>
			</div>
			<div class="sigma">
				<label class="input-param">
					<span>Sigma</span>
					<v-menu
						bottom
						v-model="sigmaMenu"
						offset-y
						:close-on-content-click="false"
						origin="center center"
						transition="scale-transition"
					>
						<v-icon
							slot="activator"
							class="elevation-3"
							:class="userSigma !== null ? 'on' : 'off'"
							size="16"
						>{{userSigma !== null ? 'lock' : 'lock_open'}}</v-icon>
						<div class="mrt-text-field">
							<v-text-field
								v-model="sigma"
								:append-icon="'refresh'"
								:loading="isFittingTS"
								:disabled="isFittingTS"
								:error-messages="sigmaErrors"
								label="sigma"
								color="#03A9F4"
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
				</label>
				<div v-if="isFittingTS">...</div>
				<div v-else>{{strategy.fit.sigma | number}}</div>
				<div v-if="isLoadingTS">...</div>
				<div v-else>{{strategy.fit.sigma_full | number}}</div>
			</div>
			<div class="theta">
				<label class="input-param">
					<span>Theta</span>
					<v-menu
						bottom
						v-model="thetaMenu"
						offset-y
						:close-on-content-click="false"
						origin="center center"
						transition="scale-transition"
					>
						<v-icon
							slot="activator"
							class="elevation-3"
							:class="userTheta !== null ? 'on' : 'off'"
							size="16"
						>{{userTheta !== null ? 'lock' : 'lock_open'}}</v-icon>
						<div class="mrt-text-field">
							<v-text-field
								v-model="theta"
								:append-icon="'refresh'"
								:loading="isFittingTS"
								:disabled="isFittingTS"
								:error-messages="thetaErrors"
								label="theta"
								color="#03A9F4"
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
				</label>
				<div v-if="isFittingTS">...</div>
				<div v-else>{{strategy.fit.theta | number}}</div>
				<div v-if="isLoadingTS">...</div>
				<div v-else>{{strategy.fit.theta_full | number}}</div>
			</div>
			<div class="beta" v-if="proctype === 'hypOU'">
				<label class="input-param">
					<span>Beta</span>
					<v-menu
						bottom
						v-model="betaMenu"
						offset-y
						:close-on-content-click="false"
						origin="center center"
						transition="scale-transition"
					>
						<v-icon
							slot="activator"
							class="elevation-3"
							:class="userBeta !== null ? 'on' : 'off'"
							size="16"
						>{{userBeta !== null ? 'lock' : 'lock_open'}}</v-icon>
						<div class="mrt-text-field">
							<v-text-field
								v-model="beta"
								:append-icon="'refresh'"
								:loading="isFittingTS"
								:disabled="isFittingTS"
								:error-messages="betaErrors"
								label="Beta"
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
				</label>
				<div v-if="isFittingTS">...</div>
				<div v-else>{{strategy.fit.nbeta | number}}</div>
				<div v-if="isLoadingTS">...</div>
				<div v-else>{{strategy.fit.nbeta_full | number}}</div>
			</div>
		</div>
		<div class="fittings goodness">
			<h1>Goodness of Fit</h1>
			<div class="underline"></div>
			<div class="header">
				<label></label>
				<div>Selection</div>
				<div>Full</div>
			</div>
			<div class="stat">
				<label>ADF Stat</label>
				<div v-if="isFittingTS">...</div>
				<div v-else>{{strategy.fit.adf_stat | number}}</div>
				<div v-if="isLoadingTS">...</div>
				<div v-else>{{strategy.fit.adf_stat_full | number}}</div>
			</div>
			<div class="sig-level">
				<label>ADF Sig Level</label>
				<div v-if="isFittingTS">...</div>
				<div v-else>{{strategy.fit.sig_lev}}</div>
				<div v-if="isLoadingTS">...</div>
				<div v-else>{{strategy.fit.sig_lev_full}}</div>
			</div>
			<div class="p-value">
				<label>P value</label>
				<div v-if="isFittingTS">...</div>
				<div v-else>{{strategy.fit.p_val | number}}</div>
				<div v-if="isLoadingTS">...</div>
				<div v-else>{{strategy.fit.p_val_full | number}}</div>
			</div>
		</div>
		<div class="fittings residuals">
			<h1>Residuals</h1>
			<div class="underline"></div>
			<div class="header">
				<label></label>
				<div>Selection</div>
				<div>Full</div>
			</div>
			<div class="r2">
				<label>
					R
					<sup>2</sup>
				</label>
				<div v-if="isFittingTS">...</div>
				<div v-else>{{strategy.fit.R2 | number }}</div>
				<div v-if="isLoadingTS">...</div>
				<div v-else>{{strategy.fit.R2_full | number }}</div>
			</div>
			<div class="mean">
				<label>Mean</label>
				<div v-if="isFittingTS">...</div>
				<div v-else>{{strategy.fit.resid_mean | number }}</div>
				<div v-if="isLoadingTS">...</div>
				<div v-else>{{strategy.fit.resid_mean_full | number }}</div>
			</div>
			<div class="std">
				<label>Std</label>
				<div v-if="isFittingTS">...</div>
				<div v-else>{{strategy.fit.resid_std | number }}</div>
				<div v-if="isLoadingTS">...</div>
				<div v-else>{{strategy.fit.resid_std_full | number }}</div>
			</div>
			<div class="skew">
				<label>Skew</label>
				<div v-if="isFittingTS">...</div>
				<div v-else>{{strategy.fit.resid_skew | number }}</div>
				<div v-if="isLoadingTS">...</div>
				<div v-else>{{strategy.fit.resid_skew_full | number }}</div>
			</div>
			<div class="kurt">
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
.mrt-analysis {
	.fittings {
		height: 100%;
		padding: 12px 0px;
		border-radius: 2px;
		h1 {
			font-weight: 300;
			font-size: 14px;
			margin: 0 0 2px 0;
			color: #fff;
			text-transform: uppercase;
		}
		> div {
			display: flex;
			margin: 0 0 4px 0;
			padding: 0 0 2px 4px;
			align-items: baseline;
			label {
				width: 120px;
				color: #fff;
				font-size: 13px;
				&.input-param {
					display: flex;
					justify-content: space-between;
					align-items: center;
					cursor: pointer;
					.v-icon {
						font-size: 14px !important;
						border-radius: 50%;
						background-color: #9c27b0;
						height: 24px;
						width: 24px;
						&.on {
							background-color: #ffea00;
							color: #212121;
						}
					}
				}
			}
			> div {
				flex: 1;
				text-align: right;
				&:nth-child(3) {
					font-size: 13px;
					color: var(--light-gray);
				}
			}
			&.header {
				padding: 2px 8px;
				margin: 0 -8px 0px -8px;
				border: none;
				&:nth-child(2) {
					color: #aeea00;
				}
			}
		}
		&.parameters {
			.underline {
				background: linear-gradient(0.25turn, #eeeeee, #6a1b9a 50%);
				height: 1px;
				padding: 0;
				margin: 0 0 8px 0;
			}
			.kappa label span {
				border: solid #6a1b9a;
				border-width: 0 0 0 2px;
				padding: 0 0 0 8px;
				line-height: 1.2;
			}
			.sigma label span {
				border: solid #8e24aa;
				border-width: 0 0 0 2px;
				padding: 0 0 0 8px;
				line-height: 1.2;
			}
			.theta label span {
				border: solid #ab47bc;
				border-width: 0 0 0 2px;
				padding: 0 0 0 8px;
				line-height: 1.2;
			}
			.beta label span {
				border: solid #ce93d8;
				border-width: 0 0 0 2px;
				padding: 0 0 0 8px;
				line-height: 1.2;
			}
		}
		&.goodness {
			.underline {
				background: linear-gradient(0.25turn, #eeeeee, #6a1b9a 50%);
				height: 1px;
				padding: 0;
				margin: 0 0 8px 0;
			}
			.stat label {
				border: solid #6a1b9a;
				border-width: 0 0 0 2px;
				padding: 0 0 0 8px;
				line-height: 1.2;
			}
			.sig-level label {
				border: solid #ab47bc;
				border-width: 0 0 0 2px;
				padding: 0 0 0 8px;
				line-height: 1.2;
			}
			.p-value label {
				border: solid #ce93d8;
				border-width: 0 0 0 2px;
				padding: 0 0 0 8px;
				line-height: 1.2;
			}
		}
		&.residuals {
			.underline {
				background: linear-gradient(0.25turn, #eeeeee, #6a1b9a 50%);
				height: 1px;
				padding: 0;
				margin: 0 0 8px 0;
			}
			.r2 label {
				border: solid #4a148c;
				border-width: 0 0 0 2px;
				padding: 0 0 0 8px;
				line-height: 1.2;
			}
			.std label {
				border: solid #7b1fa2;
				border-width: 0 0 0 2px;
				padding: 0 0 0 8px;
				line-height: 1.2;
			}
			.mean label {
				border: solid #9c27b0;
				border-width: 0 0 0 2px;
				padding: 0 0 0 8px;
				line-height: 1.2;
			}
			.skew label {
				border: solid #ba68c8;
				border-width: 0 0 0 2px;
				padding: 0 0 0 8px;
				line-height: 1.2;
			}
			.kurt label {
				border: solid #e1bee7;
				border-width: 0 0 0 2px;
				padding: 0 0 0 8px;
				line-height: 1.2;
			}
		}
	}
}
</style>
