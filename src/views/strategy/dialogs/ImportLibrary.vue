<template>
	<v-select
		prepend-icon="home"
		v-model="ticker"
		:loading="loading"
		:items="library"
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
		...mapState('dictionary', ['library'])
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
		async findSeries(id) {
			try {
				let series = await ApiController.findSeries(id, 'Library')
				this.$emit('loaded', {
					series: series.ts.data,
					errors: [],
					name: series.name,
					source: "Library"
				})
			}
			catch(error) {
				this.$emit('clear')
			}
		}
	}
}
</script>