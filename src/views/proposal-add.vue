<template>
	<div>
		<h2 id="addProposalTitle" class="page-title">
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
					name="propTitle"
					class="mb-3"
					:label="$t('title')"
					:valid-func="isProposalTitleValid"
					:invalid-feedback="$t('titleInvalid', {minChars: titleMinLength})"
					:maxlength="500"
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
					<span class="cancel-link" @click="goBack">{{ $t("Cancel") }}</span>
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

		<popup-modal
			id="proposalSuccessfullyAddedModal"
			ref="proposalSuccessfullyAddedModal"
			type="success"
			:message="$t('createdSuccessfully')"
			:primary-button-text="$t('gotoPoll')"
			@clickPrimary="gotoPoll"
		>
		</popup-modal>

		<popup-modal 
			id="proposalAddErrorModal"
			ref="proposalAddErrorModal"
			type="error"
			:message="$t('proposalAddError')"
		></popup-modal>
	</div>
</template>

<script>
import pollPanel from "../components/poll-panel"
import liquidoInput from "../components/liquido-input"
import popupModal from "@/components/popup-modal"

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
				noProposalYet: "Die Abstimmung '{pollTitle}' enthält bisher noch keine Wahlvorschläge. Dein Vorschlag wird der Erste sein.",
				createdSuccessfully: "Ok, dein Vorschlag wurde in die Abstimmung mit aufgenommen.",
				proposalAddError: "Es gab einen Fehler beim Hinzufügen deines Vorschlages.",
				gotoPoll: "Zur Abstimmung",
			},
		},
	},
	components: { pollPanel, liquidoInput, popupModal },
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

		saveProposal() {
			this.$api.addProposal(this.poll.id, this.proposal.title, this.proposal.description)
				.then(() => this.$refs["proposalSuccessfullyAddedModal"].show())
				.catch(err => {
					console.error("Cannot add proposal", err)
					this.$refs["proposalAddErrorModal"].show()
				})
		},

		/** Called on successfull save. */
		gotoPoll() {
			this.$router.push("/polls/" + this.poll.id)
		},
		
		goBack() {
			this.$router.go(-1)
		},
	}

}
</script>

<style lang="scss">
.cancel-link {
	font-size: 12px;
	color: $secondary;
	margin-left: 0.5em;
	cursor: pointer;
}
</style>
