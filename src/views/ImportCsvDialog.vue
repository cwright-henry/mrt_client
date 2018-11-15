<template>
	<v-dialog v-model="dialog" width="800" :fullscreen="$vuetify.breakpoint.mdAndDown">
		<v-card>
			<v-toolbar dense>
				<v-btn icon>
					<v-icon>cloud_upload</v-icon>
				</v-btn>
				<v-toolbar-title>Import from CSV</v-toolbar-title>
				<v-spacer></v-spacer>
				<v-btn icon @click.stop="dialog=false">
					<v-icon>close</v-icon>
				</v-btn>
			</v-toolbar>
			<v-container fluid grid-list-lg>
				<v-layout row wrap justify-center align-center>
					<v-flex xs12>
						<v-text-field
							prepend-icon="attach_file"
							:loading="parsing"
							:placeholder="label"
							:disabled ="uploading"
							v-model="fileName"
							single-line
							clearable
							hide-details
							box
							:append-outer-icon="errors.length !== 0 ? 'warning' : ''"
							@click:append-outer="showErrors=true"
							@click.native="onFocus"
							ref="fileTextField">
						</v-text-field>
						<input
							type="file"
							:accept="accept"
							ref="fileInput"
							@change="onFileChange"/>
					</v-flex>
					<v-flex xs12>
						<mrt-linechart :ts="timeseries" :name="timeseriesName" backgroundColor="rgba(0, 0, 0, 0.1)"></mrt-linechart>
					</v-flex>
					<v-flex xs12>
						<v-text-field
							v-model="fileName"
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
					<mrt-parse-errors 
						:show="showErrors"
						:errors="errors"
						@close="showErrors=false">
					</mrt-parse-errors>
				</v-layout>
			</v-container>
		</v-card>
	</v-dialog>  
</template>

<script>
import moment from 'moment'
import {dateFormats} from '@/utils/dateformats'
import mrtLinechart from '@/components/LineChart'
import mrtParseErrors from '@/views/ParseCsvErrorsDialog'
import ApiController from '@/services/ApiController'

const tsSorter = (a, b) => {
	if( a[0] < b[0]) return -1
	if( a[0] > b[0]) return 1
	return 0
}

const sniffFormat = (date) => {
	for(let format of dateFormats) {
		if(moment(date, format, true).isValid()) {
			return format;
		}
	}
	return null;
}

export default {
	props: {
		show: {
			type: Boolean,
			default: false
		},
		label: {
			type: String,
			default: 'Select a file to import...'
		},
		accept: {
			type:String,
			default: '.csv'
		}
	},
	data() {
		return {
			fileName: '',
			timeseries: [],
			timeseriesName: '',
			errors: [],
			uploading: false,
			parsing: false,
			dateFormat: dateFormats[0],
			showErrors: false
		}
	},
	components: {
		mrtLinechart,
		mrtParseErrors
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
			return this.timeseries.length === 0
		}
  },
	methods: {
		onFocus() {
			if(!this.disabled) {
				this.$refs.fileInput.click();
			}
		},
		onFileChange($event) {
			const file = $event.target.files[0]
			if(file) {
				this.fileName = file.name
				this.parseFile(file)
			}
			this.$refs.fileInput.value = ''
		},
		parseFile(file) {
			this.parsing = true

			const filereader = new FileReader();
			filereader.readAsText(file);
			filereader.onload = () => {
				const lines = filereader.result.split(/\r\n|\n/);
				const series = [];
				const errors = [];
        for (let i = 1; i < lines.length; i++) {
					let data = lines[i].split(',')
					if(data[0] && data[1]) {
						let date = moment(data[0], this.dateFormat, true)
						let value = data[1]
						if(!date.isValid()) {
							const format = sniffFormat(data[0])
							if(format) {
								this.dateFormat = format;
								date = moment(data[0], this.dateFormat, true)
								if(!isNaN(value)) {
									series.push([date.valueOf(), parseFloat(value)])		
								}
								else {
									errors.push({line:i, date:data[0], value:data[1]})
								}
							}
							else {
								errors.push({line:i, date:data[0], value:data[1]})
							}
						}
						else {
							if(!isNaN(value)) {
								series.push([date.valueOf(), parseFloat(value)])		
							}
							else {
								errors.push({line:i, date:data[0], value:data[1]})
							}
						}
					}
				}

				series.sort(tsSorter)
				this.timeseries = series
				this.errors = errors;
				this.parsing = false
				this.timeseriesName = this.fileName = this.fileName.substring(0, this.fileName.lastIndexOf('.'));
				this.$refs.namefield.focus()
			}
			filereader.onError = (e) => {
				this.parsing = false
				console.log(e)
				// TODO
				// Find What generates this error!!!
			}
		},

		async upload() {
			this.uploading = true;
			try {
				await ApiController.upload(this.fileName, this.timeseries, this.fit, 'CSV')
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
			this.fileName = ''
			this.timeseries = []
			this.timeseriesName = ''
			this.errors = []
			this.uploading = false
			this.parsing = false
		}
	}
}
</script>

<style scoped lang="less">
	input[type=file] {
		position:absolute;
		left:-999999px
	}
	.mrt-upload-controls {
		display: flex;
		justify-content: flex-end;
		margin: -24px -8px -8px 0;
	}
</style>