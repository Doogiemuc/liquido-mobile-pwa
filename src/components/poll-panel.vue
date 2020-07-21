<template>
	<b-card no-body class="poll-panel shadow mb-3" :pollid="poll.id">
		<template v-slot:header>
			<h3 v-if="readOnly" class="read-only"><i class="fas fa-poll"></i>&nbsp;{{poll.title}}</h3>
			<h3 v-else @click="goToPoll(poll.id)">
				<i class="fas fa-angle-double-right goto-poll-icon"></i>
				<i class="fas fa-poll"></i>&nbsp;{{poll.title}}
			</h3>
		</template>
		<div class="no-proposals" v-if="!poll.proposals || poll.proposals.length === 0">
			<p>{{$t('noProposalsInPollYet')}}</p>
			<div class="mb-1 text-right">
				<b-button variant="primary" @click="goToAddProposal(poll.id)">{{$t('addProposal')}} <i class="fas fa-angle-double-right"></i></b-button>
			</div>
		</div>
		<div class="law-panel" v-else v-for="law in poll.proposals" :key="law.id">
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
		<a v-if="poll.proposals && poll.proposals.length > 0" class="text-right collapse-icon" href="#" @click="toggleCollapse()">
			<i class="fa"></i>
		</a>
	</b-card>
</template>

<script>
import moment from "moment"

export default {
	i18n: {
		messages: {
			en: {

			},
			de:{
				noProposalsInPollYet: 'Es gibt bisher noch keine Wahlvorschläge oder Kandidaten in dieser Abstimmung.',
				addProposal: "Vorschlag hinzufügen",
			}
		}
	},
	name: "PollPanel",
	components: {},
	props: {
		poll: { type: Object, required: true },
		readOnly: { type: Boolean, required: false, default: false },
	},
	data() {
		return {}
	},
	mounted() {},
	computed: {
		
	},
	methods: {
		addProposal() {

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

		toggleCollapse() {
			$('.law-panel').toggleClass('collapse-law-panel')
			$('.collapse-icon').toggleClass('collapsed')
		},

		goToPoll(pollId) {
			if (!this.readOnly) this.$router.push("/polls/"+pollId)
		},

		goToAddProposal(pollId) {
			this.$router.push("/polls/"+pollId+"/addProposal")
		}
	},
}
</script>

<style lang="scss" scoped>
/* size of proposal image */
$avatar_size: 70px;

.poll-panel {
	.card-header {
		margin: 0;
		padding: 0;
		h3 {
			// same as .law-title
			color: $primary;
			margin: 5px 10px;
			font-size: 18px;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
		.read-only {
			color: black;
		}
	}
	.poll-proposal {
		margin: 0 10px;
		padding: 10px 0;
	}
	.poll-proposal:not(:last-child) {
		border-bottom: 1px dotted rgba(0, 0, 0, 0.125);	
	}
	.goto-poll-icon {
		line-height: 1.2;   // same as .card-header > h3
		float: right;
	}
  .collapse-icon {
		padding-right: 10px;
	}

	.no-proposals {
		padding: 10px;
	}

	// law-panel inside poll panel - list of proposals in poll
	.law-panel {
		height: 30px + 25px + $avatar_size + 15px;  // title + subtitle + avatar_img + padding
		overflow: hidden;
		padding: 10px;
		transition: height 0.5s;
		&.collapse-law-panel {
			height: 55px;
		}
		.law-title {
			margin-bottom: 5px;
			padding: 0;
			font-size: 18px;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
		.law-subtitle {
			font-size: 10px;
			color: #BBB;
			margin-bottom: 5px;
		}
		.flex-fixed-width {
			flex: 0 0 $avatar_size + 10px;
			//border: 1px solid red;
		}
		.law-image {
			border-radius: 5px;
			min-width: $avatar_size;
			max-width: $avatar_size;
			width: $avatar_size;
			min-height: $avatar_size;
			max-height: $avatar_size;
			height: $avatar_size;
			margin-right: 10px;
			
		}
		
		.law-description {
			font-size: 12px;
			height: $avatar_size;
			max-height: $avatar_size;
			overflow: hidden;
		}
		.supported {
			color: green;
		}
	}
	
}

.collapse-icon .fa:before {   
  content: "\f139";
}

.collapse-icon.collapsed .fa:before {
  content: "\f13a";
}

</style>
