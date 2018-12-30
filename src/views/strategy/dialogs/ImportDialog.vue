<template>
	<v-dialog v-model="dialog" width="1100" :fullscreen="$vuetify.breakpoint.mdAndDown">
		<v-card>
			<v-toolbar dense color="blue darken-2">
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
									<component :is="importInputA" :clear="show" @loaded="showSeriesA" @error="loadErrorA"></component>
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
									color="blue darken-2"
									fab
									dark>
									<v-icon>more_vert</v-icon>
								</v-btn>
								<div class="mrt-drop-menu">
									<p>Import Options</p>
									<v-radio-group v-model="importInputA">
										<v-radio color="orange" :value="item.value" :label="item.title" v-for="(item, i) in importTypes" :key="i"></v-radio>
									</v-radio-group>
								</div>
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
									<component :is="importInputB" :clear="show" @loaded="showSeriesB" @error="loadErrorB"></component>
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
									color="blue darken-2"
									fab
									dark>
									<v-icon>more_vert</v-icon>
								</v-btn>
								<div class="mrt-drop-menu">
									<p>Import Options</p>
									<v-radio-group v-model="importInputB">
										<v-radio color="orange" :value="item.value" :label="item.title" v-for="(item, i) in importTypes" :key="i"></v-radio>
									</v-radio-group>
								</div>
							</v-menu>
						</div>
						<div class="import-timeseries">
							<mrt-linechart :ts="timeseriesB" :height="150" :name="seriesNameB" backgroundColor="rgba(0, 0, 0, 0)"></mrt-linechart>
						</div>
					</div>
				</div>
				<div class="middle-panel">
					<v-radio-group v-model="aggregator" :column="false" :height="20">
						<v-radio color="blue darken-1" value="diff" label="Difference"></v-radio>
						<v-radio color="blue darken-1" value="ratio" label="Ratio"></v-radio>
					</v-radio-group>
					<div class="aggregated-timeseries">
						<mrt-linechart :ts="timeseriesC" :height="150" :name="seriesNameC" backgroundColor="rgba(0, 0, 0, 0)"></mrt-linechart>
					</div>
					<v-text-field
						v-model="fileName"
						@keyup.native.enter="upload"
						label="Save As..."
						box
						hide-details
						ref="namefield"
						required>
						</v-text-field>
				</div>
				<div class="bottom-panel">
					<v-btn color="primary" :loading="uploading" :disabled="importDisabled" @click="upload">Import</v-btn>
				</div>
			</div>
		</v-card>
	</v-dialog>  
</template>

<script>
import CSV from './ImportCSV'
import TickerSearch from './ImportTicker'
import CurrencySearch from './ImportCurrency'
import CommoditySearch from './ImportCommodity'
import LibrarySearch from './ImportLibrary'
import IndexSearch from './ImportIndex'
import CryptoSearch from './ImportCrypto'
import mrtLinechart from '@/components/LineChart'
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
			seriesNameA: '',
			seriesNameB: '',
			seriesNameC: '',
			timeseriesA: [],
			timeseriesB: [],
			timeseriesC: [],
			uploading: false,
			fileName: '',

			aggregator: 'diff',
			importInputA: 'CommoditySearch',
			imporMenuA: false,
			importInputB: 'CommoditySearch',
			imporMenuB: false,
			importTypes: [
				{title: 'Commodity', value: "CommoditySearch"},
				{title: 'Crypto', value: "CryptoSearch"},
				{title: 'CSV File', value: "CSV"},
				{title: 'Currency', value: "CurrencySearch"},
				{title: 'Equity', value: "TickerSearch"},
				{title: 'Index', value: "IndexSearch"},
				{title: 'My Library',value: "LibrarySearch"}
			]
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
		CryptoSearch
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
			return this.fileName == '' || this.timeseriesC.length === 0
		}
	},
	watch: {
		importInputA() {
			this.timeseriesA = [];
			this.seriesNameA = '';
		},
		importInputB() {
			this.timeseriesB = [];
			this.seriesNameB = '';
		},
		timeseriesA() {
			this.calculateC();
		},
		timeseriesB() {
			this.calculateC();
		},
		aggregator() {
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

		loadErrorA({msg}) {
			this.timeseriesA = [];
			this.seriesNameA = '';
			EventBus.$emit('api-error', msg);  
		},

		loadErrorB({msg}) {
			this.timeseriesB = [];
			this.seriesNameB = '';
			EventBus.$emit('api-error', msg);  
		},

		calculateC() {
			if(this.timeseriesA.length > 0 && this.timeseriesB.length > 0) {
				const bucketsA = {}
				const bucketsB = {}
				const series = []
				const op = this.aggregator;

				for(let i = 0; i < this.timeseriesA.length; i++) {
					bucketsA[this.timeseriesA[i][0]] = this.timeseriesA[i][1]
				}

				for(let i = 0; i < this.timeseriesB.length; i++) {
					bucketsB[this.timeseriesB[i][0]] = this.timeseriesB[i][1]
				}

				for(let p in bucketsA) {
					if(bucketsB[p]) {
						let y = (op === 'ratio' ? (bucketsA[p] / bucketsB[p]) : (bucketsA[p] - bucketsB[p]))
						series.push([parseInt(p), y])	
					}
				}
				this.timeseriesC = series;
				this.seriesNameC = this.fileName = `${this.seriesNameA} vs ${this.seriesNameB}`
			}
		},

		upload() {
			this.uploading = true;
			try {
				this.$store.dispatch('strategies/upload', {
					fileName: this.fileName,
					data: this.timeseriesC,
					source: 'COMBO'
				});
				this.reset();
				this.$emit('close')
				window.scrollTo(0,0);
			}
			finally {
				this.uploading = false;
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
			this.importInputA = 'CommoditySearch'
			this.imporMenuA = false
			this.importInputB = 'CommoditySearch'
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
	background-color:#424242;
	.top-panel {
		width:100%;
		display:flex;
		.left-panel, .right-panel {
			width:50%;
			padding:16px;
			border: solid #757575;
			border-width: 0 0 1px 0;
		}
		.right-panel {
			border: solid #757575;
			border-width: 0 0 1px 1px;
		}
		.import-timeseries {
			margin: 16px 0 0 0;
			height:150px;
			background-color: rgba(0,0,0,0.1);
			border-radius: 2px;
		}
		.import-component {
			display:flex;
		}
	}
	.middle-panel {
		width:100%;
		margin-top: -4px;
		padding:0 16px 16px 16px;
		border: solid #757575;
		border-width: 0 0 1px 0;
		.aggregated-timeseries {
			height:150px;
			background-color: rgba(0,0,0,0.1);
			margin:-8px 0 12px 0;
		}
	}
	.bottom-panel {
		width:100%;
		padding:8px 8px 8px;
		text-align: right;
	}
	
	.v-leave { opacity: 1; }
	.v-leave-active { transition: opacity .25s }
	.v-leave-to { opacity: 0; }
	.v-enter { opacity: 0; }
	.v-enter-active  { transition: opacity .25s }
	.v-enter-to { opacity: 1; }
}

</style>
