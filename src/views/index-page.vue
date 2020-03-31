<template>
	<div class="container-lg">
		<b-card class="chat-bubble shadow-sm">
			<b-card-text v-html="$t('welcome')"></b-card-text>
		</b-card>
		<b-card class="chat-bubble shadow-sm">
			<b-card-text v-html="$t('whatsYourName')"></b-card-text>
		</b-card>

		<b-form-group class="chat-right">
			<b-form-input id="userNameInput" v-model="user.name" :state="userNameState" :placeholder="$t('nickname')" trim></b-form-input>
		</b-form-group>

		<b-card class="chat-bubble shadow-sm">
			<b-card-text v-html="$t('niceToMeetYou', { nickname: user.name })"></b-card-text>
		</b-card>
		<b-card class="chat-bubble shadow-sm">
			<b-card-text v-html="$t('createOrJoin' )"></b-card-text>
		</b-card>

		<div id="joinOrCreateButtons" class="mb-3">
			<b-button id="joinTeamButton" variant="primary" @click="clickJoinTeam()">{{$t('joinTeamButton')}}</b-button>
			<b-button id="createNewTeamButton" variant="primary" @click="clickCreateNewTeam()">{{$t('createNewTeamButton')}}</b-button>
		</div>

		<!-- Join a team -->

		<form id="joinTeamForm" class="collapse">
			<b-form-group
			  :valid-feedback="$t('validInvite')"
				:invalid-feedback="$t('invalidInvite')"
				:state="inviteState">
				<div class="input-group">
					<div class="input-group-prepend">
						<span class="input-group-text">{{$t('invite')}}</span>
					</div>
					<b-form-input id="userEMailInput" v-model="user.invite" type="email" :state="inviteState" placeholder="A3BD5F" trim></b-form-input>
				</div>
			</b-form-group>

			<b-form-group
				invalid-feedback="Not a valid email"
				:state="eMailState">
				<div class="input-group">
					<div class="input-group-prepend">
						<span class="input-group-text">Email</span>
					</div>
					<b-form-input id="userEMailInput" v-model="user.email" type="email" :state="eMailState" placeholder="info@domain.com" trim></b-form-input>
				</div>
			</b-form-group>

			<div class="mb-3 d-flex justify-content-between align-items-center">
				<small><a href="#" @click="cancelJoinTeam()">{{$t('Cancel')}}</a></small>
				<b-button variant="primary">{{$t('Ok')}} <i class="fas fa-angle-double-right"></i></b-button>
			</div>
		</form>

		<!-- Create a new team -->

		<form id="createNewTeamForm" class="collapse liquido-form">
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
				welcome: 'Willkommen bei <span class="liquido"></span> - der freien, sicheren und liquiden e-voting Plattform. Mit dieser könnt Ihr online abstimmen.',
				whatsYourName: 'Darf ich dich fragen wie du heißt?',
				nickname: "<Spitzname>",
				niceToMeetYou: 'Hallo {nickname}! Schön dich kennen zu lernen.',
				createOrJoin: 'Möchtest du einem bestehenden Team <b>beitreten</b> oder möchtest du ein <b>neues Team anlegen</b>?',
				joinTeamButton: 'Team beitreten',
				invite: 'Invite',
				validInvite: 'Code verifiziert',
				invalidInvite: 'Invite code ungültig',
				createNewTeamButton: 'Neues Team',
			}
		}
	},
	name: "IndexComponent",
	components: {},
	data() {
		return {
			username: "Lisa",
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
			inviteState: null
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
		//TODO: call this on keypress
		checkInvite() {
			if (this.user.invite === undefined) return;
			this.checkingInviteCode = true
			return setTimeout(function() {
				this.checkingInviteCode = false
				this.inviteState = true
			}, 1000)
		},
		clickJoinTeam() {
			$('#createNewTeamButton').addClass('fadeOut')
			$('#joinTeamButton').addClass('moveToCenter')
			$('#joinTeamForm').collapse('show')
		},
		cancelJoinTeam() {
			$('#createNewTeamButton').removeClass('fadeOut')
			$('#joinTeamButton').removeClass('moveToCenter')
			$('#joinTeamForm').collapse('hide')
		},
		clickCreateNewTeam() {
			$('#createNewTeamButton').addClass('moveToCenter')
			$('#joinTeamButton').addClass('fadeOut')
			$('#createNewTeamForm').collapse('show')
		},
		cancelCreateNewTeam() {
			$('#createNewTeamButton').removeClass('moveToCenter')
			$('#joinTeamButton').removeClass('fadeOut')
			$('#createNewTeamForm').collapse('hide')
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
	.card-body {
		padding: 0.5rem;
	}
}
.chat-right {
	margin-left: 2rem;
	input {
		background-color: #F9FFF9;
	}
	
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
	position: relative;
	// Cannot use flex  and justify-content: space-between, because that cannot be animated
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

label {
	font-size: 14px;
	margin: 0;
	color: rgb(86, 9, 109);
}

</style>
