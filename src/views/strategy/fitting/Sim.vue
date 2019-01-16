<template>
	<v-card>
		<v-toolbar dense flat>
			<v-toolbar-title class="mrt--header-color">{{strategy.name}}</v-toolbar-title>
			<v-spacer></v-spacer>
		</v-toolbar>
		<div class="mrt-simulations">
			<mrt-fit-process :fit="strategy.fit"/>
			<mrt-sim-chart 
				:ts="strategy.ts" 
				@fetchsims="loadSims"
				:name="strategy.name">
			</mrt-sim-chart>
			<h1 class="header">Simulations</h1>
			<ul class="graphs">
				<li>
					<mrt-sims-sparkline-chart :ts="sims['0']" id="sim_0" @loaded="loaded"></mrt-sims-sparkline-chart>
				</li>
				<li>
					<mrt-sims-sparkline-chart :ts="sims['1']" id="sim_1" @loaded="loaded"></mrt-sims-sparkline-chart>
				</li>
				<li>
					<mrt-sims-sparkline-chart :ts="sims['2']" id="sim_2" @loaded="loaded"></mrt-sims-sparkline-chart>
				</li>
				<li>
					<mrt-sims-sparkline-chart :ts="sims['3']" id="sim_3" @loaded="loaded"></mrt-sims-sparkline-chart>
				</li>
				<li>
					<mrt-sims-sparkline-chart :ts="sims['4']" id="sim_4" @loaded="loaded"></mrt-sims-sparkline-chart>
				</li>
				<li>
					<mrt-sims-sparkline-chart :ts="sims['5']" id="sim_5" @loaded="loaded"></mrt-sims-sparkline-chart>
				</li>
				<li>
					<mrt-sims-sparkline-chart :ts="sims['6']" id="sim_6" @loaded="loaded"></mrt-sims-sparkline-chart>
				</li>
				<li>
					<mrt-sims-sparkline-chart :ts="sims['7']" id="sim_7" @loaded="loaded"></mrt-sims-sparkline-chart>
				</li>
				<li>
					<mrt-sims-sparkline-chart :ts="sims['8']" id="sim_8" @loaded="loaded"></mrt-sims-sparkline-chart>
				</li>
				<li>
					<mrt-sims-sparkline-chart :ts="sims['9']" id="sim_9" @loaded="loaded"></mrt-sims-sparkline-chart>
				</li>
				<li>
					<mrt-sims-sparkline-chart :ts="sims['10']" id="sim_10" @loaded="loaded"></mrt-sims-sparkline-chart>
				</li>
				<li>
					<mrt-sims-sparkline-chart :ts="sims['11']" id="sim_11" @loaded="loaded"></mrt-sims-sparkline-chart>
				</li>
				<li>
					<mrt-sims-sparkline-chart :ts="sims['12']" id="sim_12" @loaded="loaded"></mrt-sims-sparkline-chart>
				</li>
				<li>
					<mrt-sims-sparkline-chart :ts="sims['13']" id="sim_13" @loaded="loaded"></mrt-sims-sparkline-chart>
				</li>
				<li>
					<mrt-sims-sparkline-chart :ts="sims['14']" id="sim_14" @loaded="loaded"></mrt-sims-sparkline-chart>
				</li>
				<li>
					<mrt-sims-sparkline-chart :ts="sims['15']" id="sim_15" @loaded="loaded"></mrt-sims-sparkline-chart>
				</li>
				<li>
					<mrt-sims-sparkline-chart :ts="sims['16']" id="sim_16" @loaded="loaded"></mrt-sims-sparkline-chart>
				</li>
				<li>
					<mrt-sims-sparkline-chart :ts="sims['17']" id="sim_17" @loaded="loaded"></mrt-sims-sparkline-chart>
				</li>
				<li>
					<mrt-sims-sparkline-chart :ts="sims['18']" id="sim_18" @loaded="loaded"></mrt-sims-sparkline-chart>
				</li>
				<li>
					<mrt-sims-sparkline-chart :ts="sims['19']" id="sim_19" @loaded="loaded"></mrt-sims-sparkline-chart>
				</li>
			</ul>
		</div>
	</v-card>
</template>

<script>
import {mapState, mapGetters} from 'vuex'
import mrtSimChart from '@/components/SimsChart'
import mrtSimsSparklineChart from '@/components/SimsSparklineChart'
import mrtFitProcess from '@/components/fit/Fit'
import {tsExtremes} from '@/utils/sorting'

export default {
	data() {
		return {
			loading: false,
			loadeCount: 0
		}
	},
	props: {
		id: {
			type: String,
			default: ''
		}
	},
	components: {
		mrtSimChart,
		mrtSimsSparklineChart,
		mrtFitProcess
	},
	computed: {
		...mapState('fit', ['strategy', 'sims']),
		...mapGetters('strategies', ['findStrategy'])
	},
	activated() {
		this.load()
	},
	methods: {
		/**
		 * Look in cache, if not there then load strategy and
		 * Async load all stratgies
		 */
		async load() {
			if(this.id) {
				const strategy = this.findStrategy(this.id)
				if(strategy) {
					await this.$store.dispatch('fit/setStrategy', strategy)
				}
				else {
					await this.$store.dispatch('fit/loadStrategy', {id: this.id})
					this.$store.dispatch('strategies/load', {})
				}
			}
			const extremes = tsExtremes(this.strategy.ts.data)
			await this.$store.dispatch('fit/loadSims', {
				value: extremes.maxValue,
				date: extremes.max
			})
		},

		async loadSims(params) {
			this.loading = true
			await this.$store.dispatch('fit/loadSims', params)
		},

		loaded(data) {
			this.loadeCount++;
			if(this.loadeCount === 20) {
				this.loading = false
				this.loadeCount = 0;
			}
		}
	}
}
</script>

<style lang="less">
.mrt-simulations {
	padding: 16px;
	.graphs {
		list-style: none;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: flex-start;
		margin:0 -12px;
		li {
			margin: 12px;
		}
	}
	.header {
		font-size: 18px;
		font-weight:400;
		color: var(--light-gray); 
		margin: 0 0 12px 0;
	}
}
</style>
