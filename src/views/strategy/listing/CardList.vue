<template>
	<div style="margin-top:16px;">
		<transition-group tag="ul" @enter="enter" @leave="leave" @before-leave="beforeLeave" :css="false">
			<li v-for="strat in strategies" :key="strat._id" class="mb-3 mt-3 mrt-card">
				<v-card>
					<mrt-card-toolbar :strategy="strat"></mrt-card-toolbar>
					<mrt-card :strategy="strat"></mrt-card>
					<v-divider></v-divider>
					<mrt-card-actions :strategy="strat" :isLoading="isLoading" :currentStrategy="strategy"></mrt-card-actions>
				</v-card>
			</li>
		</transition-group>
		<mrt-infinite-scroll v-if="!loading" @loadmore="loadmore" />
	</div>
</template>

<script>
import mrtCard from "./Card";
import mrtInfiniteScroll from "@/components/InfiniteScroll";
import mrtCardToolbar from "./CardToolbar";
import mrtCardActions from "./CardActions";
import { mapState } from "vuex";

const ANIMATION_IN = "zoomIn";
const ANIMATION_OUT = "rollOut";

export default {
	name: "CardList",
	data() {
		return {
			menu: false
		};
	},
	computed: {
		...mapState("strategies", ["strategies", "loading"]),
		...mapState("fit", ["strategy", "isLoadingStrategy"]),
		isLoading: {
			get() {
				return this.$store.state.fit.isLoadingStrategy;
			}
		}
	},
	components: {
		mrtCard,
		mrtCardToolbar,
		mrtCardActions,
		mrtInfiniteScroll
	},
	methods: {
		loadmore() {
			this.$store.dispatch("strategies/loadMore");
		},

		enter(el, done) {
			el.classList.add("animated", ANIMATION_IN);
			el.style.animationDuration = "0.75s";

			const handleAnimationEnd = () => {
				el.classList.remove("animated", ANIMATION_IN);
				el.removeEventListener("animationend", handleAnimationEnd);
				done();
			};
			el.addEventListener("animationend", handleAnimationEnd);
		},

		leave(el, done) {
			el.classList.add("animated", ANIMATION_OUT);
			el.style.animationDuration = ".75s";

			const handleAnimationEnd = () => {
				el.classList.remove("animated", ANIMATION_OUT);
				el.removeEventListener("animationend", handleAnimationEnd);
				done();
			};
			el.addEventListener("animationend", handleAnimationEnd);
		},

		beforeLeave(el) {
			el.style.height = 0;
			el.style.overflow = "visible";
		}
	}
};
</script>

<style lang="less">
ul {
	list-style: none;
	padding: 0;
	display: flex;
	flex-wrap: wrap;
	li {
		width: 100%;
	}
}
.mrt-card {
	transition: all 1s;
}
</style>
