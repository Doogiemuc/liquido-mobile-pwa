<template>
	<div id="LoginPage" class="container">
		<h1>Login</h1>
		
		<b-card class="chat-bubble shadow-sm">
			<p>{{ $t('LoginInfo') }}</p>
		</b-card>

		<div v-if="showDevLogin" class="mb-3">
			<button type="button" class="btn btn-primary" @click="devLoginAdmin">
				<i class="fas fa-shield-alt"></i> {{ $t("DevLoginAdmin") }}
			</button>
			<button type="button" class="btn btn-primary ml-3" @click="devLoginMember">
				{{ $t("DevLoginMember") }}
			</button>

			<button type="button" class="btn btn-primary m-3" @click="showModal">
				Show Modal
			</button>
		</div>

		<b-card class="chat-bubble shadow-sm input-bubble">
			<p>{{ $t('LoginViaEmail') }}</p>
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

		<b-card class="chat-bubble shadow-sm input-bubble">
			<p>{{ $t('LoginWithAuthy') }}</p>
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

		<popup-modal 
			id="popupModal11"
			ref="popupModal11"
			type="success"
			message="Just a test"
		></popup-modal>
	</div>
</template>

<script>
import config from "config"
import liquidoInput from "@/components/liquido-input"
import popupModal from "@/components/popup-modal"

export default {
	i18n: {
		messages: {
			de: {
				LoginInfo: "Es gibt mehrere Möglichkeiten wie du dich bei LIQUIDO einloggen kannst.",

				yourEMail: "Deine Email",
				LoginViaEmail: "Ich kann dir einen MagicLink per E-Mail schicken. Mit diesem kannst du dich dann ganz einfach einloggen.",
				LoginEmailButton: "Link zuschicken",
				emailPlaceholder: "info@domain.de",
				emailInvalid: "E-Mail ungültig",

				yourMobilephone: "Deine Handynummer",
				LoginWithAuthy: "Du kannst dich mit der Authy App und einem One Time Token einloggen. Das ist besonders sicher",
				OpenAuthy: "Authy öffnen",
				mobilephonePlaceholder: "info@domain.de",
				mobilephoneInvalid: "E-Mail ungültig",

				DevLoginAdmin: "devLogin: Admin",
				DevLoginMember: "devLogin: Member",
			}
		}
	},
	components: { liquidoInput, popupModal },
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
		showModal() {
			this.$refs["popupModal11"].show()
		},
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
