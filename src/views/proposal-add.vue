<template>
	<div>
		<div class="container">
			<h2 class="page-title">{{$t('addProposal')}}</h2>
			
			<div class="card input-bubble mb-3">
				<div class="card-header">
					{{$t('yourProposal')}}
				</div>
				<div class="card-body">
					<liquido-input 
						id="propTitle"
						name="propTitle"
						:label="$t('title')"
						v-model="proposal.title"
						:state="titleState"
						:invalidFeedback="$t('titleInvalid')"
						:maxlength="500"
						@blur="titleValidated = true"></liquido-input>
					<textarea 
						id="descriptionId" 
						name="description" 
						class="form-control" 
						v-model="proposal.description"
						:class="descriptionValidClass" 
						:placeholder="$t('describeYourProposal')" 
						@blur="descriptionValidated = true"
						rows="3"></textarea>
					<div v-if="descriptionState === null" class="text-small">{{$t('descriptionInfo', { minChars: descriptionMinLength } )}}</div>	
					<div v-if="descriptionState === false" class="invalid-feedback">{{$t('descriptionTooShort')}}</div>
					<button type="button" class="btn btn-primary mt-3 float-right" :disabled="saveButtonDisabled" @click="saveProposal()">{{$t('save')}} <i class="fas fa-angle-double-right"></i></button>
				</div>
			</div>

			<div v-if="isOnlyProposal" class="card">
				<div class="card-body">
					<p>{{$t('yoursIsOnlyProposal')}}</p>
				</div>
			</div>

			<h2 class="page-title mt-5">{{$t('thePoll')}}</h2>
			<poll-panel :poll="poll" :expanded="false" :read-only="true" class="shadow mb-3"></poll-panel>

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
				titleInvalid: "Titel zu kurz",
				describeYourProposal: "Beschreibe deinen Wahlvorschlag ...",
				descriptionInfo: "(Mindestes {minChars} Zeichen)",
				descriptionTooShort: "Bitte beschreibe deinen Vorschlag etwas ausführlicher.",
				firstProposal: "Das wird der erste Wahlvorschlag in dieser Abstimmung.",
				yoursIsOnlyProposal: "Dein Vorschlag ist bisher der einzige Wahlvorschlag in dieser Abstimmung.",
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
			descriptionMinLength: 20,
		}
	},
	created() {
		var p = this.$root.store.getPollById(this.pollId)
		this.poll = p;
	},
	mounted() { },
	computed: {
		titleState() {
			if (this.proposal.title && this.proposal.title.replace(/\s/g, '').length >= 5) return this.titleValidated = true
			return this.titleValidated ? false : null
		},
		descriptionState() {
			 if (this.proposal.description && this.proposal.description.replace(/\s/g, '').length >= this.descriptionMinLength) return this.descriptionValidated = true
			 return this.descriptionValidated ? false : null
		},
		descriptionValidClass() {
			return { 'is-valid' : this.descriptionState === true, 'is-invalid' : this.descriptionState === false }   // status === null will set no class at all
		},
		saveButtonDisabled() {
			return !this.titleState || !this.descriptionState
		},
		/** Is the user's proposal the only proposal in the poll. (This can only be true when editing an existing proposal.) */
		isOnlyProposal() {
			return this.poll.proposals && this.poll.proposals.length == 1 &&
						 this.poll.proposals[0].createdBy.email === this.$root.store.user.email
		}
	},
	methods: {
		saveProposal() {
			this.$root.store.saveProposal(this.poll, this.proposal).then(() => {
				this.$router.push("/polls/"+this.poll.id)
			})
		}
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
