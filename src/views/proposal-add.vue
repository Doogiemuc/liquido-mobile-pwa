<template>
	<div>
		<h2 class="page-title">{{ $t("addProposal") }}</h2>

		<div class="card input-bubble mb-3">
			<div class="card-header">{{ $t("yourProposal") }}</div>
			<div class="card-body">
				<liquido-input
					id="propTitle"
					:label="$t('title')"
					v-model="proposal.title"
					:validFunc="isProposalTitleValid"
					:invalid-feedback="$t('titleInvalid', {minChars: titleMinLength})"
					:maxlength="500"
					name="propTitle"
				></liquido-input>
				<textarea
					id="descriptionId"
					v-model="proposal.description"
					:class="descriptionValidClass"
					:placeholder="$t('describeYourProposal')"
					name="description"
					class="form-control"
					rows="3"
					@blur="descriptionValidated = true"
				></textarea>
				<div v-if="descriptionState === null" class="text-small">
					{{ $t("descriptionInfo", { minChars: descriptionMinLength }) }}
				</div>
				<div v-if="descriptionState === false" class="invalid-feedback">
					{{ $t("descriptionTooShort") }}
				</div>
				<button
					:disabled="saveButtonDisabled"
					type="button"
					class="btn btn-primary mt-3 float-right"
					@click="saveProposal()"
				>
					{{ $t("Save") }}
					<i class="fas fa-angle-double-right"></i>
				</button>
			</div>
		</div>

		<div v-if="isOnlyProposal" class="card">
			<div class="card-body">
				<p>{{ $t("yoursIsOnlyProposal") }}</p>
			</div>
		</div>

		<div v-if="poll.proposals && poll.proposals.length > 0">
			<h2 class="page-title mt-5">{{ $t("thePoll") }}</h2>
			<poll-panel
				:poll="poll"
				:expanded="false"
				:read-only="true"
				class="shadow mb-3"
			></poll-panel>
		</div>
		
	</div>
</template>

<script>
import liquidoHeader from "../components/liquido-header"
import pollPanel from "../components/poll-panel"
import liquidoInput from "../components/liquido-input"

export default {
	i18n: {
		messages: {
			en: {},
			de: {
				addProposal: "Vorschlag zu Abstimmung hinzufügen",
				yourProposal: "Dein Vorschlag",
				thePoll: "Die Abstimmung",
				title: "Titel",
				titleInvalid: "Titel zu kurz. Mindestens {minChars} Zeichen!",
				describeYourProposal: "Beschreibe deinen Wahlvorschlag ...",
				descriptionInfo: "(Mindestes {minChars} Zeichen)",
				descriptionTooShort:
					"Bitte beschreibe deinen Vorschlag etwas ausführlicher.",
				yoursIsOnlyProposal:
					"Dein Vorschlag ist bisher der einzige Wahlvorschlag in dieser Abstimmung.",
			},
		},
	},
	components: { pollPanel, liquidoHeader, liquidoInput },
	props: {
		pollId: { type: String, required: true },
	},
	data() {
		return {
			poll: {},
			proposal: {},
			titleMinLength: 10,
			descriptionValidated: false,
			descriptionMinLength: 20,
		}
	},
	created() {
		this.$api.getPollById(this.pollId, true).then(poll => this.poll = poll)
	},
	mounted() {},
	computed: {
		descriptionState() {
			if (
				this.proposal.description &&
				this.proposal.description.trim().length >= this.descriptionMinLength
			)
				return (this.descriptionValidated = true)
			return this.descriptionValidated ? false : null
		},
		descriptionValidClass() {
			return {
				"is-valid": this.descriptionState === true,
				"is-invalid": this.descriptionState === false,
			} // status === null will set no class at all
		},
		saveButtonDisabled() {
			return !this.isProposalTitleValid(this.proposal.title) || !this.descriptionState
		},
		/** Is the user's proposal the only proposal in the poll. (This can only be true when editing an existing proposal.) */
		isOnlyProposal() {
			return (
				this.poll.proposals &&
				this.poll.proposals.length === 1 &&
				this.poll.proposals[0].createdBy.email === this.$root.store.user.email
			)
		},
	},
	methods: {
		isProposalTitleValid(val) {
			return val !== undefined && val !== null && val.trim().length >= this.titleMinLength
		},
		saveProposal() {
			this.$api.saveProposal(this.poll.id, this.proposal).then(() => {
				this.$router.push("/polls/" + this.poll.id)
			})
		},
	},
}
</script>

<style lang="scss">
.input-bubble {
	background-color: $input-bg;
	.card-header {
		padding: 10px;
	}
	.card-body {
		padding: 10px;
	}
	.description-textarea {
		width: 100%;
	}
}

.text-small {
	font-size: 80%;
	color: $secondary;
}
</style>
