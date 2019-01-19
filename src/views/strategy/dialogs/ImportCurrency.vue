<template>
	<v-select
		prepend-icon="attach_money"
		v-model="ticker"
		:loading="loading"
		:items="currencies"
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
		...mapState('dictionary', ['currencies'])
	},
	activated() {
		this.ticker = ''
	},
	watch: {
		clear() {
			this.ticker = ''
		}
	},
	methods: {
		async findSeries(value) {
			this.loading = true;
			try {
				let series = await ApiController.findSeries(value.curr_id, value.source);
				this.$emit('loaded', {
					series: series.data,
					name: value.name,
					source: value.source
				});
			}
			finally {
				this.loading = false;
			}
		}
	}
}
</script>
