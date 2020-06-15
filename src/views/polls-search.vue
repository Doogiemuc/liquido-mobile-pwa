<template>
	<div>
		<div class="poll-header">
			<h3>Polls</h3>
		</div>
		<div class="poll-filter-wrapper container-fluid">
			<div class="row text-center">
				<div class="col">
					Discuss <span class="badge badge-primary">4</span>
				</div>
				<div class="col">
					<span class="active-filter">Vote</span>&nbsp;<span class="badge badge-primary">2</span>
				</div>
				<div class="col">
					Finished <span class="badge badge-primary">0</span>
				</div>
			</div>
		</div>
		<div class="container mt-3">
			<b-card no-body class="poll-panel" :id="poll.id">
				<template v-slot:header>
					<i class="fas fa-poll"></i>&nbsp;{{poll.title}}
					<i class="float-right fas fa-angle-double-right goto-poll-icon"></i>
				</template>
				<div class="poll-proposal" v-for="prop in poll.proposals" :key="prop.id">
					<div class="d-flex">
						<img :src="'https://picsum.photos/seed/'+prop.id+'/100'" alt="proposal image" class="law-image"/>
						<div class="d-flex flex-column w-100 justify-content-between">
							<div class="law-title">{{prop.title}}</div>
							<div class="d-flex justify-content-between subtitle">
								<div>
									<i class="far fa-user"></i>&nbsp;{{ prop.createdBy.profile.name }}
								</div>
								<div>
									<i class="far fa-clock"></i>&nbsp;today
								</div>
								<div :class="{ supported: prop.supportedByCurrentUser }">
									<i :class="{'far': !prop.supportedByCurrentUser, 'fas': prop.supportedByCurrentUser}" class="fa-thumbs-up"></i>&nbsp;{{prop.numSupporters}}
								</div>
							</div>
						</div>
					</div>	
				</div>
			</b-card>
		</div>
	</div>
</template>

<script>

// import moment from 'moment'
// import pollPanel from "../components/poll-panel"

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
	//components: { pollPanel },
	data() {
		return {
			poll: {
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
						},
						{
							id: 2003,
							title: "Proposal Three with a very long title that will break more than three lines just to besure we make it very long",
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
							numSupporters: 92345,
							supportedByCurrentUser: true,
							createdBy: {
								id: 7002,
								email: "user4@liqudo.vote",
								profile: {
									name: "User4 Mobile",
									mobilephone: "#491234514",
									picture: "/img/avatars/Avatar4.png",
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
.poll-header {
	color: $primary;
	background-color: rgb(220, 236, 255);
	font-family: Georgia, 'Times New Roman', Times, serif;
	padding: 2rem;
	border-bottom: 1px solid $primary;
}
.poll-filter-wrapper {
	padding-top: 5px;
	padding-bottom: 5px;
	border-bottom: 1px solid $primary;
	.col:not(:last-child) {
		border-right: 1px solid $primary;
	}
	.active-filter {
		font-weight: bold;
		text-decoration: underline;
		//background-color: rgb(220, 236, 255);
	}
}

$avatar_size: 70px;

.poll-panel {
	.card-header {
		padding: 5px 10px;
	}
	.poll-proposal {
		margin: 0 10px;
		padding: 10px 0;
	}
	.poll-proposal:not(:last-child) {
		border-bottom: 1px dotted rgba(0, 0, 0, 0.125);	
	}
	.law-title {
		//TODO: break law-title after three lines:   https://codepen.io/romanrudenko/pen/ymHFh
		line-height: 1.2;
	}
	.law-image {
		float: left;
		border-radius: 5px;
		min-width: $avatar_size;
		max-width: $avatar_size;
		width: $avatar_size;
		min-height: $avatar_size;
		max-height: $avatar_size;
		height: $avatar_size;
		margin-right: 10px;
	}
	.subtitle {
		font-size: 10px;
		color: #BBB;
		//line-height: 10px;
	}
	.supported {
		color: green;
	}
	.goto-poll-icon {
		color: $primary;
		line-height: 1.5;   // was overwritten  by  "fas"
	}
}

</style>
