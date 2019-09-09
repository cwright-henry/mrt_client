<template>
	<div class="mrt-search-fit">
		<div class="proctype">
			<label>Fit Process</label>
			<div>{{fitProcess}}</div>
		</div>
		<div class="section">
			<div class="header">
				<label>Parameters</label>
				<div class="selection">Selection</div>
				<div class="full">Full</div>
			</div>
			<div class="item">
				<label>Kappa</label>
				<div class="selection">{{fit.kappa | number}}</div>
				<div class="full">{{fit.kappa_full | number}}</div>
			</div>
			<div class="item">
				<label>Sigma</label>
				<div class="selection">{{fit.sigma | number}}</div>
				<div class="full">{{fit.sigma_full | number}}</div>
			</div>
			<div class="item">
				<label>Theta</label>
				<div class="selection">{{fit.theta | number}}</div>
				<div class="full">{{fit.theta_full | number}}</div>
			</div>
			<div class="item" v-if="fit.proctype === 'hypOU'">
				<label>Beta</label>
				<div class="selection">{{fit.nbeta | number}}</div>
				<div class="full">{{fit.nbeta_full | number}}</div>
			</div>
		</div>
		<div class="section">
			<div class="header">
				<label>Goodness of Fit</label>
				<div class="selection">Selection</div>
				<div class="full">Full</div>
			</div>
			<div class="item">
				<label>ADF Stat</label>
				<div class="selection">{{fit.adf_stat | number}}</div>
				<div class="full">{{fit.adf_stat_full | number}}</div>
			</div>
			<div class="item">
				<label>ADF Sig Level</label>
				<div class="selection">{{fit.sig_lev}}</div>
				<div class="full">{{fit.sig_lev_full}}</div>
			</div>
			<div class="item">
				<label>P value</label>
				<div class="selection">{{fit.p_val | number}}</div>
				<div class="full">{{fit.p_val_full | number}}</div>
			</div>
		</div>
		<div class="section">
			<div class="header">
				<label>Residuals</label>
				<div class="selection">Selection</div>
				<div class="full">Full</div>
			</div>
			<div class="item">
				<label>
					R
					<sup>2</sup>
				</label>
				<div class="selection">{{fit.R2 | number}}</div>
				<div class="full">{{fit.R2_full | number}}</div>
			</div>
			<div class="item">
				<label>Mean</label>
				<div class="selection">{{fit.resid_mean | number}}</div>
				<div class="full">{{fit.resid_mean_full | number}}</div>
			</div>
			<div class="item">
				<label>Std</label>
				<div class="selection">{{fit.resid_std | number}}</div>
				<div class="full">{{fit.resid_std_full | number}}</div>
			</div>
			<div class="item">
				<label>Skew</label>
				<div class="selection">{{fit.resid_skew | number}}</div>
				<div class="full">{{fit.resid_skew_full | number}}</div>
			</div>
			<div class="item">
				<label>Kurt</label>
				<div class="selection">{{fit.resid_kurt | number}}</div>
				<div class="full">{{fit.resid_kurt_full | number}}</div>
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
		}
	}
};
</script>

<style lang="less" scoped>
.mrt-search-fit {
	font-weight: 300;
	height: 425px;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	padding: 0 12px 0 24px;
	font-size: 13px;
	background-color: rgba(255, 255, 255, 0.04);
	padding: 8px 12px;
	border-radius: 4px;
	.selection-dates {
		margin: 0 0 12px 0;
		> label {
			text-transform: uppercase;
			font-size: 12px;
			color: #e0e0e0;
		}
		.dates {
			display: flex;
			> label {
				color: #e0e0e0;
			}
			> div:first-child {
				margin: 0 24px 0 0;
			}
		}
	}
	.proctype {
		margin: 0 0 8px;
		label {
			text-transform: uppercase;
			font-size: 12px;
			color: #e0e0e0;
		}
		> div {
			font-size: 16px;
			color: #ffeb3b;
		}
	}
	.section {
		display: flex;
		flex-direction: column;
		width: 100%;
		margin: 0 0 16px 0;
		.header,
		.item {
			display: flex;
			width: 100%;
		}
		.header {
			text-transform: uppercase;
			font-size: 12px;
			color: #e0e0e0;
			border-bottom: 1px solid #424242;
			padding: 0 0 2px;
			margin: 0 0 4px;
		}
		label {
			flex: 1;
		}
		.selection {
			width: 100px;
			text-align: right;
		}
		.full {
			width: 100px;
			text-align: right;
		}
	}
}
</style>
