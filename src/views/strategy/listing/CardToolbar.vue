<template>
	<v-toolbar dense flat class="mrt-ctb">
		<v-toolbar-title class="mrt-ctb--name">{{strategy.name}}</v-toolbar-title>
		<v-spacer></v-spacer>
		<v-tooltip bottom>
			<template v-slot:activator="{ on }">
				<v-btn class="mrt-ctb--link-icon mr-3" icon v-on="on">
					<v-icon>update</v-icon>
				</v-btn>
			</template>
			<span>Update timeseries</span>
		</v-tooltip>
		<v-menu
			origin="top right"
			transition="scale-transition"
			:close-on-content-click="false"
			:nudge-width="0"
			offset-y
			left
		>
			<template v-slot:activator="{ on }">
				<v-btn class="mrt-ctb--link-icon" flat icon v-on="on">
					<v-icon>delete</v-icon>
				</v-btn>
			</template>
			<div class="mrt-ctb--action">
				<h1 class="text-truncate mb-2">Delete {{strategy.name}}</h1>
				<p>This action will permentently remove {{strategy.name}} and any references to it from the MRT system.</p>
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
			console.log(id);
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
		font-weight: 300;
	}
	.mrt-ctb--link-icon {
		color: #64b5f6;
		margin: 0 -12px 0 0;
	}
}
.mrt-ctb--action {
	padding: 16px;
	font-weight: 300;
	background-color: #2e2e2e;
	max-width: 400px;
	h1 {
		font-size: 22px;
		font-weight: inherit;
	}
}
</style>