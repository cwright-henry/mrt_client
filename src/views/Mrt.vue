<template>
	<v-layout row wrap>
		<mrt-navigation :show="showMenu" @close="showMenu=false"/>
		<mrt-toolbar @togglemenu="showMenu = !showMenu"/>
		<v-content>
			<keep-alive>
				<router-view></router-view>
			</keep-alive>
		</v-content>
	</v-layout>
</template>

<script>
import mrtToolbar from "@/components/Toolbar"
import mrtNavigation from "@/components/Navigation"
import mrtFooter  from '@/components/Footer'

export default {
  name: 'Mrt',
  data() {
    return {
      showMenu: this.$vuetify.breakpoint.mdAndUp
    }
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

