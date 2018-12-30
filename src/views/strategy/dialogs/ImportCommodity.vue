<template>
	<v-select
		prepend-icon="account_balance"
		v-model="ticker"
		:loading="loading"
		:disabled="loading"
		:items="items"
		item-text="name"
    item-value="curr_id"
		color="blue lighten-2"
		hide-details
		box
		dense
		dark
		return-object
		@change="findSeries"
		label="Choose a Commodity">
	</v-select>
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
	data: () => ({
		items: [],
		loading: false,
		ticker: ''
	}),
	watch: {
		clear() {
			this.ticker = ''
		}
	},
	activated() {
		this.ticker = ''
	},
	async mounted() {
		this.items = await ApiController.findDict('Cmdty')
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
				})
			}
			finally {
				this.loading = false	
			}
		}
	}
}
</script>