<template>
	<div>
		<liquido-header :showNavArrows="false" :minimizeOnScroll="false"></liquido-header>

		<div class="container-lg mt-3">
			<b-card class="chat-bubble shadow-sm" :class="{ 'hide-left': flowState < 1 }">
				<b-card-text v-html="$t('welcome')"></b-card-text>
			</b-card>

			<b-card class="chat-bubble shadow-sm"  :class="{ 'hide-left': flowState < 2 }">
				<b-card-text v-html="$t('whatsYourName')"></b-card-text>
			</b-card>

			<b-card class="chat-bubble chat-right" :class="{ 'hide-right': flowState < 3 }">
				<div class="form-group mb-0">
					<label for="userNameInput">{{$t('yourNickname')}}</label>
					<b-form-input id="userNameInput" v-model="user.name" type="text" class="form-control" :state="userNameState" :disabled="flowState > 3" @keyup.enter="userNameEnter()" @blur="userNameEnter()" />
					<div class="invalid-feedback">{{ $t('userNameInvalid') }}</div>
				</div>
			</b-card>

			<div :class="{'d-none': flowState < 4}">

			<b-card class="chat-bubble shadow-sm" :class="{ 'hide-left': flowState < 4 }">
				<b-card-text v-html="$t('niceToMeetYou', { nickname: user.name })"></b-card-text>
			</b-card>

			<b-card id="createOrJoinBubble" class="chat-bubble shadow-sm" :class="{ 'hide-left': flowState < 5 }">
				<b-card-text v-html="$t('createOrJoin' )"></b-card-text>
			</b-card>

			<div id="joinOrCreateButtons" class="mb-3 transition-all" :class="{ 'hide-left': flowState < 6 }">
				<button id="joinTeamButton"  @click="clickJoinTeam()" class="btn" :class="{ 
					'btn-primary': true, 
					'moveToCenterFromLeft active': flowState === 7, 
					'opacity0' : flowState == 8 
				}" >{{$t('joinTeamButton')}}</button>
				<button id="createNewTeamButton" @click="clickCreateNewTeam()" class="btn" :class="{ 
					'btn-primary': true, 
					'moveToCenterFromRight active': flowState === 8, 
					'opacity0' : flowState == 7
				}">{{$t('createNewTeamButton')}}</button>
			</div>

			</div>

			<!-- Join a team (flowState == 7) -->

			<b-card class="chat-bubble chat-right" :class="{ 'collapse-max-height': flowState !== 7 }">  
				<form id="joinTeamForm">
					<div class="form-group" :state="inviteState">
						<label for="inviteInput">{{$t('inviteCode')}}</label>
						<b-form-input id="inviteInput" v-model="user.invite" type="text" :state="inviteState" maxlength="6" placeholder="A3BD5F" trim @blur="inviteTouched = true"></b-form-input>
						<div class="invalid-feedback">{{$t('inviteInvalid')}}</div>
					</div>

					<div class="form-group" :state="eMailState">
						<label for="userEmailInput">{{$t('yourEMail')}}</label>
						<b-form-input id="userEmailInput" v-model="user.email" type="email" :state="eMailState" :placeholder="$t('eMailPlaceholder')" trim @blur="emailTouched = true"></b-form-input>
						<div class="invalid-feedback">{{$t('emailInvalid')}}</div>
					</div>

					<div class="d-flex justify-content-between align-items-center">
						<small class="ml-1"><a href="#" @click="cancelJoinTeam()">{{$t('Cancel')}}</a></small>
						<b-button variant="primary" :disabled="joinTeamButtonDisabled" @click="joinTeam()">{{$t('Ok')}} <i class="fas fa-angle-double-right"></i></b-button>
					</div>
				</form>
			</b-card>
			
			<!-- Create a new team (flowState == 8) -->

			<b-card class="chat-bubble chat-right" :class="{ 'collapse-max-height': flowState !== 8 }">
				<form id="createNewTeamForm">
					<div class="form-group">
						<label for="teamNameInput">{{$t('teamName')}}</label>
						<b-form-input id="teamNameInput" v-model="newTeam.name" type="text" :state="teamNameState" trim @blur="teamNameTouched = true"></b-form-input>
						<div class="invalid-feedback">{{$t('teamNameInvalid')}}</div>
					</div>

					<div class="form-group">
						<label for="adminEMailInput">{{$t('adminEmail')}}</label>
						<b-form-input id="adminEMailInput" v-model="user.email" type="email" :state="eMailState" :placeholder="$t('eMailPlaceholder')" trim></b-form-input>
						<small class="ml-1">{{$t('youWillBecomeAdmin')}}</small>
						<div class="invalid-feedback">{{$t('emailInvalid')}}</div>
					</div>

					<div class="d-flex justify-content-between align-items-center">
						<small class="ml-1"><a href="#" @click="cancelCreateNewTeam()">{{$t('Cancel')}}</a></small>
						<b-button variant="primary" :disabled="createNewTeamButtonDisabled" @click="creatNewTeam()">{{$t('Ok')}} <i class="fas fa-angle-double-right"></i></b-button>
					</div>
				</form>
			</b-card>

			<!-- New team created (flowState == 9) -->

			<b-card class="chat-bubble shadow-sm" :class="{'collapse-max-height': flowState !== 9 } ">
				<p>{{$t('teamCreated')}}</p>
				<ul>
					<li><a :href="newTeam.inviteLink" @click.prevent="shareLink()">{{$t('shareThisLink')}} <i class="fas fa-external-link-alt"></i></a></li>
					<li>{{$t('tellInvitationCode')}} <b>{{newTeam.inviteCode}}</b></li>
					<li>{{$t('scanQrCode')}}</li>
				</ul>
				<div class="text-center my-3">
					<img :src="newTeam.qrCode" class="qr-code" />
				</div>
				<small v-html="$t('teamInfo')"></small>
			</b-card>

			<b-card class="chat-bubble shadow-sm" :class="{'collapse-max-height': flowState !== 9 } ">
				<p v-html="$t('pollInfo')"></p>
			</b-card>

			<b-button variant="primary" class="float-right mb-3" :class="{'d-none': flowState !== 9 } " @click="createPoll()">{{$t('createPoll')}} <i class="fas fa-angle-double-right"></i></b-button>

		</div>
	</div>
</template>

<script>

//TODO: don't show footer on index page  (chat)

import liquidoHeader from '../components/liquido-header'

const eMailRegEx = /\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,64}\b/

export default {
	i18n: {
		messages: {
			en: {
				welcome: 'Welcome to  - the free, secure and liquid eVoting platform. With this mobile app you can create polls and then take votes with your team.',
				whatsYourName: 'How shall I call you?',
				createOrJoin: 'Do you want to <em>join an existing team</em> with an invitation code or <em>create a new team</em>?',
				joinTeamButton: 'Join a team',
				createNewTeamButton: 'Create new team',

				
				teamCreated: 'Ok your team has been created. Now you can invite your friends to join your team:',
				shareThisLink: 'Share this link',
				tellInvitationCode: 'or tell them your invitation code:',
				scanQrCode: 'or let them scan this QR code:',
				createPoll: 'Create a poll',
			},
			de: {
				welcome: '<p>Willkommen bei <span class="liquido"></span>, der freien, sicheren und liquiden e-voting App.</p>'+
				 '<p>Mit Liquido kannst du private Abstimmung für dein Team erstellen. Jedes Teammitglied kann eine Idee vorschlagen, welche dann von allen diskutiert und geliked wird. Anschließend wählt jeder seine favorisierten Vorschläge und Liquido berechnet den Gesamtsieger der Wahl.</p>',
				whatsYourName: 'Darf ich fragen wie du heißt?',
				yourNickname: "Dein Spitzname",
				userNameInvalid: "Bitte mindestens 4 Zeichen!",
				niceToMeetYou: 'Hallo {nickname}! Schön dich kennen zu lernen.',
				createOrJoin: 'Möchtest du <ul><li>einem bestehenden <b>Team beitreten</b></li><li>oder möchtest du ein <b>neues Team</b> gründen?</li></ul>',
				
				joinTeamButton: 'Team beitreten',
				inviteCode: 'Einladungscode',
				inviteInvalid: 'Code muss genau 6 Zeichen lang sein.',
				yourEMail: 'Deine E-Mail',
				eMailPlaceholder: 'info@domain.de',
				emailInvalid: 'E-Mail ungültig',

				createNewTeamButton: 'Neues Team',
				teamName: 'Team Name',
				teamNameInvalid: 'Bitte mindestens 4 Zeichen als Teamname!',
				adminEmail: 'Admin E-Mail',
				youWillBecomeAdmin: 'Du wirst der Admin des neuen Teams.',

				teamCreated: 'Ok, dein Team ist angelegt. Lade jetzt deine Freunde in dein Team ein:',
				shareThisLink: 'Teile diesen Link',
				tellInvitationCode: 'oder sag ihnen deinen Einadungscode:',
				scanQrCode: 'oder lass sie diesen QR code scannen:',
				teamInfo: 'Du findest diese Infos jederzeit wieder unter dem Team Icon <i class="fas fa-users"></i> ganz links unten im Footer.',


				pollInfo: 'Jetzt kannst du deine erste Abstimung anlegen, zu der jedes Teammitglied dann seine Idee (<i class="fas fa-lightbulb"></i>) hinzufügen kann.',
				createPoll: 'Abstimmung anlegen',
			}
		}
	},
	name: "indexPage",
	components: { liquidoHeader },
	data() {
		return {
			user : {
				name: undefined,
				email: undefined,
				invite: undefined			// if user already has an invitation code
			},

			// data when new team has been created
			newTeam: {
				name: undefined,
				inviteCode: "A3F43D",   
				inviteLink: "http://liquido.me/invite/A3F43D",
				qrCode: "/img/qrcode.svg",
			},
			
			/*
				user flow:   chat bubbles are consecutively blended in along this flowState value.
				 0 - empty chat
				 1 - first welcome message bubble
				 2 - blend in: What's your name
				 3 - blend in: nickname input
				 4 - Nice to meet you bubble
				 5 - create or join Team bubble
				 6 - create or join Team buttons
				 7 - join team form
				 8 - create new team form
				 9 - team created
			*/
			flowState: 0,   								//TODO: store flow State in vuex, and re-use when user comes back
				/** 
		 * Each form field may have one of three states:
		 * 1) null:  The field has not yet been validated at all. Do not show any error or success message yet.
		 * 2) false: The fields value is invalid. Show error message.
		 * 3) true:  The fields value is valid. May show success message.
		 */

			// These variables store if the field has been validated before. If false => do not show any error message yet.
			usernameValidated: false,
			inviteValidated:   false,
			emailValidated:    false,
			teamNameValidated: false,
		}
	},
	created() {
		this.$root.store.setShowFooter(false)
		window.setTimeout(() => { this.flowState = 1}, 500)
		window.setTimeout(() => { this.flowState = 2}, 2500)
		window.setTimeout(() => { this.flowState = 3}, 3000)
	},
	mounted() {
		$("html, body").animate({ scrollTop: 0 }, 1000);
	},
	computed: {
		userNameState()   { 
			 if (this.user.name && this.user.name.replace(/\s/g, '').length >= 4) return this.usernameValidated = true
			 return this.usernameValidated ? false : null
		},
		inviteState()     { 
			if (this.user.invite && this.user.invite.replace(/\s/g, '').length == 6) return this.inviteValidated = true
			return this.inviteValidated ? false : null
		},
		eMailState()      { 
			if (this.user.email && eMailRegEx.test(this.user.email)) return this.emailValidated = true
			return this.emailValidated ? false : null
		},
		teamNameState()   { 
			if(this.newTeam.name && this.newTeam.name.replace(/\s/g, '').length >= 4) return this.teamNameValidated = true
			return this.teamNameValidated ? false : null
		},
		joinTeamButtonDisabled()      { return !this.inviteState   || !this.eMailState },
		createNewTeamButtonDisabled() { return !this.teamNameState || !this.eMailState },
	},
	methods: {

		userNameEnter() {
			this.usernameValidated = true
			if (this.userNameState)	{
				this.flowState = 4
				$('#userNameInput').blur()
				setTimeout(() => { 
					this.flowState = 6 
					this.scrollToBottom()
				}, 1500)
			}
		},

		clickJoinTeam() {
			this.flowState = 7
			this.scrollToBottom()
		},
		cancelJoinTeam() {
			this.flowState = 6
			this.scrollToBottom()
		},

		clickCreateNewTeam() {
			this.flowState = 8
			this.scrollToBottom()
		},
		cancelCreateNewTeam() {
			this.flowState = 6
			this.scrollToBottom()
		},

		/** Join an existing team */
		joinTeam() {
			console.log(this.user.name + "<" + this.user.email + "> joins team with invite "+this.user.invite)

		},

		/** Create a new team */
		creatNewTeam() {
			console.log(this.user.name + "<" + this.user.email + "> creates new team: "+this.newTeam.name)

		},

		/** scroll to the very bottom of the content. Show last chat message */
		scrollToBottom() {
			this.$nextTick(() => {
				$("html, body").animate({ scrollTop: $(document).height() }, 1000);
			})
		},

		/** 
		 * scroll an HTML elemant right under the header
		 * (as far up as possible, depending on content below the elem) 
		 */
		scrollElemToTop(elem) {
			var scrollTop = $(elem).offset().top - this.$root.headerHeight
			this.$nextTick(() => {
				$("html, body").animate({ scrollTop: scrollTop }, 2000);
			})
		},

		shareLink() {
			console.log("click share link")
			if (navigator.share) {
				navigator
					.share({
						title: "Share LIQUIDO invite",
						url: inviteLink,
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
	background-color: #FBFBFB;
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
	background-color: #e9fce9;
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
	transform: translateX( 20px);
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
	position: relative;   // Cannot use flex  and justify-content: space-between, because that cannot be animated
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
