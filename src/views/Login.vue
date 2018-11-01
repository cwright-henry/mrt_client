<template>
	<v-layout align-center justify-center app>
		<v-flex xs12 sm8 md4>
			<v-card class="elevation-12">
				<v-toolbar dense>
					<v-toolbar-title>MRT Login</v-toolbar-title>
				</v-toolbar>
				<v-card-text>
					<v-container grid-list-md fluid>
						<v-layout row wrap>
							<v-flex xs12 mb-2>
								<v-text-field 
									prepend-icon="person" 
									v-model="email" 
									required
									:counter="30"
									single-line
									box
									autofocus
									label="Email">
								</v-text-field>
							</v-flex>
							<v-flex xs12>
								<v-text-field 
									prepend-icon="lock"
									v-model="password" 
									required
									single-line
									box
									hide-details
									label="Password" 
									type="password">
								</v-text-field>
							</v-flex>
						</v-layout>
					</v-container>
				</v-card-text>
				<div class="mrt-login--failed" v-if="error">
					{{error}}
				</div>
				<v-divider></v-divider>
				<div class="mrt-login text-xs-right">
					<v-btn @click="login" :loading="loading" color="primary">Login</v-btn>
				</div>
			</v-card>
		</v-flex>
	</v-layout>	
</template>

<script>
	export default {
		name: 'MRTLogin',
		data() {
			return {
				valid: false,
				email: '',
				password: '',
				error: null
			}
		},
		computed: {
			loading() {
				return this.$store.state.user.loading;
			}
		},
		methods: {
			login () {
				let payload = {
					email: this.email,
					password: this.password
				}
				this.$store.dispatch('user/login', payload)
				.then(() => {
					this.$router.push({path: '/'});
				})
				.catch((e) => {
					if(e.status == 403) {
						this.error = 'Invalid email or password!';
					}
				})
			}
		}
  }
</script>

<style lang="less">
.mrt-login {
	padding:18px 36px;
}
.mrt-login--failed {
	color: var(--error);
	text-align: center;
	border:1px solid var(--error);
	margin: 0px 56px 12px 56px;
	padding:8px
}
</style>
