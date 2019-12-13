<template>
	<v-toolbar dense flat class="mrt-ctb">
		<v-icon class="mr-2" size="24" color="#27a59a">mdi-finance</v-icon>
		<v-toolbar-title class="mrt-ctb--name">{{strategy.name}}</v-toolbar-title>
		<v-spacer></v-spacer>
		<v-menu
			origin="top right"
			transition="scale-transition"
			:close-on-content-click="false"
			:nudge-width="0"
			offset-y
			left
		>
			<template v-slot:activator="{ on }">
				<v-icon v-on="on" color="#64b5f6">mdi-delete</v-icon>
			</template>
			<div class="mrt-ctb--action">
				<h1 class="text-truncate mb-2">Delete {{strategy.name}}</h1>
				<p>This action will permentently remove {{strategy.name}} from the MRT system.</p>
				<div class="text-xs-right mr-1">
					<v-btn color="#2196F3" left small @click="remove(strategy._id)">Remove</v-btn>
				</div>
			</div>
		</v-menu>
	</v-toolbar>
</template>

<script>
export default {
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
	methods: {
		remove(id) {
			const payload = {
				id: id
			};
			this.$store.dispatch("strategies/remove", payload);
			this.$store.commit("library/removeLibrary", payload);
		}
	}
};
</script>

<style lang="less">
.mrt-ctb {
	.mrt-ctb--name {
		color: #ffffff;
		font-weight: 400;
	}
}
.mrt-ctb--action {
	padding: 16px;
	font-weight: 300;
	background-color: #2e2e2e;
	max-width: 350px;
	h1 {
		font-size: 18px;
		font-weight: 400;
		font-weight: inherit;
	}
}
</style>