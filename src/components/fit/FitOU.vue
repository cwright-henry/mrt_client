<template>
	<div class="mrt-card--fittings">
		<div class="process">
			<div class="mrt-card--fittings-process">Ornstein-Uhlenbeck</div>
		</div>
		<div class="parameters">
			<div>
				<label>Kappa</label>
				<div>{{fit.kappa | number}}</div>
			</div>
			<div>
				<label>Sigma</label>
				<div>{{fit.sigma | number}}</div>
			</div>
			<div>
				<label>Theta</label>
				<div>{{fit.theta | number}}</div>
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
					proctype: 'Ornstein-Uhlenbeck',
					kappa: 0,
					sigma: 0,
					theta: 0
				}
			}
		}
	}
}
</script>

<style scoped lang="less">
.mrt-card--fittings {
	margin: 0px 0 12px 8px;
	.process {
		display: flex;
		margin: -4px 0 2px;
		font-size: 18px;
	}
	.parameters {
		display:flex;
		> div {
			margin: 0 24px 0 0;
			label {
				color: var(--light-gray);
				white-space: nowrap;
				font-size: 13px;
			}
			div {
				font-size: 16px;
				color: var(--orange);
			}
			&:last-child {
				margin: 0;
			}
		}
	}
}

</style>
