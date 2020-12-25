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
			<b-card v-for="member in members" :key="member.email" :img-src="member.avatarUrl" img-alt="Avatar" img-top>
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
			},
			de: {
				introYourTeam: "Willkommen in deinem Team! Wenn euer Admin eine Abstimmung erstellt, kann jeder im Team seinen Wahlvorschlag hinzufügen. Nachdem der Admin dann die Wahlphase gestartet hat, kann jeder seine Stimme abgeben. Bis am Ende das Wahlergebnis feststeht.",
				teamMembers: "Teammitglieder",
				gotoPolls: "Eure Abstimmungen"
			},
		},
	},
	components: { },
	data() {
		return {}
	},
	computed: {
		teamName() { return this.$root.store.get("team").name },
		members()  { return this.$root.store.get("team").members },
	},
	created() {
		this.$root.store.put("team", {
			name: "Test Dummy Team",
			members: [
				{ name: "User1", email: "user1@liquiod.me", avatarUrl: "/img/avatars/Avatar1.png" },
				{ name: "User2", email: "user2@liquiod.me", avatarUrl: "/img/avatars/Avatar2.png" },
				{ name: "User3", email: "user3@liquiod.me", avatarUrl: "/img/avatars/Avatar3.png" },
				{ name: "User4", email: "user4@liquiod.me", avatarUrl: "/img/avatars/Avatar4.png" },
				{ name: "User5", email: "user5@liquiod.me", avatarUrl: "/img/avatars/Avatar5.png" },
			]
		})
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
@media (min-width: 320px) {
	#memberCards {
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
				padding: 0.5rem;
			}
		}
	}
}


.team-member-img {
	border-radius: 10px;

}
</style>
