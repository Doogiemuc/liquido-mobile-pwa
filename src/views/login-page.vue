<template>
	<div>
		<h1 id="login-page">{{ $t('Login') }}</h1>

		<div v-if="showDevLogin" class="mb-3">
			<button type="button" class="btn btn-primary" @click="devLoginAdmin">
				<i class="fas fa-shield-alt"></i> {{ $t("DevLoginAdmin") }}
			</button>
			<button type="button" class="btn btn-primary ml-3" @click="devLoginMember">
				{{ $t("DevLoginMember") }}
			</button>
		</div>

		<!-- Login via SMS -->

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
					id="authTokenInput"
					v-model="authToken"
					type="text"
					placeholder="<123456>"
					:label="$t('AuthToken')"
					:invalid-feedback="$t('authTokenInputInvalid')"
					:minlength="6"
					:maxlength="6"
					:required="true"
					:show-counter="true"
					:state.sync="authTokenInputState"
				></liquido-input>
				<div 
					v-if="tokenSuccessMessage" 
					id="tokenSuccessMessage"
					class="alert alert-success mt-3"
					v-html="tokenSuccessMessage"
				></div>
				<div 
					v-if="tokenErrorMessage" 
					id="tokenErrorMessage"
					class="alert alert-danger mt-3"
					v-html="tokenErrorMessage"
				></div>
			</b-collapse>
		</b-card>
		
		<!-- Login via Email -->

		<b-card class="chat-bubble shadow-sm input-bubble" :header="$t('LoginViaEmail')">
			<p>{{ $t('LoginViaEmailInfo') }}</p>
			<liquido-input
				id="loginEmailInput"
				v-model="emailInput"
				type="email"
				:label="$t('yourEMail')"
				:placeholder="$t('emailPlaceholder')"
				:invalid-feedback="$t('emailInvalid')"
				:state.sync="emailInputState"
				@keypress.enter="requestEmailToken"
			/>
			<div class="text-right">
				<button type="button" :disabled="sendLinkButtonDisabled" class="btn btn-primary" @click="requestEmailToken">
					{{ $t("SendLink") }}
				</button>
			</div>
			<div 
				v-if="emailMessage" 
				class="alert mt-3"
				:class="emailMessageClass"
				v-html="emailMessage"
			></div>
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
				LoginViaSmsInfo: "Ich kann dir ein Login-Token per SMS schicken. Mit diesem Zahlencode kannst du dich dann einloggen.",
				yourMobilephone: "Deine Handynummer",
				mobilephonePlaceholder: "+49 151 1111111",
				mobilephoneInvalid: "Handynummer ungültig",
				RequestToken: "Login-Token anfordern",
				TokenSent: "SMS verschickt ...",
				AuthToken: "Login-Token aus SMS",
				authTokenInputInvalid: "Der Login-Token hat genau sechs Ziffern.",
				MobilephoneNotFound: "Tut mir leid, ich kenne diese Telefonnummer in LIQUIDO nicht. Bitte <a href='/'>registriere dich zuerst.</a>",
				TokenInvalid: "Der eingegebene Login-Token wurde nicht akzeptiert. Hast du dich vielleicht einfach nur vertippt? Bitte versuche es bitte noch einmal.",
				SmsTokenRequestedSuccessfully: "Ok, die SMS wurde verschickt. Bitte gib den Login-Code aus der SMS ein.",
				RequestAuthTokenError: "Login-Token konnte nicht angefordert werden. Bitte versuche es noch einmal.",

				LoginViaEmail: "Login per Email",
				yourEMail: "Deine Email",
				LoginViaEmailInfo: "Ich kann dir einen magischen Link per E-Mail schicken. Klicke in der E-Mail auf den Link um dich einzuloggen.",
				SendLink: "Link zuschicken",
				emailPlaceholder: "info@domain.de",
				emailInvalid: "E-Mail ungültig",
				emailSentSuccessfully: "Ok, die Email mit deinem Login Link wurde verschickt.",
				CouldNotSendEmail: "Es gab ein Problem beim Verschicken der E-Mail. Bitte versuche es später noch einmal.",
				UserWithThatEmailNotFound: "Tut mir leid, ich kenne niemanden mit dieser E-Mail Adresse. Möchtest du dich <a href='/welcome'>zuerst registrieren</a>?",

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
			// Login via email
			emailInput: "",
			emailMessage: undefined,
			emailMessageClass: "alert-success",

			// auth token (via SMS)
			mobilephone: "",
			authToken: undefined,
			mobilephoneInputState: null,    // synced states from liquido-inputs
			authTokenInputState: null,      // synced states from liquido-inputs
			waitUntilNextRequestSecs: 0,    // Throttling: Only allow request auth token once every few seconds
			tokenHasBeenRequested: false,
			tokenSuccessMessage: undefined,
			tokenErrorMessage: undefined,

			//TODO: count failed login attempts and then offer additional help

			// magic link via email
			emailInputState: null,		// synced states from liquido-inputs
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
			console.log("authTokenInputState update", newVal)
			if (newVal === true) {
				this.loginWithAuthToken()
			}
		}
	},
	mounted() {
		if (this.email && this.teamName) {
			this.$api.devLogin(this.email, this.teamName, config.devLogin.token).then(() => {
				console.info("devLogin <"+this.email+"> into "+this.teamName)
				this.$router.push("/team")		// DevLogin navigags to /team ! Tests rely on this!
			}).catch(err => console.error("DevLogin via params failed!", err))
		}
	},
	methods: {
		devLoginAdmin() {
			this.$api.logout()
			this.$api.devLogin(config.devLogin.adminEmail, config.devLogin.adminTeamname, config.devLogin.token).then(() => {
				this.$router.push("/team")
			}).catch(err => console.error("DevLogin Admin failed!", err))
		},

		devLoginMember() {
			this.$api.logout()
			this.$api.devLogin(config.devLogin.memberEmail, config.devLogin.memberTeamname, config.devLogin.token).then(() => {
				this.$router.push("/team")
			}).catch(err => console.error("DevLogin Member failed!", err))
		},

		/** Send a magic link that the user can login with for the next n hours. */
		requestEmailToken() {
			console.log("requestEmailToken")
			if (this.emailInputState !== true) return  // When user presses return and input state is not yet valid
			this.$api.logout()  // delete any previously stored JWT
			this.$api.requestEmailToken(this.emailInput)
				.then(() => {
					console.log("Email login link sent successfully")
					this.emailMessageClass = "alert-success"
					this.emailMessage = this.$t("emailSentSuccessfully")
				})
				.catch(err => {
					this.$root.scrollToBottom()
					if (err.response &&	
							err.response.data &
							err.response.data.liquidoErrorCode === this.$api.err.CANNOT_LOGIN_EMAIL_NOT_FOUND) 
					{
						console.log("There is no user with email: "+this.emailInput)
						this.emailMessageClass = "alert-danger"
						this.emailMessage = this.$t("UserWithThatEmailNotFound")
					} else {
						console.error("Could not send email link!", err)
						this.emailMessageClass = "alert-danger"
						this.emailMessage = this.$t("CouldNotSendEmail")
					}
				})
		},

		/** 
		 * Request a on time token for authentication. 
		 * Be nice to our backend API. We only allow this request once every n seconds.
		 */
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

			this.$api.logout()
			this.authToken = undefined
			this.tokenSuccessMessage = undefined
			this.tokenErrorMessage = undefined
			console.debug("requestAuthToken", this.mobilephone)
			this.$api.requestAuthToken(this.mobilephone)
				.then(res => {
					console.debug("Auth token requested successfull.", res)
					this.tokenSuccessMessage = this.$t("SmsTokenRequestedSuccessfully")
					this.tokenErrorMessage = undefined
				})
				.catch(err => {
					if (err.response &&
							err.response.data &&
							err.response.data.liquidoErrorCode === this.$api.err.CANNOT_LOGIN_MOBILE_NOT_FOUND) {
						this.waitUntilNextRequestSecs = 0
						this.tokenSuccessMessage = undefined
						this.tokenErrorMessage = this.$t("MobilephoneNotFound")
					} else {
						console.error("Cannot requestAuthToken", err)
						this.waitUntilNextRequestSecs = 1
						this.tokenErrorMessage = this.$t("RequestAuthTokenError")
					}
				})
		},

		loginWithAuthToken() {
			this.tokenErrorMessage = undefined
			this.$api.loginWithAuthToken(this.mobilephone, this.authToken)
				.then(() => {
					this.$router.push({name: "teamHome"})
				})
				.catch(err => {
					if (err.response &&
							err.response.data &&
							err.response.data.liquidoErrorCode === this.$api.err.CANNOT_LOGIN_TOKEN_INVALID) {
						console.log("The entered auth token was invalid.")
						this.tokenErrorMessage = this.$t("TokenInvalid")
					} else {
						console.error("Something is wrong with our auth backend", err)
					}
					
				})
		}
	},
}
</script>

<style></style>
