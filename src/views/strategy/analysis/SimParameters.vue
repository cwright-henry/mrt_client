<template>
	<div class="sim-fittings">
		<div class="proctype">
			<label>Fit Process</label>
			<div>{{findProctype.text}}</div>
		</div>
		<div class="parameters">
			<label>Sim Parameters</label>
			<div class="parameter-set">
				<div>
					<ul>
						<li>
							<label>Kappa</label>
							<div>
								<v-icon v-if="userKappa != null">lock</v-icon>
								<div>{{kappa | number}}</div>
							</div>
						</li>
						<li>
							<label>Sigma</label>
							<div>
								<v-icon v-if="userSigma != null">lock</v-icon>
								<div>{{sigma | number}}</div>
							</div>
						</li>
						<li>
							<label>Theta</label>
							<div>
								<v-icon v-if="userTheta != null">lock</v-icon>
								<div>{{theta | number}}</div>
							</div>
						</li>
						<li v-if="findProctype.value !== 'OU'">
							<label>Beta</label>
							<div>
								<v-icon v-if="userBeta != null">lock</v-icon>
								<div>{{beta | number}}</div>
							</div>
						</li>
					</ul>
				</div>
				<div>
					<ul>
						<li>
							<label>Start Date</label>
							<div>
								<div>{{simStart.date | date-short}}</div>
							</div>
						</li>
						<li>
							<label>Start Value</label>
							<div>
								<div>{{simStart.value | number}}</div>
							</div>
						</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { mapState, mapGetters } from "vuex";

export default {
	computed: {
		...mapState("fit", ["userKappa", "userSigma", "userTheta", "userBeta"]),
		...mapState("fit/sims", ["simStart"]),
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
	margin: 0 0 12px;
	font-size: 14px;
	.proctype {
		margin: 0 0 16px;
		label {
			text-transform: uppercase;
			color: #fff9c4;
			font-size: 12px;
			font-weight: 300;
			display: inline-block;
		}
		> div {
			font-size: 18px;
			font-weight: 400;
			color: #ce93d8;
		}
	}
	.parameters {
		> label {
			text-transform: uppercase;
			color: #fff9c4;
			font-size: 12px;
			font-weight: 300;
			padding: 0 0 6px;
			display: inline-block;
		}
		.parameter-set {
			display: flex;
			> div {
				margin: 0 80px 0 0;
				ul {
					display: flex;
					flex-direction: column;
					padding: 0;
					list-style: none;
					li {
						display: flex;
						justify-content: space-between;
						align-items: center;
						height: 24px;
						margin: 0 0 6px 0;
						label {
							color: #e0e0e0;
							margin: 0 12px 0 0;
							font-size: 14px;
						}
						> div {
							display: flex;
							justify-content: space-between;
							align-items: center;
							margin: 0 0 0 16px;
							i {
								font-size: 16px;
								color: #fff9c4;
								margin: 0 5px 0 0;
							}
							> div {
								background-color: #2e2e2e;
								border: 1px solid #757575;
								padding: 1px 8px;
								border-radius: 4px;
								width: 100px;
								display: flex;
								justify-content: flex-end;
							}
						}
					}
				}
			}
		}
	}
}
</style>