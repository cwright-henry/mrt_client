<template>
	<v-dialog v-model="dialog" width="1100" :fullscreen="$vuetify.breakpoint.mdAndDown">
		<v-card>
			<v-toolbar dense color="#827717">
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
				<div class="top-panel">
					<div class="left-panel">
						<div class="import-component">
							<transition mode="out-in">
								<keep-alive>
									<component :is="importInputA" :clear="show" @loaded="showSeriesA" @error="loadErrorA" @clear="clearA"></component>
								</keep-alive>
							</transition>
							<v-menu
								v-model="imporMenuA"
								bottom
								origin="center center"
								offset-x
								transition="slide-y-transition">
								<v-btn
									slot="activator"
									small
									color="#0091EA"
									fab
									dark>
									<v-icon>more_vert</v-icon>
								</v-btn>
								<mrtImportOptions :isOpen="imporMenuA" :importDefault="importInputA" @change="setImportTypeA"/>
							</v-menu>
						</div>
						<div class="import-timeseries">
							<mrt-linechart :ts="timeseriesA" :height="150" :name="seriesNameA" backgroundColor="rgba(0, 0, 0, 0)"></mrt-linechart>
						</div>
					</div>
					<div class="right-panel">
						<div class="import-component">
							<transition mode="out-in">
								<keep-alive>
									<component :is="importInputB" :clear="show" @loaded="showSeriesB" @error="loadErrorB" @clear="clearB"></component>
								</keep-alive>
							</transition>
							<v-menu
								v-model="imporMenuB"
								bottom
								origin="center center"
								offset-x
								transition="slide-y-transition">
								<v-btn
									slot="activator"
									small
									color="#0091EA"
									fab
									dark>
									<v-icon>more_vert</v-icon>
								</v-btn>
								<mrtImportOptions :isOpen="imporMenuB" :importDefault="importInputB" @change="setImportTypeB"/>
							</v-menu>
						</div>
						<div class="import-timeseries">
							<mrt-linechart :ts="timeseriesB" :height="150" :name="seriesNameB" backgroundColor="rgba(0, 0, 0, 0)"></mrt-linechart>
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
						<v-switch label="Flip" class="flip" :loading="isLoadingLSE" :disabled="!hasTwo" v-model="flip"></v-switch>
						<div class="params" v-if="aggregator == 'LSPairfit'">
							<div class="param">
								<label>R2</label>
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
							<div class="param">
								<label>T Statistic</label>
								<span v-if="isLoadingLSE">...</span>
								<span v-else>{{tStat | number(2)}}</span>
							</div>
						</div>
					</div>
					<div class="aggregated-timeseries">
						<mrt-linechart :ts="timeseriesC" :height="150" :name="seriesNameC" backgroundColor="rgba(0, 0, 0, 0)"></mrt-linechart>
					</div>
				</div>
				<div class="bottom-panel">
					<v-text-field
						v-model="fileName"
						@keyup.native.enter="upload"
						label="Save As..."
						box
						hide-details
						ref="namefield"
						required>
						</v-text-field>
					<div>
						<v-btn color="primary" :loading="uploading" :disabled="importDisabled" @click="upload">Import</v-btn>
					</div>
				</div>
			</div>
		</v-card>
	</v-dialog>  
</template>

<script>
import ApiController from '@/services/ApiController'
import CSV from './ImportCSV'
import TickerSearch from './ImportTicker'
import CurrencySearch from './ImportCurrency'
import CommoditySearch from './ImportCommodity'
import LibrarySearch from './ImportLibrary'
import IndexSearch from './ImportIndex'
import CryptoSearch from './ImportCrypto'
import mrtLinechart from '@/components/LineChart'
import mrtImportOptions from './ImportOptions'
import {EventBus} from '@/events'

export default {
	props: {
		show: {
			type: Boolean,
			default: false
		},
		label: {
			type: String,
			default: 'Select a ticker to import ...'
		}
	},
	data() {
		return {
			seriesNameA: null,
			seriesNameB: null,
			seriesNameC: null,
			timeseriesA: [],
			timeseriesB: [],
			timeseriesC: [],
			uploading: false,
			flip: false,

			aggregator: 'diff',
			importInputA: 'LibrarySearch',
			imporMenuA: false,
			importInputB: 'LibrarySearch',
			imporMenuB: false,

			// LSE
			isLoadingLSE: false,
			R2: 0,
			constant: '',
			hedgeRatio: '',
			tStat: 0
		}
	},
	components: {
		CSV,
		TickerSearch,
		CurrencySearch,
		CommoditySearch,
		LibrarySearch,
		IndexSearch,
		mrtLinechart,
		CryptoSearch,
		mrtImportOptions
	},
	computed: {
    dialog: {
      get () {
        return this.show
      },
      set (value) {
        if (!value) {
					this.reset()
          this.$emit('close')
        }
      }
		},
		importDisabled() {
			return this.fileName === null;
		},
		hasTwo() {
			return this.timeseriesA.length > 0 && this.timeseriesB.length > 0;
		},
		fileName() {
			if(this.seriesNameA && this.seriesNameB) {
				return this.flip ? `${this.seriesNameB} vs ${this.seriesNameA}` : `${this.seriesNameA} vs ${this.seriesNameB}`;
			}
			if(this.seriesNameA) {
				return this.seriesNameA;
			}
			if(this.seriesNameB) {
				return this.seriesNameB
			}
			return null;
		}
	},
	watch: {
		importInputA() {
			this.timeseriesA = [];
			this.seriesNameA = null;
			this.timeseriesC = []
			this.seriesNameC = null
			this.aggregator = 'diff'
		},
		importInputB() {
			this.timeseriesB = [];
			this.seriesNameB = null;
			this.timeseriesC = []
			this.seriesNameC = null
			this.aggregator = 'diff'
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
		showSeriesA({series, name}) {
			this.timeseriesA = series;
			this.seriesNameA = name;
		},

		showSeriesB({series, name}) {
			this.timeseriesB = series;
			this.seriesNameB = name;
		},

		clearA() {
			this.timeseriesA = []
			this.timeseriesC = []
			this.seriesNameA = null
			this.seriesNameC = null
			this.aggregator = 'diff'
		},

		clearB() {
			this.timeseriesB = []
			this.timeseriesC = []
			this.seriesNameB = null
			this.seriesNameC = null
			this.aggregator = 'diff'
		},

		loadErrorA({msg}) {
			this.timeseriesA = [];
			this.seriesNameA = null;
			EventBus.$emit('api-error', msg);  
		},

		loadErrorB({msg}) {
			this.timeseriesB = [];
			this.seriesNameB = null;
			EventBus.$emit('api-error', msg);  
		},

		setImportTypeA(type) {
			this.importInputA = type
		},

		setImportTypeB(type) {
			this.importInputB = type
		},

		async calculateC() {
			if(this.timeseriesA.length > 0 && this.timeseriesB.length > 0) {
				const bucketsA = {}
				const bucketsB = {}
				const series = []
				const op = this.aggregator;
				let tsA = this.timeseriesA;
				let tsB = this.timeseriesB;
				if(this.flip) {
					tsA = this.timeseriesB;
					tsB = this.timeseriesA;
				}

				if(op === 'diff' || op === 'ratio') {
					for(let i = 0; i < tsA.length; i++) {
						bucketsA[tsA[i][0]] = tsA[i][1]
					}

					for(let i = 0; i < tsB.length; i++) {
						bucketsB[tsB[i][0]] = tsB[i][1]
					}
				}

				switch(op) {
					case 'diff':
						for(let p in bucketsA) {
							if(bucketsB[p]) {
								series.push([parseInt(p), (bucketsA[p] - bucketsB[p])])	
							}
						}
						this.timeseriesC = series;
						break;
					case 'ratio':
						for(let p in bucketsA) {
							if(bucketsB[p]) {
								series.push([parseInt(p), (bucketsA[p] / bucketsB[p])])	
							}
						}
						this.timeseriesC = series;
						break;
					case 'LSPairfit':
						this.isLoadingLSE = true;
						const fit = await ApiController.fitLse({ts1: tsA, ts2: tsB});
						this.isLoadingLSE = false;
						this.timeseriesC = fit.pair_resid;
						this.R2 = `${this.$options.filters.number(fit.R2, 2)}`;
						this.constant = `${this.$options.filters.number(fit.constant, 2)} \u00B1 ${this.$options.filters.number(fit.std_err_constant, 2)}`;
						this.hedgeRatio = `${this.$options.filters.number(fit.hedgeratio, 2)} \u00B1 ${this.$options.filters.number(fit.std_err_hedgeratio, 2)}`;
						this.tStat = fit['t-stat'];
						break;
				}

				this.seriesNameC = this.flip ? `${this.seriesNameB} vs ${this.seriesNameA}` : `${this.seriesNameA} vs ${this.seriesNameB}`;
			}
		},

		async upload() {
			let series = null;
			if(this.timeseriesC.length > 0) {
				series = this.timeseriesC;
			}
			else if(this.timeseriesA.length > 0) {
				series = this.timeseriesA;
			}
			else if (this.timeseriesB.length > 0) {
				series = this.timeseriesB;
			}
			if(series) {
				this.uploading = true;
				try {
					const strategy = await this.$store.dispatch('strategies/upload', {
						fileName: this.fileName,
						data: series,
						source: 'COMBO'
					});
					this.$store.commit('dictionary/addLibrary', strategy)
					this.reset();
					this.$emit('close')
					window.scrollTo(0,0);
				}
				finally {
					this.uploading = false;
				}
			}
		},

		reset() {
			this.timeseriesA = []
			this.seriesNameA = ''
			this.timeseriesB = []
			this.seriesNameB = ''
			this.timeseriesC = []
			this.seriesNameC = ''
			this.fileName = ''
			this.aggregator= 'diff'
			this.importInputA = 'LibrarySearch'
			this.imporMenuA = false
			this.importInputB = 'LibrarySearch'
			this.imporMenuB = false
		}
	}
}
</script>

<style lang="less">
.mrt-drop-menu {
	background-color: #424242;
	padding:16px 32px 0 16px;
}
.mrt-import {
	display: flex;
	flex-wrap: wrap;
	background-color:#78909C;
	.top-panel {
		width:100%;
		display:flex;
		.left-panel, .right-panel {
			width:50%;
			padding:12px;
			border: solid #546E7A;
			border-width: 1px 1px 0px 1px;
			border-radius: 2px;
			background-color: #455A64;
		}
		.right-panel {
			border: solid #757575;
			border-width: 0 0 0px 1px;
		}
		.import-timeseries {
			margin: 16px 0 0 0;
			height:150px;
			border-radius: 2px;
		}
		.import-component {
			display:flex;
		}
	}
	.middle-panel {
		width: 100%;
		padding:12px;
		margin: 0 0 12px;
		border: solid #757575;
		border-width: 1px 0px 1px 0px;
		border-radius: 2px;
		background-color: #455A64;
		.controls {
			display:flex;
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
					margin:0 24px 0 0;
					min-width: 20px;
					&:nth-child(1) {
						width:40px;
					}
					&:nth-child(2) {
						width:100px;
					}
					&:nth-child(3) {
						width:100px;
					}
					&:nth-child(4) {
						width:60px;
						margin:0 8px 0 0;
					}
					label {
						color: var(--light-gray);
						font-size: 12px;
					}
					> span {
						min-height: 22px;
						display:block;
						> span {
							font-size: 10px;
						}
					}
				}
			}
		}
		.aggregated-timeseries {
			height:150px;
			margin:-8px 0 12px 0;
		}
	}
	.bottom-panel {
		width:100%;
		margin: -12px 0 0 0;
		text-align: center;
		padding: 0px 16px 8px 16px;
		background-color: #455A64;
		> div {
			padding: 8px 0 0 0;
		}
	}
	
	.v-leave { opacity: 1; }
	.v-leave-active { transition: opacity .25s }
	.v-leave-to { opacity: 0; }
	.v-enter { opacity: 0; }
	.v-enter-active  { transition: opacity .25s }
	.v-enter-to { opacity: 1; }
}

</style>
