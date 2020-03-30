<template>
	<div class="container-lg">
		<b-card class="chat-bubble shadow-sm">
			Welcome to <span class="liquido" /> - the free, secure and liquid eVoting platform.
			With this mobile app you can create polls and then take votes with your team.
		</b-card>

		<b-card id="questionCard" class="chat-bubble shadow-sm">
			Do you want to <em>join an existing team</em> with an invitation code or <em>create a new team</em>?
		</b-card>

		<div id="joinOrCreateButtons" class="mb-3">
			<b-button id="joinTeamButton" variant="primary" @click="clickJoinTeam()">Join a team</b-button>
			<b-button id="createNewTeamButton" variant="primary" @click="clickCreateNewTeam()">Create new team</b-button>
		</div>

		<form id="joinTeamForm" class="collapse">
			<div class="input-group mb-3">
				<div class="input-group-prepend">
					<span class="input-group-text">Invite</span>
				</div>
				<input type="text" class="form-control" placeholder="e.g. A65DFE3">
			</div>

			<div class="input-group mb-3">
				<div class="input-group-prepend">
					<span class="input-group-text">Name</span>
				</div>
				<input type="text" class="form-control" placeholder="Firstname Lastname">
			</div>

			<div class="input-group mb-3">
				<div class="input-group-prepend">
					<span class="input-group-text">E-Mail</span>
				</div>
				<input type="text" class="form-control" placeholder="mail@domain.com">
			</div>

			<div class="mb-3 d-flex justify-content-between align-items-center">
				<small><a href="#" @click="cancelJoinTeam()">Cancel</a></small>
				<b-button variant="primary">Ok <i class="fas fa-angle-double-right"></i></b-button>
			</div>
		</form>

		<b-card id="createNewTeamCard" class="chat-bubble shadow-sm collapse" header="Create new team">
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
	name: "Welcome",
	components: {},
	data() {
		return {
			username: "Lisa",
			inviteLink: "http://liquido.me/invite/A3F43D",
			qrCode: "/img/qrcode.svg",
			invitationCode: undefined
		}
	},
	created() {},
	mounted() {
		//$('#joinTeamForm').collapse('hide')
	},
	computed: {},
	methods: {
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
			$('#createNewTeamCard').collapse('show')
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
</style>
