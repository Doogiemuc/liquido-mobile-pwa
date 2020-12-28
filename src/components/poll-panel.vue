<template>
	<b-card :pollid="poll.id" no-body class="poll-panel shadow mb-3">
		<template #header>
			<h4 v-if="readOnly" class="read-only poll-panel-title">
				<i class="fas fa-poll" />
				&nbsp;{{ poll.title }}
			</h4>
			<h4 v-else class="poll-panel-title" @click="goToPoll(poll.id)">
				<i class="fas fa-angle-double-right goto-poll-icon" />
				<i class="fas fa-poll" />
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
			<b-list-group-item v-for="law in poll.proposals" :key="law.id" class="proposal-list-group-item">
				<div class="d-flex">
					<div>
						<img :src="'https://picsum.photos/seed/' + law.id + '/100'" alt="Law image" class="law-image">
					</div>
					<div class="d-flex flex-column">
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
		expanded: { type: Boolean, required: false, default: true },
	},
	data() {
		return {}
	},
	computed: {},
	mounted() {
		if (!this.expanded) this.toggleCollapse() // collapse the proposal descriptions when initially not expanded. This is animated!
	},
	methods: {
		addProposal() {},

		formatDate(dateVal) {
			return moment(dateVal).format("L")
		},

		/*
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
		*/

		toggleCollapse() {
			$(".proposal-list-group-item").toggleClass("collapse-law-panel")
			$(".collapse-icon").toggleClass("collapsed")
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
/* size of law proposal image */
$avatar_size: 32px;

.poll-panel {
	.card-header {
		margin: 0;
		padding: 0;
		h4 {
			// same as .law-title
			color: $primary;
			margin: 8px 10px;
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
		height: 8rem;  // 30px + 25px + $avatar_size + 15px; // title + subtitle + avatar_img + padding
		overflow: hidden;
		padding: 10px;
		transition: height 0.5s;
		&.collapse-law-panel {
			height: 55px;
		}
		.law-title {
			margin-bottom: 0px;
			padding: 0;
			font-size: 18px;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
		.law-subtitle {
			font-size: 10px;
			color: #bbb;
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
