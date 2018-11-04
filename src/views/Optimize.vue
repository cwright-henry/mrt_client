<template>
	<div>
		<div class="text-xs-center" v-if="isLoading">
				Loading...
		</div>
		<v-card v-else>
			<v-toolbar dense flat class="mrt--toolbar">
				<v-toolbar-title class="mrt--header-color">{{series.name}}</v-toolbar-title>
				<v-spacer></v-spacer>
			</v-toolbar>
			<v-container grid-list-lg fluid>
				<mrt-fit 
					:kappa.sync="series.fit.kappa"
					:sigma.sync="series.fit.sigma"
					:theta.sync="series.fit.theta"
					:adf_stat.sync="series.fit.adf_stat"
					:p_val.sync="series.fit.p_val"
					:sig_lev.sync="series.fit.sig_lev"
					:readonly=true>
				</mrt-fit>
				<v-layout row wrap>
					<v-flex lg1 md1 xs4>
						<div class="mrt-no-wrap mrt--fit key">Start Date</div>
						<div class="mrt-no-wrap mrt--fit value">{{series.fit.start_date | date-short}}</div>
					</v-flex>
					<v-flex lg1 md1 xs4>
						<div class="mrt-no-wrap mrt--fit key">End Date</div>
						<div class="mrt-no-wrap mrt--fit value">{{series.fit.end_date | date-short}}</div>
					</v-flex>
				</v-layout>
			</v-container>
			<mrt-multichart 
				:primary="primary" 
				:secondarys="secondarys"
				@startdate="startDate"
				@enddate="endDate"
				backgroundColor="#424242">
			</mrt-multichart>
			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn outline small color="primary" :loading="isSltp" @click="sltp" flat>SLTP</v-btn>
			</v-card-actions>
		</v-card>
		<v-divider></v-divider>
		<v-layout row wrap>
			<v-flex md2 xs12>
				<mrt-surface-chart id="graphET" title="ET" :values="ET"></mrt-surface-chart>
			</v-flex>
			<v-flex md2 xs12>
				<mrt-surface-chart id="graphEIR" title="EIR" :values="EIR"></mrt-surface-chart>
			</v-flex>
			<v-flex md2 xs12>
				<mrt-surface-chart id="graphEPnl" title="EPnl" :values="EPnl"></mrt-surface-chart>
			</v-flex>
			<v-flex md2 xs12>
				<mrt-surface-chart id="graphER" title="ER" :values="ER"></mrt-surface-chart>
			</v-flex>
			<v-flex md2 xs12>
				<mrt-surface-chart id="graphpblta" title="pblta" :values="pblta"></mrt-surface-chart>
			</v-flex>
		</v-layout>
	</div>
</template>

<script>
import mrtMultichart from '@/components/MultiChart'
import mrtFit from '@/components/Fit'
import mrtSurfaceChart from '@/components/SurfaceChart'
import ApiController from '@/services/ApiController'

const ONE_YEAR 					= 1000*60*60*24*365
const PRIMARY_COLOR 		= '#00E676'
const STOP_LOSS_COLOR 	= '#EF5350'
const TAKE_PROFIT_COLOR = '#42A5F5'
const OPTIMAL_COLOR 		= '#FFA726'

const createSeries = (lastDate, series) => {
	const arr = []
	for(let prop in series) {
		let date = lastDate + (prop * ONE_YEAR)
		arr.push([date, series[prop]])
	}

	return arr;
}

export default {
	props: {
		id: {
			type: String,
			defualt: null
		}
	},
	data() {
		return {
			series: {
				fit: {}
			},
			isLoading: false,
			isFitting: false,
			isSltp: false,
			primary: {
				name: '',
				ts: [],
				color: ''
			},
			secondarys: [],
			ET: {},
			ER: {},
			EIR: {},
			EPnl: {},
			pblta: {}
		}
	},
	watch: {
		// Only triggered by route change - not refresh
    '$route' (to) {
			if(to.name == 'optimize') {
				this.load()
			}
			else {
				this.reset()
			}
		}
	},
	components: {
		mrtMultichart,
		mrtFit,
		mrtSurfaceChart
	},
	// Triggered by refresh
	mounted() {
		this.load()
	},
	methods: {
		async load() {
			this.isLoading = true
			try {
				this.series = await ApiController.find(this.id);
				this.primary = {
					color: PRIMARY_COLOR,
					name: this.series.name,
					ts: this.series.ts
				}
				this.isLoading = false
			}
			catch(e) {
				console.log(e)
				this.isLoading = false
			}
		},

		async fit() {
			this.isFitting = true;
			try {
				const series = this.series.ts.filter((item)=> {
					return this.series.fit.start_date <= item[0] && item[0] <= this.series.fit.end_date
				})
				const data = await ApiController.fit(series);
				this.series.fit.kappa 		= data.kappa
				this.series.fit.sigma 		= data.sigma
				this.series.fit.theta 		= data.theta
				this.series.fit.adf_stat 	= data.adf_stat
				this.series.fit.p_val 		= data.p_val
				this.series.fit.sig_lev 	= data.sig_lev
				this.isFitting = false;
			}
			catch(e) {
				console.log(e)
				this.isFitting = false;
			}
		},

		startDate(d) {
			this.series.fit.start_date = d
			this.fit()
		},

		endDate(d) {
			this.series.fit.end_date = d
			this.fit()
		},

		async sltp() {
			this.isSltp = true
			try {
				const series = this.series.ts.filter((item)=> {
					return this.series.fit.start_date <= item[0] && item[0] <= this.series.fit.end_date
				})
				
				const payload = {
					kappa: this.series.fit.kappa, 
					sigma: this.series.fit.sigma,
					theta: this.series.fit.theta,
					carry: 0.1,
					x_T: series[series.length - 1][1], 
					trans_oneway_stdev: 0.05
				}
				const data = await ApiController.sltp(payload);
				this.secondarys = []
				this.secondarys.push({
					color: STOP_LOSS_COLOR,
					name: 'opt SL',
					ts: createSeries(this.series.fit.end_date, data['opt']['opt SL'])
				})
				this.secondarys.push({
					color: TAKE_PROFIT_COLOR,
					name: 'opt TP',
					ts: createSeries(this.series.fit.end_date, data['opt']['opt TP'])
				})
				this.secondarys.push({
					color: OPTIMAL_COLOR,
					name: 'E[x_T] NBC',
					ts: createSeries(this.series.fit.end_date, data['opt']['E[x_T] NBC'])
				})
				this.ER 	= data['ER']
				this.ET 	= data['ET']
				this.EIR 	= data['EIR']
				this.EPnl = data['EPnL']
				this.pblta 	= data['pblta']
				this.isSltp = false
			}
			catch(e) {
				console.log(e)
				this.isSltp = false
			}
		},

		reset() {
			this.series = {
				fit: {}
			}
			this.isLoading = false
			this.isFitting = false
			this.isSltp = false
			this.datasets = null
		}
	}
}
</script>

<style>

</style>
