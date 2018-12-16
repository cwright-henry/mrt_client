<template>
	<div class="mrt-card--fittings">
		<div>
			<label>Fit Process</label>
			<div>Not Fitted</div>
		</div>
	</div>
</template>

<script>
export default {

}
</script>

<style scoped lang="less">
.mrt-card--fittings {
	display: flex;
	margin: 4px 0 12px 8px;
	> div {
		margin: 0 36px 0 0;
		label {
			color: var(--light-gray);
			white-space: nowrap;
		}
		div {
			font-size: 16px;
			color: var(--orange);
			color: #FF5722;
		}
	}
}
</style>
