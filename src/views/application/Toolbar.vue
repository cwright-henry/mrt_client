<template>
	<v-toolbar dense fixed clipped-left app class="mrt-toolbar">
		<v-toolbar-side-icon @click.stop="$emit('togglemenu')"></v-toolbar-side-icon>
		<v-toolbar-title class="hidden-xs-and-down mr-4 pl-2">
			<div class="mrt-toolbar--app">
				<logo />
				<span>Mean Reversion Trader</span>
			</div>
		</v-toolbar-title>
		<v-spacer></v-spacer>
		<div class="mrt-toolbar--user">
			<v-avatar color="#757575" size="32">
				<v-icon dark>account_circle</v-icon>
			</v-avatar>
			<div class="mrt-toolbar--user-info">
				<span>{{ userName }}</span>
				<span class="mrt-toolbar--user-info__company">{{ companyName }}</span>
			</div>
		</div>
	</v-toolbar>
</template>

<script>
import Logo from "../../../public/svg/crowe.svg";

export default {
	name: "MrtToolbar",

	data() {
		return {};
	},
	components: {
		Logo
	},
	computed: {
		userName() {
			return this.$store.state.user.user.email;
		},
		companyName() {
			return this.$store.state.user.user.companyName;
		}
	}
};
</script>

<style lang="less">
.mrt-toolbar {
	background-color: #383838 !important;
	.mrt-toolbar--app {
		display: flex;
		align-items: center;
		span {
			padding-left: 8px;
			font-weight: 300;
		}
	}
	.mrt-toolbar--user {
		display: flex;
		align-items: center;
		.mrt-toolbar--user-info {
			display: flex;
			flex-direction: column;
			margin: 0 0 0 12px;
			line-height: 1.2;
			.mrt-toolbar--user-info__company {
				color: #FFF59D;
				font-weight: 300;
			}
		}
	}
}
</style>
