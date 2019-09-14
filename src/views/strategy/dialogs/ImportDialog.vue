<template>
	<v-dialog
		v-model="dialog"
		width="1100"
		:fullscreen="$vuetify.breakpoint.mdAndDown"
		style="z-index:-1"
	>
		<v-card>
			<v-toolbar dense color="#484848">
				<v-btn icon>
					<v-icon>cloud_upload</v-icon>
				</v-btn>
				<v-toolbar-title>Import</v-toolbar-title>
				<v-spacer></v-spacer>
				<v-btn icon @click.stop="dialog=false">
					<v-icon>close</v-icon>
				</v-btn>
			</v-toolbar>
			<div class="mrt-import">
				<div class="mrt-import-dynammic">
					<div class="one" :class="!plusOne ? 'slide-in' : 'slide-out'">
						<div class="import-component">
							<transition mode="out-in">
								<keep-alive>
									<component :is="importInput" :clear="show" @loaded="showSeries" @clear="clear"></component>
								</keep-alive>
							</transition>
							<v-menu
								v-model="imporMenu"
								bottom
								origin="center center"
								offset-x
								transition="slide-y-transition"
							>
								<v-btn slot="activator" small color="#0091EA" fab>
									<v-icon>more_vert</v-icon>
								</v-btn>
								<mrtImportOptions :isOpen="imporMenu" :importDefault="importInput" @change="setImportType" />
							</v-menu>
						</div>
						<div class="import-timeseries">
							<mrt-linechart
								:ts="timeseries"
								:height="380"
								:name="seriesName"
								backgroundColor="rgba(0, 0, 0, 0)"
							></mrt-linechart>
						</div>
					</div>
					<div class="plusOne" :class="plusOne ? 'slide-in' : 'slide-out'">
						<div class="top-panel">
							<div class="left-panel" :class="flip ? 'flip' : ''">
								<div class="import-component">
									<transition mode="out-in">
										<keep-alive>
											<component :is="importInputA" :clear="show" @loaded="showSeriesA" @clear="clearA"></component>
										</keep-alive>
									</transition>
									<v-menu
										v-model="imporMenuA"
										bottom
										origin="center center"
										offset-x
										transition="slide-y-transition"
									>
										<v-btn slot="activator" small color="#0091EA" fab dark>
											<v-icon>more_vert</v-icon>
										</v-btn>
										<mrtImportOptions
											:isOpen="imporMenuA"
											:importDefault="importInputA"
											@change="setImportTypeA"
										/>
									</v-menu>
								</div>
								<div class="import-timeseries">
									<mrt-linechart
										:ts="timeseriesA"
										:height="150"
										:name="seriesNameA"
										backgroundColor="rgba(0, 0, 0, 0)"
									></mrt-linechart>
								</div>
							</div>
							<div class="right-panel" :class="flip ? 'flip' : ''">
								<div class="import-component">
									<transition mode="out-in">
										<keep-alive>
											<component :is="importInputB" :clear="show" @loaded="showSeriesB" @clear="clearB"></component>
										</keep-alive>
									</transition>
									<v-menu
										v-model="imporMenuB"
										bottom
										origin="center center"
										offset-x
										transition="slide-y-transition"
									>
										<v-btn slot="activator" small color="#0091EA" fab dark>
											<v-icon>more_vert</v-icon>
										</v-btn>
										<mrtImportOptions
											:isOpen="imporMenuB"
											:importDefault="importInputB"
											@change="setImportTypeB"
										/>
									</v-menu>
								</div>
								<div class="import-timeseries">
									<mrt-linechart
										:ts="timeseriesB"
										:height="150"
										:name="seriesNameB"
										backgroundColor="rgba(0, 0, 0, 0)"
									></mrt-linechart>
								</div>
							</div>
						</div>
						<div class="middle-panel">
							<div class="controls">
								<div class="radios">
									<v-radio-group v-model="aggregator" :column="false" :height="20" :disabled="!hasTwo">
										<v-radio color="#0091EA" value="diff" label="Difference"></v-radio>
										<v-radio color="#0091EA" value="ratio" label="Ratio"></v-radio>
										<v-radio color="#0091EA" value="LSPairfit" label="Least Squares"></v-radio>
									</v-radio-group>
								</div>
								<v-switch
									color="#0091EA"
									label="Flip"
									class="flip"
									:loading="isLoadingLSE"
									:disabled="!hasTwo"
									v-model="flip"
								></v-switch>
								<div class="params" v-if="aggregator == 'LSPairfit'">
									<div class="param">
										<label>
											R
											<sup>2</sup>
										</label>
										<span v-if="isLoadingLSE">...</span>
										<span v-else>{{R2 | number(2)}}</span>
									</div>
									<div class="param">
										<label>Constant</label>
										<span v-if="isLoadingLSE">...</span>
										<span v-else>{{constant}}</span>
									</div>
									<div class="param">
										<label>Hedge Ratio</label>
										<span v-if="isLoadingLSE">...</span>
										<span v-else>{{hedgeRatio}}</span>
									</div>
								</div>
							</div>
							<div class="aggregated-timeseries">
								<mrt-linechart
									:ts="timeseriesC"
									:height="150"
									:name="`${seriesNameA} vs ${seriesNameB}`"
									backgroundColor="rgba(0, 0, 0, 0)"
								></mrt-linechart>
							</div>
						</div>
					</div>
					<div class="bottom-panel">
						<v-text-field
							v-model="fileName"
							:disabled="uploading"
							:loading="uploading"
							@keyup.native.enter="upload"
							label="Save As..."
							:error-messages="errorMessages"
							background-color="#323232"
							box
							ref="namefield"
							required
						></v-text-field>
						<div>
							<v-switch color="#ffeb3b" hide-details label="Plus One" v-model="plusOne"></v-switch>
							<v-btn color="#2196F3" :loading="uploading" :disabled="importDisabled" @click="upload">Import</v-btn>
						</div>
					</div>
				</div>
			</div>
		</v-card>
	</v-dialog>
</template>

<script>
import ApiController from "@/services/ApiController";
import LibrarySearch from "./ImportSearch";
import CSVSearch from "./ImportCSV";
import mrtLinechart from "@/components/LineChart";
import mrtImportOptions from "./ImportOptions";
import { getErrorCode } from "@/utils";

export default {
	props: {
		show: {
			type: Boolean,
			default: false
		},
		label: {
			type: String,
			default: "Select a ticker to import ..."
		}
	},
	data() {
		return {
			// One series
			seriesName: null,
			timeseries: [],

			// Two Series
			seriesNameA: null,
			seriesNameB: null,
			seriesNameC: null,
			timeseriesA: [],
			timeseriesB: [],
			timeseriesC: [],
			uploading: false,

			// Switches
			flip: false,
			plusOne: false,

			// Two series aggregation type - difference, ratio or Least Squares
			aggregator: "diff",

			// Menu One Series
			importInput: "CSVSearch",
			imporMenu: false,

			// Menu Two Series
			importInputA: "CSVSearch",
			imporMenuA: false,
			importInputB: "CSVSearch",
			imporMenuB: false,

			// LSE data
			isLoadingLSE: false,
			R2: 0,
			constant: "",
			hedgeRatio: "",

			// Name to save as
			saveAs: "",
			errorMessages: null
		};
	},
	components: {
		CSVSearch,
		LibrarySearch,
		mrtLinechart,
		mrtImportOptions
	},
	computed: {
		dialog: {
			get() {
				return this.show;
			},
			set(value) {
				if (!value) {
					this.reset();
					this.$emit("close");
				}
			}
		},
		importDisabled() {
			return this.fileName === null;
		},
		hasTwo() {
			return this.timeseriesA.length > 0 && this.timeseriesB.length > 0;
		},
		fileName: {
			get() {
				if (this.plusOne) {
					if (this.seriesNameA && this.seriesNameB) {
						return this.seriesNameC;
					}
				} else if (this.seriesName) {
					return this.seriesName;
				}
				return null;
			},
			set(value) {
				if (this.plusOne) {
					this.seriesNameC = value;
				} else {
					this.seriesName = value;
				}
			}
		}
	},
	watch: {
		importInput() {
			this.timeseries = [];
			this.seriesName = null;
		},
		importInputA() {
			this.timeseriesA = [];
			this.seriesNameA = null;
			this.timeseriesC = [];
			this.seriesNameC = null;
			this.aggregator = "diff";
		},
		importInputB() {
			this.timeseriesB = [];
			this.seriesNameB = null;
			this.timeseriesC = [];
			this.seriesNameC = null;
			this.aggregator = "diff";
		},
		timeseriesA() {
			this.calculateC();
		},
		timeseriesB() {
			this.calculateC();
		},
		aggregator() {
			this.calculateC();
		},
		flip() {
			this.calculateC();
		}
	},
	methods: {
		showSeries({ series, name }) {
			this.timeseries = series;
			this.seriesName = name;
		},

		showSeriesA({ series, name }) {
			this.timeseriesA = series;
			this.seriesNameA = name;
		},

		showSeriesB({ series, name }) {
			this.timeseriesB = series;
			this.seriesNameB = name;
		},

		clear() {
			this.timeseries = [];
			this.seriesName = null;
		},

		clearA() {
			this.timeseriesA = [];
			this.timeseriesC = [];
			this.seriesNameA = null;
			this.seriesNameC = null;
			this.aggregator = "diff";
		},

		clearB() {
			this.timeseriesB = [];
			this.timeseriesC = [];
			this.seriesNameB = null;
			this.seriesNameC = null;
			this.aggregator = "diff";
		},

		setImportType(type) {
			this.importInput = type;
		},

		setImportTypeA(type) {
			this.importInputA = type;
		},

		setImportTypeB(type) {
			this.importInputB = type;
		},

		calculateC() {
			if (this.timeseriesA.length > 0 && this.timeseriesB.length > 0) {
				const bucketsA = {};
				const bucketsB = {};
				const series = [];
				const op = this.aggregator;
				let tsA = this.timeseriesA;
				let tsB = this.timeseriesB;
				if (this.flip) {
					tsA = this.timeseriesB;
					tsB = this.timeseriesA;
				}

				if (op === "diff" || op === "ratio") {
					for (let i = 0; i < tsA.length; i++) {
						bucketsA[tsA[i][0]] = tsA[i][1];
					}

					for (let i = 0; i < tsB.length; i++) {
						bucketsB[tsB[i][0]] = tsB[i][1];
					}
				}

				switch (op) {
					case "diff":
						for (let p in bucketsA) {
							if (bucketsB[p]) {
								series.push([
									parseInt(p),
									bucketsA[p] - bucketsB[p]
								]);
							}
						}
						this.timeseriesC = series;
						break;
					case "ratio":
						for (let p in bucketsA) {
							if (bucketsB[p]) {
								series.push([
									parseInt(p),
									bucketsA[p] / bucketsB[p]
								]);
							}
						}
						this.timeseriesC = series;
						break;
					case "LSPairfit":
						this.isLoadingLSE = true;
						ApiController.fitLse({ ts1: tsA, ts2: tsB }).then(
							fit => {
								this.R2 = `${this.$options.filters.number(
									fit.R2,
									2
								)}`;
								this.constant = `${this.$options.filters.number(
									fit.constant,
									2
								)} \u00B1 ${this.$options.filters.number(
									fit.std_err_constant * fit["t-stat"],
									2
								)}`;
								this.hedgeRatio = `${this.$options.filters.number(
									fit.hedgeratio,
									2
								)} \u00B1 ${this.$options.filters.number(
									fit.std_err_hedgeratio * fit["t-stat"],
									2
								)}`;

								// Delay update util flip transition is finished
								// highcharts updates kill all animations
								setTimeout(() => {
									this.isLoadingLSE = false;
									this.timeseriesC = fit.pair_resid;
								}, 300);
							}
						);
						break;
				}

				this.seriesNameC = this.flip
					? `${this.seriesNameB} vs ${this.seriesNameA}`
					: `${this.seriesNameA} vs ${this.seriesNameB}`;
			}
		},

		async upload() {
			this.uploading = true;
			try {
				const strategy = await this.$store.dispatch(
					"strategies/upload",
					{
						fileName: this.plusOne
							? this.seriesNameC
							: this.seriesName,
						data: this.plusOne ? this.timeseriesC : this.timeseries,
						source: "COMBO"
					}
				);
				this.$store.commit("library/addLibrary", strategy);
				this.reset();
				this.$emit("close");
				window.scrollTo(0, 0);
			} catch (error) {
				const code = getErrorCode(error);
				if (code === "DUPLICATE_NAME") {
					this.errorMessages =
						"This Scenario already exists! Please provide a unique name";
				} else {
					this.errorMessages = "Unknown Error";
				}
				setTimeout(() => {
					this.errorMessages = null;
				}, 5000);
			} finally {
				this.uploading = false;
			}
		},

		reset() {
			this.seriesName = null;
			this.timeseries = [];

			// Two Series
			this.seriesNameA = null;
			this.seriesNameB = null;
			this.seriesNameC = null;
			this.timeseriesA = [];
			this.timeseriesB = [];
			this.timeseriesC = [];
			this.uploading = false;

			// Switches
			this.flip = false;

			// Two series aggregation type - difference, ratio or Least Squares
			this.aggregator = "diff";

			// Menu One Series
			this.importInput = "CSVSearch";
			this.imporMenu = false;

			// Menu Two Series
			this.importInputA = "CSVSearch";
			this.imporMenuA = false;
			this.importInputB = "CSVSearch";
			this.imporMenuB = false;

			// LSE data
			this.isLoadingLSE = false;
			this.R2 = 0;
			this.constant = "";
			this.hedgeRatio = "";

			this.saveAs = "";
		}
	}
};
</script>

<style lang="less">
.mrt-drop-menu {
	background-color: #424242;
	padding: 16px 32px 0 16px;
}
.mrt-import {
	background-color: #252525;
	.mrt-import-dynammic {
		position: relative;
		overflow: hidden;
		width: 100%;
	}
	.plusOne {
		width: 100%;
		position: absolute;
		top: 0px;
		display: block;
		will-change: transform;
		transform: translateX(100%);
		transition: transform 0.3s cubic-bezier(0.4, 0, 1, 1);
	}
	.one {
		width: 100%;
		padding: 12px;
		margin: 3px 0 0 0;
		display: block;
		will-change: transform;
		transform: translateX(100%);
		transition: transform 0.3s cubic-bezier(0.4, 0, 1, 1);
		.import-timeseries {
			margin: 24px 0 0 0;
			height: 388px;
			border-radius: 2px;
		}
	}
	.one.slide-in {
		display: block;
		transform: translateX(0%);
	}
	.one.slide-out {
		transform: translateX(100%);
	}
	.plusOne.slide-in {
		display: block;
		transform: translateX(0%);
	}
	.plusOne.slide-out {
		transform: translateX(-100%);
	}
	.import-timeseries {
		margin: 16px 0 0 0;
		height: 150px;
		border-radius: 2px;
	}
	.import-component {
		display: flex;
	}
	.top-panel {
		width: 100%;
		display: flex;
		margin: 3px 0 0 0;
		.left-panel,
		.right-panel {
			width: 50%;
			padding: 12px;
			border: solid #546e7a;
			background-color: #252525;
			will-change: transform;
			transition: all 0.3s cubic-bezier(0.4, 0, 1, 1);
		}
		.left-panel {
			border-width: 0px 1px 0px 0px;
		}
		.right-panel {
			border: solid #757575;
			border-width: 0 0 0px 1px;
		}
		.right-panel.flip {
			border-width: 0px 1px 0px 0px;
			transform: translateX(-100%);
		}
		.left-panel.flip {
			transform: translateX(100%);
			border-width: 0 0 0px 1px;
		}
	}
	.middle-panel {
		width: 100%;
		padding: 12px;
		margin: 0 0 0 0;
		border: solid #757575;
		border-width: 1px 0px 1px 0px;
		background-color: #252525;
		.controls {
			display: flex;
			justify-content: space-between;
			align-items: center;
			min-height: 72px;
			margin: -18px 0 0 0;
			.flip {
				flex: initial;
			}
			.params {
				display: flex;
				margin: 16px 0 16px 16px;
				.param {
					display: flex;
					flex-direction: column;
					margin: 0 24px 0 0;
					min-width: 20px;
					&:nth-child(1) {
						width: 40px;
					}
					&:nth-child(2) {
						width: 100px;
					}
					&:nth-child(3) {
						width: 100px;
						margin: 0 8px 0 0;
					}
					label {
						color: var(--light-gray);
						font-size: 12px;
					}
					> span {
						min-height: 22px;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
						display: block;
						> span {
							font-size: 10px;
						}
					}
				}
			}
		}
		.aggregated-timeseries {
			height: 150px;
			margin: -8px 0 12px 0;
		}
	}
	.bottom-panel {
		width: 100%;
		margin: 4px 0 0 0;
		text-align: center;
		padding: 12px 16px 8px 16px;
		background-color: #252525;
		> div {
			display: flex;
			align-items: center;
			justify-content: center;
			margin: -20px 0 0 0;
			button {
				margin: 8px 0 0 0;
			}
		}
	}

	.v-leave {
		opacity: 1;
	}
	.v-leave-active {
		transition: opacity 0.25s;
	}
	.v-leave-to {
		opacity: 0;
	}
	.v-enter {
		opacity: 0;
	}
	.v-enter-active {
		transition: opacity 0.25s;
	}
	.v-enter-to {
		opacity: 1;
	}
	.fade-enter-active {
		transition: opacity 0.5s;
	}
}
</style>
