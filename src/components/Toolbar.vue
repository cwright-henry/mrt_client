<template>
	<v-toolbar dense fixed clipped-left app class="mrt-toolbar-class">
		<v-toolbar-side-icon @click.stop="$emit('togglemenu')"></v-toolbar-side-icon>
		<v-toolbar-title class="hidden-xs-and-down mr-4 pl-2">
			<div class="mrt-toolbar">
				<logo />
				<span>Mean Reversion Trader</span>
			</div>
		</v-toolbar-title>
		<v-spacer></v-spacer>
		<div class="hidden-sm-and-down">
			<span class="mrt-toolbar--name">{{ userName }}</span>
			<v-avatar color="#2196F3" size="32">
				<v-icon dark>account_circle</v-icon>
			</v-avatar>
		</div>
	</v-toolbar>
</template>

<script>
import Logo from "../../public/svg/crowe.svg";

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
		}
	}
};
</script>

<style lang="less">
.mrt-toolbar-class {
	background-color: #383838 !important;
}
.mrt-toolbar--name {
	margin: 0 12px 0 0;
	display: inline-block;
}
.mrt-toolbar {
	display: flex;
	align-items: center;
	span {
		padding-left: 8px;
		font-weight: 300;
	}
}
</style>
