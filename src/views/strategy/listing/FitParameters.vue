<template>
	<div class="mrt-sfp">
		<div class="mrt-sfp--proctype">
			<label>Fit Process</label>
			<div :class="{'mrt-sfp--notfitted': !isFitted}">{{fitProcess}}</div>
		</div>
		<div class="mrt-sfp--section">
			<div class="mrt-sfp--header">
				<label>Parameters</label>
				<div class="mrt-sfp--selection">Selection</div>
				<div class="mrt-sfp--full">Full</div>
			</div>
			<div class="mrt-sfp--item">
				<label class="mrt-sfp--item__dyna">
					<span>Kappa</span>
					<v-icon v-if="fit.userKappa != null">mdi-lock</v-icon>
				</label>
				<div class="mrt-sfp--selection">{{fit.kappa | number}}</div>
				<div class="mrt-sfp--full">{{fit.kappa_full | number}}</div>
			</div>
			<div class="mrt-sfp--item">
				<label class="mrt-sfp--item__dyna">
					<span>Sigma</span>
					<v-icon v-if="fit.userSigma != null">mdi-lock</v-icon>
				</label>
				<div class="mrt-sfp--selection">{{fit.sigma | number}}</div>
				<div class="mrt-sfp--full">{{fit.sigma_full | number}}</div>
			</div>
			<div class="mrt-sfp--item">
				<label class="mrt-sfp--item__dyna">
					<span>Theta</span>
					<v-icon v-if="fit.userTheta != null">mdi-lock</v-icon>
				</label>
				<div class="mrt-sfp--selection">{{fit.theta | number}}</div>
				<div class="mrt-sfp--full">{{fit.theta_full | number}}</div>
			</div>
			<div class="mrt-sfp--item" v-if="fit.proctype === 'hypOU'">
				<label class="mrt-sfp--item__dyna">
					<span>Beta</span>
					<v-icon v-if="fit.usernBeta != null">mdi-lock</v-icon>
				</label>
				<div class="mrt-sfp--selection">{{fit.nbeta | number}}</div>
				<div class="mrt-sfp--full">{{fit.nbeta_full | number}}</div>
			</div>
		</div>
		<div class="mrt-sfp--section">
			<div class="mrt-sfp--header">
				<label>Goodness of Fit</label>
				<div class="mrt-sfp--selection">Selection</div>
				<div class="mrt-sfp--full">Full</div>
			</div>
			<div class="mrt-sfp--item">
				<label>ADF Stat</label>
				<div class="mrt-sfp--selection">{{fit.adf_stat | number}}</div>
				<div class="mrt-sfp--full">{{fit.adf_stat_full | number}}</div>
			</div>
			<div class="mrt-sfp--item">
				<label>ADF Sig Level</label>
				<div class="mrt-sfp--selection">{{fit.sig_lev}}</div>
				<div class="mrt-sfp--full">{{fit.sig_lev_full}}</div>
			</div>
			<div class="mrt-sfp--item">
				<label>P value</label>
				<div class="mrt-sfp--selection">{{fit.p_val | number}}</div>
				<div class="mrt-sfp--full">{{fit.p_val_full | number}}</div>
			</div>
		</div>
		<div class="mrt-sfp--section">
			<div class="mrt-sfp--header">
				<label>Residuals</label>
				<div class="mrt-sfp--selection">Selection</div>
				<div class="mrt-sfp--full">Full</div>
			</div>
			<div class="mrt-sfp--item">
				<label>
					R
					<sup>2</sup>
				</label>
				<div class="mrt-sfp--selection">{{fit.R2 | number}}</div>
				<div class="mrt-sfp--full">{{fit.R2_full | number}}</div>
			</div>
			<div class="mrt-sfp--item">
				<label>Mean</label>
				<div class="mrt-sfp--selection">{{fit.resid_mean | number}}</div>
				<div class="mrt-sfp--full">{{fit.resid_mean_full | number}}</div>
			</div>
			<div class="mrt-sfp--item">
				<label>Std</label>
				<div class="mrt-sfp--selection">{{fit.resid_std | number}}</div>
				<div class="mrt-sfp--full">{{fit.resid_std_full | number}}</div>
			</div>
			<div class="mrt-sfp--item">
				<label>Skewness</label>
				<div class="mrt-sfp--selection">{{fit.resid_skew | number}}</div>
				<div class="mrt-sfp--full">{{fit.resid_skew_full | number}}</div>
			</div>
			<div class="mrt-sfp--item">
				<label>Kurtosis</label>
				<div class="mrt-sfp--selection">{{fit.resid_kurt | number}}</div>
				<div class="mrt-sfp--full">{{fit.resid_kurt_full | number}}</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		fit: {
			type: Object,
			default: () => {
				return {
					proctype: null,
					kappa: null,
					kappa_full: null,
					sigma: null,
					sigma_full: null,
					theta: null,
					theta_full: null,
					nBeta: null,
					nbeta_full: null,
					adf_stat: null,
					adf_stat_full: null,
					sig_lev: null,
					sig_lev_full: null,
					p_val: null,
					p_val_full: null,
					R2: null,
					R2_full: null,
					resid_mean: null,
					resid_mean_full: null,
					resid_std: null,
					resid_std_full: null,
					resid_skew: null,
					resid_skew_full: null,
					resid_kurt: null,
					resid_kurt_full: null,
					start_date: null,
					end_date: null
				};
			}
		}
	},
	computed: {
		fitProcess() {
			switch (this.fit.proctype) {
				case "hypOU":
					return "Hyperbolic Ornstein-Uhlenbeck";
				case "OU":
					return "Ornstein-Uhlenbeck";
				default:
					return "Not Fitted";
			}
		},
		isFitted() {
			return this.fit.proctype === "hypOU" || this.fit.proctype === "OU";
		}
	}
};
</script>

<style lang="less" scoped>
/* MRT strategy-fit */
.mrt-sfp {
	font-weight: 300;
	height: 438px;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	padding: 0 12px 0 24px;
	font-size: 13px;
	background-color: #2e2e2e;
	padding: 8px 12px;
	border-radius: 4px;
	border: 1px solid #424242;
	.mrt-sfp--proctype {
		margin: 0 0 12px 0;
		label {
			text-transform: uppercase;
			font-size: 12px;
			color: #f3e5f5;
		}
		> div {
			font-size: 16px;
			font-weight: 400;
			color: #ce93d8;
			&.mrt-sfp--notfitted {
				color: #f44336;
			}
		}
	}
	.mrt-sfp--section {
		display: flex;
		flex-direction: column;
		width: 100%;
		margin: 0 0 16px 0;
		.mrt-sfp--header,
		.mrt-sfp--item {
			display: flex;
			width: 100%;
			label,
			.mrt-sfp--selection,
			.mrt-sfp--full {
				font-weight: 400;
				line-height: 1.5;
				white-space: nowrap;
				text-overflow: ellipsis;
				overflow: hidden;
			}
		}
		.mrt-sfp--item {
			margin: 2px 0;
		}
		.mrt-sfp--header {
			text-transform: uppercase;
			font-size: 12px;
			color: #f3e5f5;
			border-bottom: 1px solid #424242;
			padding: 0 0 2px;
			margin: 0 0 4px;
			label,
			.mrt-sfp--selection,
			.mrt-sfp--full {
				font-weight: 300;
			}
			label {
				color: #fff9c4;
			}
		}
		label {
			flex: 1;
			&.mrt-sfp--item__dyna {
				display: flex;
				justify-content: space-between;
				align-items: center;
				i {
					font-size: 16px;
					color: #fff9c4;
				}
			}
		}
		.mrt-sfp--selection {
			width: 100px;
			text-align: right;
		}
		.mrt-sfp--full {
			width: 100px;
			text-align: right;
		}
	}
}
</style>
