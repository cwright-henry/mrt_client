<template>
	<v-card-actions class="mrt-cla">
		<div class="mrt-cla--info mr-5">
			<label>Created</label>
			<div class="text-no-wrap">{{strategy.created | date}}</div>
		</div>
		<div class="mrt-cla--info">
			<label class="text-no-wrap">Last Updated</label>
			<div class="text-no-wrap">{{strategy.lastUpdate | date}}</div>
		</div>
		<v-spacer></v-spacer>
		<v-btn
			:loading="strategy._id === currentStrategy._id && isLoading"
			small
			color="#2196F3"
			:to="`/library/${strategy._id}/scenario`"
		>Scenario Analysis</v-btn>
	</v-card-actions>
</template>

<script>
export default {
	props: {
		strategy: {
			type: Object,
			default: () => {
				return {};
			}
		},
		currentStrategy: {
			type: Object,
			default: () => {
				return {};
			}
		},
		isLoading: false
	}
};
</script>

<style lang="less" scoped>
.mrt-cla {
	margin: 0 12px;
	.mrt-cla--info {
		font-size: 12px;
		line-height: 1.4;
		font-weight: 300;
		color: #fffffff;
		label {
			color: #e0e0e0;
			text-transform: uppercase;
			font-size: 10px;
		}
	}
}
</style>