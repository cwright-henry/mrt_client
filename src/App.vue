<template>
	<v-app dark>
		<router-view></router-view>
		<v-snackbar
			v-model="apiauth"
			:timeout="timeout"
			color="error"
			:vertical="$vuetify.breakpoint.mdAndDown"
		>
			{{ text }}
			<v-btn dark text @click="apiauth = false">Close</v-btn>
		</v-snackbar>
		<v-snackbar
			v-model="apierror"
			:top="true"
			:timeout="timeout"
			color="error"
			:vertical="$vuetify.breakpoint.mdAndDown"
		>
			{{ text }}
			<v-btn dark text @click="apierror = false">Close</v-btn>
		</v-snackbar>
		<v-snackbar
			v-model="apisuccess"
			color="#8E24AA"
			:timeout="5000"
			:left="true"
			:bottom="true"
			:vertical="$vuetify.breakpoint.mdAndDown"
		>
			{{ text }}
			<v-btn dark color="#FFEB3B" text @click="apisuccess = false">Close</v-btn>
		</v-snackbar>
	</v-app>
</template>

<script>
import { EventBus } from "./events.js";

export default {
	name: "MrtApplication",
	data() {
		return {
			apiauth: false,
			apierror: false,
			apisuccess: false,
			text: "",
			timeout: 6000
		};
	},
	watch: {
		apiauth(v) {
			if (!v) {
				this.$store.dispatch("user/logout").then(() => {
					this.$router.push("/login");
				});
			}
		}
	},
	mounted() {
		EventBus.$on("api-auth", reason => {
			this.apiauth = true;
			this.text = reason;
		});
		EventBus.$on("api-error", reason => {
			this.apierror = true;
			this.text = reason;
		});
		EventBus.$on("api-save", reason => {
			this.apisuccess = true;
			this.text = reason;
		});
	}
};
</script>

<style lang="less">
a {
	text-decoration: none;
}
:root {
	--blue: #14bb83;
	--orange: #ffa726;
	--green: #00e676;
	--error: #ef5350;
	--light-gray: #9e9e9e;
	--purple: rgb(0, 249, 166);

	/* Application theme colors */
	--color-primary: #212121;
	--color-secondary: #607d8b;
	--color-teriatry: #263238;

	/* buttun colors */
	--color-btn-primary: #ab47bc;
	--color-btn-secondary: #4fc3f7;

	/* Background colors */
	--color-bk-primary1: #212121;
	--color-bk-secondary1: #303030;
	--color-bk-var1: #424242;

	/* Navigation Link Colors */
	--nav-link--color: #2196f3;
}
.theme--dark.application {
	background-color: #121212;
}
.theme--dark.v-navigation-drawer {
	background-color: #252525;
}

.theme--dark.v-toolbar {
	background-color: rgba(255, 255, 255, 0.16);
}
.theme--dark.v-card {
	background-color: #252525;
	color: #fff;
}

.theme--dark .v-stepper__header {
	background-color: #484848;
	color: #fff;
}

[v-cloak] {
	display: none;
}
.container {
	max-width: 1785px;
	background-color: #121212;
}
.v-content__wrap {
	background-color: #121212;
}
.menuable__content__active {
	/*Fix for Safari dialog display. Reference Vuetify issue #2111 */
	z-index: 250 !important;
}
.mrt-nav--link {
	background-color: var(--nav-link--color) !important;
}
.mrt-nav--link-icon {
	color: var(--nav-link--color) !important;
}
</style>

