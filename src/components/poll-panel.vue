<template>
	<b-card :id="pollCardId" :pollid="poll.id" no-body class="poll-panel shadow mb-3">
		<template #header>
			<h4 v-if="readOnly" class="read-only poll-panel-title">
				<i :class="iconForPoll" />
				&nbsp;{{ poll.title }}
			</h4>
			<h4 v-else class="poll-panel-title" @click="goToPoll(poll.id)">
				<i class="fas fa-angle-double-right goto-poll-icon" />
				<i :class="iconForPoll" />
				&nbsp;{{ poll.title }}
			</h4>
		</template>
		<div
			v-if="!poll.proposals || poll.proposals.length === 0"
			class="card-body"
		>
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
			<b-list-group-item v-for="law in poll.proposals" :key="law.id" class="proposal-list-group-item" :class="{'collapse-law-panel' : collapsed}">
				<div class="d-flex" @click="goToPoll(poll.id)">
					<div>
						<img :src="'https://picsum.photos/seed/' + law.id + '/100'" alt="Law image" class="law-image">
					</div>
					<div class="d-flex flex-column text-truncate">
						<h4 class="law-title">
							{{ law.title }}
						</h4>
						<div class="law-subtitle">
							<i class="far fa-clock" />&nbsp;{{ formatDate(law.createdAt) }}
							<i class="far fa-user" />&nbsp;{{ law.createdBy.name }}
							<div :class="{ supported: law.supportedByCurrentUser }" class="like-button">
								<i :class="{
										far: !law.supportedByCurrentUser,
										fas: law.supportedByCurrentUser,
									}"
									class="fa-thumbs-up"
								/>
								&nbsp;{{ law.numSupporters }}
							</div>
						</div>
					</div>
				</div>
				<div class="law-description" v-html="law.description"></div>
			</b-list-group-item>
		</b-list-group>
		<a
			v-if="poll.proposals && poll.proposals.length > 0"
			class="collapse-icon"
			:class="{'collapsed' : collapsed}"
			href="#"
			@click="toggleCollapse()"
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
		},
	},
	mounted() {
	},
	methods: {
		formatDate(dateVal) {
			return moment(dateVal).format("L")
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
	.card-header {
		margin: 0;
		padding: 0;
		background-color: $secondary-bg;
		h4 {
			// same as .law-title
			color: $primary;
			margin: 8px 10px;
			font-size: 14px;
			font-weight: bold;
			/* bootstraps .text-truncate does this for us
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			*/
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
		line-height: 1.2; // same as .card-header > h3
		float: right;
	}
	.collapse-icon {
		position: absolute;
		bottom: 5px;
		right: 10px;
		opacity: 0.5;
	}

	.card-body {
		padding: 10px;
	}

	// law-panel inside poll panel - list of proposals in poll
	.proposal-list-group-item {
		height: 8rem;  // 30px + 25px + $proposal_img_size + 15px; // title + subtitle + avatar_img + padding
		overflow: hidden;
		padding: 10px;
		background-color: $proposal-bg;
		transition: height 0.5s;
		&.collapse-law-panel {
			height: 18px + $proposal_img_size;
		}
		.law-title {
			margin-bottom: 0px;
			padding: 0;
			font-size: 14px;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
		.law-subtitle {
			font-size: 10px;
			color: #bbb;
			margin-bottom: 5px;
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
			margin-left: 0.5rem;
		}
		.supported {
			color: green;
		}
	}

	.proposal-separator {
		width: 100%;
		margin: 5px auto;
		border-top: 1px solid lightgrey;
	}
}

.collapse-icon .fa:before {
	content: "\f139";
}

.collapse-icon.collapsed .fa:before {
	content: "\f13a";
}
</style>
