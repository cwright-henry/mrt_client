<template>
	<v-text-field
		@keyup.native.enter="findSeries"
		prepend-icon="search"
		:loading="loading"
		:disabled="loading"
		:error-messages="errorMessages"
		class="mrt-import-ticker"
		label="Enter Ticker..."
		color="blue lighten-2"
		v-model="ticker"
		box
		background-color="rgba(0,0,0,0.1)"
		return-object
		ref="tickerTextField">
	</v-text-field>
</template>

<script>
import ApiController from '@/services/ApiController'
import {getErrorCode} from '@/utils'

export default {
	props: {
		clear: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			loading: false,
			uploading: false,
			ticker: '',
			errorMessages: null
		}
	},
	watch: {
		clear() {
			this.ticker = ''
		}
	},
	activated() {
		this.ticker = ''
	},
	methods: {
		async findSeries() {
			this.loading = true
			this.errorMessages = null
			try {
				let series = await ApiController.findSeries(this.ticker, 'Alphavantage')
				this.$emit('loaded', {
					series: series.data,
					name: this.ticker,
					source: 'Alphavantage'
				})
			}
			catch(error) {
				this.$emit('clear')
				const code = getErrorCode(error);
				if(code === 'UNKNOWN_TICKER') {
					this.errorMessages = `Unable to find data for ticker ${this.ticker}`;
					setTimeout(() => {
						this.errorMessages = null
					}, 5000);
				}
			}
			finally {
				this.loading = false	
			}
		}
	}
}
</script>

<style lang="less">
.mrt-import-ticker {
	margin: 0 0 -28px 0 !important; 
}
</style>
