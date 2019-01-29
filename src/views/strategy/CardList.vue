<template>
	<div>
		<transition-group tag="ul" name="slideRight">
			<li v-for="strat in strategies" :key="`${strat._id}`" class="mb-4 mt-3">
				<v-card style="background-color: #455A64;">
					<v-toolbar dense flat>
						<v-toolbar-title class="mrt--header-color">{{strat.name}}</v-toolbar-title>
						<v-spacer></v-spacer>
						<v-btn color="primary" flat icon>
							<v-icon @click.self.passive="remove(strat._id)">delete</v-icon>
						</v-btn>
					</v-toolbar>
					<mrt-card :strategy="strat"></mrt-card>
					<v-divider></v-divider>
					<v-card-actions class="mrt-cardlist--actions">
						<div class="mrt--fit lastupdated hidden-sm-and-down">
							<div class="mrt-no-wrap">Last Updated</div>
							<div class="mrt-no-wrap">{{strat.lastUpdate | date}}</div>
						</div>
						<v-spacer></v-spacer>
						<v-btn 
							outline 
							:loading="strat._id === strategy._id && isLoadingStrategy"
							@click="isLoadingStrategy = true"
							small 
							color="primary" 
							:to="`/library/${strat._id}/fit`">
							Fit Strategy
						</v-btn>
						<v-btn :disabled="strat.fit && strat.fit.proctype === 'NONE'" outline small color="primary" flat :to="`/library/${strat._id}/sltp`">SLTP</v-btn>
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
		...mapState('strategies', ['strategies', 'loading']),
		...mapState('fit', ['strategy']),
		isLoadingStrategy: {
			get() {
				return this.$store.state.fit.isLoadingStrategy
			},
			set(value) {
				this.$store.commit('fit/isLoadingStrategy', value);
			}
		}
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
