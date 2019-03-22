<template>
	<div class="panel sltp">
		<div class="navigation">
			<mrt-fit-process :fit="strategy.fit"/>
			<div class="mrt-fit--actions">
				<div>
					<v-btn small fab color="#0091EA" :loading="isLoadingSLTP" @click="runSltp"><v-icon>autorenew</v-icon></v-btn>
					<label>Generate SLTP</label>
				</div>
			</div>
		</div>
    <div class="parameters">
      <mrt-parameters/>
    </div>
		<mrt-sltpchart/>
		<ul class="mrt-optimize--surfaces">
			<li>
				<mrt-surface-chart id="graphET" @showSurfaceDialog="enableSufaceChart" title="ET" :values="ET"></mrt-surface-chart>
			</li>
			<li>
				<mrt-surface-chart id="graphEIR" @showSurfaceDialog="enableSufaceChart" title="EIR" :values="EIR"></mrt-surface-chart>
			</li>
			<li>
				<mrt-surface-chart id="graphEPnl" @showSurfaceDialog="enableSufaceChart" title="EPnl" :values="EPnl"></mrt-surface-chart>
			</li>
			<li>
				<mrt-surface-chart id="graphER" @showSurfaceDialog="enableSufaceChart" title="ER" :values="ER"></mrt-surface-chart>
			</li>
			<li>
				<mrt-surface-chart id="graphpblta" @showSurfaceDialog="enableSufaceChart" title="pblta" :values="pblta"></mrt-surface-chart>
			</li>
		</ul>
		<mrt-surface-chart-dialog 
			:show="showSurfaceChart"
			:data="sufaceChartData"
			@close="showSurfaceChart=false"/>
	</div>
</template>

<script>
import mrtFitProcess from '@/components/fit/Fit'
import mrtSltpchart from './SltpChart'
import mrtSurfaceChart from './SltpSurfaceChart'
import mrtSurfaceChartDialog from './SltpSurfaceChartDialog'
import mrtParameters from './SltpParameters'
import {mapState, mapGetters} from 'vuex'

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
		}
	},
	computed: {
		...mapState('fit', ['strategy', 'ER', 'ET', 'EIR', 'EPnl', 'pblta', 'isLoadingSLTP']),
		...mapGetters('strategies', ['findStrategy']),
	},
	components: {
		mrtSltpchart,
		mrtFitProcess,
		mrtSurfaceChart,
    mrtSurfaceChartDialog,
    mrtParameters
	},
	methods: {
		runSltp() {
			this.$store.dispatch('fit/loadSltp');
		},

		enableSufaceChart(data) {
			this.sufaceChartData = data;
			this.showSurfaceChart = true;
		}
	}
}
</script>

<style lang="less">
.mrt-analysis {
	.sltp {
		.navigation {
			display:flex;
			justify-content: space-between;
			margin: 0 0 12px;
    }
    .parameters {
			display:flex;
			justify-content: center;
			margin: 0 0 12px;
		}
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
