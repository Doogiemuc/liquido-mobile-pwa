<template>
	<div id="LoginPage" class="container">
		<h1>{{ $t('Login') }}</h1>

		<div v-if="showDevLogin" class="mb-3">
			<button type="button" class="btn btn-primary" @click="devLoginAdmin">
				<i class="fas fa-shield-alt"></i> {{ $t("DevLoginAdmin") }}
			</button>
			<button type="button" class="btn btn-primary ml-3" @click="devLoginMember">
				{{ $t("DevLoginMember") }}
			</button>
		</div>

		<b-card class="chat-bubble shadow-sm input-bubble" :header="$t('LoginViaEmail')">
			<p>{{ $t('LoginViaEmailInfo') }}</p>
			<liquido-input
				id="emailInput"
				v-model="emailInput"
				:label="$t('yourEMail')"
				:placeholder="$t('emailPlaceholder')"
				type="email"
				:invalid-feedback="$t('emailInvalid')"
				@statusChange="emailInputStatusChange"
			/>
			<button type="button" :disabled="sendLinkButtonDisabled" class="btn btn-primary float-right" @click="requestEmailToken">
				{{ $t("SendLink") }}
			</button>
		</b-card>

		<b-card class="chat-bubble shadow-sm input-bubble" :header="$t('LoginViaSms')">
			<p>{{ $t('LoginViaSmsInfo') }}</p>
			<liquido-input
				id="mobilephoneInput"
				v-model="mobilephone"
				type="mobilephone"
				:label="$t('yourMobilephone')"
				:placeholder="$t('mobilephonePlaceholder')"
				:invalid-feedback="$t('mobilephoneInvalid')"
				@statusChange="mobilephoneInputStatusChange"
			/>
			<div class="text-right">
				<button id="requestTokenButton" :disabled="requestTokenButtonDisabled" class="btn btn-primary">
					{{ $t("RequestToken") }}
				</button>
			</div>
			<hr />
			<p class="mt-3">{{ $t('PleaseEnterToken') }}</p>
			<liquido-input
				id="authToken"
				v-model="authToken"
				type="number"
				placeholder="123456"
				:label="$t('AuthToken')"
				:invalid-feedback="$t('authTokenInvalid')"
				:minlength="6"
				:maxlength="6"
				:required="true"
				:show-counter="true"
			></liquido-input>
		</b-card>
	</div>
</template>

<script>
import config from "config"
import liquidoInput from "@/components/liquido-input"

export default {
	i18n: {
		messages: {
			de: {
				LoginViaEmail: "Login per Email",
				yourEMail: "Deine Email",
				LoginViaEmailInfo: "Ich kann dir einen magischen Link per E-Mail schicken. Mit diesem kannst du dich dann ganz einfach einloggen.",
				SendLink: "Link zuschicken",
				emailPlaceholder: "info@domain.de",
				emailInvalid: "E-Mail ungültig",

				LoginViaSms: "Login per SMS",
				yourMobilephone: "Deine Handynummer",
				LoginViaSmsInfo: "Ich kann dir einen einmal gültigen Code per SMS schicken. Das ist besonders sicher.",
				RequestToken: "Login Code anfordern",
				mobilephonePlaceholder: "+49 151 1234567",
				mobilephoneInvalid: "Handynummer ungültig",
				AuthToken: "SMS Code",
				authTokenInvalid: "Der SMS Code hat genau sechs Ziffern.",
				PleaseEnterToken: "Gib dann den 6-stelligen Code aus der SMS hier ein:",

				DevLoginAdmin: "devLogin: Admin",
				DevLoginMember: "devLogin: Member",
			}
		}
	},
	components: { liquidoInput },
	props: {
		email: { type: String, required: false, default: undefined },
		teamName: { type: String, required: false, default: undefined },
	},
	data() {
		return {
			emailInput: "",
			mobilephone: "",
			authToken: undefined,
			sendLinkButtonDisabled: true,
			requestTokenButtonDisabled: true,
		}
	},
	computed: {
		showDevLogin() {
			return process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test"
		},
	},
	mounted() {
		if (this.email && this.teamName) {
			this.$api.devLogin(this.email, this.teamName).then(() => {
				console.info("devLogin <"+this.email+"> into "+this.teamName)
				this.$router.push("/team")		// DevLogin navigags to /team ! Tests rely on this!
			}).catch(err => console.error("DevLogin via params failed!", err))
		}
	},

	methods: {
		emailInputStatusChange(newStatus) {
			this.sendLinkButtonDisabled = (newStatus !== true)
		},
		mobilephoneInputStatusChange(newStatus) {
			this.requestTokenButtonDisabled = (newStatus !== true)
		},

		devLoginAdmin() {
			this.$api.devLogin(config.devLogin.adminEmail, config.devLogin.adminTeamname).then(() => {
				this.$router.push("/team")
			}).catch(err => console.error("DevLogin Admin failed!", err))
		},

		devLoginMember() {
			this.$api.devLogin(config.devLogin.memberEmail, config.devLogin.memberTeamname).then(() => {
				this.$router.push("/team")
			}).catch(err => console.error("DevLogin Member failed!", err))
		},

		/** Send a magic link that the user can login with for the next n hours. */
		requestEmailToken() {
			this.$api.requestEmailToken(this.emailInput)
				.then(() => {
					console.log("Email login link sent successfully")
				})
				.catch(err => {
					console.log("Could not send email link!", err)
				})
		},

		loginWithSmsToken() {
			this.$api.loginWithAuthToken(this.authToken)
				.then(() => {
					this.$router.push({name: "teamHome"})
				})
				.catch(err => {
					console.log("Login with authToken failed", err)
					//TODO: show error modal
				})
		}
	},
}
</script>

<style lang="scss" scoped>
.digit-group {
	white-space: nowrap;
	text-align: center;
}
.digit {
	width: 30pt;
	height: 30pt;
	line-height: 24pt;
	padding: 0;
	font-size: 18pt;
	text-align: center;
	display: inline-block; /* prevent wrapping also on narrow mobile view */
}
</style>
