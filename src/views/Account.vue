<template>
	<v-container fluid grid-list-lg>
		<v-layout row wrap>
			<v-flex md3 xs12>
				<v-card>
					<v-toolbar dense flat>
						<v-toolbar-title>Member</v-toolbar-title>
						<v-spacer></v-spacer>
					</v-toolbar>
					<v-card-text class="text-xs-left">
						<v-avatar color="secondary" size="78">
							<v-icon dark size="56">account_circle</v-icon>
						</v-avatar>
						<div class="headline mt-3">{{fullName}}</div>
						<div class="subheading">{{email}}</div>
					</v-card-text>
				</v-card>
			</v-flex>
			<v-flex md9 xs12>
				<v-layout row wrap>
					<v-flex xs12>
						<v-card>
							<v-toolbar dense flat>
								<v-toolbar-title>Account Status</v-toolbar-title>
								<v-spacer></v-spacer>
							</v-toolbar>
							<v-card-text></v-card-text>
						</v-card>
					</v-flex>
					<v-flex xs12>
						<v-card>
							<v-toolbar dense flat>
								<v-toolbar-title>Reset Login</v-toolbar-title>
								<v-spacer></v-spacer>
							</v-toolbar>
							<v-card-text>
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
									<v-flex xs12>
										<v-divider></v-divider>
										<div class="text-xs-right">
											<v-btn @click="login" color="primary">Reset</v-btn>
										</div>
									</v-flex>
								</v-layout>
							</v-card-text>
						</v-card>
					</v-flex>
				</v-layout>
			</v-flex>
		</v-layout>
	</v-container>
</template>

<script>
export default {
	data() {
		return {
			password: ''
		}
	},
	computed:{
		fullName() {
			return this.$store.getters['user/fullName']
		},

		email() {
			return this.$store.getters['user/email']
		}
	}
}
</script>

<style>

</style>
