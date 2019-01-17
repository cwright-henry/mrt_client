<template>
	<v-select
		prepend-icon="account_balance"
		v-model="ticker"
		:loading="loading"
		:disabled="loading"
		:items="commodities"
		item-text="name"
    item-value="curr_id"
		color="blue lighten-2"
		hide-details
		box
		dense
		dark
		return-object
		clearable
		@change="findSeries"
		label="Choose a Commodity">
	</v-select>
</template>

<script>
import ApiController from '@/services/ApiController'
import {mapState} from 'vuex'

export default {
	props: {
		clear: {
			type: Boolean,
			default: false
		}
	},
	data: () => ({
		loading: false,
		ticker: ''
	}),
	computed: {
		...mapState('dictionary', ['commodities'])
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
		async findSeries(value) {
			this.loading = true
			try {
				if(value) {
					let series = await ApiController.findSeries(value.curr_id, value.source)
					this.$emit('loaded', {
						series: series.data,
						name: value.name,
						source: value.source
					})
				}
				else {
					this.$emit('clear')
				}
			}
			finally {
				this.loading = false	
			}
		}
	}
}
</script>