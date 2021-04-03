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

		<b-card class="chat-bubble input-bubble" :header="$t('LoginViaSms')">
			<p>{{ $t('LoginViaSmsInfo') }}</p>
			<liquido-input
				id="mobilephoneInput"
				v-model="mobilephone"
				type="mobilephone"
				:label="$t('yourMobilephone')"
				:placeholder="$t('mobilephonePlaceholder')"
				:invalid-feedback="$t('mobilephoneInvalid')"
				:state.sync="mobilephoneInputState"
			/>
			<div class="text-right">
				<button id="requestTokenButton" :disabled="requestTokenButtonDisabled" class="btn btn-primary" @click="requestAuthToken">
					<div v-if="waitUntilNextRequestSecs > 0">
						{{ $t('TokenSent') }}&nbsp;<b-spinner small />
					</div>
					<div v-else>
						{{ $t('RequestToken') }}
					</div>
				</button>
			</div>
			<b-collapse v-model="tokenHasBeenRequested" class="mt-3">
				<liquido-input
					id="authToken"
					v-model="authToken"
					type="number"
					placeholder="<123456>"
					:label="$t('AuthToken')"
					:invalid-feedback="$t('authTokenInvalid')"
					:minlength="6"
					:maxlength="6"
					:required="true"
					:show-counter="true"
					:state.sync="authTokenInputState"
				></liquido-input>
			</b-collapse>
		</b-card>
		

		<b-card class="chat-bubble shadow-sm input-bubble" :header="$t('LoginViaEmail')">
			<p>{{ $t('LoginViaEmailInfo') }}</p>
			<liquido-input
				id="emailInput"
				v-model="emailInput"
				type="email"
				:label="$t('yourEMail')"
				:placeholder="$t('emailPlaceholder')"
				:invalid-feedback="$t('emailInvalid')"
				:state.sync="emailInputState"
			/>
			<button type="button" :disabled="sendLinkButtonDisabled" class="btn btn-primary float-right" @click="requestEmailToken">
				{{ $t("SendLink") }}
			</button>
			<b-collapse v-model="emailSent" class="mt-3">
				<p>{{ $t('emailSentInfo') }}</p>
			</b-collapse>
		</b-card>
	</div>
</template>

<script>
import config from "config"
import liquidoInput from "@/components/liquido-input"

const REQUEST_THROTTLE_SECS = 10

export default {
	i18n: {
		messages: {
			de: {
				LoginViaSms: "Login per SMS",
				LoginViaSmsInfo: "Ich kann dir einen Code per SMS schicken. Damit kannst du dich dann ganz einfach einloggen.",
				yourMobilephone: "Deine Handynummer",
				mobilephonePlaceholder: "+49 151 1111111",
				mobilephoneInvalid: "Handynummer ungültig",
				RequestToken: "Login Code anfordern",
				TokenSent: "SMS verschickt ...",
				AuthToken: "Login-Code aus SMS",
				authTokenInvalid: "Der SMS Code hat genau sechs Ziffern.",
				// error modal
				authTokenInvalidTitle: "Login-Code ungültig",
				authTokenInvalidMsg: "Der eingegebene Login-Code wurde nicht akzeptiert. Hast du dich vielleicht einfach nur vertippt? Versuche es bitte noch einmal.",				

				LoginViaEmail: "Login per Email",
				yourEMail: "Deine Email",
				LoginViaEmailInfo: "Ich kann dir einen magischen Link per E-Mail schicken. Klicke in der E-Mail auf den Link um dich einzuloggen.",
				SendLink: "Link zuschicken",
				emailPlaceholder: "info@domain.de",
				emailInvalid: "E-Mail ungültig",
				emailSentInfo: "Ok, die Email mit deinem Login Link wurde verschickt.",

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
			// synced states from liquido-inputs
			emailInputState: null,
			mobilephoneInputState: null,
			authTokenInputState: null,
			// Throttling: Only allow request auth token once every few seconds
			waitUntilNextRequestSecs: 0,
			tokenHasBeenRequested: false,
			emailSent: false,
		}
	},
	computed: {
		showDevLogin() {
			return process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test"
		},
		sendLinkButtonDisabled() {
			return this.emailInputState !== true
		},
		requestTokenButtonDisabled() {
			return this.mobilephoneInputState !== true || this.waitUntilNextRequestSecs > 0
		},
	},
	watch: {
		/** UX: When auth token format is valid, then immideately try to login with it. No extra "login" button step. */
		authTokenInputState: function(newVal) {
			if (newVal === true) {
				console.log("Token format is valid")
				this.loginWithAuthToken()
			}
		}
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
					this.emailSent = true
				})
				.catch(err => {
					console.log("Could not send email link!", err)
					this.emailSent = false
				})
		},

		requestAuthToken() {
			this.tokenHasBeenRequested = true
			if (this.waitUntilNextRequestSecs > 0) return
			this.waitUntilNextRequestSecs = REQUEST_THROTTLE_SECS
			let requestThrottler = setInterval(() => {
				if (this.waitUntilNextRequestSecs > 0) {
					this.waitUntilNextRequestSecs--
				} else {
					clearInterval(requestThrottler)
					this.waitUntilNextRequestSecs = 0
				}
			}, 1000);
			console.log("requestAuthToken", this.mobilephone)
		},

		loginWithAuthToken() {
			this.$api.loginWithAuthToken(this.mobilephone, this.authToken)
				.then(() => {
					this.$router.push({name: "teamHome"})
				})
				.catch(err => {
					console.log("Login with authToken failed", err)
					
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
