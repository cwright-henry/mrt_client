<template>
	<v-container fluid grid-list-lg>
		<v-layout row wrap>
			<v-flex xs8 offset-xs2 class="text-xs-center mt-3">
				<v-avatar color="#2196F3" size="48">
					<v-icon dark size="36">account_circle</v-icon>
				</v-avatar>
				<div class="headline mt-2">{{fullName}}</div>
				<div class="account-status">
					<div class="subheading">
						<span>Email</span>
						{{user.email}}
					</div>
					<div class="subheading">
						<span>Company</span>
						{{user.companyName}}
					</div>
					<div class="subheading">
						<span>Member Since</span>
						{{user.created | date}}
					</div>
					<div class="subheading">
						<span>Session Token Expires</span>
						{{tokenExpires | date}}
					</div>
				</div>
			</v-flex>
			<v-flex xs8 offset-xs2 class="mt-2">
				<v-layout row wrap>
					<v-flex xs12>
						<v-card>
							<v-toolbar dense flat>
								<v-toolbar-title class="font-weight-light account-password-header">
									<i class="material-icons">security</i>Reset Password
								</v-toolbar-title>
								<v-spacer></v-spacer>
							</v-toolbar>
							<v-card-text>
								<v-layout row wrap>
									<v-flex xs12>
										<v-text-field
											prepend-icon="lock"
											v-model="oldPassword"
											:append-icon="showOldPassword ? 'visibility' : 'visibility_off'"
											:type="showOldPassword ? 'text' : 'password'"
											hint="At least 8 characters"
											:error-messages="oldErrorMessages"
											label="Current Password"
											class="input-group--focused"
											color="#2196F3"
											counter="32"
											maxlength="32"
											@click:append="showOldPassword = !showOldPassword"
										></v-text-field>
									</v-flex>
									<v-flex xs12>
										<v-text-field
											prepend-icon="lock"
											v-model="newPassword"
											:append-icon="showNewPassword ? 'visibility' : 'visibility_off'"
											:type="showNewPassword ? 'text' : 'password'"
											hint="At least 8 characters"
											:error-messages="newErrorMessages"
											label="New Password"
											class="input-group--focused"
											color="#2196F3"
											counter="32"
											maxlength="32"
											@click:append="showNewPassword = !showNewPassword"
										></v-text-field>
									</v-flex>
									<v-flex xs12>
										<div class="text-xs-center mt-2">
											<v-btn @click="update" :loading="updating" color="#2196F3">Update</v-btn>
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
import moment from "moment";
import { EventBus } from "@/events";
import { getErrorCode } from "@/utils";
import { mapState, mapGetters } from "vuex";

export default {
	data() {
		return {
			oldPassword: "",
			newPassword: "",
			showOldPassword: true,
			showNewPassword: true,
			oldErrorMessages: null,
			newErrorMessages: null,
			updating: false
		};
	},
	computed: {
		...mapState("user", ["user"]),
		...mapGetters("user", ["fullName", "tokenExpires"])
	},
	methods: {
		formatDate(d) {
			return moment(d).valueOf();
		},

		async update() {
			// Check old and new password lenghts
			if (this.oldPassword.length < 8 || this.newPassword.length < 8) {
				if (this.oldPassword.length < 8) {
					this.oldErrorMessages =
						"Password lenght must be greater than 8 characters";
					setTimeout(() => {
						this.oldErrorMessages = null;
					}, 2500);
				}

				if (this.newPassword.length < 8) {
					this.newErrorMessages =
						"Password lenght must be greater than 8 characters";
					setTimeout(() => {
						this.newErrorMessages = null;
					}, 2500);
				}
				return;
			}

			// OK lets try and change it
			try {
				this.updating = true;
				await this.$store.dispatch("user/updatePassword", {
					oldPassword: this.oldPassword,
					newPassword: this.newPassword
				});

				setTimeout(() => {
					this.oldPassword = "";
					this.newPassword = "";
				}, 1500);
				EventBus.$emit("api-save", "New password saved!");
			} catch (e) {
				const code = getErrorCode(e);
				if (code === "PASSWORD_MISMATCH") {
					this.oldErrorMessages =
						"Password does not match current password";
					setTimeout(() => {
						this.oldErrorMessages = null;
					}, 2500);
				} else if (code === "INVALID_LOGIN") {
					this.$store.dispatch("user/logout").then(() => {
						this.$router.push("/login");
					});
				} else if (
					code[0] &&
					code[0].indexOf("required pattern") != -1
				) {
					this.newErrorMessages =
						"Password must only contain characters a-z, A-Z, 0-9";
					setTimeout(() => {
						this.newErrorMessages = null;
					}, 5000);
				} else {
					EventBus.$emit("api-error", "Unknown error");
				}
			} finally {
				this.updating = false;
			}
		}
	}
};
</script>

<style lang="less">
.account-status {
	text-align: left;
	margin: 36px 0 12px 0;
	span {
		color: #757575;
		font-size: 13px;
		margin: 0 12px 0 0;
		display: inline-block;
		width: 140px;
	}
}
.account-password-header {
	display: flex;
	align-items: center;
	i {
		margin: 0 5px 0 -3px;
		font-size: 22px;
	}
}
</style>
