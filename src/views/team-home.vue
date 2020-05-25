<template>
	<div class="container-lg team-container">
		<h3>Team Fabolous</h3>

		<b-tabs content-class="tabs-content" justified>
			<b-tab active>
				<template v-slot:title>
					<i class="far fa-lightbulb"></i>
				</template>				
					<law-panel
						v-for="idea in ideas" :key="'idea-'+idea.id"
						class="mb-3 shadow-sm"
						:law="idea"
						:read-only="false"
						
					/>
			</b-tab>
			<b-tab>
				<template v-slot:title>
					<i class="far fa-file-alt"></i>
				</template>
					<law-panel
						v-for="prop in proposals" :key="'prop-'+prop.id"
						class="mb-3 shadow-sm"
						:law="prop"
						:read-only="false"
					/>
			</b-tab>

			<b-tab>
				<template v-slot:title>
					<i class="far fa-comments"></i>
				</template>
			</b-tab>

			<b-tab>
				<template v-slot:title>
					<i class="fas fa-poll"></i>
				</template>

				<b-card 
				  v-for="poll in polls" :key="poll.id"
					no-body 
					class="poll-panel mb-3 shadow-sm" 
				>
					<template v-slot:header>
						<b-button variant="primary" size="sm" class="float-right">
							<i class="fas fa-angle-double-right"></i>
						</b-button>
						<h5 class="m-0"><i class="fas fa-poll"></i>&nbsp;{{poll.title}}</h5>
					</template>

					<b-list-group flush>
						<b-list-group-item v-for="prop in poll.proposals" :key="prop.id" class="prop-list-group-item">
							<img :src="'https://picsum.photos/seed/'+prop.id+'/100'" class="prop-image"/>
							<h4 class="prop-title">{{prop.title}}</h4>
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
				ideas: "Ideen",
				newIdeas: "Neue Ideen", 
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
			ideas: [
					{
							id: 1001,
							title: "This is a great idea with a long tittle",
							description: "Just an example proposal Bei relativ positionierten Elementen (position: relative) wird das Element aus seiner normalen Position im Elementfluss verschoben. Dabei gilt: Wenn die top Eigenschaft definiert wurde, überschreibt diese den Wert der bottom Eigenschaft. Wenn top den Wert auto besitzt, ist der berechnete Wert für bottom gleich dem Wert der top Eigenschaft mit umgedrehtem Vorzeichen. Wenn beide Eigenschaften nicht den Wert auto besitzen, wird bottom ignoriert und auf auto gesetzt.",
							status: "IDEA",
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
							id: 1002,
							title: "Just an example proposal Bei relativ positionierten Elementen (position: relative)",
							description: "Just an example proposal Bei relativ positionierten Elementen (position: relative) wird das Element aus seiner normalen Position im Elementfluss verschoben. Dabei gilt: Wenn die top Eigenschaft definiert wurde, überschreibt diese den Wert der bottom Eigenschaft. Wenn top den Wert auto besitzt, ist der berechnete Wert für bottom gleich dem Wert der top Eigenschaft mit umgedrehtem Vorzeichen. Wenn beide Eigenschaften nicht den Wert auto besitzen, wird bottom ignoriert und auf auto gesetzt.",
							status: "IDEA",
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
							id: 1003,
							title: "asdfklfj ewml,rtn wvasdoi v weweklv  gfdsfasdf",
							description: "Just an example proposal Bei relativ positionierten Elementen (position: relative) wird das Element aus seiner normalen Position im Elementfluss verschoben. Dabei gilt: Wenn die top Eigenschaft definiert wurde, überschreibt diese den Wert der bottom Eigenschaft. Wenn top den Wert auto besitzt, ist der berechnete Wert für bottom gleich dem Wert der top Eigenschaft mit umgedrehtem Vorzeichen. Wenn beide Eigenschaften nicht den Wert auto besitzen, wird bottom ignoriert und auf auto gesetzt.",
							status: "IDEA",
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
							id: 1004,
							title: "Fourht idea with a long title",
							description: "Just an example proposal Bei relativ positionierten Elementen (position: relative) wird das Element aus seiner normalen Position im Elementfluss verschoben. Dabei gilt: Wenn die top Eigenschaft definiert wurde, überschreibt diese den Wert der bottom Eigenschaft. Wenn top den Wert auto besitzt, ist der berechnete Wert für bottom gleich dem Wert der top Eigenschaft mit umgedrehtem Vorzeichen. Wenn beide Eigenschaften nicht den Wert auto besitzen, wird bottom ignoriert und auf auto gesetzt.",
							status: "IDEA",
							createdAt: new Date(),

							updatedAt: new Date(),
							area: {
								id: 4001,
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
									mobilephone: "#491234512",
									picture: "/img/avatars/Avatar2.png",
								}
							}
						},
						{
							id: 1005,
							title: "Fifth 555 idea with a vey long title",
							description: "Just an example proposal Bei relativ positionierten Elementen (position: relative) wird das Element aus seiner normalen Position im Elementfluss verschoben. Dabei gilt: Wenn die top Eigenschaft definiert wurde, überschreibt diese den Wert der bottom Eigenschaft. Wenn top den Wert auto besitzt, ist der berechnete Wert für bottom gleich dem Wert der top Eigenschaft mit umgedrehtem Vorzeichen. Wenn beide Eigenschaften nicht den Wert auto besitzen, wird bottom ignoriert und auf auto gesetzt.",
							status: "IDEA",
							createdAt: new Date(),
							updatedAt: new Date(),
							area: {
								id: 4001,
								title: "Example Area"
							},
							supporters: [],
							numSupporters: 0,
							supportedByCurrentUser: false,
							createdBy: {
								id: 7004,
								email: "user4@liqudo.vote",
								profile: {
									name: "User4 Mobile",
									mobilephone: "#49123454",
									picture: "/img/avatars/Avatar4.png",
								}
							}
						},
			],
			proposals: [
					{
							id: 2001,
							title: "Just a dummy proposal with a very long title",
							description: "Just an example proposal Bei relativ positionierten Elementen (position: relative) wird das Element aus seiner normalen Position im Elementfluss verschoben. Dabei gilt: Wenn die top Eigenschaft definiert wurde, überschreibt diese den Wert der bottom Eigenschaft. Wenn top den Wert auto besitzt, ist der berechnete Wert für bottom gleich dem Wert der top Eigenschaft mit umgedrehtem Vorzeichen. Wenn beide Eigenschaften nicht den Wert auto besitzen, wird bottom ignoriert und auf auto gesetzt.",
							status: "PROPOSAL",
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
			],
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
$avatar_size: 90px;

 .tabs-content {
	margin-left: -15px;
	margin-right: -15px;
	padding: 1rem 15px;
	background-color: #f0f0f0;
}

.nav-tabs .nav-link.active {
	background-color: #f0f0f0;
	border-bottom-color: #f0f0f0;
}

.poll-panel {
	.prop-list-group-item {
		padding: 5px;
	}
	.prop-title {
		//line-height: 30px;
		margin: 0;
		font-size: 18px;
		//white-space: nowrap;
		//overflow: hidden;
		//text-overflow: ellipsis;
	}
	.prop-image {
		float: left;
		margin-right: 5px;
		border-radius: 5px;
		min-width: $avatar_size;
		max-width: $avatar_size;
		width: $avatar_size;
		min-height: $avatar_size;
		max-height: $avatar_size;
		height: $avatar_size;
	}
}
</style>
