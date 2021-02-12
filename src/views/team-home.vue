<template>
	<div>
		<h2 id="team-home" class="page-title">
			{{ teamName }}
		</h2>

		<b-card class="chat-bubble shadow-sm">
			<b-card-text>
				{{ $t('introYourTeam') }}
			</b-card-text>
		</b-card>

		<b-button
			id="gotoPollsButton"
			variant="primary"
			size="m"
			class="float-right mb-3"
			@click="gotoPolls()"
		>
			{{ $t("gotoPolls") }}
			<i class="fas fa-angle-double-right" />
		</b-button>

		<div class="clearfix" />

		<h3 class="my-3">
			{{ $t('teamMembers') }}
		</h3>
		<b-card-group id="memberCards" deck>
			<b-card v-for="member in members" :key="member.email" :img-src="member.picture" img-alt="Avatar" img-top>
				<i class="fas fa-shield-alt admin-shield"></i>
				<b-card-text class="text-center">
					<b>{{ member.name }}</b>
				</b-card-text>
			</b-card>
			<b-card v-for="member in admins" :key="member.email" :img-src="member.picture" img-alt="Avatar" img-top>
				<b-card-text class="text-center">
					{{ member.name }}
				</b-card-text>
			</b-card>
		</b-card-group>
	</div>
</template>

<script>

export default {
	i18n: {
		messages: {
			en: {
				introYourTeam: "",
				teamAdmin: "Teama admin | Team Admin | Team Admins",
				teamMembers: "Team members",
			},
			de: {
				introYourTeam: 
					"Willkommen in deinem Team! Wenn euer Admin eine Abstimmung erstellt, kann jeder im Team seinen Wahlvorschlag hinzufügen. "+
					"Nachdem der Admin dann die Wahlphase gestartet hat, kann jeder seine Stimme abgeben. Bis am Ende das Wahlergebnis feststeht.",
				teamMembers: "Teammitglieder",
				teamAdmins: "Team Admin | Team Admin | Team Admins",
				gotoPolls: "Eure Abstimmungen"
			},
		},
	},
	components: { },
	data() {
		return {}
	},
	computed: {
		teamName() { return this.$api.teamCache.getSync("team").teamName },
		admins()   { return this.$api.teamCache.getSync("team").admins },
		members()  { 
			let res = this.$api.teamCache.getSync("team").members 
			return res
		},
	},
	created() {
	},
	mounted() {},
	
	methods: {
		gotoPolls() {
			this.$router.push({name: "polls"})
		}
	},
}
</script>

<style lang="scss">
#adminCards {
	.card {
		width: 30%;
		max-width: 110px;
		.card-text {
			color: $primary;
		}
		
	}
}

.admin-shield {
	color: $primary;
	position: absolute;
	top: 5px;
	right: 5px;
}

@media (min-width: 320px) {
	#memberCards, #adminCards {
		display: -ms-flexbox;
		display: -webkit-box;
		display: flex;
		-ms-flex-flow: row wrap;
		-webkit-box-orient: horizontal;
		-webkit-box-direction: normal;
		flex-flow: row wrap;
		justify-content: space-between;
		//margin-right: -15px;
		//margin-left: -15px;
		.card {
			width: 30%;
			//margin-right: 10px;
			.card-body {
				padding: 0.5rem 0;
			}
		}
	}
}


</style>
