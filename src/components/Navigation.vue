<template>
	<v-navigation-drawer v-model="dialog" fixed clipped app mini-variant>
		<v-list dense>
			<template v-for="(item, i) in menuitems">
				<router-link v-if="item.url" :to="item.url" :key="i" :exact="item.exact">
					<div class="mrt-menu--item">
						<v-icon dark>{{item.icon}}</v-icon>
						<div>{{item.text}}</div>
					</div>
				</router-link>
			</template>
		</v-list>
	</v-navigation-drawer>
</template>

<script>
export default {
	props: {
		show: {
			type: Boolean,
			default: true
		}
	},
	computed: {
    dialog: {
      get () {
        return this.show
      },
      set (value) {
        if (!value) {
          this.$emit('close')
        }
      }
    }
  },
	data: () => ({
		menuitems: [
			{ icon: 'home', text: 'Library' , url: "/library"},
			{ icon: 'account_box', text: 'Account', url: "/Account" },
			{ icon: 'help_outline', text: 'Guide', url: "/Guide" },
			{ icon: 'clear', text: 'Logout', url: "/logout" }
		]
	})
}
</script>

<style scoped lang="less">
	.router-link-active .mrt-menu--item {
		color:var(--green);
		i {
			color:var(--green);
		}
	}
	.mrt-menu--item {
		display:flex;
		flex-direction: column;
		margin: 16px 0 24px;
		justify-content: center;
		align-items: center;
		color:var(--blue);
		i {
			color:var(--blue);
		}
	}
</style>
