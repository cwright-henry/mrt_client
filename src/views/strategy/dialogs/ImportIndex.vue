<template>
	<v-select
		prepend-icon="home"
		v-model="ticker"
		:items="items"
		:loading="loading"
		:disabled="loading"
		color="blue lighten-2"
		item-text="name"
    item-value="curr_id"
		hide-details
		box
		dense
		return-object
		@change="findSeries"
		label="Choose an Index">
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
	watch: {
		clear() {
			this.ticker = ''
		}
	},
	activated() {
		this.ticker = ''
	},
	async mounted() {
		this.items = await ApiController.findDict('Index')
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