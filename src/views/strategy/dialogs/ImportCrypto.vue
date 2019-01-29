<template>
	<v-select
		prepend-icon="home"
		v-model="ticker"
		:items="cryptos"
		:loading="loading"
		item-text="name"
    item-value="curr_id"
		color="blue lighten-2"
		hide-details
		box
		dense
		return-object
		@change="findSeries"
		label="Choose a Crypto Currency">
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
		ticker: '',
		loading: false
	}),
	computed: {
		...mapState('dictionary', ['cryptos'])
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
				let series = await ApiController.findSeries(value.curr_id, value.source)
				this.$emit('loaded', {
					series: series.data,
					name: value.name,
					source: value.source
				});
			}
			catch(error) {
				this.$emit('clear')
			}
			finally {
				this.loading = false	
			}
		}
	}
}
</script>