<template>
	<v-layout row wrap>
		<mrt-navigation :show="showMenu" @close="showMenu=false"/>
		<mrt-toolbar @togglemenu="showMenu = !showMenu"/>
		<v-content>
			<v-container fluid>
				<keep-alive>
					<router-view></router-view>
				</keep-alive>
				<v-snackbar
					v-model="snackbar"
					:timeout="timeout"
					color="error"
					:vertical="$vuetify.breakpoint.mdAndDown">
					{{ text }}
					<v-btn
						dark
						flat
						@click="snackbar = false">
						Close
					</v-btn>
				</v-snackbar>
			</v-container>
		</v-content>
	</v-layout>
</template>

<script>
import mrtToolbar from "@/components/Toolbar"
import mrtNavigation from "@/components/Navigation"
import mrtFooter  from '@/components/Footer'
import { EventBus } from '../events.js';

export default {
  name: 'Mrt',
  data() {
    return {
			snackbar: false,
			timeout: 6000,
			text:'',
      showMenu: this.$vuetify.breakpoint.mdAndUp
    }
	},
	watch: {
		snackbar(v) {
			if(!v) {
				this.$store.dispatch('user/logout')
				.then(() => {
					this.$router.push('/login')
				})
			}
		}
	},
	mounted() {
		EventBus.$on('server-logout', (reason) => {
			this.snackbar = true
			this.text=reason
		});
	},
  components: {
    mrtToolbar,
    mrtNavigation,
    mrtFooter
  }
}
</script>

<style>
</style>

