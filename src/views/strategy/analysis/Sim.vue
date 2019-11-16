<template>
	<div class="simulations">
		<div class="sim-header">
			<mrt-sim-parameters />
			<div class="sim-action">
				<v-btn small fab color="#0091EA" :loading="isLoadingSims" @click="getMoreSims">
					<v-icon>autorenew</v-icon>
				</v-btn>
				<label>New Sims</label>
			</div>
		</div>
		<div class="sim-graph">
			<mrt-simchart ref="simChart" @startdate="loadSimsForDate"></mrt-simchart>
		</div>
		<div class="sim-controls">
			<div class="horizon">
				<v-select
					v-model="horizon"
					:items="simhorizons"
					:loading="isLoadingSims"
					:disabled="selectedSim == null"
					dense
					box
					hide-details
					return-object
					flat
					color="#FFF"
					background-color="#424242"
					label="Horizon"
				></v-select>
			</div>
			<div class="play">
				<div class="thumb-slider">
					<v-slider
						v-model="animationTime"
						:thumb-size="28"
						:disabled="selectedSim == null"
						label="Interval"
						:min="0.5"
						:max="8"
						step="0.5"
						ticks="always"
						tick-size="1"
						thumb-label="always"
					>
						<template slot="thumb-label" slot-scope="props">
							<span>{{ `${props.value}s` }}</span>
						</template>
					</v-slider>
				</div>
				<div class="sim-action">
					<v-btn
						small
						fab
						color="#0091EA"
						:disabled="selectedSim == null"
						:loading="isLoadingSims"
						@click="autoPlaySims"
					>
						<v-icon>{{isPlaying ? 'pause' : 'play_arrow'}}</v-icon>
					</v-btn>
					<label>{{isPlaying ? 'Stop' : 'Animate'}}</label>
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
import mrtFitProcess from "@/components/fit/Fit";
import mrtSimsSparklineChart from "./SimsSparklineChart";
import mrtSimchart from "./SimsChart";
import mrtSimParameters from "./SimParameters";
import { mapState } from "vuex";
import { closestNeighbour } from "@/utils";

export default {
	data() {
		return {
			isPlaying: false,
			isPlayingTimeout: null
		};
	},
	components: {
		mrtSimchart,
		mrtSimsSparklineChart,
		mrtFitProcess,
		mrtSimParameters
	},
	computed: {
		...mapState("fit", ["strategy"]),
		...mapState("fit/sims", [
			"isLoadingSims",
			"sims",
			"selectedSim",
			"simHorizon",
			"simhorizons",
			"simAnimationTime"
		]),
		horizon: {
			get() {
				return this.simHorizon;
			},
			set(value) {
				this.$store.commit("fit/sims/setSimHorizon", value);
				this.$store.dispatch("fit/sims/loadSims");
			}
		},
		animationTime: {
			get() {
				return this.simAnimationTime;
			},
			set(value) {
				this.$store.commit("fit/sims/setAnimationTime", value);
			}
		}
	},
	watch: {
		selectedSim(value) {
			if (value == null) {
				clearTimeout(this.isPlayingTimeout);
			}
		}
	},
	methods: {
		async getMoreSims() {
			await this.$store.commit("fit/sims/setSimSeed");
			await this.$store.dispatch("fit/sims/loadSims");
		},

		async loadSimsForDate(event) {
			const closest = closestNeighbour(this.strategy.ts.data, event.date);
			this.$store.commit("fit/sims/setSimStart", {
				value: closest[1],
				date: closest[0]
			});
			if (event.type === "end") {
				await this.$store.dispatch("fit/sims/loadSims");
			}
		},

		autoPlaySims() {
			this.isPlaying = !this.isPlaying;
			if (this.isPlaying) {
				this.autoPlay();
			} else {
				clearTimeout(this.isPlayingTimeout);
			}
		},

		autoPlay() {
			this.$store.commit("fit/sims/setNextSim");
			this.isPlayingTimeout = setTimeout(() => {
				this.autoPlay();
			}, this.animationTime * 1000);
		}
	}
};
</script>

<style lang="less" scoped>
.simulations {
	background-color: #252525;
	padding: 16px;
	.sim-action {
		display: flex;
		flex-direction: column;
		align-items: center;
		label {
			color: #e0e0e0;
			font-size: 12px;
			font-weight: 300;
		}
	}
	.sim-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		margin: 0 0 12px;
	}
	.sim-graph {
		width: calc(100% - 0px);
	}
	.sim-controls {
		display: flex;
		justify-content: space-between;
		padding: 24px 0 16px;
		margin: 0 0 16px;
		.play {
			display: flex;
			.thumb-slider {
				margin: 0 16px 0 0;
			}
		}
		.horizon {
			width: 220px;
		}
	}
	ul.sparklines-graph {
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		list-style: none;
		padding: 0;
		li {
			width: auto;
		}
	}
}
</style>