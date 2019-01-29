<template>
	<div class="mrt-card">
		<mrt-fit-process :fit="strategy.fit"/>
		<div class="mrt-card--graphs">
			<mrt-serieschart :strategy="strategy"></mrt-serieschart>
		</div>
	</div>
</template>

<script>
import mrtSerieschart from '@/components/SeriesChart'
import mrtFitProcess from '@/components/fit/Fit'

export default {
	data() {
		return {
			observer: null,
			isLoading: false
		}
	},
	props: {
		strategy: {
			type: Object,
			default: () => {
				return {
					ts:{},
					fit:{}
				}
			}
		}
	},
	watch: {
		/**
		 * Watch for deep changes to strategy which happens
		 * when the search tool is used and Vue reuses the slot, The slot
		 * has already been mounted so the interaction observer wont kick in so strategy
		 * will not be fully loaded
		 */
		strategy: {
			handler: async function() {
				this.load();
			},
			deep: true
		}
	},
	mounted() {
		this.observer = new IntersectionObserver(([entry], self) => {
			if (entry && entry.isIntersecting) {
				this.load()
				self.unobserve(entry.target)
			}
		}, {});

		this.observer.observe(this.$el); // Only used once so watch for strategy reuse
	},
	components: {
		mrtSerieschart,
		mrtFitProcess
	},
	methods: {
		async load() {
			try {
				this.isLoading = true
				if(!this.strategy.ts) {
					await this.$store.dispatch('strategies/loadStrategy', {
						id: this.strategy._id
					});
				}
			}
			finally {
				this.isLoading = false
			}
		}
	},
	destroyed() {
		this.observer.disconnect()
  }
}
</script>

<style scoped lang="less">
.mrt-card {
	display:flex;
	flex-direction: row;
	flex-wrap: wrap;
	padding:16px;
	background-color: #455A64;
	min-height: 340px;

	.mrt-card--graphs {
		width: calc(100%);
	}
}
@media screen and (max-width: 600px) {
	.mrt-card {
		.mrt-card--fittings {
			margin: 4px 0 12px 8px;
			> div {
				margin: 0 12px 0 0;
				div {
					font-size: 18px;
				}
			}
		}
	}
}
</style>
