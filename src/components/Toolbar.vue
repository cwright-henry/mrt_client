<template>
	<v-toolbar dense fixed clipped-left app class="mrt-toolbar">
		<v-toolbar-side-icon @click.stop="$emit('togglemenu')"></v-toolbar-side-icon>
		<v-toolbar-title class="hidden-xs-and-down mr-4 pl-2">Mean Reversion Trader</v-toolbar-title>
		<v-spacer></v-spacer>
		<div class="hidden-sm-and-down">
			<span class="mrt-toolbar--name">{{ userName }}</span>
			<v-avatar color="secondary" size="32">
				<v-icon dark>account_circle</v-icon>
			</v-avatar>
		</div>
	</v-toolbar>
</template>

<script>
export default {
	name: 'MrtToolbar',

	data() {
		return {
		}
	},
	computed: {
		userName() {
			return this.$store.state.user.user.email
		}
	}
}
</script>

<style lang="less">
.mrt-toolbar--name {
	margin: 0 12px 0 0;
	display: inline-block;
}
</style>
