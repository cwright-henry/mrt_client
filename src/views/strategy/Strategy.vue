<template>
	<div class="mrt-strategy">
		<v-text-field
			flat
			solo-inverted
			hide-details
			clearable
			v-model="search"
			prepend-inner-icon="search"
			label="Search Library">
		</v-text-field>
		<mrt-cardlist/>
		<mrt-csv-import
			:show="showCSVUpload"
			@close="showCSVUpload=false"/>
		<mrt-import 
			:show="showInvestUpload"
			@close="showInvestUpload=false"/>
		<v-speed-dial
			v-model="fab"
			bottom
			right
			fixed
			open-on-hover
			direction="top"
			transition="scale-transition">
			<v-btn
				slot="activator"
				v-model="fab"
				color="fab"
				dark
				fab>
				<v-icon>add</v-icon>
				<v-icon>close</v-icon>
			</v-btn>
			<v-btn
				fab
				dark
				small
				@click.stop="showCSVUpload=true"
				color="green">
				CSV
			</v-btn>
			<v-btn
				fab
				dark
				small
				@click.stop="showInvestUpload=true"
				color="orange">
				<v-icon>exposure_plus_1</v-icon>
			</v-btn>
		</v-speed-dial>
	</div>
</template>

<script>
import mrtCardlist from '@/components/CardList'
import mrtCsvImport from './dialogs/ImportCsvDialog'
import mrtImport from './dialogs/ImportDialog'
import debounce from 'lodash/debounce'

export default {
	name: 'Home',
	data() {
		return {
			fab: false,
			showCSVUpload: false,
			showInvestUpload: false,
			search: ''
		}
	},
	computed: {
		loading() {
			return this.$store.state.library.loading;
		}
	},
	watch: {
		search: function() {
			this.debounceSearch()	
		}
	},
	beforeRouteLeave(to, from, next) {
		if(from.name === 'strategy') {
			from.meta.yPos = document.documentElement.scrollTop
		}
    next()
	},
	components: {
		mrtCardlist,
		mrtCsvImport,
		mrtImport
	},
	created() {
		this.debounceSearch = debounce(this.searchLibrary, 500)
	},
  mounted() {
		this.load()
  },
	methods : {
		load() {
			const payload = {
				nameFilter: ''
			}
			this.$store.dispatch('strategies/load', payload)
		},

		searchLibrary() {
			let payload = {
				nameFilter: this.search
			}
			this.$store.dispatch('strategies/load', payload)
		}
	}
}
</script>

<style lang="less">
.mrt-strategy .v-text-field.v-text-field--solo .v-input__control {
	min-height: 42px;
}
.mrt-toolbar--name {
	margin: 0 12px 0 0;
	display: inline-block;
}
</style>
