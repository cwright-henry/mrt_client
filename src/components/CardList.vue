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
				<mrt-card :id="i._id"></mrt-card>
				<v-divider></v-divider>
				<v-card-actions>
					<div class="mrt--fit lastupdated hidden-sm-and-down">
						<div class="mrt-no-wrap">Last Updated</div>
						<div class="mrt-no-wrap">{{i.lastUpdate | date}}</div>
					</div>
					<v-spacer></v-spacer>
					<v-btn outline small color="primary" flat :to="`/library/${i._id}/optimize`">Optimize</v-btn>
				</v-card-actions>
			</v-card>
		</li>
	</transition-group>
</template>

<script>
import mrtCard from '@/components/Card'

export default {
	name: 'CardList',
	computed: {
		series() {
			return this.$store.state.library.series;
		}
	},
	components: {
		mrtCard
	},
	methods: {
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
