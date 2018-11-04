<template>
	<v-navigation-drawer v-model="dialog" fixed clipped app mini-variant>
		<v-list dense>
			<router-link to="/library">
				<div class="mrt-menu--item">
					<v-icon dark>home</v-icon>
					<div>Library</div>
				</div>
			</router-link>
			<router-link to="/account">
				<div class="mrt-menu--item">
					<v-icon dark>account_box</v-icon>
					<div>Account</div>
				</div>
			</router-link>
			<router-link to="/guide">
				<div class="mrt-menu--item">
					<v-icon dark>help_outline</v-icon>
					<div>Guide</div>
				</div>
			</router-link>
			<div class="mrt-menu--item" @click="logout">
				<v-icon dark>clear</v-icon>
				<div>Logout</div>
			</div>
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
			{ icon: 'help_outline', text: 'Guide', url: "/guide" },
			{ icon: 'clear', text: 'Logout', action: "logout" }
		]
	}),
	methods: {
		logout() {
			this.$store.dispatch('user/logout')
			.then(() => {
				this.$router.push('/login')
			})
		}
	}
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
		cursor: pointer;
		color:var(--blue);
		i {
			color:var(--blue);
		}
	}
</style>
