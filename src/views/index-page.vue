<template>
	<div class="container-lg">
		<p @click="nextFlowState()">{{flowState}}</p>

		<b-card class="chat-bubble shadow-sm" :class="{ 'hide-left': flowState < 1 }">
			<b-card-text v-html="$t('welcome')"></b-card-text>
		</b-card>

		<b-card class="chat-bubble shadow-sm"  :class="{ 'hide-left': flowState < 2 }">
			<b-card-text v-html="$t('whatsYourName')"></b-card-text>
		</b-card>

		<div class="form-group chat-right" :class="{ 'hide-right': flowState < 3 }">
			<b-form-input id="userNameInput" v-model="user.name" :state="userNameState" :placeholder="$t('nickname')" trim></b-form-input>
		</div>

		<b-card class="chat-bubble shadow-sm" :class="{ 'hide-left': flowState < 4 }">
			<b-card-text v-html="$t('niceToMeetYou', { nickname: user.name })"></b-card-text>
		</b-card>
		<b-card class="chat-bubble shadow-sm" :class="{ 'hide-left': flowState < 5 }">
			<b-card-text v-html="$t('createOrJoin' )"></b-card-text>
		</b-card>

		<div id="joinOrCreateButtons" class="mb-3 transition-all" :class="{ 'hide-left': flowState < 6 }">
			<button id="joinTeamButton"  @click="clickJoinTeam()" class="btn" :class="{ 
				'btn-primary': flowState <= 6, 
				'moveToCenter btn-secondary': flowState === 7, 
				'display-none' : flowState == 8 
			 }" >{{$t('joinTeamButton')}}</button>
			<button id="createNewTeamButton" @click="clickCreateNewTeam()" class="btn" :class="{ 
				'btn-primary': flowState <= 6, 
				'moveToCenter btn-secondary': flowState === 8, 
				'display-none' : flowState == 7
			 }">{{$t('createNewTeamButton')}}</button>
		</div>

		<!-- Join a team (flowState == 7) -->

		<div class="transition-all" :class="{ 'display-none': flowState !== 7 }">
			<form id="joinTeamForm">
				<div class="form-group">
					<label for="inviteInput">{{$t('inviteCode')}}</label>
					<b-form-input id="inviteInput" v-model="user.invite" type="text" :state="inviteState" placeholder="A3BD5F" trim></b-form-input>
				</div>

				<div class="form-group">
					<label for="userEmailInput">{{$t('yourEMail')}}</label>
					<b-form-input id="userEmailInput" v-model="user.email" type="email" :state="inviteState" placeholder="info@domain.com" trim></b-form-input>
				</div>
  
				<div class="d-flex justify-content-between align-items-center">
					<small class="ml-1"><a href="#" @click="cancelJoinTeam()">{{$t('Cancel')}}</a></small>
					<b-button variant="primary" @click="joinTeam()">{{$t('Ok')}} <i class="fas fa-angle-double-right"></i></b-button>
				</div>
			</form>
		</div>

		<!-- Create a new team -->

		<form id="createNewTeamForm" class="transition-all" :class="{ 'display-none': flowState !== 8 }">
			<b-form-group	:state="teamNameState" >
				<div class="input-group">
					<div class="input-group-prepend">
						<span class="input-group-text">Team name</span>
					</div>
					<b-form-input id="teamNameInput" v-model="newTeam.name" :state="teamNameState" trim></b-form-input>
				</div>
			</b-form-group>

			<b-form-group
				description="You will become the admin of the new team."
				invalid-feedback="Not a valid email"
				:state="eMailState">
				<div class="input-group">
					<div class="input-group-prepend">
						<span class="input-group-text">Admin email</span>
					</div>
					<b-form-input id="adminEMailInput" v-model="user.email" type="email" :state="eMailState" placeholder="info@domain.com" trim></b-form-input>
				</div>
			</b-form-group>

			<div class="mb-3 d-flex justify-content-between align-items-center">
				<small><a href="#" @click="cancelCreateNewTeam()">{{$t('Cancel')}}</a></small>
				<b-button variant="primary">{{$t('Ok')}} <i class="fas fa-angle-double-right"></i></b-button>
			</div>
		</form>

		<b-card id="createdNewTeamCard" class="chat-bubble shadow-sm collapse" header="Create a new team">
			Ok your team has been created. Now invite your friends so that they can join your team.
			<a :href="inviteLink" @click.prevent="shareLink()"
				>Share this link <i class="fas fa-external-link-alt"></i
			></a>
			or let them scan this QR code:
			<div class="my-3">
				<img :src="qrCode" width="150" height="150" />
			</div>
			Invitation code: <b>ABCDE</b>
		</b-card>

	</div>
</template>

<script>
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
				nickname: "<Spitzname>",
				niceToMeetYou: 'Hallo {nickname}! Schön dich kennen zu lernen.',
				createOrJoin: 'Möchtest du einem bestehenden Team <b>beitreten</b> oder möchtest du ein <b>neues Team anlegen</b>?',
				
				joinTeamButton: 'Team beitreten',
				inviteCode: 'Einladungscode',
				validInvite: 'Code verifiziert',
				invalidInvite: 'Einladungscode ungültig',
				yourEMail: 'Deine E-Mail',
				createNewTeamButton: 'Neues Team',
			}
		}
	},
	name: "IndexComponent",
	components: {},
	data() {
		return {
			inviteLink: "http://liquido.me/invite/A3F43D",
			qrCode: "/img/qrcode.svg",
			invitationCode: undefined,
			user : {
				name: undefined,
				email: undefined,
				invite: undefined
			},
			newTeam: {
				name: undefined,
			},
			inviteState: null,
			/*
				user flow:   chat bubbles and input elemnts are blended in depending on this flowState value.
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
			flowState: 0
		}
	},
	created() {},
	mounted() {
		
		//$('#joinTeamForm').collapse('hide')
	},
	computed: {
		userNameState()   { return this.user.name === undefined ? null : this.user.name.length >= 5 },
		eMailState()      { return this.user.email === undefined ? null : this.user.email.length >= 5 },
		teamNameState()   { return this.newTeam.name === undefined ? null : this.newTeam.name.length >= 5 },
	},
	methods: {
		nextFlowState() {
			this.flowState++;
		},

		checkInvite() {
			if (this.user.invite === undefined) return;
			this.checkingInviteCode = true
			return setTimeout(function() {
				this.checkingInviteCode = false
				this.inviteState = true
			}, 1000)
		},
		//TODO: simply set boolean values and then to  :class="..."
		clickJoinTeam() {
			this.flowState = 7
			/*
			$('#createNewTeamButton').addClass('fadeOut')
			$('#joinTeamButton').addClass('moveToCenter')
			$('#joinTeamForm').collapse('show')
			*/
		},
		cancelJoinTeam() {
			this.flowState = 6
			/*
			$('#createNewTeamButton').removeClass('fadeOut')
			$('#joinTeamButton').removeClass('moveToCenter')
			$('#joinTeamForm').collapse('hide')
			*/
		},
		clickCreateNewTeam() {
			this.flowState = 8
			/*
			$('#createNewTeamButton').addClass('moveToCenter')
			$('#joinTeamButton').addClass('fadeOut')
			$('#createNewTeamForm').collapse('show')
			*/
		},
		cancelCreateNewTeam() {
			this.flowState = 6
			/*
			$('#createNewTeamButton').removeClass('moveToCenter')
			$('#joinTeamButton').removeClass('fadeOut')
			$('#createNewTeamForm').collapse('hide')
			*/
		},

		joinTeam() {

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
	-webkit-transition: all 0.5s ease-out;
	-moz-transition: all 0.5s ease-out;
	-o-transition: all 0.5s ease-out;
	transition: all 0.5s ease-out;
	.card-body {
		padding: 0.5rem;
	}
}

.chat-right {
	margin-left: 2rem;
	margin-bottom: 1rem;
	-webkit-transition: all 0.5s ease-out;
	-moz-transition: all 0.5s ease-out;
	-o-transition: all 0.5s ease-out;
	transition: all 0.5s ease-out;
	input {
		width: 100%;
		background-color: #F9FFF9;
	}
}

.transition-all {
	-webkit-transition: all 0.5s ease-out;
	-moz-transition: all 0.5s ease-out;
	-o-transition: all 0.5s ease-out;
	transition: all 0.5s ease-out;
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


.card-header {
	padding: 0.5rem;
}
#joinTeamForm .input-group-text {
	width: 5em;
}
#joinOrCreateButtons {
	width: 100%;
	height: 40px;
	position: relative;   // Cannot use flex  and justify-content: space-between, because that cannot be animated
}
#joinTeamButton {
	-webkit-transition: all 0.5s ease-out;
	-moz-transition: all 0.5s ease-out;
	-o-transition: all 0.5s ease-out;
	transition: all 0.5s ease-out;
	position: absolute;
	left: 0;
	top: 0;
}
#createNewTeamButton {
	-webkit-transition: all 0.5s ease-out;
	-moz-transition: all 0.5s ease-out;
	-o-transition: all 0.5s ease-out;
	transition: all 0.5s ease-out;
	position: absolute;
	right: 0;
	top: 0;
}
.moveToCenter {
	left: 50% !important;
	transform: translateX(-50%);
}
.fadeOut {
	opacity: 0;
}

#joinTeamForm {
	margin-left: 2rem;
	margin-bottom: 1rem;
	padding: 0.5rem;
	border: 1px solid rgba(0, 0, 0, 0.125);
	border-radius: 0.25rem;
	
	background-color: #F9FFF9;
	input {
		width: 100%;
		background-color: white;	
	}
}

label {
	font-size: 14px;
	font-weight: bold;
	margin: 0;
	//color: rgb(86, 9, 109);
}

</style>
