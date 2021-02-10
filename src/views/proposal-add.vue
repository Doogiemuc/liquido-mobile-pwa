<template>
	<div>
		<h2 class="page-title">
			{{ $t("addProposal") }}
		</h2>

		<div class="card input-bubble mb-5">
			<div class="card-header">
				{{ $t("yourProposal") }}
			</div>
			<div class="card-body">
				<liquido-input
					id="propTitle"
					v-model="proposal.title"
					:label="$t('title')"
					:valid-func="isProposalTitleValid"
					:invalid-feedback="$t('titleInvalid', {minChars: titleMinLength})"
					:maxlength="500"
					name="propTitle"
				/>

				<textarea
					id="propDescription"
					v-model="proposal.description"
					:class="descriptionValidClass"
					:placeholder="$t('describeYourProposal')"
					name="description"
					class="form-control"
					rows="3"
					@blur="validateDescription()"
					@keyup="validateDescription()"
				/>

				<div class="text-small ml-2">
					{{ descriptionCharCounter }}
				</div>
				<div v-if="descriptionState === false" class="invalid-feedback">
					{{ $t("descriptionTooShort") }}
				</div>

				<div class="d-flex justify-content-between align-items-center">
					<small class="ml-1">
						<a href="#" @click="cancelAddProposal()">{{ $t("Cancel") }}</a>
					</small>
					<button
						id="saveProposalButton"
						:disabled="saveButtonDisabled"
						type="button"
						class="btn btn-primary"
						@click="saveProposal()"
					>
						{{ $t("Save") }}
					</button>
				</div>
			</div>
		</div>

		<div v-if="!poll.proposals || poll.proposals.length == 0" class="alert alert-secondary mb-3">
			<i class="fas fa-info-circle float-right" />
			<p v-html="$t('noProposalYet', {pollTitle: poll.title})" />
		</div>

		<div v-if="poll && poll.proposals && poll.proposals.length > 0">
			<poll-panel
				:poll="poll"
				:expanded="false"
				:read-only="true"
				class="shadow mb-3"
			/>
		</div>

		<b-modal id="proposalSuccessfullyAddedModal" 
			title="Danke"
			hide-header-close
			no-close-on-esc
			no-close-on-backdrop 
			header-bg-variant="success"
			header-text-variant="light"
			body-bg-variant="success"
			body-text-variant="light"
			footer-bg-variant="success"
			footer-text-variant="light"
		>
			{{ $t('createdSuccessfully') }}
			<template #modal-footer="{}">
				<b-button id="createdSuccessfullyButton" variant="primary" @click="gotoPoll()">
					{{ $t('gotoPoll') }}&nbsp;<i class="fas fa-angle-double-right"></i>
				</b-button>
			</template>
		</b-modal>
	</div>
</template>

<script>
import pollPanel from "../components/poll-panel"
import liquidoInput from "../components/liquido-input"

export default {
	i18n: {
		messages: {
			en: {},
			de: {
				addProposal: "Vorschlag zur Abstimmung hinzufügen",
				yourProposal: "Dein neuer Vorschlag",
				title: "Titel",
				titleInvalid: "Titel zu kurz: Bitte mindestens {minChars} Zeichen!",
				describeYourProposal: "Beschreibe deinen Wahlvorschlag ...",
				descriptionInfo: "(Mindestes {minChars} Zeichen)",
				descriptionTooShort: "Bitte beschreibe deinen Vorschlag etwas ausführlicher.",
				noProposalYet: "Die Abstimmung '{pollTitle}' enthält bisher noch keine Wahlvorschläge. Deine Vorschlag wird der Erste sein.",
				createdSuccessfully: "Dein Vorschlag wurde zur Abstimmung mit aufgenommen",
				gotoPoll: "Zur Abstimmung",
			},
		},
	},
	components: { pollPanel, liquidoInput },
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
			descriptionState: null,
		}
	},
	computed: {
		descriptionCharCounter() {
			if (this.proposal.description) {
				return this.proposal.description.length + "/" + this.descriptionMinLength
			} else {
				return "0/"+this.descriptionMinLength
			}
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
	},
	created() {
		this.$api.getPollById(this.pollId, true).then(poll => this.poll = poll)
	},
	mounted() {},
	methods: {
		isProposalTitleValid(val) {
			return val !== undefined && val !== null && val.trim().length >= this.titleMinLength
		},

		/** validate description. Only set to invalid, and show error message, if it description been valid before. */
		validateDescription() {
			if (this.proposal.description &&	this.proposal.description.trim().length >= this.descriptionMinLength) {
				this.descriptionState = true
			} else {
				if(this.descriptionState !== null ) this.descriptionState = false
			}
			
		},

		cancelAddProposal() {
			this.$router.push("/polls")
		},

		saveProposal() {
			this.$api.addProposal(this.poll.id, this.proposal.title, this.proposal.description)
				.then(() => this.$bvModal.show("proposalSuccessfullyAddedModal"))
				.catch(err => {
					console.error("Cannot add proposal", err)
				})
		},

		gotoPoll() {
			this.$router.push("/polls/" + this.poll.id)
		}
	}

}
</script>

<style lang="scss">
</style>
