<template>
	<div>
		<transition-group tag="ul" name="bounceRight">
			<li v-for="strategy in strategies" :key="`${strategy._id}`" class="mb-4 mt-3">
				<v-card style="background-color: #455A64;">
					<v-toolbar dense flat>
						<v-toolbar-title class="mrt--header-color">{{strategy.name}}</v-toolbar-title>
						<v-spacer></v-spacer>
						<v-btn color="primary" flat icon>
							<v-icon @click.self.passive="remove(strategy._id)">delete</v-icon>
						</v-btn>
					</v-toolbar>
					<mrt-card :strategy="strategy"></mrt-card>
					<v-divider></v-divider>
					<v-card-actions class="mrt-cardlist--actions">
						<div class="mrt--fit lastupdated hidden-sm-and-down">
							<div class="mrt-no-wrap">Last Updated</div>
							<div class="mrt-no-wrap">{{strategy.lastUpdate | date}}</div>
						</div>
						<v-spacer></v-spacer>
						<v-btn 
							outline 
							small color="primary" 
							:to="`/library/${strategy._id}/fit`">
							Fit Strategy
						</v-btn>
						<v-btn :disabled="strategy.fit && strategy.fit.proctype === 'NONE'" outline small color="primary" flat :to="`/library/${strategy._id}/sltp`">SLTP</v-btn>
					</v-card-actions>
				</v-card>
			</li>
		</transition-group>
		<mrt-infinite-scroll v-if="!loading" @loadmore="loadmore"/>
	</div>
</template>

<script>
import mrtCard from './Card'
import mrtInfiniteScroll from '@/components/InfiniteScroll'
import {mapState} from 'vuex'

export default {
	name: 'CardList',
	computed: {
		...mapState('strategies', ['strategies', 'loading'])
	},
	components: {
		mrtCard,
		mrtInfiniteScroll
	},
	methods: {
		loadmore() {
			this.$store.dispatch('strategies/loadMore')
		},

		remove(id) {
			const payload = {
				id: id
			}
			this.$store.dispatch('strategies/remove', payload)
			this.$store.commit('dictionary/removeLibrary', payload)
		}
	}
}
</script>

<style lang="less">
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
	.mrt-cardlist--actions {
		margin: 0 16px;
		.v-btn + .v-btn {
			margin: 0 0 0 24px;
		}
	}
</style>
