<template>
	<div class="mrt-card">
		<div class="mrt-card--graphs">
			<div class="mrt-card--graphs-series">
				<h1>Series</h1>
				<mrt-serieschart :ts="timeseries"></mrt-serieschart>
			</div>
			<div class="mrt-card--graphs-residuals">
				<h1>Residuals</h1>
				<mrt-risdualschart :ts="residuals"></mrt-risdualschart>
			</div>
		</div>
		<div class="mrt-card--details">
			<div class="mrt-card--details-process">
				<div>
					<label>Fit Process</label>
					<div>{{process}}</div>
				</div>
				<div>
					<label>Start Date</label>
					<div>{{startDate | date-short}}</div>
				</div>
				<div>
					<label>End Date</label>
					<div>{{endDate | date-short}}</div>
				</div>
			</div>
			<div class="mrt-card--details-goodness">
				<h1 class="body-2">Goodness of Fit</h1>
				<div>
					<label>ADF Stat</label>
					<div>{{goodness.adf_stat | number}}</div>
				</div>
				<div>
					<label>ADF Sig Level</label>
					<div>{{goodness.sig_lev}}</div>
				</div>
				<div>
					<label>P value</label>
					<div>{{goodness.p_val | number}}</div>
				</div>
			</div>
			<div class="mrt-card--details-stats">
				<h1 class="body-2">Statistics</h1>
				<div>
					<label>Kappa</label>
					<div>{{stats.kappa | number}}</div>
				</div>
				<div>
					<label>Sigma</label>
					<div>{{stats.sigma | number}}</div>
				</div>
				<div>
					<label>Theta</label>
					<div>{{stats.theta | number}}</div>
				</div>
			</div>
			<div class="mrt-card--details-residuals">
				<h1 class="body-2">Residual Results</h1>
				<div>
					<label>R2</label>
					<div>{{residualStats.R2 | number }}</div>
				</div>
				<div>
					<label>Mean</label>
					<div>{{residualStats.mean | number }}</div>
				</div>
				<div>
					<label>Std</label>
					<div>{{residualStats.std | number }}</div>
				</div>
				<div>
					<label>Skew</label>
					<div>{{residualStats.skew | number }}</div>
				</div>
				<div>
					<label>Kurtosis</label>
					<div>{{residualStats.kurt | number }}</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import mrtSerieschart from '@/components/SeriesChart'
import mrtRisdualschart from '@/components/RisdualsChart'

export default {
	data() {
		return {
			observer: null,
			timeseries: {},
			residuals: {},
			goodness: {},
			stats: {},
			residualStats: {},
			startDate: '',
			endDate: '',
			process: '',
			isLoading: false
		}
	},
	props: {
		id: {
			type: String,
			default: ''
		}
	},
	mounted() {
		this.observer = new IntersectionObserver(([entry], self) => {
			if (entry && entry.isIntersecting) {
				this.load()
				self.unobserve(entry.target)
			}
		}, {});

		this.observer.observe(this.$el);
	},
	components: {
		mrtSerieschart,
		mrtRisdualschart
	},
	methods: {
		async load() {
			this.isLoading = true
			try {
				const payload = {
					id: this.id
				}
				const res = await this.$store.dispatch('library/findTs', payload)
				const ts = {}
				ts.data = res.ts;
				ts.name = res.name;
				this.timeseries = ts;

				const residuals = {}
				residuals.data = res.fit.resid;
				residuals.name = res.name;
				residuals.id = res.fit._id;
				this.residuals = residuals;

				const residualStats = {}
				residualStats.R2 = res.fit.R2
				residualStats.mean = res.fit.resid_mean
				residualStats.std = res.fit.resid_std
				residualStats.skew = res.fit.resid_skew
				residualStats.kurt = res.fit.resid_kurt
				this.residualStats = residualStats;

				const goodness = {}
				goodness.adf_stat = res.fit.adf_stat
				goodness.sig_lev = res.fit.sig_lev
				goodness.p_val = res.fit.p_val
				this.goodness = goodness

				const stats = {}
				stats.kappa = res.fit.kappa
				stats.sigma = res.fit.sigma
				stats.theta = res.fit.theta
				this.stats = stats

				this.startDate = res.fit.start_date
				this.endDate = res.fit.end_date
				this.process = res.proctype
			}
			catch(e) {
				// TODO 
			}
			finally {
				this.isLoading = false
			}
		}
	},
	destroyed() {
		this.observer.disconnect()
  }
}
</script>

<style scoped lang="less">
.mrt-card {
	display:flex;
	flex-direction: row;
	flex-wrap: wrap;
	padding:16px;

	.mrt-card--graphs {
		width: calc(100% - 208px);
		h1 {
			font-size:16px;
			font-weight:400;
			padding: 0 0 4px 12px;
			color: var(--light-gray);
		}
		.mrt-card--graphs-series {
			padding: 0 0 16px;
		}
	}
	.mrt-card--details {
		width:180px;
		margin: 12px 0 0 24px;
		.mrt-card--details-goodness, .mrt-card--details-stats, .mrt-card--details-residuals, .mrt-card--details-process {
			padding: 0 0 16px;
			h1 {
				background-color: #4CAF50;
				padding: 0 4px;
				font-weight:400;
				border-radius: 2px 2px 0 0;
				margin: 0 0 2px;	
			}
			label {
				font-size: 13px;
				font-weight: 300;
				color: var(--light-gray);
				margin: 0 12px 0 0;
			}
			> div {
				display:flex;
				justify-content: space-between;
				align-items: baseline;
				padding: 0 4px;
				div {
					padding:1px 0px;
					text-align:right;
				}
			}
		}
	}
}
@media screen and (max-width: 600px) {
	.mrt-card {
		justify-content: center;
		.mrt-card--graphs {
			width: 100%;
		}
		.mrt-card--details {
			width: 100%;
			margin:0;
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			justify-content: space-around;
			.mrt-card--details-goodness, .mrt-card--details-stats, .mrt-card--details-residuals {
				max-width: 200px;
				min-width:150px;
				width:100%;
			}
			.mrt-card--details-process {
				width:100%;
				justify-content: space-around;
				display: flex;
				> div {
					display: flex;
					flex-direction: column;
					padding: 0 16px 0 0;
					align-items: flex-start;
				}
			}
		}
	}
}
</style>
