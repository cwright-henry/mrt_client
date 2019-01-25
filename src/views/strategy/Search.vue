<template>
	<v-autocomplete
		:loading="loading"
		:items="items"
		:search-input.sync="search"
		cache-items
		v-model="select"
		clearable
		chips
		ref="select"
		item-text="name"
		item-value="id"
		hide-details
		label="Search your library"
		box
		multiple
		background-color='#455A64'
		color='#0091EA'>
		<template slot="no-data">
			<v-list-tile>
				<v-list-tile-title>
					Search through your library and pick <strong>Scenario's</strong> to analyse.
				</v-list-tile-title>
			</v-list-tile>
		</template>
		<template
			slot="selection"
			slot-scope="{item, selected }">
			<v-chip
				:selected="selected"
				@input="remove(item.id)"
				close
				color="blue-grey"
				class="white--text">
				<v-icon left color="#AEEA00">check_circle</v-icon>
				<span v-text="item.name"></span>
			</v-chip>
		</template>
		<template
			slot="item"
			slot-scope="{ item }">
			<v-icon left class="mr-1" color="#AEEA00">insert_chart</v-icon>
			<v-list-tile-content>
				<v-list-tile-title v-text="item.name"></v-list-tile-title>
				<v-list-tile-sub-title>Last modified {{item.lastModified | date}}</v-list-tile-sub-title>
			</v-list-tile-content>
		</template>
	</v-autocomplete>
</template>

<script>
import ApiController from '@/services/ApiController'

export default {
	data() {
		return {
			loading: false,
			search: '',
			items: []
		}
	},
	computed: {
		/**
		 * Select is the array of ObjectIds
		 */
		select: {
			get() {
				return this.$store.state.strategies.overrides;
			},
			set(overrides) {
				this.$store.commit('strategies/setOverrides', overrides);
				this.$store.dispatch('strategies/load')
			}
		}
	},
	watch: {
		search (val) {
			val && this.querySelections(val)
		}
	},
	methods: {
		remove(id) {
			this.$store.commit('strategies/setOverrides', this.select.filter(e => e !== id));
			this.$store.dispatch('strategies/load')
		},

		async querySelections (v) {
			if(v !== '') {
				this.loading = true
				const results = await ApiController.search(v)
				this.items = [];
				results.docs.map((doc) => {
					this.items.push({
						name: doc.name,
						id: doc._id,
						lastModified: doc.lastUpdate
					})
				});
				this.loading = false
			}
			else {
				this.items = [];
			}
		}
	}
}
</script>

<style>

</style>
