<template>
	<div>
		<liquido-header></liquido-header>
		<div class="behind-header">&nbsp;</div>
		
		<div class="container mt-3">
			 <b-button-group class="filter-buttons shadow-sm">
				<b-button><i class="far fa-comments"></i><div class="icon-title">{{$t('elaboration')}}</div></b-button>
				<b-button class="active"><i class="fas fa-poll"></i><div class="icon-title">{{$t('inVoting')}}</div></b-button>
				<b-button><i class="fas fa-check"></i><div class="icon-title">{{$t('finished')}}</div></b-button>
			</b-button-group>
		</div>

		<div class="container mt-3 mb-5">
			<poll-panel :poll="poll" class="shadow mb-3"></poll-panel>
		</div>
	</div>
</template>

<script>

import moment from 'moment'
import liquidoHeader from '../components/liquido-header'
import pollPanel from "../components/poll-panel"

export default {
	i18n: {
		messages: {
			en: {
			},
			de: {
			}
		}
	},
	components: { pollPanel, liquidoHeader },
	data() {
		return {
			poll: {
				id: 101,
				title: "Example poll in voting with a very long titela asddfasdf dd",
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



/*
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
*/

</style>
