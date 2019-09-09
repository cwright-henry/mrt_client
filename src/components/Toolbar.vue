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
		<v-menu v-model="menu" :close-on-content-click="false" :nudge-width="200" offset-x>
			<template v-slot:activator="{ on }">
				<v-avatar class="account-circle" color="#2196F3" size="32" v-on="on">
					<v-icon dark>account_circle</v-icon>
				</v-avatar>
			</template>
			<v-card>
				<v-list>
					<v-list-tile avatar>
						<v-list-tile-avatar>
							<v-avatar color="#2196F3" size="48">
								<v-icon dark large>account_circle</v-icon>
							</v-avatar>
						</v-list-tile-avatar>

						<v-list-tile-content>
							<v-list-tile-title>{{ userName }}</v-list-tile-title>
							<v-list-tile-sub-title>Bluecrowe Analytics</v-list-tile-sub-title>
						</v-list-tile-content>
					</v-list-tile>
				</v-list>
			</v-card>
		</v-menu>
	</v-toolbar>
</template>

<script>
import Logo from "../../public/svg/crowe.svg";

export default {
	name: "MrtToolbar",

	data() {
		return {
			menu: false,
			message: false,
			hints: true
		};
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
	.mrt-toolbar--name {
		margin: 0 12px 0 0;
		display: inline-block;
	}
	.account-circle {
		cursor: pointer;
	}
	.mrt-toolbar {
		display: flex;
		align-items: center;
		span {
			padding-left: 8px;
			font-weight: 300;
		}
	}
}
</style>
