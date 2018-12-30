<template>
	<v-navigation-drawer v-model="dialog" fixed clipped app mini-variant>
		<v-list dense>
			<router-link to="/library">
				<div class="mrt-menu--item">
					<v-badge right>
						<span slot="badge">{{ total }}</span>
						<v-icon dark>
							home
						</v-icon>
					</v-badge>
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
import {mapState} from 'vuex'

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
		},
		...mapState('strategies', ['total'])
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

<style lang="less">
	.router-link-active .mrt-menu--item {
		color:var(--blue);
		i {
			color:var(--blue);
		}
	}
	.router-link-active .v-badge__badge {
		background-color: #B3E5FC !important;
	}
	.v-badge__badge {
		font-size:12px;
		color:#424242;
		background-color: #fff !important;
	}
	.mrt-menu--item {
		display:flex;
		flex-direction: column;
		margin: 16px 0 24px;
		justify-content: center;
		align-items: center;
		cursor: pointer;
		color: var(--light-gray);
		i {
			color: var(--light-gray);
		}
	}
</style>
