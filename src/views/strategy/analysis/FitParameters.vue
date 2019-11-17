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
					<v-icon v-if="userKappa !== null" class="on">mdi-lock</v-icon>
				</label>
				<div v-if="isFittingTS" class="mrt-fitparams--section__row-fitting">...</div>
				<div v-else>
					<v-menu
						left
						v-model="kappaMenu"
						offset-y
						:close-on-content-click="false"
						origin="top right"
						transition="scale-transition"
					>
						<template v-slot:activator="{ on }">
							<span
								class="mrt-fitparams--section__row-dyna"
								:class="userKappa !== null ? 'on' : 'off'"
								v-on="on"
							>{{strategy.fit.kappa | number}}</span>
						</template>
						<div class="mrt-text-field">
							<v-text-field
								v-model="kappa"
								:loading="isFittingTS"
								:disabled="isFittingTS"
								:error-messages="kappaErrors"
								label="Kappa"
								:color="color"
								:background-color="backrgoundColor"
								maxlength="10"
								ref="kappaInput"
								placeholder="Fix Kappa"
								@keyup.enter="fixKappa"
							></v-text-field>
							<div class="mrt-text-field--actions" @click="resetKappa">
								<v-btn icon color="white">
									<v-icon>mdi-close</v-icon>
								</v-btn>
								<div class="mrt-text-field--actions__text">Reset</div>
							</div>
						</div>
					</v-menu>
				</div>
				<div v-if="isLoadingTS">...</div>
				<div v-else>{{strategy.fit.kappa_full | number}}</div>
			</div>
			<div class="mrt-fitparams--section__row">
				<label class="input-param">
					<span>Sigma</span>
					<v-icon v-if="userSigma !== null" class="on">mdi-lock</v-icon>
				</label>
				<div v-if="isFittingTS" class="mrt-fitparams--section__row-fitting">...</div>
				<div v-else>
					<v-menu
						left
						v-model="sigmaMenu"
						offset-y
						:close-on-content-click="false"
						origin="top right"
						transition="scale-transition"
					>
						<template v-slot:activator="{ on }">
							<span
								class="mrt-fitparams--section__row-dyna"
								:class="userSigma !== null ? 'on' : 'off'"
								v-on="on"
							>{{strategy.fit.sigma | number}}</span>
						</template>
						<div class="mrt-text-field">
							<v-text-field
								v-model="sigma"
								:loading="isFittingTS"
								:disabled="isFittingTS"
								:error-messages="sigmaErrors"
								label="Sigma"
								:color="color"
								:background-color="backrgoundColor"
								ref="sigmaInput"
								maxlength="10"
								placeholder="Fix Sigma"
								@keyup.enter="fixSigma"
							></v-text-field>
							<div class="mrt-text-field--actions" @click="resetSigma">
								<v-btn icon color="white">
									<v-icon>mdi-close</v-icon>
								</v-btn>
								<div class="mrt-text-field--actions__text">Reset</div>
							</div>
						</div>
					</v-menu>
				</div>
				<div v-if="isLoadingTS">...</div>
				<div v-else>{{strategy.fit.sigma_full | number}}</div>
			</div>
			<div class="mrt-fitparams--section__row">
				<label class="input-param">
					<span>Theta</span>
					<v-icon v-if="userTheta !== null" class="on">mdi-lock</v-icon>
				</label>
				<div v-if="isFittingTS" class="mrt-fitparams--section__row-fitting">...</div>
				<div v-else>
					<v-menu
						left
						v-model="thetaMenu"
						offset-y
						:close-on-content-click="false"
						origin="top right"
						transition="scale-transition"
					>
						<template v-slot:activator="{ on }">
							<span
								class="mrt-fitparams--section__row-dyna"
								:class="userTheta !== null ? 'on' : 'off'"
								v-on="on"
							>{{strategy.fit.theta | number}}</span>
						</template>
						<div class="mrt-text-field">
							<v-text-field
								v-model="theta"
								:loading="isFittingTS"
								:disabled="isFittingTS"
								:error-messages="thetaErrors"
								label="Theta"
								:color="color"
								:background-color="backrgoundColor"
								ref="thetaInput"
								maxlength="10"
								placeholder="Fix Theta"
								@keyup.enter="fixTheta"
							></v-text-field>
							<div class="mrt-text-field--actions" @click="resetTheta">
								<v-btn icon color="white">
									<v-icon>mdi-close</v-icon>
								</v-btn>
								<div class="mrt-text-field--actions__text">Reset</div>
							</div>
						</div>
					</v-menu>
				</div>
				<div v-if="isLoadingTS">...</div>
				<div v-else>{{strategy.fit.theta_full | number}}</div>
			</div>
			<div class="mrt-fitparams--section__row" v-if="proctype === 'hypOU'">
				<label class="input-param">
					<span>Beta</span>
					<v-icon v-if="userBeta !== null" class="on">mdi-lock</v-icon>
				</label>
				<div v-if="isFittingTS" class="mrt-fitparams--section__row-fitting">...</div>
				<div v-else>
					<v-menu
						left
						v-model="betaMenu"
						offset-y
						:close-on-content-click="false"
						origin="top right"
						transition="scale-transition"
					>
						<template v-slot:activator="{ on }">
							<span
								class="mrt-fitparams--section__row-dyna"
								:class="userBeta !== null ? 'on' : 'off'"
								v-on="on"
							>{{strategy.fit.nbeta | number}}</span>
						</template>
						<div class="mrt-text-field">
							<v-text-field
								v-model="beta"
								:loading="isFittingTS"
								:disabled="isFittingTS"
								:error-messages="betaErrors"
								label="Beta"
								:color="color"
								:background-color="backrgoundColor"
								ref="betaInput"
								maxlength="1"
								placeholder="Fix Beta"
								@keyup.enter="fixBeta"
							></v-text-field>
							<div class="mrt-text-field--actions" @click="resetBeta">
								<v-btn icon color="white">
									<v-icon>mdi-close</v-icon>
								</v-btn>
								<div class="mrt-text-field--actions__text">Reset</div>
							</div>
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
				<label>Skewness</label>
				<div v-if="isFittingTS">...</div>
				<div v-else>{{strategy.fit.resid_skew | number }}</div>
				<div v-if="isLoadingTS">...</div>
				<div v-else>{{strategy.fit.resid_skew_full | number }}</div>
			</div>
			<div class="mrt-fitparams--section__row">
				<label>Kurtosis</label>
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
			// Menu toggles
			kappaMenu: false,
			sigmaMenu: false,
			thetaMenu: false,
			betaMenu: false,

			// Values
			kappa: this.$store.state.fit.userKappa,
			sigma: this.$store.state.fit.userSigma,
			theta: this.$store.state.fit.userTheta,
			beta: this.$store.state.fit.userBeta,

			// Errors
			kappaErrors: [],
			sigmaErrors: [],
			thetaErrors: [],
			betaErrors: [],

			// Validation
			tsRange: this.$store.state.fit.range,
			tsAvg: this.$store.state.fit.avg,

			// Props
			backrgoundColor: "transparent",
			color: "#FFF9C4",
			theme: false
		};
	},
	watch: {
		kappaMenu(shown) {
			if (shown) {
				setTimeout(() => this.focusControl(this.$refs.kappaInput), 100);
			} else {
				this.kappa = null;
			}
		},
		sigmaMenu(shown) {
			if (shown) {
				setTimeout(() => this.focusControl(this.$refs.sigmaInput), 100);
			} else {
				this.sigma = null;
			}
		},
		thetaMenu(shown) {
			if (shown) {
				setTimeout(() => this.focusControl(this.$refs.thetaInput), 100);
			} else {
				this.theta = null;
			}
		},
		betaMenu(shown) {
			if (shown) {
				setTimeout(() => this.focusControl(this.$refs.betaInput), 100);
			} else {
				this.beta = null;
			}
		},
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
		},

		/**
		 * Fix for focus when textfield is shown in a menu
		 * or dialog
		 */
		focusControl(control) {
			control.focus();
		}
	}
};
</script>

<style lang="less">
@lock-on: #fff9c4;

.mrt-text-field {
	display: flex;
	align-items: center;
	background-color: #484848;
	padding: 4px 8px;
	font-size: 14px;
	.v-input__slot {
		margin-bottom: 0px !important;
	}
	.v-text-field__details {
		display: none;
		margin-bottom: 0px !important;
	}
	.error--text {
		color: #f44336;
		.v-text-field__details {
			display: block;
			margin-bottom: 8px !important;
		}
		.v-input__slot {
			margin-bottom: 8px !important;
		}
	}
	.mrt-text-field--actions {
		display: flex;
		flex-direction: column;
		align-items: center;
		.mrt-text-field--actions__text {
			margin: -8px 0 0 0;
			font-weight: 400;
			font-size: 12px;
		}
	}
}
.mrt-fitparams {
	background-color: #2e2e2e;
	border: 1px solid #424242;
	padding: 8px 12px;
	border-radius: 4px;
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	height: 100%;
	font-size: 14px;
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
					font-size: 16px !important;
					margin: 0 8px 0 0;
					&.on {
						color: @lock-on;
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
			label {
				color: #fff9c4;
			}
		}
		.mrt-fitparams--section__row {
			display: flex;
			margin: 0 0 3px 0;
			padding: 0 0 2px 4px;
			align-items: center;
			> div {
				flex: 1;
				text-align: right;
			}
			.mrt-fitparams--section__row-dyna {
				background-color: #e0e0e0;
				padding: 1px 4px 1px 4px;
				border-radius: 3px;
				color: #121212;
				width: 100px;
				height: 22px;
				display: inline-block;
				cursor: pointer;
				white-space: nowrap;
				text-overflow: ellipsis;
				overflow: hidden;
				&.on {
					background-color: @lock-on;
				}
			}
			.mrt-fitparams--section__row-fitting {
				height: 24px;
			}
		}
	}
}
</style>
