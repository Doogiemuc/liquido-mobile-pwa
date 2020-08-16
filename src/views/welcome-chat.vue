<template>
	<div>
		<div class="container-lg mt-3">
			<b-card id="welcomeBubble" :class="{ 'hide-left': flowState < 1 }" class="chat-bubble shadow-sm">
				<b-card-text v-html="$t('welcome')"></b-card-text>
			</b-card>

			<b-card :class="{ 'hide-left': flowState < 2 }" class="chat-bubble shadow-sm">
				<b-card-text v-html="$t('whatsYourName')"></b-card-text>
			</b-card>

			<b-card :class="{ 'hide-right': flowState < 3 }" class="chat-bubble chat-right">
				<liquido-input
					v-model="user.name"
					ref="userNameInput"
					:label="$t('yourNickname')"
					:valid-func="isUsernameValid"
					:maxlength="100"
					:invalid-feedback="$t('userNameInvalid')"
					:disabled="flowState >= 4"
					@keyup.enter="userNameSubmit"
					@blur="userNameSubmit"
				></liquido-input>
			</b-card>

			<div :class="{ 'collapse-max-height': flowState < 4 }" class="transition-all">
				<b-card :class="{ 'hide-left': flowState < 4 }" class="chat-bubble shadow-sm">
					<b-card-text v-html="$t('niceToMeetYou', { nickname: user.name })"></b-card-text>
				</b-card>
			</div>

			<div :class="{ 'collapse-max-height': flowState < 5 }" class="transition-all">
				<b-card
					id="createOrJoinBubble"
					:class="{ 'hide-left': flowState < 5 }"
					class="chat-bubble shadow-sm"
				>
					<b-card-text v-html="$t('createOrJoin')"></b-card-text>
				</b-card>

				<div
					id="joinOrCreateButtons"
					:class="{ 'hide-left': flowState < 6 }"
					class="mb-3 transition-all"
				>
					<button
						id="joinTeamButton"
						:class="{
							'btn-primary': true,
							'moveToCenterFromLeft active': flowState === 7,
							opacity0: flowState >= 8,
						}"
						class="btn"
						@click="clickJoinTeam()"
					>{{ $t("joinTeamButton") }}</button>
					<button
						id="createNewTeamButton"
						:class="{
							'btn-primary': true,
							'moveToCenterFromRight active': flowState >= 8,
							opacity0: flowState == 7,
						}"
						class="btn"
						@click="clickCreateNewTeam()"
					>{{ $t("createNewTeamButton") }}</button>
				</div>
			</div>

			<!-- Join a team (flowState == 7) -->

			<b-card :class="{ 'collapse-max-height': flowState !== 7 }" class="chat-bubble chat-right">
				<form id="joinTeamForm">
					<liquido-input
						v-model="inviteCode"
						ref="inviteCodeInput"
						:label="$t('inviteCode')"
						:valid-func="isInviteCodeValid"
						:maxlength="100"
						:invalid-feedback="$t('inviteCodeInvalid')"
						:disabled="flowState > 7"
						tabindex="1"
					></liquido-input>

					<liquido-input
						v-model="user.email"
						ref="emailInput"
						:label="$t('yourEMail')"
						:valid-func="isEmailValid"
						:maxlength="200"
						:invalid-feedback="$t('emailInvalid')"
						:disabled="flowState > 7"
						tabindex="2"
					></liquido-input>

					<div class="d-flex justify-content-between align-items-center">
						<small :class="{ invisible: flowState > 7 }" class="ml-1">
							<a href="#" @click="cancelJoinTeam()" tabindex="4">{{ $t("Cancel") }}</a>
						</small>
						<b-button
							:disabled="joinTeamOkButtonDisabled"
							variant="primary"
							@click="joinTeam()"
							tabindex="3"
						>
							{{ $t("Ok") }}
							<i class="fas fa-angle-double-right"></i>
						</b-button>
					</div>
				</form>
			</b-card>

			<!-- Create a new team (flowState == 8) -->

			<b-card :class="{ 'collapse-max-height': flowState < 8 }" class="chat-bubble chat-right">
				<form id="createNewTeamForm">
					<liquido-input
						v-model="newTeam.name"
						ref="teamNameInput"
						:label="$t('teamName')"
						:valid-func="isTeamNameValid"
						:maxlength="100"
						:invalid-feedback="$t('teamNameInvalid')"
						:disabled="flowState > 8"
						tabindex="1"
					></liquido-input>

					<liquido-input
						class="mb-0"
						v-model="user.email"
						ref="adminEmailInput"
						:label="$t('adminEmail')"
						:valid-func="isAdminEmailValid"
						:maxlength="200"
						:invalid-feedback="$t('emailInvalid')"
						:disabled="flowState > 8"
						tabindex="2"
					></liquido-input>

					<small class="ml-1 mb-1">{{ $t("youWillBecomeAdmin") }}</small>

					<div
						:class="{ 'collapse-max-height': flowState > 8 }"
						class="d-flex justify-content-between align-items-center"
					>
						<small class="ml-1">
							<a href="#" @click="cancelCreateNewTeam()" tabindex="4">{{ $t("Cancel") }}</a>
						</small>
						<b-button
							:disabled="createNewTeamOkButtonDisabled"
							variant="primary"
							@click="createNewTeam()"
							tabindex="3"
						>
							{{ $t("Ok") }}
							<i class="fas fa-angle-double-right"></i>
						</b-button>
					</div>
				</form>
			</b-card>

			<!-- New team created (flowState == 9) -->

			<b-card
				id="newTeamCreatedBubble"
				:class="{ 'collapse-max-height': flowState < 9 }"
				class="chat-bubble shadow-sm"
			>
				<p>{{ $t("teamCreated") }}</p>
				<ul>
					<li>
						<a :href="newTeam.inviteLink" @click.prevent="shareLink()">
							{{ $t("shareThisLink") }}
							<i class="fas fa-external-link-alt"></i>
						</a>
					</li>
					<li>
						{{ $t("tellInvitationCode") }}
						<b>{{ newTeam.inviteCode }}</b>
					</li>
					<li>{{ $t("scanQrCode") }}</li>
				</ul>
				<div class="text-center my-3">
					<img :src="newTeam.qrCode" class="qr-code" />
				</div>
				<p v-html="$t('teamInfo')"></p>
			</b-card>

			<b-card :class="{ 'collapse-max-height': flowState !== 9 }" class="chat-bubble shadow-sm">
				<p v-html="$t('pollInfo')"></p>
				<b-button
					:class="{ 'd-none': flowState !== 9 }"
					variant="primary"
					class="float-right mb-3"
					@click="createPoll()"
				>
					<i class="fas fa-user-shield"></i>
					{{ $t("createPoll") }}
					<i class="fas fa-angle-double-right"></i>
				</b-button>
			</b-card>
		</div>
	</div>
</template>

<script>
import liquidoInput from "@/components/liquido-input"

const eMailRegEx = /\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,64}\b/

export default {
	i18n: {
		messages: {
			en: {
				welcome:
					"Welcome to  - the free, secure and liquid eVoting platform. With this mobile app you can create polls and then take votes with your team.",
				whatsYourName: "How shall I call you?",
				createOrJoin:
					"Do you want to <em>join an existing team</em> with an invitation code or <em>create a new team</em>?",
				joinTeamButton: "Join a team",
				createNewTeamButton: "Create new team",

				teamCreated:
					"Ok your team has been created. Now you can invite your friends to join your team:",
				shareThisLink: "Share this link",
				tellInvitationCode: "or tell them your invitation code:",
				scanQrCode: "or let them scan this QR code:",
				createPoll: "Create a poll",
			},
			de: {
				welcome:
					'<p>Willkommen bei <span class="liquido"></span>, der freien, sicheren und liquiden e-voting App für euer Team.</p>' +
					"In Liquido wählt man mit seiner Stimme nicht nur einen Vorschlag (oder Kandidaten), sondern jeder im Team sortiert alle Wahlvorschläge nach seiner eigenen Prio und Liquido berechnet daraus dann den Gesamtsieger der Wahl.</p>",
				whatsYourName: "Darf ich fragen wie du heißt?",
				yourNickname: "Dein Spitzname",
				userNameInvalid: "Bitte mindestens 4 Zeichen!",
				niceToMeetYou: "Hallo {nickname}! Schön dich kennen zu lernen.",
				createOrJoin:
					"Möchtest du <ul><li>einem bestehenden <b>Team beitreten</b></li><li>oder möchtest du ein <b>neues Team</b> gründen?</li></ul>",

				joinTeamButton: "Team beitreten",
				inviteCode: "Einladungscode",
				inviteCodeInvalid: "Code muss genau 6 Zeichen lang sein.",
				yourEMail: "Deine E-Mail",
				eMailPlaceholder: "info@domain.de",
				emailInvalid: "E-Mail ungültig",

				createNewTeamButton: "Neues Team",
				teamName: "Team Name",
				teamNameInvalid: "Bitte mindestens 6 Zeichen als Teamname!",
				adminEmail: "Admin E-Mail",
				youWillBecomeAdmin: "Du wirst der Admin des neuen Teams.",

				teamCreated:
					"Ok, dein Team ist angelegt. Lade jetzt deine Freunde in dein Team ein:",
				shareThisLink: "Teile diesen Link",
				tellInvitationCode: "oder sage ihnen deinen Einadungscode:",
				scanQrCode: "oder lass sie diesen QR code scannen:",
				teamInfo:
					'Du findest diese Infos später jederzeit wieder unter dem Team Icon (<i class="fas fa-users"></i>) oben rechts.',
				pollInfo:
					'Jetzt kannst du deine erste Abstimung (<i class="fas fa-poll"></i>) erstellen, zu der jedes Teammitglied dann seinen Wahlvorschlag (<i class="fas fa-vote-yea"></i>) hinzufügen kann.',
				createPoll: "Abstimmung anlegen",
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
			},

			inviteCode: undefined,

			// data when new team has been created
			newTeam: {
				name: undefined,
				inviteCode: "A3F43D",
				inviteLink: "http://liquido.me/invite/A3F43D",
				qrCode: "/img/qrcode.svg",
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
				 7 - join a team form
				 8 - create new team form
				 9 -new  team created
			*/
			flowState: 0,

			chatAnimationStarted: false,
		}
	},
	/**
	 * Do not show the Footer on the index page and
	 * only start automatic scrolling if first bubble is completely visible (> iPhone5)
	 */
	created() {
		//this.$root.store.setShowFooter(false)
	},

	/**
	 * By default scroll to the top of the page (e.g. when reloading the page)
	 * When the bottom of the #welcomeBubble becomes visible (or already is visible on larger screens)
	 * then start the chat animation ONCE
	 */
	mounted() {
		//$("html, body").animate({ scrollTop: 0 }, 500);
		$("html, body").scrollTop(0)
		window.setTimeout(() => {
			this.flowState = 1
		}, 500)

		if (this.isBottomInView("#welcomeBubble")) {
			this.startChatAnimation()
		} else {
			$(window).scroll(() => {
				if (
					!this.chatAnimationStarted &&
					this.isBottomInView("#welcomeBubble")
				) {
					this.startChatAnimation()
				}
			})
		}
	},
	computed: {
		joinTeamOkButtonDisabled() {
			return (
				!this.isInviteCodeValid(this.inviteCode) ||
				!this.isEmailValid(this.user.email) ||
				this.flowState > 7
			)
		},
		createNewTeamOkButtonDisabled() {
			return (
				!this.isTeamNameValid(this.newTeam.name) ||
				!this.isAdminEmailValid(this.user.email) ||
				this.flowState > 8
			)
		},
	},
	watch: {
		/*
		'flowState': function(newVal, oldVal) {
			console.log("flowState", oldVal, "=>", newVal)
		}
		*/
	},
	methods: {
		/* username must not be empty and contain at least 4 chars */
		isUsernameValid(val) {
			return val !== undefined && val !== null && val.trim().length >= 4
		},

		/* username can be submitted by pressing ENTER or by blurring the field or by clicking on "done" on the iOS keyboard */
		userNameSubmit() {
			this.$refs.userNameInput.validateField(true)
			if (this.isUsernameValid(this.user.name) && this.flowState < 4) {
				this.flowState = 4
				$("#userNameInput").blur()
				this.scrollToBottom()
				setTimeout(() => {
					this.flowState = 6
					this.scrollToBottom()
				}, 1500)
			}
		},

		/* invite must be ast least 6 chars */
		isInviteCodeValid(val) {
			return val !== undefined && val !== null && val.trim().length === 6
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
		clickJoinTeam() {
			if (this.flowState === 6) {
				this.flowState = 7
				this.scrollToBottom()
			}
		},
		cancelJoinTeam() {
			this.flowState = 6
			this.scrollToBottom()
		},

		clickCreateNewTeam() {
			if (this.flowState === 6) {
				this.flowState = 8
				this.scrollToBottom()
			}
		},
		cancelCreateNewTeam() {
			this.flowState = 6
			this.scrollToBottom()
		},

		/** Join an existing team */
		joinTeam() {
			console.log(
				this.user.name +
					" <" +
					this.user.email +
					"> joins team with invite code " +
					this.invite
			)
		},

		/** Create a new team */
		createNewTeam() {
			if (this.createNewTeamOkButtonDisabled) return
			console.log(
				this.user.name +
					"<" +
					this.user.email +
					"> creates new team: " +
					this.newTeam.name
			)
			//TODO: backend call createNewTeam
			this.flowState = 9
			this.$nextTick(() => {
				this.scrollElemToTop("#newTeamCreatedBubble", 0)
			})
		},

		createPoll() {
			this.$router.push("/createPoll")
		},

		// Here comes some UX magic :-)

		/** scroll to the very bottom of the content. Show last chat message */
		scrollToBottom() {
			this.$nextTick(() => {
				$("#app").animate({ scrollTop: $("#app").height() }, 1000)
			})
		},

		/**
		 * scroll an HTML elemant right under the header
		 * (as far up as possible, depending on content below the elem)
		 * @param {String} elem JQuery selector for dom elem
		 * @param {Number} margin margin below headerHeight in pixels (default 0)
		 */
		scrollElemToTop(elem, margin = 0) {
			let scrollTop =
				$("#app").scrollTop() +
				$(elem).offset().top -
				this.$root.headerHeight -
				margin
			this.$nextTick(() => {
				$("#app").animate({ scrollTop: scrollTop }, 1000)
			})
		},

		/** Check if the bottom of elem is scrolled into view */
		isBottomInView(elem) {
			let docViewTop = $(window).scrollTop()
			let docViewBottom = docViewTop + $(window).height()
			let elemTop = $(elem).offset().top
			let elemBottom = elemTop + $(elem).height()
			return elemBottom <= docViewBottom
		},

		startChatAnimation() {
			this.chatAnimationStarted = true
			$(window).off("scroll")
			window.setTimeout(() => {
				this.flowState = 2
				this.scrollToBottom()
			}, 2500)
			window.setTimeout(() => {
				this.flowState = 3
				this.scrollToBottom()
			}, 3000)
		},

		shareLink() {
			if (navigator.share) {
				navigator
					.share({
						title: "Share LIQUIDO invite",
						url: this.newTeam.inviteLink,
					})
					.then(() => {
						console.log("Invite has been sent!")
					})
					.catch(console.error)
			} else {
				console.log("No native support")
				//shareDialog.classList.add('is-open');
			}
		},
	},
}
</script>

<style lang="scss">
.chat-bubble {
	//background-color: $secondary-bg;
	margin-bottom: 1rem;
	opacity: 1;
	transform: none;
	max-height: 1000px;
	-webkit-transition: all 0.5s ease;
	-moz-transition: all 0.5s ease;
	-o-transition: all 0.5s ease;
	transition: all 0.5s ease;
	.card-body {
		padding: 0.5rem;
		ul {
			padding-inline-start: 25px;
		}
		input {
			width: 100%;
		}
		p:last-child {
			margin-bottom: 0;
		}
	}
}

.chat-right {
	background-color: $input-bg;
	margin-left: 2rem;
	margin-bottom: 1rem;
}

.transition-all {
	-webkit-transition: all 0.5s ease;
	-moz-transition: all 0.5s ease;
	-o-transition: all 0.5s ease;
	transition: all 0.5s ease;
}
.opacity0 {
	opacity: 0;
}
.hide-left {
	opacity: 0;
	transform: translateX(-20px);
}
.hide-right {
	opacity: 0;
	transform: translateX(20px);
}
.collapse-max-height {
	max-height: 0;
	overflow: hidden;
	margin-top: 0;
	margin-bottom: 0;
	border: none;
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
	width: 60%;
	max-width: 300px;
}
</style>
