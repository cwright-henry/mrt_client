<template>
  <div id="app" v-cloak>
    <v-app dark>
      <router-view></router-view>
      <v-snackbar
				v-model="apiauth"
				:timeout="timeout"
				color="error"
				:vertical="$vuetify.breakpoint.mdAndDown">
				{{ text }}
				<v-btn
					dark
					flat
					@click="apiauth = false">
					Close
				</v-btn>
			</v-snackbar>
      <v-snackbar
				v-model="apierror"
				:top="true"
				:timeout="timeout"
				color="error"
				:vertical="$vuetify.breakpoint.mdAndDown">
				{{ text }}
				<v-btn
					dark
					flat
					@click="apierror = false">
					Close
				</v-btn>
			</v-snackbar>
			<v-snackbar
				v-model="apisuccess"
				dark
				:timeout="4000"
				:left="true"
				:bottom="true"
				:vertical="$vuetify.breakpoint.mdAndDown">
				{{ text }}
				<v-btn
					dark
					color="secondary"
					flat
					@click="apisuccess = false">
					Close
				</v-btn>
			</v-snackbar>
    </v-app>
  </div>
</template>

<script>
import { EventBus } from './events.js';

export default {
  name: 'MrtApplication',
  data() {
    return {
      apiauth: false,
			apierror: false,
			apisuccess: false,
      text: '',
      timeout: 6000
    }
  },
  watch: {
		apiauth(v) {
			if(!v) {
				this.$store.dispatch('user/logout')
				.then(() => {
					this.$router.push('/login')
				})
			}
		}
	},
  mounted() {
		EventBus.$on('api-auth', (reason) => {
			this.apiauth = true
			this.text=reason
    });
    EventBus.$on('api-error', (reason) => {
			this.apierror = true
			this.text=reason
		});
		EventBus.$on('api-strategy-save', (reason) => {
			this.apisuccess = true
			this.text = reason
		});
	}
}
</script>

<style lang="less">
  a {
    text-decoration: none;
  }
  :root {
    --blue: #64B5F6;
    --orange: #FFA726;
    --green: #00E676;
    --error: #EF5350;
		--light-gray: rgba(255, 255, 255, 0.7);
		
		/* Application theme colors */
		--color-primary: #37474F;
		--color-secondary: #607D8B;
		--color-teriatry: #263238;
	}
	.theme--dark.application {
		background-color:#78909C;
	}

	.theme--dark.v-toolbar {
		background-color:var(--color-primary);
	}
	.theme--dark.v-card {
		background-color:var(--color-primary);
		border-color: #424242;
		color: #fff;
	}

  [v-cloak] {
     display: none;
  }
	.container.fluid {
    max-width: 1785px;
	}
	.menuable__content__active { /*Fix for Safari dialog display. Reference Vuetify issue #2111 */ z-index:250!important; }
</style>

