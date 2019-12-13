<template>
	<div class="mrt-sf">
		<div class="mrt-sf--selection">
			<label>
				Full
				<span>{{fullDays | number(0)}} Entries</span>
			</label>
			<div class="mrt-sf--dates">
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
		<div class="mrt-sf--selection">
			<label>
				Selection
				<span v-if="selectionDays">{{selectionDays | number(0)}} Entries</span>
			</label>
			<div class="mrt-sf--dates">
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
import { dataPointsBetween } from "@/utils";

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
			return {};
		},
		tsStartDate() {
			if (this.strategy.ts) {
				return this.strategy.ts.data[0][0];
			}
			return null;
		},
		tsEndDate() {
			if (this.strategy.ts) {
				return this.strategy.ts.data[
					this.strategy.ts.data.length - 1
				][0];
			}
			return null;
		},
		fullDays() {
			if (this.strategy.ts) {
				return this.strategy.ts.data.length;
			}

			return null;
		},
		selectionDays() {
			if (
				this.strategy.ts &&
				this.strategy.fit &&
				this.strategy.fit.start_date
			) {
				return dataPointsBetween(
					this.strategy.ts.data,
					this.strategy.fit.start_date,
					this.strategy.fit.end_date
				);
			}
			return null;
		}
	}
};
</script>

<style lang="less">
.mrt-sf {
	font-weight: 300;
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	font-size: 13px;
	line-height: 1.4;
	margin: 0 0 12px;
	.mrt-sf--selection {
		background-color: #2e2e2e;
		padding: 8px 12px;
		border-radius: 4px;
		border: 1px solid #424242;
		&:not(:first-child) {
			margin: 0 0 0 36px;
		}
		> label {
			text-transform: uppercase;
			font-size: 12px;
			color: #f3e5f5;
			border-bottom: 1px solid #424242;
			padding: 0 0 2px;
			margin: 0 0 4px;
			display: inherit;
			display: flex;
			justify-content: space-between;
			span {
				font-size: 12px;
				color: #fff;
				text-transform: none;
			}
		}
		.mrt-sf--dates {
			display: flex;
			flex-direction: column;
			font-weight: 400;
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
