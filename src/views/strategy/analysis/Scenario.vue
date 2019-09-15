<template>
	<div class="mrt-analysis">
		<div class="mrt-fit--details">
			<div class="selection">
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
			<div class="mrt-fit--actions">
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
			EventBus.$emit(
				"api-strategy-save",
				`${strategy.name} Strategy Saved`
			);
			this.$router.push("/library");
		},

		toggle() {
			this.$refs["fullscreen"].toggle();
		}
	}
};
</script>

<style lang="less">
.mrt-analysis {
	.v-stepper__step__step {
		color: #121212 !important;
	}
}

.mrt-text-field1 {
	background-color: #fff;
	.v-input__slot {
		margin-bottom: 0px !important;
	}
	.v-text-field__details {
		display: none;
		margin-bottom: 0px !important;
	}
	.error--text {
		.v-text-field__details {
			display: block;
			margin-bottom: 8px !important;
		}
		.v-input__slot {
			margin-bottom: 8px !important;
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
.mrt-fit--actions {
	display: flex;
	> div {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 0 16px;
		label {
			font-size: 11px;
			font-weight: 300;
			color: #fff;
		}
	}
}

.mrt-fit,
.mrt-analysis {
	will-change: transform;
	.auto-fit {
		display: flex;
		justify-content: flex-end;
		> div {
			flex: inherit;
			margin-top: -4px;
		}
	}
	.panel-2 {
		display: flex;
		margin: 0px 0;
		.panel {
			margin: 0;
		}
		.panel:nth-child(1) {
			margin-right: 0px;
		}
	}
	.panel {
		border: solid #607d8b;
		border-width: 0;
		padding: 16px;
		background-color: #252525;
		margin: 0px 0;
		h3 {
			text-transform: uppercase;
			font-weight: 300;
			margin: 8px 0 16px 0;
			color: #ffffff;
		}
	}
	.strategy {
		width: calc(100% - 300px);
		.graph {
			background-color: var(--bg-color);
		}
	}
	.strategy-result {
		width: 300px;
		> div {
			height: 100%;
			display: flex;
			flex-direction: column;
			justify-content: stretch;
		}
	}
	.residuals {
		.graphs {
			display: flex;
			.residual-graph {
				width: calc(100% - 300px);
			}
			.histogram-graph {
				width: 100px;
			}
		}
	}
}

@media screen and (max-width: 600px) {
}
</style>
