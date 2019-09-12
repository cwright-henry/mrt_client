<template>
	<v-navigation-drawer v-model="dialog" fixed clipped app mini-variant class="mrt-navigation">
		<v-list dense>
			<router-link to="/library">
				<div class="mrt-menu--item">
					<v-badge right>
						<span slot="badge">{{ total }}</span>
						<v-icon dark>home</v-icon>
					</v-badge>
					<div>Library</div>
				</div>
			</router-link>
			<router-link to="/account">
				<div class="mrt-menu--item">
					<v-icon dark>account_box</v-icon>
					<div>Account</div>
				</div>
			</router-link>
			<router-link to="/guide">
				<div class="mrt-menu--item">
					<v-icon dark>help_outline</v-icon>
					<div>Guide</div>
				</div>
			</router-link>
			<div class="mrt-menu--item" @click="logout">
				<v-icon dark>clear</v-icon>
				<div>Logout</div>
			</div>
		</v-list>
	</v-navigation-drawer>
</template>

<script>
import { mapState } from "vuex";

export default {
	props: {
		show: {
			type: Boolean,
			default: true
		}
	},
	computed: {
		dialog: {
			get() {
				return this.show;
			},
			set(value) {
				if (!value) {
					this.$emit("close");
				}
			}
		},
		...mapState("strategies", ["total"])
	},
	data: () => ({
		menuitems: [
			{ icon: "help_outline", text: "Guide", url: "/guide" },
			{ icon: "clear", text: "Logout", action: "logout" }
		]
	}),
	methods: {
		async logout() {
			await this.$store.dispatch("user/logout");
			await this.$store.commit("strategies/reset");
			this.$router.push("/login");
		}
	}
};
</script>

<style lang="less">
.mrt-navigation {
	border-radius: 2px;
	.v-list {
		background: transparent !important;
	}
	.router-link-active {
		.mrt-menu--item {
			color: #2196F3;
			i {
				color: #2196F3
			}
		}
		.v-badge__badge {
			background-color: #2196F3 !important;
			color: #fff;
		}
	}
	.v-badge__badge {
		font-size: 12px;
		background-color: var(--light-gray) !important;
	}
	.mrt-menu--item {
		display: flex;
		flex-direction: column;
		padding: 12px 0;
		margin: 16px 0;
		justify-content: center;
		align-items: center;
		cursor: pointer;
		text-transform: uppercase;
		font-size: 12px;
		font-weight: 300;
		color: #ffffff;
		i {
			color: var(--light-gray);
		}
		div {
			margin: 8px 0 0 0;
		}
	}
}
</style>
