<template>
	<div class="mrt-scenario">
		<div class="mrt-scenario--details">
			<div class="mrt-scenario--details-name">
				<v-text-field
					v-model="name"
					label="Name"
					color="#90CAF9"
					background-color="#323232"
					box
					hide-details
					ref="namefield"
					required
				></v-text-field>
			</div>
			<div class="mrt-scenario--details-action">
				<div>
					<v-btn small outline fab color="#2196F3" :disabled="isSavingFit" @click="home">
						<v-icon>home</v-icon>
					</v-btn>
					<label>Library</label>
				</div>
				<div>
					<v-btn small fab color="#2196F3" :loading="isSavingFit" @click="save">
						<v-icon>cloud_upload</v-icon>
					</v-btn>
					<label>Save Scenario</label>
				</div>
				<div>
					<v-btn small fab color="#2196F3" @click="toggle">
						<v-icon>fullscreen</v-icon>
					</v-btn>
					<label>Full Screen</label>
				</div>
			</div>
		</div>

		<fullscreen :fullscreen.sync="fullscreen" ref="fullscreen">
			<v-stepper v-model="activeTab">
				<v-stepper-header>
					<v-stepper-step editable color="#FFEE58" step="1">Fit Process</v-stepper-step>
					<v-divider></v-divider>
					<v-stepper-step editable color="#FFEE58" step="2">Run Simulations</v-stepper-step>
					<v-divider></v-divider>
					<v-stepper-step editable color="#FFEE58" step="3">Stop Loss / Take Profit</v-stepper-step>
				</v-stepper-header>

				<v-stepper-items>
					<v-stepper-content step="1" style="padding:0">
						<mrt-fit />
					</v-stepper-content>
					<v-stepper-content step="2" style="padding:0">
						<mrt-sims />
					</v-stepper-content>
					<v-stepper-content step="3" style="padding:0">
						<mrt-sltp />
					</v-stepper-content>
				</v-stepper-items>
			</v-stepper>
		</fullscreen>
	</div>
</template>

<script>
import mrtSims from "./Sim";
import mrtFit from "./Fit";
import mrtSltp from "./Sltp";
import { EventBus } from "@/events";
import { mapState, mapGetters } from "vuex";

export default {
	name: "MRT_SCENARIO",
	data() {
		return {
			fullscreen: false
		};
	},
	props: {
		id: {
			type: String,
			default: ""
		}
	},
	activated() {
		this.load();
	},
	components: {
		mrtFit,
		mrtSims,
		mrtSltp
	},
	computed: {
		...mapState("fit", [
			"strategy",
			"isFittingTS",
			"isLoadingTS",
			"isSavingFit"
		]),
		...mapGetters("strategies", ["findStrategy"]),
		activeTab: {
			get() {
				return this.$store.state.fit.activeTab;
			},
			set(value) {
				this.$store.commit("fit/setActiveTab", value);
			}
		},
		name: {
			get() {
				return this.$store.state.fit.strategy.name;
			},
			set(value) {
				this.$store.commit("fit/setStrategyName", value);
			}
		}
	},
	methods: {
		/**
		 * Look in cache, if not there then load strategy and
		 * Async load all stratgies
		 */
		async load() {
			if (this.id) {
				this.autoFit = true;
				const strategy = this.findStrategy(this.id);
				if (strategy) {
					await this.$store.dispatch("fit/setStrategy", strategy);
				} else {
					await this.$store.dispatch("fit/loadStrategy", {
						id: this.id
					});
					this.$store.dispatch("strategies/load", {});
				}
			}
		},

		async save() {
			const strategy = await this.$store.dispatch("fit/save", {
				id: this.id
			});
			this.$store.commit("strategies/updateStrategy", strategy);
			EventBus.$emit("api-save", `${strategy.name} Saved!`);
		},

		home() {
			this.$router.push("/library");
		},

		toggle() {
			this.$refs["fullscreen"].toggle();
		}
	}
};
</script>

<style lang="less">
.mrt-scenario {
	.v-stepper__step__step {
		color: #121212 !important;
	}
	.mrt-scenario--details {
		display: flex;
		justify-content: space-between;
		margin: 0 0 24px;
		.mrt-scenario--details-name {
			width: 400px;
		}
		.mrt-scenario--details-action {
			display: flex;
			margin: 0 16px 0 0;
			> div {
				display: flex;
				flex-direction: column;
				align-items: center;
				margin: 0 0 0 36px;
			}
			label {
				color: #e0e0e0;
				font-weight: 300;
				font-size: 12px;
				line-height: 1.3;
			}
		}
	}
}

.fullscreen {
}

.mrt-fit--details {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin: 0 0 24px 0;
	.selection {
		display: flex;
		> div {
			width: 400px;
		}
	}
}

@media screen and (max-width: 600px) {
}
</style>
