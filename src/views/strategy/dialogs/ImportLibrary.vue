<template>
	<v-select
		prepend-icon="home"
		v-model="ticker"
		:items="items"
		item-text="name"
    item-value="_id"
		hide-details
		box
		dense
		@change="findSeries"
		label="Select from Library">
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
		this.items = await ApiController.findDict('library')
	},
	methods: {
		async findSeries(id) {
			let series = await ApiController.findSeries(id, 'Library')
			this.$emit('loaded', {
				series: series.ts.data,
				errors: [],
				name: series.name,
				source: "Library"
			})
		}
	}
}
</script>