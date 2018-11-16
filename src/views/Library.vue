<template>
	<div class="mrt-library">
		<div class="text-xs-center" v-if="loading">
			Loading...
		</div>
		<div v-else>
			<v-layout row wrap justify-space-between align-center>
				<v-flex md4 xs12>
					<v-text-field
						flat
						solo-inverted
						hide-details
						clearable
						v-model="search"
						prepend-inner-icon="search"
						label="Search Library">
					</v-text-field>
				</v-flex>
				<v-flex md4 xs12 text-xs-center>
					{{start}} - {{end}} of {{total}}
				</v-flex>
				<v-flex md4 xs12>
					<div class="text-xs-center text-md-right">
						<v-pagination  v-if="total > 0"
							color="primary"
							v-model="page"
							:length=pageCount
							@input="nextPage"
							circle>
						</v-pagination>
					</div>
				</v-flex>
			</v-layout>
			<mrt-cardlist/>
			<div class="text-xs-center text-md-right">
				<v-pagination v-if="total > 0"
					v-model="page"
					:length=pageCount
					@input="nextPage"
					circle>
				</v-pagination>
			</div>
			<mrt-csv-import
				:show="showCSVUpload"
				@close="showCSVUpload=false"/>
			<mrt-av-import 
				:show="showAlphavantageUpload"
				@close="showAlphavantageUpload=false"/>
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
					@click.stop="showAlphavantageUpload=true"
					color="cyan">
					Av
				</v-btn>
			</v-speed-dial>
		</div>
	</div>
</template>

<script>
import mrtCardlist from '@/components/CardList'
import mrtCsvImport from './ImportCsvDialog'
import mrtAvImport from './ImportAvDialog'
import debounce from 'lodash/debounce'

export default {
	name: 'Home',
	data() {
		return {
			fab: false,
			showCSVUpload: false,
			showAlphavantageUpload: false,
			page: 1,
			search: ''
		}
	},
	computed: {
		loading() {
			return this.$store.state.library.loading;
		},
		pageCount() {
			return this.$store.state.library.totalPages;
		},
		start() {
			return this.$store.getters['library/startOffset']
		},
		end	() {
			return this.$store.getters['library/endOffset']
		},
		total() {
			return this.$store.state.library.totalSeries;
		}
	},
	watch: {
		search: function() {
			this.debounceSearch()	
		}
	},
	components: {
		mrtCardlist,
		mrtCsvImport,
		mrtAvImport
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
				page: 1,
				nameFilter: ''
			}
			this.$store.dispatch('library/load', payload)
		},

		nextPage(page) {
			let payload = {
				page: page,
				nameFilter: ''
			}
			this.$store.dispatch('library/load', payload)
		},

		searchLibrary() {
			let payload = {
				page: 1,
				nameFilter: this.search
			}
			this.$store.dispatch('library/load', payload)
		}
	}
}
</script>

<style lang="less">
.mrt-library .v-text-field.v-text-field--solo .v-input__control {
	min-height: 42px;
}
.mrt-toolbar--name {
	margin: 0 12px 0 0;
	display: inline-block;
}
</style>
