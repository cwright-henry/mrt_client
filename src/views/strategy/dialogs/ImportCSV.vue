<template>
	<div class="mrt-import-csv">
		<v-text-field
			prepend-icon="attach_file"
			:loading="parsing"
			:label="label"
			:disabled ="parsing"
			color="blue lighten-2"
			v-model="fileName"
			hide-details
			box
			readonly
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
	</div>
</template>

<script>
import moment from 'moment'
import {dateFormats} from '@/utils/dateformats'

const tsSorter = (a, b) => {
	if( a[0] < b[0]) return -1
	if( a[0] > b[0]) return 1
	return 0
}

const sniffFormat = (date) => {
	for(let format of dateFormats) {
		if(moment.utc(date, format, true).isValid()) {
			return format;
		}
	}
	return null;
}

export default {
	props: {
		clear: {
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
			parsing: false,
			dateFormat: dateFormats[0],
			showErrors: false,
			errors: []
		}
	},
	watch: {
		clear() {
			this.reset();
		}
	},
	activated() {
		this.reset();
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
						let date = moment.utc(data[0], this.dateFormat, true)
						let value = data[1]
						if(!date.isValid()) {
							const format = sniffFormat(data[0])
							if(format) {
								this.dateFormat = format;
								date = moment.utc(data[0], this.dateFormat, true)
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
				this.parsing = false
				this.errors = errors
				this.$emit('loaded', {
					series,
					errors,
					name: this.fileName.substring(0, this.fileName.lastIndexOf('.')),
					source: "CSV"
				})
			}
			filereader.onError = (e) => {
				this.parsing = false
				console.log(e)
				// TODO
				// Find What generates this error!!!
			}
		},

		reset() {
			this.fileName = ''
			this.parsing = false
		}
	}
}
</script>

<style scoped lang="less">
.mrt-import-csv {
	width:100%;
	input[type=file] {
		position:absolute;
		left:-999999px
	}
}
</style>