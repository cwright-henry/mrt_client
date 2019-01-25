<template>
	<div class="mrt-strategy">
		<mrt-search/>
		<!-- <v-text-field
			flat
			solo-inverted
			hide-details
			clearable
			v-model="search"
			prepend-inner-icon="search"
			label="Search Library">
		</v-text-field> -->
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
				color="#AEEA00"
				@click.stop="showInvestUpload=true"
				dark
				fab>
				<v-icon>playlist_add</v-icon>
				<v-icon>edit</v-icon>
			</v-btn>
		</v-speed-dial>
	</div>
</template>

<script>
import mrtSearch from './Search'
import mrtCardlist from './CardList'
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
	beforeRouteLeave(to, from, next) {
		if(from.name === 'strategy') {
			from.meta.yPos = document.documentElement.scrollTop
		}
    next()
	},
	components: {
		mrtSearch,
		mrtCardlist,
		mrtCsvImport,
		mrtImport
	},
  mounted() {
		this.load()
  },
	methods : {
		load() {
			this.$store.dispatch('strategies/load')
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
