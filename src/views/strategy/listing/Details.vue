<template>
	<div class="mrt-details">
		<div class="selection">
			<label>Full</label>
			<div class="dates">
				<div>
					<label>Start Date</label>
					<div>{{tsStartDate | date-short}}</div>
				</div>
				<div>
					<label>End Date</label>
					<div>{{tsEndDate | date-short}}</div>
				</div>
			</div>
		</div>
		<div class="selection">
			<label>Selection</label>
			<div class="dates">
				<div>
					<label>Start Date</label>
					<div>{{fit.start_date | date-short}}</div>
				</div>
				<div>
					<label>End Date</label>
					<div>{{fit.end_date | date-short}}</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		strategy: {
			type: Object,
			default: () => {
				return {
					ts: {}
				};
			}
		}
	},
	computed: {
		fit() {
			if (this.strategy.fit) {
				return this.strategy.fit;
			}
			return { start_date: "...", end_date: "n/a" };
		},
		tsStartDate() {
			if (this.strategy.ts) {
				return this.strategy.ts.data[0][0];
			}
		},
		tsEndDate() {
			if (this.strategy.ts) {
				return this.strategy.ts.data[
					this.strategy.ts.data.length - 1
				][0];
			}
		},
		tsEndValue() {
			if (this.strategy.ts) {
				return this.strategy.ts.data[
					this.strategy.ts.data.length - 1
				][1];
			}
		}
	}
};
</script>

<style lang="less">
.mrt-details {
	font-weight: 300;
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	font-size: 13px;
	line-height: 1.4;
	margin: 0 0 12px;
	.selection {
		background-color: rgba(255, 255, 255, 0.04);
		padding: 8px 12px;
		border-radius: 4px;
		&:not(:first-child) {
			margin: 0 0 0 36px;
		}
		> label {
			text-transform: uppercase;
			font-size: 12px;
			color: #e0e0e0;
			border-bottom: 1px solid #424242;
			padding: 0 0 2px;
			margin: 0 0 4px;
			display: inherit;
		}
		.dates {
			display: flex;
			flex-direction: column;
			> div {
				display: flex;
				> label {
					color: #e0e0e0;
					display: inline-flex1;
					width: 90px;
				}
				> div {
					text-align: right;
					width: 100px;
				}
			}
		}
	}
}
</style>
