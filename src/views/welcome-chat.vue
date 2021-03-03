<template>
	<div>
		<div class="mt-3">
			<b-card id="welcomeBubble" :class="{ 'hide-left': flowState < 1 }" class="chat-bubble shadow-sm">
				<b-card-text v-html="$t('welcome')" />
			</b-card>

			<b-card :class="{ 'hide-left': flowState < 2 }" class="chat-bubble shadow-sm">
				<b-card-text v-html="$t('whatsYourName')" />
			</b-card>

			<b-card :class="{ 'hide-right': flowState < 3 }" class="chat-bubble chat-right">
				<liquido-input
					id="userNameInput"
					ref="userNameInput"
					v-model="user.name"
					:label="$t('yourNickname')"
					:valid-func="isUsernameValid"
					:maxlength="100"
					:invalid-feedback="$t('userNameInvalid')"
					:disabled="flowState != 3"
					@keyup.enter="userNameSubmit"
					@blur="userNameSubmit"
				/>
			</b-card>

			<div :class="{ 'collapse-max-height': flowState < 4 }" class="transition-all">
				<b-card :class="{ 'hide-left': flowState < 4 }" class="chat-bubble shadow-sm">
					<b-card-text v-html="$t('niceToMeetYou', { nickname: user.name })" />
				</b-card>
			</div>


			<!-- create or join a team buttons -->
			<div :class="{ 'collapse-max-height': flowState < 5 }" class="transition-all">
				<b-card	id="createOrJoinBubble"	:class="{ 'hide-left': flowState < 5 }"	class="chat-bubble shadow-sm">
					<b-card-text v-html="$t('createOrJoin')" />
				</b-card>

				<div id="joinOrCreateButtons" :class="{ 'hide-left': flowState < 6 }" class="mb-3 transition-all">
					<button
						id="joinTeamButton"
						:class="{
							'btn-primary': true,
							'moveToCenterFromLeft active': flowState === 7,
							opacity0: flowState >= 8,
						}"
						class="btn"
						@click="chooseJoinTeam()"
					>
						{{ $t("joinTeamButton") }}
					</button>
					<button
						id="createNewTeamButton"
						:class="{
							'btn-primary': true,
							'moveToCenterFromRight active': flowState >= 8,
							opacity0: flowState === 7,
						}"
						class="btn"
						@click="chooseCreateNewTeam()"
					>
						{{ $t("createNewTeamButton") }}
					</button>
				</div>
			</div>

			<!-- Join a team - form (flowState == 10) -->
			<b-card :class="{ 'collapse-max-height': ![10,11,12].includes(flowState) }" class="chat-bubble chat-right">
				<form id="joinTeamForm">
					<liquido-input
						id="inviteCodeInput"
						ref="inviteCodeInput"
						v-model="inviteCode"
						:label="$t('inviteCode')"
						placeholder="ABC123"
						:valid-func="isInviteCodeValid"
						:maxlength="100"
						:invalid-feedback="$t('inviteCodeInvalid')"
						:disabled="flowState !== 10"
						tabindex="1"
					/>

					<!-- TODO: ask for mobile phone already here or later?
					<liquido-input
						id="mobilephoneInput"
						ref="mobilephoneInput"
						v-model="user.mobilephone"
						:label="$t('yourMobilephone')"
						:placeholder="$t('mobilephonePlaceholder')"
						:valid-func="isMobilephoneValid"
						type="tel"
						pattern="[\+0-9 -/]{3,50}"
						:maxlength="100"
						:invalid-feedback="$t('mobilephoneInvalid')"
						:disabled="flowState !== 10"
						tabindex="2"
					/>
					-->

					<liquido-input
						id="emailInput"
						ref="emailInput"
						v-model="user.email"
						:label="$t('yourEMail')"
						:placeholder="$t('emailPlaceholder')"
						:valid-func="isEmailValid"
						:maxlength="200"
						:invalid-feedback="$t('emailInvalid')"
						:disabled="flowState !== 10"
						tabindex="2"
					/>

					<div class="d-flex justify-content-between align-items-center">
						<small :class="{ invisible: flowState !== 10 }" class="ml-1">
							<a href="#" tabindex="4" @click="cancelJoinTeam()">{{ $t("Cancel") }}</a>
						</small>
						<b-button
							id="joinTeamOkButton"
							:disabled="joinTeamOkButtonDisabled"
							variant="primary"
							tabindex="3"
							@click="joinTeam()"
						>
							{{ $t("Ok") }}
							<i class="fas fa-angle-double-right" />
						</b-button>
					</div>
				</form>
			</b-card>

			<!--Joined team successfully (flowState == 12) -->
			<b-card	id="joinedTeamBubble"	:class="{ 'collapse-max-height': flowState !== 12 }" class="chat-bubble shadow-sm">
				<p v-html="$t('joinedTeamSuccessfully', { teamName: team.teamName })" />
				<b-button
					id="joinedTeamGoToTeamButton"
					variant="primary"
					class="float-right mb-1"
					@click="$router.push('/team')"
				>
					{{ $t("goToTeam") }}
					<i class="fas fa-angle-double-right" />
				</b-button>
			</b-card>






			<!-- Create a new team - form (flowState == 20) -->

			<b-card :class="{ 'collapse-max-height': ![20,21,22].includes(flowState) }" class="chat-bubble chat-right">
				<form id="createNewTeamForm">
					<liquido-input
						id="teamNameInput"
						ref="teamNameInput"
						v-model="team.teamName"
						:label="$t('teamName')"
						:valid-func="isTeamNameValid"
						:maxlength="100"
						:invalid-feedback="$t('teamNameInvalid')"
						:disabled="flowState !== 20"
						tabindex="1"
					/>

					<liquido-input
						id="adminEmailInput"
						ref="adminEmailInput"
						v-model="user.email"
						class="mb-0"
						:label="$t('adminEmail')"
						:valid-func="isAdminEmailValid"
						:maxlength="200"
						:invalid-feedback="$t('emailInvalid')"
						:disabled="flowState !== 20"
						tabindex="2"
						@keyup.enter="createNewTeam()"
					/>

					<small class="ml-1 mb-1">{{ $t("youWillBecomeAdmin") }}</small>

					<div class="d-flex justify-content-between align-items-center">
						<small :class="{ invisible: flowState !== 20 }" class="ml-1">
							<a href="#" tabindex="4" @click="cancelCreateNewTeam()">{{ $t("Cancel") }}</a>
						</small>
						<b-button
							id="createNewTeamOkButton"
							:disabled="createNewTeamOkButtonDisabled"
							variant="primary"
							tabindex="3"
							@click="createNewTeam()"
						>
							{{ $t("Ok") }}
							<i class="fas fa-angle-double-right" />
						</b-button>
					</div>
				</form>
			</b-card>

			<!-- New team created successfully (flowState == 22) -->

			<b-card
				id="newTeamCreatedBubble"
				:class="{ 'collapse-max-height': flowState !== 22 }"
				class="chat-bubble shadow-sm"
			>
				<p>{{ $t("teamCreated") }}</p>
				<p>
					{{ $t("shareThisLink") }}
					<a id="inviteLink" :href="inviteLinkURL" @click.prevent="shareLink()">
						{{ inviteLinkURL }}
						<i class="fas fa-external-link-alt" />
					</a>
				</p>
				<p>
					{{ $t("tellInvitationCode") }}
					<b id="newTeamInviteCode">{{ team.inviteCode }}</b>
				</p>
				<p>{{ $t("scanQrCode") }}</p>
				<div class="text-center">
					<img id="qrCodeImg" src="" class="qr-code">
				</div>
				<p v-html="$t('teamInfo')" />
			</b-card>

			<b-card :class="{ 'collapse-max-height': flowState !== 22 }" class="chat-bubble shadow-sm">
				<p v-html="$t('pollInfo')" />
				<b-button
					id="gotoCreatePollButton"
					variant="primary"
					class="float-right mb-3"
					@click="gotoCreatePoll()"
				>
					<i class="fas fa-user-shield" />
					{{ $t("createPoll") }}
					<i class="fas fa-angle-double-right" />
				</b-button>
			</b-card>
		</div> <!-- end of container -->

		<!-- Error modal -->
		<b-modal 
			id="welcomeChatErrorModal"
			ref="welcomeChatErrorModal"
			:title="errorTitle"
			centered
			ok-only
			no-close-on-esc
			no-close-on-backdrop
			hide-header-close
			:content-class="errorModalClasses"
		>
			{{ errorMessage }}
		</b-modal>
	</div>
</template>

<script>
import config from "config"
import QRCode from "qrcode"
import liquidoInput from "@/components/liquido-input"
const log = require("loglevel").getLogger("welcome-chat")

const eMailRegEx = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,64}$/

// but see https://github.com/google/libphonenumber/blob/master/FALSEHOODS.md    :-)
const mobilephoneRegEx = /^(\+[1-9]{1}[0-9]{1,14})|(0[0-9]{3} *[-/][0-9 ]{1,50})$/

export default {
	i18n: {
		messages: {
			en: {
				welcome: 
					"Welcome to <span class='liquido'></span> - the free, secure and liquid eVoting platform. "+
					"With this mobile app you can create polls and then take votes with your team.",
				whatsYourName: "How shall I call you?",
				createOrJoin: "Do you want to <em>join an existing team</em> with an invitation code or <em>create a new team</em>?",
				joinTeamButton: "Join a team",
				createNewTeamButton: "Create new team",

				teamCreated: "Ok your team has been created. Now you can invite your friends to join your team:",
				shareThisLink: "Share this link",
				tellInvitationCode: "or tell them your invitation code:",
				scanQrCode: "or let them scan this QR code:",
				createPoll: "Create a poll",
			},
			de: {
				welcome:
					"<p>Willkommen bei <span class='liquido'></span>, der freien, sicheren und liquiden e-voting App für euer Team.</p>"+
					"In Liquido wählst du nicht einfach nur einen Vorschlag oder stimmst nur für einen Kandidaten. Stattdessen sortiert jeder im Team "+
					"Wahlvorschläge nach seiner eigenen Priorität. Liquido berechnet daraus dann mit einem cleveren Algorithmus den Sieger der Wahl.</p>",
				whatsYourName: "Darf ich fragen wie du heißt?",
				yourNickname: "Dein Spitzname",
				userNameInvalid: "Bitte mindestens 4 Zeichen!",
				niceToMeetYou: "Hallo <b>{nickname}</b> ! Schön dich kennen zu lernen.",
				createOrJoin: "Möchtest du <ul><li>einem bestehenden <b>Team beitreten</b></li><li>oder möchtest du ein <b>neues Team</b> gründen?</li></ul>",

				joinTeamButton: "Team beitreten",
				inviteCode: "Einladungscode",
				inviteCodeInvalid: "Einladungscode muss genau 6 Zeichen lang sein.",
				yourMobilephone: "Deine Handynummer",
				mobilephonePlaceholder: "+49 151 1234567",
				mobilephoneInvalid: "Keine gültige Handynummer",
				yourEMail: "Deine E-Mail",
				emailPlaceholder: "info@domain.de",
				emailInvalid: "E-Mail ungültig",

				joinedTeamSuccessfully: 
					"Herzlich willkommen im Team <b>{teamName}</b>. Du kannst nun deine Wahlvorschläge zu den Abstimmungen "+
					"im Team hinzufügen. Viel Spaß beim wählen!",
				goToTeam: "Zum Team",

				createNewTeamButton: "Neues Team",
				teamName: "Team Name",
				teamNameInvalid: "Bitte mindestens 6 Zeichen als Teamname!",
				adminEmail: "Admin E-Mail",
				youWillBecomeAdmin: "Du wirst der Admin des neuen Teams.",

				teamCreated: "Ok, dein Team ist angelegt. Lade jetzt deine Freunde in dein Team ein:",
				shareThisLink: "Teile diesen Link",
				tellInvitationCode: "Sage ihnen deinen Einadungscode:",
				scanQrCode: "Oder lass sie diesen QR code scannen:",
				teamInfo: "Du findest diese Infos später jederzeit wieder unter dem Team Icon (<i class='fas fa-users'></i>) oben rechts.",
				pollInfo: 
					"Erstelle jetzt die erste Abstimung (<i class='fas fa-poll'></i>) für dein Team. Jedes Teammitglied kann dann seinen eigenen "+
					"Wahlvorschlag (<i class='fas fa-vote-yea'></i>) hinzufügen.",
				createPoll: "Abstimmung anlegen",

				areYouOffline: "Der LIQUIDO Server ist nicht erreichbar. Bist vielleicht du offline? Bitte schalte dein WLAN ein.",
				teamWithSameNameExists: "Ein Teamm mit diesem Namen existiert bereits. Bitte wählen einen anderen Namen für dein Team.",
				cannotCreateNewTeam: "Es tut uns sehr leid, das neue Team konnt nicht angelegt werden. Bitte versuche es später noch einmal.",
				cannotJoinTeam: "Du kannst diesem Team nicht beitreten. {errorDetails}"
			},
		},
	},
	name: "WelcomeChat",
	components: { liquidoInput },
	data() {
		return {
			user: {
				name: undefined,
				email: undefined,
				mobilephone: undefined
			},

			inviteCode: undefined,    // inviteCode when joining an existing team

			// newly created or joined Team
			team: {
				//name: undefined,
				//inviteCode: "A3F43D",
				//inviteLink: "http://liquido.me/invite/A3F43D_static",
				//qrCode: "/img/qrcode.svg",
			},

			/*
				user flow:   chat bubbles are consecutively blended in along this flowState.
				 0 - empty chat
				 1 - first welcome message bubble
				 2 - blend in: What's your name
				 3 - blend in: nickname input
				 4 - Nice to meet you bubble
				 5 - create or join Team bubble
				 6 - create or join Team buttons
				 
				 10 - join a team form
				 11 - clicked on joinTeam button, waiting for server reply
				 12 - new team joined successfully

				 21 - create new team form
				 22 - clicked on createTeam button,  waiting for server reply
				 23 - new team created successfully
				 
			*/
			flowState: 0,

			//Semaphore so that the chat animation is only started once. This is for example relevant when the window is reloaded in the browser
			chatAnimationStarted: false,

			// localized message in the error modal popup
			errorTitle: this.$t("Error"),
			errorMessage: "",
			errorVariant: "info",
		}
	},
	computed: {
		joinTeamOkButtonDisabled() {
			return !this.isInviteCodeValid(this.inviteCode) || !this.isEmailValid(this.user.email) || this.flowState > 10
		},
		createNewTeamOkButtonDisabled() {
			return !this.isTeamNameValid(this.team.teamName) || !this.isAdminEmailValid(this.user.email) || this.flowState > 20
		},
		errorModalClasses() {
			switch (this.errorVariant) {
				case "error":
					return "bg-danger text-white"
				case "warning": 
					return "bg-warning text-dark"
				default:
					return "bg-info text-white"
			}
		},
		inviteLinkURL() {
			return config.inviteLinkPrefix + this.team.inviteCode
		},
	},
	watch: {
		
		"flowState": function(newVal, oldVal) {
			log.debug(" ====>>> flowState", oldVal, "=>", newVal)
		}
		
	},
	created() {
		
	},
	/**
	 * By default scroll to the top of the page (e.g. when reloading the page)
	 * When the bottom of the #welcomeBubble becomes visible (or already is visible on larger screens)
	 * then start the chat animation ONCE
	 */
	mounted() {
		$("html, body").scrollTop(0)
		this.flowState = 0
		this.$api.pingApi().catch(() => {
			this.errorTitle = this.$t("Attention")
			this.errorMessage = this.$t("areYouOffline")
			this.$refs["welcomeChatErrorModal"].show()
		})

		if (this.$root.isBottomInView("#welcomeBubble")) {
			this.startChatAnimation()
		} else {
			$(window).scroll(() => {
				if (this.$root.isBottomInView("#welcomeBubble")) {
					this.startChatAnimation()
				}
			})
		}
	},
	methods: {
		/* username must not be empty and contain at least 4 chars */
		isUsernameValid(val) {
			return val !== undefined && val !== null && val.trim().length >= config.usernameMinLength
		},

		/* username can be submitted by pressing ENTER or by blurring the field or by clicking on "done" on the iOS keyboard */
		userNameSubmit() {
			this.$refs.userNameInput.validateField(true)
			if (this.isUsernameValid(this.user.name) && this.flowState === 3) {
				this.user.name = this.user.name.trim()
				this.flowState = 4
				$("#userNameInput").blur()
				this.$root.scrollToBottom()
				setTimeout(() => {
					this.flowState = 6
					this.$root.scrollToBottom()
				}, 1500)
			}
		},

		/* invite must be ast least 6 chars */
		isInviteCodeValid(val) {
			return val !== undefined && val !== null && val.trim().length === config.inviteCodeLength
		},

		isMobilephoneValid(val) {
			return val !== undefined && val !== null && mobilephoneRegEx.test(val)
		},

		/* user's email must match regex */
		isEmailValid(val) {
			return val !== undefined && val !== null && eMailRegEx.test(val)
		},

		/* team name must be at least 6 chars */
		isTeamNameValid(val) {
			return val !== undefined && val !== null && val.trim().length >= 6
		},

		/* admin email must match regex */
		isAdminEmailValid(val) {
			return val !== undefined && val !== null && eMailRegEx.test(val)
		},

		/** Click join team button */
		chooseJoinTeam() {
			if (this.flowState === 6) {
				this.flowState = 10
				this.$root.scrollToBottom()
			}
		},
		cancelJoinTeam() {
			this.flowState = 6
			this.$root.scrollToBottom()
		},

		chooseCreateNewTeam() {
			if (this.flowState === 6) {
				this.flowState = 20
				this.$root.scrollToBottom()
				$("#teamNameInput").focus()
			}
		},
		cancelCreateNewTeam() {
			this.flowState = 6
			this.$root.scrollToBottom()
		},

		/** Create a new team */
		createNewTeam() {
			if (this.createNewTeamOkButtonDisabled) return
			//TODO: show loading icon
			this.flowState = 21
			let newTeamRequest = {
				teamName: this.team.teamName,
				adminName: this.user.name,
				adminEmail: this.user.email,
			}
			this.$api.createNewTeam(newTeamRequest)
				.then((team) => {
					this.team = team
					this.createTeamQRCode()
					this.flowState = 22
					this.$nextTick(() => {
						let headerHeight = this.$root.$refs["liquido-header"].height
						this.$root.scrollElemToTop("#newTeamCreatedBubble", headerHeight)
					})
				})
				.catch((err) => {			// on error show modal
					let errCode = err && err.response && err.response && err.response.data ? err.response.data.liquidoErrorCode : undefined
					// https://babeljs.io/docs/en/babel-plugin-proposal-optional-chaining  Here Babel is cool. Ey, you need this cool top notch language feature. Just "install" it :-)
					//MAYBE:  let errCode = err?.response?.data?.liquidoErrorCode  
					if (errCode === this.$api.err.TEAM_WITH_SAME_NAME_EXISTS) {
						this.errorTitle = this.$t("Error")
						this.errorMessage = this.$t("teamWithSameNameExists")
					} else {
						this.errorTitle = this.$t("Error")
						this.errorMessage = this.$t("cannotCreateNewTeam")
						log.error("Cannot create new team", err)
					}
					this.$refs["welcomeChatErrorModal"].show()
					this.flowState = 20
				})
		},

		createTeamQRCode() {
			let QRcodeOpts = { scale: 10 }
			QRCode.toDataURL(this.inviteLinkURL, QRcodeOpts, function (err, url) {
				if (err) {
					console.warn("Cannot create QR code", err)
				} else {
					let img = document.getElementById("qrCodeImg")
					img.src = url
				}
			})
		},

		gotoCreatePoll() {
			this.$router.push({name: "createPoll"})
		},

		/** Join an existing team */
		joinTeam() {
			this.flowState = 11
			log.info(this.user.name + " <" + this.user.email + "> joins team with invite code " + this.invite)
			this.$api.joinTeam(this.inviteCode, this.user.name, this.user.email, this.user.mobilephone)
				.then(team => {
					this.flowState = 12
					this.team = team
					this.$nextTick(() => {
						let headerHeight = this.$root.$refs["liquido-header"].height
						this.$root.scrollElemToTop("#joinedTeamBubble", headerHeight)
					})
				})
				.catch(err => {
					log.error("Cannot join team", err)
					this.errorMessage = this.$t("cannotJoinTeam", {errorDetails: err.err })
					this.$bvModal.show("errorModal")
					this.flowState = 10
				})
		},


		// Here comes some UX magic :-)

		startChatAnimation() {
			if (this.chatAnimationStarted) return  // start chat animation only once
			this.chatAnimationStarted = true
			$(window).off("scroll")
			let smallDelay = 500  //ms
			let mediumDelay = 2500 // ms

			// If we are running inside a Cypress test, then speedup animation.
			if (window.Cypress) {
				smallDelay = 100
				mediumDelay = 200
			}

			window.setTimeout(() => {
				this.flowState = 1
				this.$root.scrollToBottom()
			}, smallDelay)
			window.setTimeout(() => {
				this.flowState = 2
				this.$root.scrollToBottom()
			}, mediumDelay)
			window.setTimeout(() => {
				this.flowState = 3
				this.$root.scrollToBottom()
			}, smallDelay + mediumDelay)
		},

		shareLink() {
			if (navigator.share) {
				navigator
					.share({
						title: "Share LIQUIDO invite",
						url: this.team.inviteLink,
					})
					.then(() => {
						log.debug("Invite has been sent!")
					})
					.catch(console.error)
			} else {
				log.debug("No native support")
			}
		},
	},
}
</script>

<style lang="scss">

.createOrJoinTable {
	td {
		width: 50%;
	}
	td:fist-child() {
		border-right: 1px solid grey;
	}
}

#joinOrCreateButtons {
	width: 100%;
	height: 40px;
	position: relative; // Cannot use flex  and justify-content: space-between, because that cannot be animated
}
#joinTeamButton {
	position: absolute;
	transition: all 0.5s ease;
	left: 0;
	top: 0;
}
#createNewTeamButton {
	position: absolute;
	transition: all 0.5s ease;
	right: 0;
	top: 0;
}
.moveToCenterFromLeft {
	left: 50% !important;
	transform: translateX(-50%);
}
.moveToCenterFromRight {
	right: 50% !important;
	transform: translateX(50%);
}

label {
	font-size: 14px;
	font-weight: bold;
	margin: 0;
	//color: rgb(86, 9, 109);
}

.qr-code {
	width: 80%;
	max-width: 300px;
}
</style>
