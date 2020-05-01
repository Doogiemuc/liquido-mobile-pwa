<template>
	<div id="" class="container-lg">
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

		<b-card class="chat-bubble shadow-sm" :class="{ 'hide-left': flowState < 4 }">
			<b-card-text v-html="$t('niceToMeetYou', { nickname: user.name })"></b-card-text>
		</b-card>

		<b-card id="createOrJoinBubble" class="chat-bubble shadow-sm" :class="{ 'hide-left': flowState < 5 }">
			<b-card-text v-html="$t('createOrJoin' )"></b-card-text>
		</b-card>

		<div id="joinOrCreateButtons" class="mb-3 transition-all" :class="{ 'hide-left': flowState < 6 }">
			<button id="joinTeamButton"  @click="clickJoinTeam()" class="btn" :class="{ 
				'btn-primary': flowState <= 6, 
				'moveToCenter btn-secondary': flowState === 7, 
				'opacity0' : flowState == 8 
			 }" >{{$t('joinTeamButton')}}</button>
			<button id="createNewTeamButton" @click="clickCreateNewTeam()" class="btn" :class="{ 
				'btn-primary': flowState <= 6, 
				'moveToCenter btn-secondary': flowState === 8, 
				'opacity0' : flowState == 7
			 }">{{$t('createNewTeamButton')}}</button>
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

		<b-card id="createdNewTeamCard" class="chat-bubble shadow-sm collapse" header="Create a new team">
			Ok your team has been created. Now invite your friends so that they can join your team.
			<a :href="inviteLink" @click.prevent="shareLink()"
				>Share this link <i class="fas fa-external-link-alt"></i
			></a>
			or let them scan this QR code:
			<div class="my-3">
				<img :src="qrCode" width="150" height="150" />
			</div>
			Invitation code: <b>{{user.invite}}</b>
		</b-card>

	</div>
</template>

<script>

const eMailRegEx = /\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,64}\b/

export default {
	i18n: {
		messages: {
			en: {
				welcome: 'Welcome to <span class="liquido"></span> - the free, secure and liquid eVoting platform. With this mobile app you can create polls and then take votes with your team.',
				whatsYourName: 'How shall I call you?',
				createOrJoin: 'Do you want to <em>join an existing team</em> with an invitation code or <em>create a new team</em>?',
				joinTeamButton: 'Join a team',
				createNewTeamButton: 'Create new team',
			},
			de: {
				welcome: 'Willkommen bei <span class="liquido"></span> - der freien, sicheren und liquiden e-voting App. Hier könnt ihr in eurem Team abstimmen.',
				whatsYourName: 'Darf ich fragen wie du heißt?',
				yourNickname: "Dein Spitzname",
				userNameInvalid: "Bitte mindestens 4 Zeichen!",
				niceToMeetYou: 'Hallo {nickname}! Schön dich kennen zu lernen.',
				createOrJoin: 'Möchtest du <ul><li>einem bestehenden <b>Team beitreten</b></li><li>oder möchtest du ein <b>neues Team</b> anlegen?</li></ul>',
				
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
				youWillBecomeAdmin: 'Du wirst Admin des neuen Teams.',

			}
		}
	},
	name: "IndexComponent",
	components: {},
	data() {
		return {
			inviteLink: "http://liquido.me/invite/A3F43D",
			qrCode: "/img/qrcode.svg",
			user : {
				name: undefined,
				email: undefined,
				invite: undefined
			},
			newTeam: {
				name: undefined,
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
			*/
			flowState: 0,   								//TODO: store flow State in vuex, and re-use when user comes back
				/** 
		 * Each form field may have one of three states:
		 * 1) null:  The field has not yet been validated at all. Do not show any error or success message yet.
		 * 2) false: The fields value is invalid. Show error message.
		 * 3) true:  The fields value is valid. May show success message.
		 */
			usernameValidated: false,
			inviteValidated:   false,
			emailValidated:    false,
			teamNameValidated: false,
		}
	},
	created() {
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
				setTimeout(() => { this.flowState = 6 }, 1500)
			}
		},

		clickJoinTeam() {
			this.flowState = 7
			this.scrollElemToTop('#joinTeamButton');
		},
		cancelJoinTeam() {
			this.flowState = 6
			this.scrollElemToTop('#createOrJoinBubble')
		},

		clickCreateNewTeam() {
			this.flowState = 8
			this.scrollElemToTop('#createNewTeamButton')
		},
		cancelCreateNewTeam() {
			this.flowState = 6
			this.scrollElemToTop('#createOrJoinBubble')
		},

		/** Join an existing team */
		joinTeam() {
			console.log(this.user.name + "<" + this.user.email + "> joins team with invite "+this.user.invite)

		},

		/** Create a new team */
		creatNewTeam() {
			console.log(this.user.name + "<" + this.user.email + "> created new team: "+this.newTeam.name)

		},

		scrollToBottom() {
			this.$nextTick(() => {
				$("html, body").animate({ scrollTop: $(document).height() }, 2000);
			})
		},
		scrollElemToTop(elem) {
			this.$nextTick(() => {
				$("html, body").animate({ scrollTop: $(elem).offset().top }, 2000);
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
.display-none {
	display: none;
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
	left: 0;
	top: 0;
}
#createNewTeamButton {
	position: absolute;
	right: 0;
	top: 0;
}
.moveToCenter {
	left: 50% !important;
	transform: translateX(-50%);
}

label {
	font-size: 14px;
	font-weight: bold;
	margin: 0;
	//color: rgb(86, 9, 109);
}

</style>
