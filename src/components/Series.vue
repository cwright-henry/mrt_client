<template>
	<transition-group name="list" tag="ul">
		<li v-for="i in series" :key="`${i._id}`" class="mb-4 mt-3">
			<v-card>
				<v-toolbar dense flat class="mrt--toolbar">
					<v-toolbar-title class="mrt--header-color">{{i.name}}</v-toolbar-title>
					<v-spacer></v-spacer>
					<v-btn color="primary" flat icon @click.stop="remove(i._id)">
						<v-icon>delete</v-icon>
					</v-btn>
				</v-toolbar>
				<v-container grid-list-lg fluid>
					<mrt-fit 
						:kappa.sync="i.fit.kappa"
						:sigma.sync="i.fit.sigma"
						:theta.sync="i.fit.theta"
						:adf_stat.sync="i.fit.adf_stat"
						:p_val.sync="i.fit.p_val"
						:sig_lev.sync="i.fit.sig_lev"
						:readonly=true>
					</mrt-fit>
				</v-container>
				<mrt-linechart :lazyload="true" :id="i._id" :ts="[]" :name="i.name" backgroundColor="#424242"></mrt-linechart>
				<v-card-actions>
					<div class="mrt--fit lastupdated hidden-sm-and-down">
						<div class="mrt-no-wrap">Last Updated</div>
						<div class="mrt-no-wrap">{{formatDate(i.lastUpdate) | date}}</div>
					</div>
					<v-spacer></v-spacer>
					<v-btn outline small color="primary" flat :to="`/library/${i._id}/optimize`">Optimize</v-btn>
				</v-card-actions>
			</v-card>
		</li>
	</transition-group>
</template>

<script>
import mrtLinechart from '@/components/LineChart'
import mrtFit from '@/components/Fit'
import moment from 'moment'

export default {
	name: 'Series',
	data() {
		return {
		}
	},
	computed: {
		series() {
			return this.$store.state.library.series;
		}
	},
	components: {
		mrtLinechart,
		mrtFit
	},
	methods: {
		formatDate(d) {
			return moment(d).valueOf()
		},
		remove(id) {
			const payload = {
				id: id
			}
			this.$store.dispatch('library/remove', payload)
			.then(() => {
				this.$store.dispatch('library/load', payload)
			})
			.catch((e) => {
				console.log(e)
			})
		}
	}
}
</script>

<style scoped lang="less">
	.mrt-no-wrap {
		white-space: nowrap;
	}
	.mrt--header-color {
		color:var(--light-gray);
	}
	.mrt--fit {
		&.lastupdated {
			color:var(--light-gray);
			font-size:11px;
		}
	}
	ul {
		list-style: none;
		padding: 0;
	}
</style>
