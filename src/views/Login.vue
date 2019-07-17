<template>
	<div app class="mrt-login">
		<header class="header"></header>
		<section class="section">
			<div class="login-box">
				<div class="login-box__intro">
					<h1>Mean Reversion Trader</h1>
					<h3>
						Bluecrowe Software
						<logo />
					</h3>
				</div>
				<div class="login-box__contents elevation-8">
					<div class="logo">
						<i class="material-icons">person</i>
						<h1>Login</h1>
					</div>
					<div class="email">
						<v-text-field
							prepend-icon="person"
							v-model="email"
							:error-messages="errorMessages"
							required
							color="#1976D2"
							background-color="#B0BEC5"
							@keypress.enter="login"
							box
							autofocus
							label="Email"
						></v-text-field>
					</div>
					<div class="password">
						<v-text-field
							prepend-icon="lock"
							v-model="password"
							:error-messages="errorMessages"
							color="#1976D2"
							background-color="#B0BEC5"
							required
							box
							@keypress.enter="login"
							label="Password"
							type="password"
						></v-text-field>
					</div>
					<div class="action">
						<v-btn @click="login" :loading="loading" block large>Login</v-btn>
					</div>
				</div>
			</div>
		</section>
	</div>
</template>

<script>
import Logo from "../../public/svg/crowe.svg";
import { mapState } from "vuex";
import { getErrorCode } from "@/utils";

export default {
	name: "MRTLogin",
	data() {
		return {
			email: "",
			password: "",
			errorMessages: null
		};
	},
	components: {
		Logo
	},
	computed: {
		...mapState("user", ["loading"])
	},
	methods: {
		async login() {
			try {
				await this.$store.dispatch("user/login", {
					email: this.email,
					password: this.password
				});
				this.$router.push({ path: "/" });
			} catch (error) {
				const code = getErrorCode(error);
				if (code === "INVALID_LOGIN") {
					this.errorMessages = "Email or password is incorrect";
				} else {
					this.errorMessages = "Unknown Error";
				}
				setTimeout(() => {
					this.errorMessages = null;
				}, 2500);
			}
		}
	}
};
</script>

<style lang="less">
.mrt-login {
	display: flex;
	flex-direction: column;
	.v-icon {
		color: #455a64 !important;
	}
	.header {
		height: 400px;
		width: 100%;
		background-color: #37474f;
	}
	.login-box {
		max-width: 500px;
		margin: -300px auto 100px auto;
		.login-box__intro {
			text-align: center;
			padding: 24px 0 24px 0;
			h1 {
				font-size: 32px;
			}
			h3 {
				font-size: 16px;
				font-weight: 300;
				font-style: italic;
				display: flex;
				justify-content: center;
				svg {
					margin: 0 0 0 4px;
				}
			}
		}
		.login-box__contents {
			background-color: #eceff1;
			padding: 24px 48px;
			border-radius: 2px;
			.action {
				margin: 12px 0 12px 0;
				button {
					color: #fff;
					background-color: #1e88e5;
				}
			}
			.logo {
				display: flex;
				flex-direction: column;
				align-items: center;
				text-align: center;
				i {
					font-size: 64px;
					height: 72px;
					width: 72px;
					border-radius: 50%;
					background-color: #37474f;
				}
				h1 {
					color: #37474f;
					font-weight: 300;
					margin: 2px 0 32px 0;
				}
			}
		}
	}
}
.mrt-login--failed {
	color: var(--error);
	text-align: center;
	border: 1px solid var(--error);
	margin: 0px 56px 12px 56px;
	padding: 8px;
}
</style>
