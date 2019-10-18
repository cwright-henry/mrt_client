<template>
	<div class="sltp">
		<div v-if="isLoadingSLTP" class="blocker"></div>
		<div class="sltp-header">
			<mrt-sltp-parameters />
			<div class="sltp-action">
				<v-btn small fab color="#0091EA" :loading="isLoadingSLTP" @click="runSltp">
					<v-icon>autorenew</v-icon>
				</v-btn>
				<label>Generate SLTP</label>
			</div>
		</div>
		<div class="sltp-graph">
			<mrt-sltpchart />
		</div>
		<ul class="mrt-optimize--surfaces">
			<li>
				<mrt-surface-chart
					id="graphET"
					@showSurfaceDialog="enableSufaceChart"
					title="Horizon"
					:values="ET"
				></mrt-surface-chart>
			</li>
			<li>
				<mrt-surface-chart
					id="graphEIR"
					@showSurfaceDialog="enableSufaceChart"
					title="EIR"
					:values="EIR"
				></mrt-surface-chart>
			</li>
			<li>
				<mrt-surface-chart
					id="graphEPnl"
					@showSurfaceDialog="enableSufaceChart"
					title="EPnl"
					:values="EPnl"
				></mrt-surface-chart>
			</li>
			<li>
				<mrt-surface-chart id="graphER" @showSurfaceDialog="enableSufaceChart" title="ER" :values="ER"></mrt-surface-chart>
			</li>
			<li>
				<mrt-surface-chart
					id="graphpblta"
					@showSurfaceDialog="enableSufaceChart"
					title="pblta"
					:values="pblta"
				></mrt-surface-chart>
			</li>
		</ul>
		<mrt-surface-chart-dialog
			:show="showSurfaceChart"
			:data="sufaceChartData"
			@close="showSurfaceChart=false"
		/>
	</div>
</template>

<script>
import mrtSltpchart from "./SltpChart";
import mrtSurfaceChart from "./SltpSurfaceChart";
import mrtSurfaceChartDialog from "./SltpSurfaceChartDialog";
import mrtSltpParameters from "./SltpParameters";
import { mapState } from "vuex";

export default {
	props: {
		id: {
			type: String,
			defualt: null
		}
	},
	data() {
		return {
			showSurfaceChart: false,
			sufaceChartData: null
		};
	},
	computed: {
		...mapState("fit", ["strategy"]),
		...mapState("fit/sltp", [
			"ER",
			"ET",
			"EIR",
			"EPnl",
			"pblta",
			"isLoadingSLTP"
		])
	},
	components: {
		mrtSltpchart,
		mrtSurfaceChart,
		mrtSurfaceChartDialog,
		mrtSltpParameters
	},
	methods: {
		runSltp() {
			this.$store.dispatch("fit/sltp/generate");
		},

		enableSufaceChart(data) {
			this.sufaceChartData = data;
			this.showSurfaceChart = true;
		}
	}
};
</script>

<style lang="less">
.sltp {
	background-color: #252525;
	padding: 16px;
	position: relative;
	.sltp-action {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-end;
		label {
			color: #e0e0e0;
			font-size: 12px;
			font-weight: 300;
		}
	}
	.sltp-header {
		display: flex;
		justify-content: space-between;
		margin: 0 0 24px;
	}
	.sltp-graph {
		width: calc(100% - 0px);
	}
	.blocker {
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		background-color: rgba(255, 255, 255, 0);
		z-index: 999;
	}
}
.mrt-optimize--surfaces {
	margin: 36px 0 0 0;
	display: flex;
	flex-direction: row;
	list-style: none;
	flex-wrap: wrap;
	justify-content: space-evenly;
	li {
		width: auto;
	}
}
</style>
