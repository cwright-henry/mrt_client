<template>
	<div v-show="hasNext">
		<div class="text-xs-center" :options="options" v-if="isInfiniteScrolling">
			<v-progress-circular indeterminate color="primary"></v-progress-circular>
		</div>
		<div class="text-xs-center" :options="options" v-else>
			<v-btn
				:loading="loading"
				:disabled="loading"
				outline
				color="primary"
				@click="loadMore"
			>Load {{pageSize}} More</v-btn>
		</div>
	</div>
</template>

<script>
import { mapGetters, mapState } from "vuex";

export default {
	props: {
		options: {
			type: Object,
			default: () => {
				return {
					root: null,
					threshold: 0
				};
			}
		}
	},
	data() {
		return {
			observer: null
		};
	},
	computed: {
		...mapState("strategies", ["hasNext", "loading", "pageSize"]),
		...mapGetters("strategies", ["isInfiniteScrolling"]),
		...mapGetters("user", ["isAuthenticated"])
	},
	mounted() {
		this.observer = new IntersectionObserver(([entry], self) => {
			if (entry && entry.isIntersecting) {
				this.autoMore();
			}
		}, this.options);

		this.observer.observe(this.$el);
	},
	methods: {
		autoMore() {
			if (this.isInfiniteScrolling && this.isAuthenticated) {
				this.$emit("loadmore");
			}
		},

		loadMore() {
			this.$emit("loadmore");
		}
	},
	destroyed() {
		this.observer.disconnect();
	}
};
</script>

<style>
</style>
