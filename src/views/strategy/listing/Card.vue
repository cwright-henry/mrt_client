<template>
	<div class="mrt-card">
		<div class="mrt-card--graphs">
			<mrtDetails :strategy="strategy" />
			<mrt-serieschart :strategy="strategy" />
		</div>
		<div class="mrt-card--info">
			<mrtFitParameters :fit="strategy.fit" />
		</div>
	</div>
</template>

<script>
import mrtSerieschart from "./SeriesChart";
import mrtFitParameters from "./FitParameters";
import mrtDetails from "./Details";

export default {
	data() {
		return {
			observer: null,
			isLoading: false
		};
	},
	props: {
		strategy: {
			type: Object,
			default: () => {
				return {
					ts: {},
					fit: {}
				};
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
				this.load();
				self.unobserve(entry.target);
			}
		}, {});

		this.observer.observe(this.$el); // Only used once so watch for strategy reuse
	},
	components: {
		mrtSerieschart,
		mrtFitParameters,
		mrtDetails
	},
	methods: {
		async load() {
			try {
				this.isLoading = true;
				if (!this.strategy.ts) {
					await this.$store.dispatch("strategies/loadStrategy", {
						id: this.strategy._id
					});
				}
			} finally {
				this.isLoading = false;
			}
		}
	},
	destroyed() {
		this.observer.disconnect();
	}
};
</script>

<style scoped lang="less">
.mrt-card {
	display: flex;
	padding: 16px;
	min-height: 340px;
	width: 100%;

	.mrt-card--graphs {
		width: calc(100% - 330px);
	}
	.mrt-card--info {
		width: 330px;
	}
}
</style>
