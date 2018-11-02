<template>
	<v-dialog v-model="dialog" width="900" :fullscreen="$vuetify.breakpoint.mdAndDown">
		<v-card>
			<v-toolbar dense>
				<v-btn icon>
					<v-icon>cloud_upload</v-icon>
				</v-btn>
				<v-toolbar-title>Import from Alphavantage</v-toolbar-title>
				<v-spacer></v-spacer>
				<v-btn icon @click.stop="dialog=false">
					<v-icon>close</v-icon>
				</v-btn>
			</v-toolbar>
			<v-container fluid grid-list-lg>
				<v-layout row wrap justify-center align-center>
					<v-flex xs6>
						<v-text-field
							@keyup.native.enter="submitTickerA"
							:loading="loadingA"
							:disabled="uploading"
							placeholder="Select Ticker A..."
							v-model="tickerNameA"
							single-line
							clearable
							hide-details
							box
							ref="fileTextFieldA">
						</v-text-field>
					</v-flex>
					<v-flex xs6>
						<v-text-field
							@keyup.native.enter="submitTickerB"
							:loading="loadingB"
							:disabled="uploading"
							placeholder="Select Ticker B..."
							v-model="tickerNameB"
							single-line
							clearable
							hide-details
							box
							ref="fileTextFieldB">
						</v-text-field>
					</v-flex>
					<v-flex xs6>
						<mrt-linechart :ts="timeseriesA" :height=120 :name="tickerNameA" backgroundColor="rgba(0, 0, 0, 0.1)"></mrt-linechart>
					</v-flex>
					<v-flex xs6>
						<mrt-linechart :ts="timeseriesB" :height=120 :name="tickerNameB" backgroundColor="rgba(0, 0, 0, 0.1)"></mrt-linechart>
					</v-flex>
					<v-flex xs12>
						<mrt-linechart :ts="timeseriesC" :height=120 :name="tickerNameC" backgroundColor="rgba(0, 0, 0, 0.1)"></mrt-linechart>
					</v-flex>
					<v-flex xs12>
						<mrt-fit 
							:kappa.sync="fit.kappa"
							:sigma.sync="fit.sigma"
							:theta.sync="fit.theta"
							:adf_stat.sync="fit.adf_stat"
							:p_val.sync="fit.p_val"
							:sig_lev.sync="fit.sig_lev"
							breakpoints="md2 xs4"
							:readonly=true>
						</mrt-fit>
					</v-flex>
					<v-flex xs12>
						<v-text-field
							v-model="fileName"
							@keyup.native.enter="upload"
							label="Save As..."
							box
							ref="namefield"
							required>
							</v-text-field>
					</v-flex>
					<v-flex xs12>
						<div class="mrt-upload-controls">
							<v-btn color="primary" :loading="uploading" :disabled="importDisabled" @click="upload">Import</v-btn>
						</div>
					</v-flex>
				</v-layout>
			</v-container>
		</v-card>
	</v-dialog>  
</template>

<script>
import mrtLinechart from '@/components/LineChart'
import mrtFit from '@/components/Fit'
import ApiController from '@/services/ApiController'

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
			tickerNameA: '',
			tickerNameB: '',
			tickerNameC: '',
			loadingA: false,
			loadingB: false,
			timeseriesA: [],
			timeseriesB: [],
			timeseriesC: [],
			uploading: false,
			fit: {},
			fileName: ''
		}
	},
	components: {
		mrtLinechart,
		mrtFit
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
			return this.name == '' || this.timeseriesC.length === 0
		}
	},
	watch: {
		timeseriesA() {
			this.calculateC();
		},
		timeseriesB() {
			this.calculateC();
		}
	},
	methods: {
		async submitTickerA() {
			this.loadingA = true;
			try {
				this.timeseriesA = await ApiController.loadAv(this.tickerNameA);
				this.loadingA = false;
			}
			catch(e) {
				this.loadingA = false;
				console.log(e)
			}
		},

		async submitTickerB() {
			this.loadingB = true;
			try {
				this.timeseriesB = await ApiController.loadAv(this.tickerNameB);
				this.loadingB = false;
			}
			catch(e) {
				this.loadingB = false;
				console.log(e)
			}
		},

		async upload() {
			this.uploading = true;
			try {
				await ApiController.upload(this.fileName, this.timeseriesC, this.fit, 'Alphavantage')
				this.reset();
				this.$store.dispatch('library/load', {page: 1, nameFilter: ''});
				this.$emit('close')
			}
			catch(e) {
				this.uploading = false;
				console.log(e)
			}
		},

		reset() {
			this.tickerNameA = ''
			this.tickerNameB = ''
			this.loadingA = false
			this.loadingB = false
			this.timeseriesA = []
			this.timeseriesB = []
			this.timeseriesC = []
			this.uploading = false
			this.fit = {}
			this.fileName = ''
		},

		calculateC() {
			if(this.timeseriesA.length > 0 && this.timeseriesB.length > 0) {
				const bucketsA = {}
				const bucketsB = {}
				const series = []
				this.loadingA = true
				this.loadingB = true

				for(let i = 0; i < this.timeseriesA.length; i++) {
					bucketsA[this.timeseriesA[i][0]] = this.timeseriesA[i][1]
				}

				for(let i = 0; i < this.timeseriesB.length; i++) {
					bucketsB[this.timeseriesB[i][0]] = this.timeseriesB[i][1]
				}

				for(let p in bucketsA) {
					if(bucketsB[p]) {
						let y = bucketsA[p] / bucketsB[p]
						series.push([parseInt(p), y])	
					}
				}
				
				if(series.length > 0) {
					this.timeseriesC = series;
					ApiController.fit(series)
					.then((data) => {
						this.fit = data
						this.loadingA = false
						this.loadingB = false
						this.tickerNameC = this.fileName = `${this.tickerNameA} vs ${this.tickerNameB}`
						this.$refs.namefield.focus()
					})
					.catch((e) => {
						console.log(e)
						this.loadingA = false
						this.loadingB = false
					})
				}
			}
		}
	}
}
</script>

<style scoped lang="less">
	.mrt-upload-controls {
		display: flex;
		justify-content: flex-end;
		margin: -24px -8px -8px 0;
	}
	.mrt-selected-date {
		color: var(--green);
	}
	.mrt--small-text {
		color:var(--light-gray);
		font-size:11px;
		display:block;
	}
	.mrt-upload--error {
		display:flex;
		> div {
			min-width:20px;
			margin: 0 8px 0 0
		}
		> div:nth-child(1) {
			width:40px;
		}
		> div:nth-child(2) {
			width:70px
		}
	}
	.v-list--dense .v-list__tile {
		height:32px;
	}
</style>