<template>
	<div>
		<div class="header">
			<h3>Simulations</h3>
		</div>
		<div class="simulation-graph">
			<mrt-simchart
				ref="simChart"
				@startdate="loadSimsForDate">
			</mrt-simchart>
		</div>
		<div class="controls">
			<div class="horizon">
				<v-select
					v-model="horizon"
					:items="horizonTypes"
					:loading="isLoadingSims"
					dense
					box
					hide-details
					return-object
					flat
					label="Horizon">
				</v-select>
			</div>
			<div class="play">
				<div class="thumb-slider">
					<v-slider
						v-model="animationTime"
						:thumb-size="28"
						label="Interval"
						:min=0.5
						:max=8
						step=0.5
						ticks="always"
						tick-size="1"
						thumb-label="always">
						<template slot="thumb-label" slot-scope="props">
							<span>
								{{ `${props.value}s` }}
							</span>
						</template>
					</v-slider>
				</div>
				<div class="mrt-fit--actions">
					<div>
						<v-btn small fab color="#0091EA" :loading="isLoadingSims" @click="autoPlaySims"><v-icon>{{isPlaying ? 'pause' : 'play_arrow'}}</v-icon></v-btn>
						<label>{{isPlaying ? 'Stop' : 'Animate'}}</label>
					</div>
				</div>
			</div>
			<div class="updates">
				<div class="mrt-fit--actions">
					<div>
						<v-btn small fab color="#0091EA" :loading="isLoadingSims" @click="reset"><v-icon>settings_backup_restore</v-icon></v-btn>
						<label>Reset</label>
					</div>
				</div>
				<div class="mrt-fit--actions">
					<div>
						<v-btn small fab color="#0091EA" :loading="isLoadingSims" @click="getMoreSims"><v-icon>autorenew</v-icon></v-btn>
						<label>New Sims</label>
					</div>
				</div>
			</div>
		</div>
		<ul class="sparklines-graph">
			<li>
				<mrt-sims-sparkline-chart :sim="sims[0]"></mrt-sims-sparkline-chart>	
			</li>
			<li>
				<mrt-sims-sparkline-chart :sim="sims[1]"></mrt-sims-sparkline-chart>	
			</li>
			<li>
				<mrt-sims-sparkline-chart :sim="sims[2]"></mrt-sims-sparkline-chart>	
			</li>
			<li>
				<mrt-sims-sparkline-chart :sim="sims[3]"></mrt-sims-sparkline-chart>	
			</li>
			<li>
				<mrt-sims-sparkline-chart :sim="sims[4]"></mrt-sims-sparkline-chart>	
			</li>
			<li>
				<mrt-sims-sparkline-chart :sim="sims[5]"></mrt-sims-sparkline-chart>	
			</li>
			<li>
				<mrt-sims-sparkline-chart :sim="sims[6]"></mrt-sims-sparkline-chart>	
			</li>
			<li>
				<mrt-sims-sparkline-chart :sim="sims[7]"></mrt-sims-sparkline-chart>	
			</li>
			<li>
				<mrt-sims-sparkline-chart :sim="sims[8]"></mrt-sims-sparkline-chart>	
			</li>
			<li>
				<mrt-sims-sparkline-chart :sim="sims[9]"></mrt-sims-sparkline-chart>	
			</li>
		</ul>
	</div>
</template>

<script>
import mrtSimsSparklineChart from './SimsSparklineChart'
import mrtSimchart from './SimsChart'
import {mapState} from 'vuex'
import {closestNeighbour} from '@/utils/sorting'

export default {
	data() {
		return {
			isPlaying: false,
			isPlayingTimeout: null,
			horizonTypes: [
				{value: '130', text: '6 months'},
				{value: '260', text: '1 year'},
				{value: '520', text: '2 years'},
				{value: '780', text: '3 years'},
				{value: '1300', text: '5 years'},
				{value: '-1', text: 'Align'} /* Special Case to match slider and end of timeseries */
			]
		}
	},
	components: {
		mrtSimchart,
		mrtSimsSparklineChart
	},
	computed: {
		...mapState('fit', ['strategy', 'isFittingTS', 'isLoadingTS', 'isLoadingSims','isSavingFit', 'sims', 'selectedSim', 'simHorizon', 'simAnimationTime']),
		horizon: {
			get () {
        return this.simHorizon
      },
      set (value) {
				this.$store.commit('fit/setSimHorizon', value);
				this.$store.dispatch('fit/loadSims')
      }
		},
		animationTime: {
			get () {
        return this.simAnimationTime
      },
      set (value) {
        this.$store.commit('fit/setAnimationTime', value);
      }
		}
	},
	methods: {
		async getMoreSims() {
			this.$store.commit('fit/genSimSeed')
			await this.$store.dispatch('fit/loadSims')

		},

		async loadSimsForDate(date) {
			const closest = closestNeighbour(this.strategy.ts.data, date)
			this.$store.commit('fit/setSimStart', {
				value: closest[1],
				date: closest[0]
			});
			await this.$store.dispatch('fit/loadSims')
		},

		async reset() {
			this.isPlaying = false;
			clearTimeout(this.isPlayingTimeout)
			this.$refs.simChart.resetPos();
			this.$store.commit('fit/resetAnimationTime')
			this.$store.commit('fit/resetSimHorizon')
			this.$store.commit('fit/resetSimStart')
			await this.$store.dispatch('fit/loadSims')
		},

		autoPlaySims() {
			this.isPlaying = !this.isPlaying
			if(this.isPlaying) {
				this.autoPlay();
			}
			else {
				clearTimeout(this.isPlayingTimeout)
			}
		},

		autoPlay() {
			this.$store.commit('fit/setNextSim');
			this.isPlayingTimeout = setTimeout(() => {
				this.autoPlay()
			}, this.animationTime * 1000)
		}
	}
}
</script>

<style>
</style>