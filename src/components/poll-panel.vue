<template>
	<b-card 
		:id="pollCardId"
		:pollid="poll.id"
		:data-poll-status="poll.status"
		no-body
		class="poll-panel" 
		@click="goToPoll(poll.id)"
	>
		<template #header>
			<h1 v-if="readOnly" class="read-only poll-panel-title">
				<i :class="iconForPoll" />
				&nbsp;{{ poll.title }}
			</h1>
			<h1 v-else class="poll-panel-title">
				<i class="fas fa-angle-double-right goto-poll-icon" />
				<i :class="iconForPoll" />
				&nbsp;{{ poll.title }}
			</h1>
		</template>
		<div v-if="!poll.proposals || poll.proposals.length === 0" class="card-body">
			<p class="text-secondary">
				<small>{{ $t("noProposalsInPollYet") }}</small>
			</p>
			<div v-if="showAddProposalButton" class="mb-1 text-right">
				<b-button variant="primary" @click="goToAddProposal(poll.id)">
					{{ $t("addProposal") }}
					<i class="fas fa-angle-double-right" />
				</b-button>
			</div>
		</div>

		<b-list-group v-else flush>
			<b-list-group-item v-for="law in poll.proposals" :key="law.id" class="proposal-list-group-item" :class="proposalListGroupItemClasses(law.id)">
				<div class="proposal-header d-flex" @click="goToPoll(poll.id)">
					<div>
						<img :src="'https://picsum.photos/seed/' + law.id + '/100'" alt="Law image" class="law-image">
					</div>
					<div class="proposal-header-text d-flex flex-column text-truncate">
						<h2 class="law-title">
							{{ law.title }}
						</h2>
						<div class="law-subtitle">
							<div :class="{ supported: law.supportedByCurrentUser }" class="like-button">
								<i :class="{
										far: !law.supportedByCurrentUser,
										fas: law.supportedByCurrentUser,
									}"
									class="fa-thumbs-up"
								/>
								&nbsp;{{ law.numSupporters }}
							</div>
							<i class="created-date far fa-clock" />&nbsp;{{ formatDate(law.createdAt) }}
							<i class="createdby-user far fa-user" />&nbsp;{{ law.createdBy.name }}
						</div>
					</div>
				</div>
				<div class="law-description" v-html="law.description"></div>
				<div class="proposal-separator"></div>
			</b-list-group-item>
		</b-list-group>
		<a
			v-if="poll.proposals && poll.proposals.length > 0"
			class="collapse-icon"
			:class="{'collapsed' : collapsed}"
			href="#"
			@click.stop.prevent="toggleCollapse()"
		>
			<i class="fa" />
		</a>
	</b-card>
</template>

<script>
import moment from "moment"

export default {
	i18n: {
		messages: {
			en: {},
			de: {
				noProposalsInPollYet: "Diese Abstimmung enthält bisher noch keine Wahlvorschläge oder Kandidat*innen.",
				addProposal: "Vorschlag hinzufügen",
			},
		},
	},
	name: "PollPanel",
	components: {},
	props: {
		poll: { type: Object, required: true },
		readOnly: { type: Boolean, required: false, default: false },
		showAddProposalButton: { type: Boolean, required: false, default: false },
		collapse: { type: Boolean, required: false, default: false },
	},
	data() {
		return {
			collapsed: this.collapse
		}
	},
	computed: {
		pollCardId() { return "PollCard_"+this.poll.id },
		iconForPoll() {
			if (!this.poll) return undefined
			switch (this.poll.status) {
				case "ELABORATION":
					return "far fa-comments"   // or fa-poll?
				case "VOTING":
					return "fas fa-person-booth"    // or fa-vote-yea?
				case "FINISHED":
					return "fas fa-university"
				default:
					return "far fa-poll"
			}
		}
	},
	mounted() {
		//console.log("poll panel", this.poll)
	},
	methods: {
		formatDate(dateVal) {
			return moment(dateVal).format("L")
		},

		proposalListGroupItemClasses(propId) {
			let isWinner = this.poll.winner && propId === this.poll.winner.id
			return {
				"collapsed-law-panel" : this.collapsed,
				"winner": this.poll.status === "FINISHED" && isWinner,
				"lost": this.poll.status === "FINISHED" && !isWinner,
			}
		},

		toggleCollapse() {
			this.collapsed = !this.collapsed
		},

		goToPoll(pollId) {
			if (!this.readOnly) this.$router.push("/polls/" + pollId)
		},

		goToAddProposal(pollId) {
			this.$router.push("/polls/" + pollId + "/add")
		},
	},
}
</script>

<style lang="scss" scoped>
/* size of proposal image */
$proposal_img_size: 32px;

.poll-panel {
	&:not(.read-only) {
		cursor: pointer;
	}

	.card-header {
		margin: 0;
		padding: 0;
		background-color: $secondary-bg;
		border-bottom: none;
		.poll-panel-title {
			// same as .law-title
			color: $primary;
			margin: 8px 10px;
			font-size: 1.0rem !important;
			font-weight: bold;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
	}
		
	.goto-poll-icon {
		line-height: 1.2; // same as .card-header > h3
		float: right;
	}
	.collapse-icon {
		position: absolute;
		font-size: 1.2rem;
		bottom: 0;
		right: 3px;
		opacity: 0.5;
	}

	.collapse-icon .fa:before {
		content: "\f139";
	}

	.collapse-icon.collapsed .fa:before {
		content: "\f13a";
	}

	.card-body {
		padding: 10px;
	}

	// law-panel inside poll panel - list of proposals in poll
	.proposal-list-group-item {
		height: 8rem;
		overflow: hidden;
		padding: 10px;
		background-color: $proposal-bg;
		transition: height 0.5s;
		border: none;
		//box-shadow: inset 0 1px 3px rgba(0,0,0, 0.125);
		&.collapsed-law-panel {
			height: 18px + $proposal_img_size;
		}			
		.proposal-header-text {
			margin-bottom: 5px;
		}
		.law-title {
			margin-bottom: 0px;
			padding: 0;
			font-size: 0.8rem !important;
			line-height: 18px;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
		.law-subtitle {
			font-size: 10px;
			color: #bbb;
		}
		.law-image {
			border-radius: 5px;
			min-width: $proposal_img_size;
			max-width: $proposal_img_size;
			width: $proposal_img_size;
			min-height: $proposal_img_size;
			max-height: $proposal_img_size;
			height: $proposal_img_size;
			margin-right: 10px;
		}

		.law-description {
			font-size: 12px;
			overflow: hidden;
		}
		.like-button {
			display: inline;
		}
		.supported {
			color: green;
		}
		.created-date {
			margin-left: 5px;
		}
		.createdby-user {
			margin-left: 5px;
		}
	}

	.winner {
		background-color: $header-bg;
	}

	.lost {
		color: grey;
		.law-title {
			text-decoration: line-through;
		}
		.law-image {
			opacity: 0.5;
		}
		&.collapsed-law-panel {
			height: 0;
			margin: 0;
			padding: 0;
		}
	}

	.proposal-list-group-item:not(:first-child):not(.collapsed-law-panel) .proposal-separator {
		position: absolute;
		left: 10px;
		right: 10px;
		top: 1px;
		border-top: 1px solid rgba(0,0,0, 0.1)
	}
}

</style>
