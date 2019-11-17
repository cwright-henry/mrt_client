<template>
	<v-layout row wrap>
		<mrt-navigation :show="showMenu" @close="showMenu=false" />
		<mrt-toolbar @togglemenu="showMenu = !showMenu" />
		<v-content>
			<v-container>
				<keep-alive>
					<router-view></router-view>
				</keep-alive>
			</v-container>
		</v-content>
	</v-layout>
</template>

<script>
import mrtToolbar from "@/views/application/Toolbar";
import mrtNavigation from "@/views/application/Navigation";

export default {
	name: "Mrt",
	data() {
		return {
			showMenu: this.$vuetify.breakpoint.lg
		};
	},
	components: {
		mrtToolbar,
		mrtNavigation
	},
	mounted() {
		this.$store.dispatch("library/load");
	}
};
</script>

<style>
</style>

