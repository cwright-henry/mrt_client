<template>
	<div class="mrt-card--fittings">
		<div class="process">
			<div class="mrt-card--fittings-process">Hyperbolic Ornstein-Uhlenbeck</div>
		</div>
		<div class="parameters">
			<div class="elevation-2">
				<label>Kappa</label>
				<div>{{fit.kappa | number}}</div>
			</div>
			<div class="elevation-2">
				<label>Sigma</label>
				<div>{{fit.sigma | number}}</div>
			</div>
			<div class="elevation-2">
				<label>Theta</label>
				<div>{{fit.theta | number}}</div>
			</div>
			<div class="elevation-2">
				<label>Beta</label>
				<div>{{fit.nbeta | number}}</div>
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
					proctype: "Hyperbolic Ornstein-Uhlenbeck",
					kappa: 0,
					sigma: 0,
					theta: 0,
					nBeta: 0
				};
			}
		}
	}
};
</script>

<style scoped lang="less">
.mrt-card--fittings {
	margin: 0 0 12px 8px;
	.process {
		display: flex;
		margin: -2px 0 12px;
		font-size: 18px;
	}
	.parameters {
		display: flex;
		margin: 0 0 8px 0;
		> div {
			border: 1px solid #616161;
			background-color: #424242;
			padding: 12px 16px;
			border-radius: 3px;
			margin: 0 24px 0 0;
			label {
				color: #e0e0e0;
				white-space: nowrap;
				font-size: 13px;
			}
			div {
				font-size: 16px;
				color: #ce93d8;
			}
			&:last-child {
				margin: 0;
			}
		}
	}
}
</style>
