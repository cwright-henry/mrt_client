<template>
	<div app light class="mrt-login">
		<section class="section">
			<div class="login-box elevation-20">
				<div class="login-box__intro">
					<h1>Mean Reversion Trader</h1>
					<h3>
						Bluecrowe Analytics
						<logo />
					</h3>
				</div>
				<div class="login-box__contents">
					<div class="logo">
						<v-icon>mdi-account</v-icon>
						<h1>Sign In</h1>
					</div>
					<div class="email">
						<v-text-field
							prepend-icon="mdi-email-outline"
							v-model="email"
							:error-messages="errorMessages"
							@keypress.enter="login"
							placeholder="Email"
							label
							maxlength="256"
							light
							outlined
							color="#2196F3"
						></v-text-field>
					</div>
					<div class="password">
						<v-text-field
							prepend-icon="mdi-lock"
							v-model="password"
							:append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
							:type="show ? 'text' : 'password'"
							:error-messages="errorMessages"
							@keypress.enter="login"
							hint="At least 8 characters"
							placeholder="Password"
							label
							light
							outlined
							class="input-group--focused"
							color="#2196F3"
							maxlength="32"
							@click:append="show = !show"
						></v-text-field>
					</div>
					<div class="action">
						<v-btn @click="login" color="#1E88E5" :loading="loading" large>Sign In</v-btn>
					</div>
				</div>
			</div>
		</section>
	</div>
</template>

<script>
import Logo from "../../public/svg/crowe.svg";
import { mapState } from "vuex";

export default {
	name: "MRTLogin",
	data() {
		return {
			email: "",
			password: "",
			errorMessages: null,
			show: false
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
				this.errorMessages = "Email or password is incorrect";
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
	background: center/cover url("/img/bb-login8.jpg") no-repeat;
	min-height: 100vh;
	.v-icon {
		color: #455a64 !important;
	}
	.login-box {
		max-width: 450px;
		margin: 80px auto 100px auto;
		border-radius: 8px;
		.login-box__intro {
			text-align: center;
			padding: 16px 0 16px 0;
			background-color: #eeeeee;
			border-radius: 8px 8px 0 0;
			border-bottom: 1px solid #e0e0e0;
			h1 {
				font-size: 32px;
				font-weight: 300;
				color: #212121;
			}
			h3 {
				font-size: 16px;
				font-weight: 300;
				color: #212121;
				font-style: italic;
				display: flex;
				justify-content: center;
				svg {
					margin: 0 0 0 4px;
				}
			}
		}
		.login-box__contents {
			background-color: #fff;
			padding: 36px;
			border-radius: 0 0 8px 8px;
			.action {
				margin: 4px 0 4px 0;
				text-align: center;
			}
			.logo {
				display: flex;
				flex-direction: column;
				align-items: center;
				text-align: center;
				margin: 0 0 36px 0;
				i {
					font-size: 64px;
					height: 72px;
					width: 72px;
					border-radius: 50%;
					background-color: #e0e0e0;
				}
				h1 {
					color: #37474f;
					font-weight: 300;
					margin: 2px 0 0 0;
				}
			}
		}
	}
	input:-webkit-autofill,
	input:-webkit-autofill:hover,
	input:-webkit-autofill:focus,
	input:-webkit-autofill:active {
		-webkit-box-shadow: 0 0 0 30px #fff inset !important;
	}
	input:-webkit-autofill {
		-webkit-text-fill-color: #212121 !important;
	}
}
.mrt-login--failed {
	color: var(--error);
	text-align: center;
	border: 1px solid var(--error);
	margin: 0px 56px 12px 56px;
	padding: 8px;
}

@media screen and (max-width: 600px) {
	.mrt-login {
		background: #fff;
		.login-box {
			max-width: 100%;
			margin: 0;
			box-shadow: none !important;
			.login-box__contents {
				padding: 36px 16px;
			}
		}
	}
}
</style>
