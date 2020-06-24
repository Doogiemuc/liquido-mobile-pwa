<template>
	<div>
		<div class="liquido-header shadow-sm">
			<div class="liquido-brand"><i class="fas fa-university"></i>&nbsp;<span class="liquido"></span></div>

			<ul id="navArrows" class="nav nav-arrows container-fluid" >
				<li><router-link active-class="active" to="/ideas" id="IdeasArrow">	<i class="far fa-comments"></i>&nbsp;Ideas</router-link></li>
				<li><router-link active-class="active" to="/proposals" id="ProposalsArrow"><i class="far fa-comments"></i>&nbsp;Proposals</router-link></li>
				<li class="active"><router-link active-class="active" to="/polls" id="PollsArrow"><i class="fas fa-poll"></i>&nbsp;Polls</router-link></li>
			</ul>
		</div>

		<div class="behind-header">&nbsp;</div>
		
		<div class="container mt-3">
			 <b-button-group class="filter-buttons shadow-sm">
				<b-button><i class="far fa-comments"></i><div class="icon-title">Discuss</div></b-button>
				<b-button class="active"><i class="fas fa-poll"></i><div class="icon-title">Vote</div></b-button>
				<b-button><i class="fas fa-check"></i><div class="icon-title">Finished</div></b-button>
			</b-button-group>
		</div>


		<div class="container mt-3 mb-5">

			<b-card no-body class="poll-panel shadow mb-3" :id="poll.id">
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

			<b-card no-body class="poll-panel shadow mb-3" :id="poll.id">
				<template v-slot:header>
					<i class="fas fa-poll"></i>&nbsp;{{poll.title}}
					<i class="float-right fas fa-angle-double-right goto-poll-icon"></i>
				</template>
				<div class="law-panel" v-for="law in poll.proposals" :key="law.id">
					<div>
						<h4 class="law-title"><i :class="getIconForLaw(law)" class="title-icon"></i>&nbsp;{{law.title}}</h4>
					</div>
					<div class="law-subtitle d-flex">
						<div class="createdAt flex-fixed-width">
							<i class="far fa-clock"></i>&nbsp;{{ formatDate(law.createdAt) }}
						</div>
						<div class="user">
							<i class="far fa-user"></i>&nbsp;{{ law.createdBy.profile.name }}
						</div>
						<div class="like-button flex-grow-1 text-right" :class="{ supported: law.supportedByCurrentUser }">
							<i :class="{'far': !law.supportedByCurrentUser, 'fas': law.supportedByCurrentUser}" class="fa-thumbs-up"></i>&nbsp;{{law.numSupporters}}
						</div>
					</div>
					<div class="d-flex">
						<div class="law-image flex-fixed-width">
							<img :src="'https://picsum.photos/seed/'+law.id+'/100'" alt="Image" class="law-image"/>
						</div>
						<div class="law-description">
							{{law.description}}
						</div>
					</div> 
				</div>
			</b-card>
		</div>
	</div>
</template>

<script>

import moment from 'moment'
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
	components: { moment },
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
									name: "User1longname Mobileasdf",
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
	mounted() {
		window.onscroll = () => this.transitionHeader();
	},
	computed: {},
	methods: {
		
		addDays(date, days) {
			var result = new Date(date);
			result.setDate(result.getDate() + days);
			return result;
		},

		getFromNow(dateVal) {
			return moment(dateVal).fromNow()
		},

		formatDate(dateVal) {
			return moment(dateVal).format("L")
		},

		getIconForLaw(law) {
			switch (law.status) {
				case "IDEA":
					return "far fa-lightbulb"
				case "PROPOSAL":
					return "far fa-file-alt"
				case "ELABORATION":
					return "far fa-comments"
				case "VOTING":
					return "fas fa-vote-yea"
				case "LAW":
					return "fas fa-balance-scale-left"
				case "DROPPED":
					return "far fa-window-close"
				case "RETENTION":
					return "fas fa-temperature-low"
				case "RETRACTED":
					return "fas fa-backspace"
				default:
					return "fas fa-university"
			}
		},

		transitionHeader() {
			var navHeight = 130;  // pixel
			if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
				$('.liquido-header').addClass('scrolled')
				$('#navArrows').addClass('scrolled')
			} else {
				$('.liquido-header').removeClass('scrolled')
				$('#navArrows').removeClass('scrolled')
			}
		}
	},

}

</script>

<style lang="scss">

$navHeight: 130px;

.liquido-header {
	position: fixed;
	top: 0;
	width: 100%;
	//height: $navHeight;
	z-index: 100;
	transition: 0.3s;  /* Add a transition effect when scrolling */
	color: $primary;
	background-color: rgb(220, 236, 255);
	border-bottom: 1px solid rgba(0,0,255, 0.3);
	text-align: center;

	.liquido-brand {
		font-size: 24px;
		font-weight: bold;
		margin: 1rem 0;
		transition: 0.3s;  /* Add a transition effect when scrolling */
	}
}

.liquido-header.scrolled {
	.liquido-brand {
		//height: 0;
		font-size: 0;
		margin: 5px 0 0 0;
	}
}

.behind-header {
	height: $navHeight;
	min-height: $navHeight;
}

/* Arrows for nav links */

$inactiveNavArrowBg: #fdfdff;

#navArrows {
	flex-wrap: nowrap;
	margin: 0 auto;
	justify-content: center;
	font-family: 'Libre Baskerville', serif;
	//font-family: Georgia, 'Times New Roman', Times, serif;
	margin-bottom: 1rem;
	padding-left: 15px;  // same as contianer-fluid. Was overwritten by .nav
	//min-width: 350px;	
	transition: 0.3s;
	@media (max-width: 350px) {
		font-size: 12px;
	}
}

#navArrows > li {
	margin: 0 12px;
	position: relative;
	flex-grow: 1;
	transition: 0.3s;
}
#navArrows a {
	display: block;
	color: $primary;
	height: 40px;
	line-height: 40px;   // vertically center text in arrows
	background-color: $inactiveNavArrowBg;
	transition: 0.3s;
}
#navArrows a:before {
	position: absolute;
	content: "";
	top: 0px;
	left: -19px;
	width: 0px;
	height: 0px;
	border-style: solid;
	border-width: 20px 0 20px 20px;
	border-color: $inactiveNavArrowBg $inactiveNavArrowBg $inactiveNavArrowBg transparent;
	z-index: 150;
	transition: 0.3s;
}
#navArrows a:after {
	position: absolute;
	content: "";
	top: 0px;
	right: -20px;
	width: 0px;
	height: 0px;
	border-style: solid;
	border-width: 20px 0 20px 20px;
	border-color: transparent transparent transparent $inactiveNavArrowBg;
	z-index: 150;
	transition: 0.3s;
}

/* Navbar arrows become smaller when user scrolled upwards */
#navArrows.scrolled {
	margin-bottom: 5px;
	a {
		height: 30px;
		line-height: 30px;
	}
	li {
		margin: 0 10px;
	}
	a:before {
		left: -15px;
		border-width: 15px 0 15px 15px;
	}
	a:after {
		right: -15px;
		border-width: 15px 0 15px 15px;
	}
}


/* Navbar arrows when active */
#navArrows li.active a  {
	color: white;
	background-color: $primary;
}
#navArrows li.active a:before {
	border-color: $primary $primary $primary transparent;
}
#navArrows li.active a:after {
	border-color: transparent transparent transparent $primary;
}


/* Navbar arrows when disabled */
#navArrows li.disabled a  {
	background-color: #ddd;
}
#navArrows li.disabled a:before {
	border-color:  #ddd #ddd #ddd transparent;
}
#navArrows li.disabled a:after {
	border-color: transparent transparent transparent #ddd;
}

.filter-buttons {
	width: 100%;
	button {
		color: $primary;
	  border: 1px solid rgba(0, 0, 0, 0.125);
		background-color: rgb(220, 236, 255); //$grey-light;
		font-size: 20px;
	}
	.icon-title {
		font-size: 10px;
		line-height: 1.0;
	}
	.btn-secondary:not(:disabled).active {
		color: white;
		background-color: $primary;
		border: 1px solid $primary;
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
		//line-height: 1.2;
		//height: 20px;
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
	.law-subtitle {
		font-size: 10px;
		color: #BBB;
		//line-height: 18px;
	}
	.supported {
		color: green;
	}
	.goto-poll-icon {
		color: $primary;
		line-height: 1.5;   // was overwritten  by  "fas"
	}
}

.law-panel {
	//height: 30px + 25px + $avatar_size + 15px;  // title + subtitle + avatar_img + padding
	//overflow: hidden;
	padding: 10px 10px 10px 10px;

	.flex-fixed-width {
		flex: 0 0 $avatar_size + 10px;
		//border: 1px solid red;
	}

	.law-title {
		margin-bottom: 3px;
		padding: 0;
		font-size: 18px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.title-icon {
		font-size: 80%;
	}

	.law-subtitle {
		font-size: 10px;
		//line-height: 15px;
		//height: 18px;
		//min-height: 18px;
		color: #BBB;
		margin-bottom: 5px;
		//border-bottom: 1px solid rgba(0, 0, 0, 0.1);;
		//-webkit-box-shadow: 0 0.1rem 0.2rem rgba(0, 0, 0, 0.1);
		//box-shadow: 0 0.1rem 0.2rem rgba(0, 0, 0, 0.1);
	}

	.law-image {
		//margin: 5px;
		border-radius: 5px;
		min-width: $avatar_size;
		max-width: $avatar_size;
		width: $avatar_size;
		min-height: $avatar_size;
		max-height: $avatar_size;
		height: $avatar_size;
	}

	.law-description {
		font-size: 12px;
		height: $avatar_size;
		max-height: $avatar_size;
		overflow: hidden;
	}
}

</style>
