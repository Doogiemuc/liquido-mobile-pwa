<template>
	<div id="LoginPage" class="container">
		<h1>Login</h1>

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
				v-model="email"
				:label="$t('yourEMail')"
				:placeholder="$t('emailPlaceholder')"
				:type="email"
				:invalid-feedback="$t('emailInvalid')"
			/>
			<button type="button" class="btn btn-primary float-right">
				{{ $t("LoginEmailButton") }}
			</button>
		</b-card>

		<b-card class="chat-bubble shadow-sm input-bubble" :header="$t('LoginWithAuthy')">
			<p>{{ $t('LoginWithAuthyInfo') }}</p>
			<liquido-input
				id="mobilephoneInput"
				v-model="mobilephone"
				:label="$t('yourMobilephone')"
				:placeholder="$t('mobilephonePlaceholder')"
				:type="mobilephone"
				:invalid-feedback="$t('mobilephoneInvalid')"
			/>
			<button type="button" class="btn btn-primary float-right">
				{{ $t("OpenAuthy") }}
			</button>
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
				LoginViaEmailInfo: "Ich kann dir einen MagicLink per E-Mail schicken. Mit diesem kannst du dich dann ganz einfach einloggen.",
				LoginEmailButton: "Link zuschicken",
				emailPlaceholder: "info@domain.de",
				emailInvalid: "E-Mail ungültig",

				LoginWithAuthy: "Login with Authy",
				yourMobilephone: "Deine Handynummer",
				LoginWithAuthyInfo: "Die Authy App kann dir einen einmal gültigen Login-Code per SMS schicken. Das ist besonders sicher",
				OpenAuthy: "Authy öffnen",
				mobilephonePlaceholder: "info@domain.de",
				mobilephoneInvalid: "E-Mail ungültig",

				DevLoginAdmin: "devLogin: Admin",
				DevLoginMember: "devLogin: Member",
			}
		}
	},
	components: { liquidoInput },
	data() {
		return {
			email: "",
			mobilephone: "",
		}
	},
	computed: {
		showDevLogin() {
			return process.env.NODE_ENV === "development"
		}
	},
	mounted() {
		
	},
	methods: {
		devLoginAdmin() {
			this.$api.devLogin(config.devLogin.adminEmail, config.devLogin.adminTeamname).then(() => {
				this.$router.push("/team")
			})
		},
		devLoginMember() {
			this.$api.devLogin(config.devLogin.memberEmail, config.devLogin.memberTeamname).then(() => {
				this.$router.push("/team")
			})
		}
	},
}
</script>

<style lang="scss" scoped></style>
