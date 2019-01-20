<template>
	<v-text-field
		@keyup.native.enter="findSeries"
		prepend-icon="search"
		:loading="loading"
		:disabled="loading"
		label="Enter Ticker..."
		color="blue lighten-2"
		v-model="ticker"
		hide-details
		box
		background-color="rgba(0,0,0,0.1)"
		return-object
		ref="tickerTextField">
	</v-text-field>
</template>

<script>
import ApiController from '@/services/ApiController'

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
			ticker: ''
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
			try {
				let series = await ApiController.findSeries(this.ticker, 'Alphavantage')
				this.$emit('loaded', {
					series: series.data,
					name: this.ticker,
					source: 'Alphavantage'
				})
			}
			catch(e) {
				this.$emit('error', e.response.data)
			}
			finally {
				this.loading = false	
			}
		}
	}
}
</script>

<style>

</style>
