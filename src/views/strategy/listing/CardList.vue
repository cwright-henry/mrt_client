<template>
	<div style="margin-top:16px;">
		<transition-group tag="ul" @enter="enter" @leave="leave" @before-leave="beforeLeave" :css="false">
			<li v-for="strat in strategies" :key="strat._id" class="mb-3 mt-3 mrt-card">
				<v-card>
					<v-toolbar dense flat>
						<v-toolbar-title class="mrt--header-color">{{strat.name}}</v-toolbar-title>
						<v-spacer></v-spacer>
						<v-menu :close-on-content-click="false" :nudge-width="200" offset-x>
							<template v-slot:activator="{ on }">
								<v-btn class="mrt-nav--link-icon" flat icon v-on="on">
									<v-icon>delete</v-icon>
								</v-btn>
							</template>
							<v-card>
								<div
									class="mrt-delete--item"
									@click.self.passive="remove(strat._id)"
								>Delete {{strat.name}} from Library</div>
							</v-card>
						</v-menu>
					</v-toolbar>
					<mrt-card :strategy="strat"></mrt-card>
					<v-divider></v-divider>
					<v-card-actions class="mrt-cardlist--actions">
						<div class="mrt--fit hidden-sm-and-down mr-5">
							<div class="mrt-no-wrap label">Created</div>
							<div class="mrt-no-wrap">{{strat.created | date}}</div>
						</div>
						<div class="mrt--fit hidden-sm-and-down">
							<div class="mrt-no-wrap label">Last Updated</div>
							<div class="mrt-no-wrap">{{strat.lastUpdate | date}}</div>
						</div>
						<v-spacer></v-spacer>
						<v-btn
							:loading="strat._id === strategy._id && isLoading"
							small
							dark
							class="mrt-nav--link"
							:to="`/library/${strat._id}/scenario`"
						>Scenario Analysis</v-btn>
					</v-card-actions>
				</v-card>
			</li>
		</transition-group>
		<mrt-infinite-scroll v-if="!loading" @loadmore="loadmore" />
	</div>
</template>

<script>
import mrtCard from "./Card";
import mrtInfiniteScroll from "@/components/InfiniteScroll";
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
		},

		remove(id) {
			const payload = {
				id: id
			};
			this.$store.dispatch("strategies/remove", payload);
			this.$store.commit("dictionary/removeLibrary", payload);
		}
	}
};
</script>

<style lang="less">
.mrt--header-color {
	color: #fff;
	font-weight: 300;
}
ul {
	list-style: none;
	padding: 0;
	display: flex;
	flex-wrap: wrap;
	li {
		width: 100%;
	}
}
.mrt-delete--item {
	padding: 16px;
	background-color: #1976d2;
	cursor: pointer;
	transition: all 0.125s ease-in;
	&:hover {
		background-color: #0d47a1;
	}
}
.mrt-cardlist--actions {
	margin: 0 12px;
	.v-btn + .v-btn {
		margin: 0 0 0 24px;
	}
	.mrt--fit {
		color: #fff;
		font-size: 11px;
	}
	.mrt-no-wrap {
		white-space: nowrap;
		font-size: 12px;
		line-height: 1.4;
		font-weight: 300;
		&.label {
			color: #e0e0e0;
			text-transform: uppercase;
			font-size: 10px;
		}
	}
}
.mrt-card {
	transition: all 1s;
}
</style>
