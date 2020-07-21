<template>
	<div>
		<liquido-header></liquido-header>
		
		<div class="container">
			<h2 class="pageTitle">{{$t('addProposal')}}</h2>
			
			<div class="card input-bubble mb-3">
				<div class="card-header">
					{{$t('yourProposal')}}
				</div>
				<div class="card-body">
					<liquido-input id="propTitle" name="propTitle" :label="$t('title')" v-model="proposal.title" :state="titleState" :maxlength="500"></liquido-input>
					<textarea 
						id="descriptionId" 
						name="description" 
						class="form-control" 
						v-model="proposal.description"
						:class="descriptionValidClass" 
						:placeholder="$t('describeYourProposal')" 
						@blur="descriptionValidated = true"
						rows="3"></textarea>
					<div v-if="descriptionState === false" class="invalid-feedback">{{$t('descriptionTooShort')}}</div>
					<button type="button" class="btn btn-primary mt-3 float-right" :disabled="saveButtonDisabled" @click="saveProposal()">{{$t('save')}}</button>
				</div>
			</div>

			<h2 class="pageTitle mt-5">{{$t('thePoll')}}</h2>

			<poll-panel :poll="poll" class="shadow mb-3"></poll-panel>

		</div>
	</div>
</template>

<script>

import liquidoHeader from '../components/liquido-header'
import pollPanel from "../components/poll-panel"
import liquidoInput from "../components/liquido-input"

export default {
	i18n: {
		messages: {
			en: {
			},
			de: {
				addProposal: "Vorschlag zu Abstimmung hinzufügen",
				yourProposal: "Dein Vorschlag",
				thePoll: "Die Abstimmung",
				title: "Titel",
				describeYourProposal: "Beschreibe deinen Wahlvorschlag ...",
				descriptionTooShort: "Bitte beschreibe deinen Vorschlag ausführlicher.",
			}
		}
	},
	components: { pollPanel, liquidoHeader, liquidoInput },
	props: {
		pollId: { type: String, required: true }
	},
	data() {
		return {
			poll: {},
			proposal: {},
			titleValidated: false,
			descriptionValidated: false,
		}
	},
	created() {
		var p = this.$root.store.getPollById(this.pollId)
		this.poll = p;
	},
	mounted() {},
	computed: {
		titleState() {
			console.log("titleState", this.proposal.title)
			if (this.proposal.title && this.proposal.title.replace(/\s/g, '').length >= 10) return this.titleValidated = true
			return this.titleValidated ? false : null
		},
		descriptionState() {
			 if (this.proposal.description && this.proposal.description.replace(/\s/g, '').length >= 50) return this.descriptionValidated = true
			 return this.descriptionValidated ? false : null
		},
		descriptionValidClass() {
			return { 'is-valid' : this.descriptionState === true, 'is-invalid' : this.descriptionState === false }   // status === null will set no class at all
		},
		saveButtonDisabled() {
			return !this.titleState || !this.descriptionState
		}
	},
	methods: {
		saveProposal() {
			this.$root.store.saveProposal(poll.id, proposal)
		}
	},

}

</script>

<style lang="scss">
.pageTitle {
	font-size: 1.5rem;
	margin: 1rem 0;
	font-family: 'Libre Baskerville', serif;
}

.input-bubble {
	background-color: $secondary-bg;
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
</style>
