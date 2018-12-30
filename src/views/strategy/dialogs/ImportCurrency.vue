<template>
	<v-select
		prepend-icon="attach_money"
		v-model="ticker"
		:loading="loading"
		:items="items"
		item-text="name"
    item-value="curr_id"
		color="blue lighten-2"
		hide-details
		box
		dense
		@change="findSeries"
		return-object
		label="Choose a Currency">
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
		ticker: '',
		loading: false
	}),
	activated() {
		this.ticker = ''
	},
	watch: {
		clear() {
			this.ticker = ''
		}
	},
	async mounted() {
		this.items = await ApiController.findDict('Curncy')
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
