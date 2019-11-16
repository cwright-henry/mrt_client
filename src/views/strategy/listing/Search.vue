<template>
	<v-autocomplete
		:loading="loading"
		:items="items"
		v-model="select"
		clearable
		chips
		class="mrt-autocomplete"
		ref="select"
		item-text="name"
		item-value="_id"
		hide-details
		label="Search Your Library"
		filled
		multiple
		color="#90CAF9"
		background-color="#323232"
	>
		<template slot="no-data">
			<v-list-tile>
				<v-list-tile-title>
					No matching
					<strong>Scenario's</strong> to analyse.
				</v-list-tile-title>
			</v-list-tile>
		</template>
		<template slot="selection" slot-scope="{item, selected }">
			<v-chip :selected="selected" @input="remove(item._id)" close color="#26A69A" class="white--text">
				<v-icon left color="#FFEB3B">check_circle</v-icon>
				<span v-text="item.name"></span>
			</v-chip>
		</template>
		<template slot="item" slot-scope="{ item }">
			<v-icon left class="mr-2" color="#FFEB3B">show_chart</v-icon>
			<v-list-tile-content>
				<v-list-tile-title v-text="item.name"></v-list-tile-title>
				<v-list-tile-sub-title>Last modified {{item.lastUpdate | date}}</v-list-tile-sub-title>
			</v-list-tile-content>
		</template>
	</v-autocomplete>
</template>

<script>

export default {
	data() {
		return {
			loading: false,
			search: ""
		};
	},
	computed: {
		/**
		 * Select is the array of ObjectIds
		 */
		select: {
			get() {
				return this.$store.state.strategies.overrides;
			},
			async set(overrides) {
				this.$store.commit("strategies/setOverrides", overrides);
				this.loading = true;
				await this.$store.dispatch("strategies/load");
				this.loading = false;
			}
		},
		items: {
			get() {
				return this.$store.state.library.library;
			}
		}
	},
	methods: {
		async remove(id) {
			this.loading = true;
			this.$store.commit(
				"strategies/setOverrides",
				this.select.filter(e => e !== id)
			);
			await this.$store.dispatch("strategies/load");
			this.loading = false;
		}
	}
};
</script>
