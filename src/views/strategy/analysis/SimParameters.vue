<template>
	<div class="sim-fittings">
		<div class="proctype">
			<label>Fit Process</label>
			<div>{{findProctype().text}}</div>
		</div>
		<div class="parameters">
			<label>Parameters</label>
			<ul>
				<li>
					<label>Kappa</label>
					<div>
						<v-icon v-if="userKappa != null">lock</v-icon>
						<div>{{kappa() | number}}</div>
					</div>
				</li>
				<li>
					<label>Sigma</label>
					<div>
						<v-icon v-if="userSigma != null">lock</v-icon>
						<div>{{sigma() | number}}</div>
					</div>
				</li>
				<li>
					<label>Theta</label>
					<div>
						<v-icon v-if="userTheta != null">lock</v-icon>
						<div>{{theta() | number}}</div>
					</div>
				</li>
				<li v-if="findProctype().value !== 'OU'">
					<label>Beta</label>
					<div>
						<v-icon v-if="userBeta != null">lock</v-icon>
						<div>{{beta() | number}}</div>
					</div>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
import { mapState, mapGetters } from "vuex";

export default {
	computed: {
		...mapState("fit", ["userKappa", "userSigma", "userTheta", "userBeta"]),
		...mapGetters("fit", [
			"kappa",
			"sigma",
			"theta",
			"beta",
			"findProctype"
		])
	}
};
</script>

<style lang="less" scoped>
.sim-fittings {
	display: flex;
	flex-direction: column;
	.proctype {
		margin: 0 0 12px;
		label {
			text-transform: uppercase;
			color: #e0e0e0;
			font-size: 12px;
			font-weight: 300;
		}
		> div {
			font-size: 16px;
			font-weight: 400;
			color: #ce93d8;
		}
	}
	.parameters {
		display: flex;
		flex-direction: column;
		margin: 0 0 12px;
		> label {
			text-transform: uppercase;
			color: #e0e0e0;
			font-size: 12px;
			font-weight: 300;
			margin: 0 0 4px;
		}
		ul {
			display: flex;
			padding: 0;
			list-style: none;
			li {
				display: flex;
				align-items: center;
				margin: 0 24px 0 0;
				label {
					color: #e0e0e0;
					margin: 0 12px 0 0;
					font-size: 14px;
				}
				> div {
					display: flex;
					justify-content: space-between;
					align-items: center;
					i {
						font-size: 16px;
						color: #b39ddb;
						margin: 0 5px 0 0;
					}
					> div {
						background-color: #2e2e2e;
						border: 1px solid #424242;
						padding: 1px 8px;
						border-radius: 4px;
					}
				}
			}
			li:last-child {
				margin: 0 0 0 0;
			}
		}
	}
}
</style>