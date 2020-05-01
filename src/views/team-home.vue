<template>
	<div id="" class="container-lg">
		<h1>Team Fabolous</h1>

		<b-tabs content-class="mt-3" justified>
			<b-tab :title="$t('proposals')">

				<div v-for="poll in polls" :key="'p1-'+poll.id">
					<h5><i class="fas fa-lightbulb"></i>&nbsp;New Ideas</h5>
					<law-panel
						v-for="prop in poll.proposals" :key="'p1'+prop.id"
						class="mb-3"
						:law="prop"
						:read-only="false"
						
					/>

					<h5><i class="fas fa-file-alt"></i>&nbsp;Proposals</h5>
					<law-panel
						v-for="prop in poll.proposals" :key="'k2'+prop.id"
						class="mb-3"
						:law="prop"
						:read-only="false"
						
					/>
				</div>

			</b-tab>

			<b-tab :title="$t('elaboration')">
				<p>Elaboration</p>
			</b-tab>

			<b-tab :title="$t('inVoting')" active>

				<b-card v-for="poll in polls" :key="poll.id"
					no-body 
					class="mb-3 poll-panel" 
					header-tag="header"
				>
					<template v-slot:header>
						<b-button variant="primary" size="sm" class="float-right">
							<i class="fas fa-angle-double-right"></i>
						</b-button>
						<h5 class="mb-0"><i class="fas fa-poll"></i>&nbsp;{{poll.title}}</h5>
					</template>

					<b-list-group flush>
						<b-list-group-item v-for="prop in poll.proposals" :key="prop.id">
							<img :src="prop.createdBy.profile.picture" class="prop-img"/>
							{{prop.title}}
							<div class="author">
								<i class="far fa-user"></i>&nbsp;{{ prop.createdBy.profile.name }}&nbsp;
								<span :class="{ supported: prop.supportedByCurrentUser }">
									<i :class="{'far': !prop.supportedByCurrentUser, 'fas': prop.supportedByCurrentUser}" class="fa-thumbs-up">&nbsp;{{prop.numSupporters}}</i>
								</span>
							</div>
						</b-list-group-item>
					</b-list-group>
				</b-card>

			</b-tab>
			
		</b-tabs>

	</div>
</template>

<script>

// import moment from 'moment'
import lawPanel from "../components/law-panel"

export default {
	i18n: {
		messages: {
			en: {
				welcome: 'Welcome to <span class="liquido"></span> - the free, secure and liquid eVoting platform. With this mobile app you can create polls and then take votes with your team.',


			},
			de: {
				proposals: 'Vorschläge',
				polls: 'Wahlen',  // Abstimmungen, Umfragen ??
				elaboration: 'Diskussion',
				inVoting: 'Abstimmung',  // laufende Wahlen ??
			}
		}
	},
	components: { lawPanel },
	data() {
		return {
			polls: [
				{
					id: 101,
					title: "Example poll in voting",
					status: "VOTING",
					votingStartAt: this.addDays(new Date(), -1),
					votingEndAt:   this.addDays(new Date(), +9),

					proposals: [
						{
							id: 2001,
							title: "Proposal One qurg ASD asdfcvvef fdadsf ddd fff ddccc c ewe e",
							description: "Just an example proposal Bei relativ positionierten Elementen (position: relative) wird das Element aus seiner normalen Position im Elementfluss verschoben. Dabei gilt: Wenn die top Eigenschaft definiert wurde, überschreibt diese den Wert der bottom Eigenschaft. Wenn top den Wert auto besitzt, ist der berechnete Wert für bottom gleich dem Wert der top Eigenschaft mit umgedrehtem Vorzeichen. Wenn beide Eigenschaften nicht den Wert auto besitzen, wird bottom ignoriert und auf auto gesetzt.",
							status: "VOTING",
							createdAt: new Date(),

							updatedAt: new Date(),
							area: {
								id: 4001,
								title: "Example Area"
							},
							supporters: [
								
							],
							numSupporters: 15,
							supportedByCurrentUser: true,
							createdBy: {
								id: 7001,
								email: "user1@liqudo.vote",
								profile: {
									name: "User1 Mobile",
									mobilephone: "#491234517",
									picture: "/img/avatars/Avatar1.png",
								}
							}
						},
						{
							id: 2002,
							title: "Proposal Two",
							description: "Yet another example proposal xcvxclk c vd xc asdf cxvyxcv yxcv xycv ",
							status: "VOTING",
							createdAt: new Date(),
							updatedAt: new Date(),
							area: {
								id: 4002,
								title: "Example Area"
							},
							supporters: [
								
							],
							numSupporters: 9,
							supportedByCurrentUser: false,
							createdBy: {
								id: 7002,
								email: "user2@liqudo.vote",
								profile: {
									name: "User2 Mobile",
									mobilephone: "#491234518",
									picture: "/img/avatars/Avatar2.png",
								}
							}
						}
					],

					area: {
						id: 4001,
						title: "Example Area"
					},
					winner: undefined,
					duelMatrix: undefined
				}
			]
		}
	},
	created() {},
	mounted() {},
	computed: {},
	methods: {
		
		addDays(date, days) {
			var result = new Date(date);
			result.setDate(result.getDate() + days);
			return result;
		},


	},

}

</script>

<style lang="scss">
.nav-link {
	padding: 0.25rem;
}
.poll-panel {
	position: relative;
	 
	.card-header {
		padding: 0 0 0 0.5rem;
		h5 {
			padding-top: 2px;
		}
		.btn {
			border-top-left-radius: 0;
			border-bottom-right-radius: 0;
			border-bottom-left-radius: 0;
		}
	}
	.list-group-item {
		padding: 0.25rem 0.5rem;
		font-size: 14px;
		height: 48px;
	}
	.prop-img {
		float: left;
		width: 32px;
		height: 32px;
		margin-top: 4px;
		margin-right: 0.5rem;
		border-radius: 5px;
	}
}

.author {
	font-size: 10px;
	line-height: 15px;
	color: grey;
	background-color: #f3f3f3;
	border-top-left-radius: 15px;
	// border-bottom-left-radius: 15px;
	border-left: 5px solid white;
	box-shadow: inset 2px 2px 2px 0px rgba(100,100,100, 0.1);
	padding: 3px 5px 0 10px; // need some more white pixels above to hide h2 behind
	position: absolute;
	right: 0;
	bottom: 0;
}
.supported {
	color: green;
}

</style>
