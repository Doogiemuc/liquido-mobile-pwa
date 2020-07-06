<template>
	<div>
		<liquido-header></liquido-header>

		<div class="container-lg mt-3">
			
			<h2 class="my-3"><i class="fas fa-poll"></i> {{$t('newPoll')}}</h2>

			<b-card class="chat-bubble form-bubble">
				<liquido-input v-model="poll.title" id="pollTitleInput" :label="$t('pollTitle')" :state="pollTitleState" :invalidFeedback="$t('pollTitleInvalid')" @blur="pollTitleValidated = true"></liquido-input>

				<div class="d-flex justify-content-between align-items-center">
					<small class="ml-1"><a href="#" @click="cancelCreatePoll()">{{$t('cancel')}}</a></small>
					<b-button variant="primary" class="float-right" :disabled="pollTitleState !== true"  @click="clickSavePoll()">{{$t('save')}} <i class="fas fa-angle-double-right"></i></b-button>
				</div>

			</b-card>

			<b-card class="chat-bubble shadow-sm my-5" :class="{ 'hide-left': flowState < 1 }">
				<!-- a class="float-right px-1" data-toggle="collapse" href="#collapseInfo" role="button" aria-expanded="true" aria-controls="collapseOne">
					<i class="fa" aria-hidden="true"></i>
				</a -->
				<div id="collapseInfo" v-html="$t('createPollInfo')"></div>
			</b-card>
		</div>
	</div>
</template>

<script>

import liquidoHeader from '../components/liquido-header'
import liquidoInput  from '../components/liquido-input'

export default {
	i18n: {
		messages: {
			en: {
			},
			de: {
				newPoll: 'Neue Abstimmung',
				createPollInfo: '<p>Eine Abstimmung enthält mehrere Wahlvorschläge (<i class="fas fa-vote-yea"></i>). Jeder in deinem Team kann seine Idee zur Abstimmung hinzufügen.<p>'+
					 '<p>Bevor eine Idee (<i class="fas fa-lightbulb"></i>) jedoch zu einem gültigen Wahlvorschlag werden kann, muss sie erst genügend Unterstützer finden.</p>'+
					 '<p>Während der Elaborationsphase können Ideen und Vorschläge noch diskutiert (<i class="fas fa-comments"></i>) werden.</p>'+
					 '<p>Sobald die Wahlphase der Abstimmung eröffnet ist, könnt ihr wählen. (<i class="fas fa-person-booth"></i>)</p>',
				pollTitle: 'Titel der Abstimmung',
				pollTitleInvalid: 'Titel ist zu kurz. Bitte mind. 10 Zeichen.',

			}
		}
	},
	name: "createPollPage",
	components: { liquidoHeader, liquidoInput },
	data() {
		return {
			poll: {},
			pollTitleValidated: false,
			flowState: 0,
		}
	},
	created() {  
		//this.$root.store.setShowFooter(false)
	},
	mounted() {
		window.setTimeout(() => { this.flowState = 1}, 500)
	},
	computed: {
		pollTitleState() {
			 if (this.poll.title && this.poll.title.replace(/\s/g, '').length >= 10) return this.pollTitleValidated = true
			 return this.pollTitleValidated ? false : null
		},
	},
	methods: {

		

		clickSavePoll() {
		},

	},


}

</script>

<style lang="scss">
	.chat-bubble {
		position: relative;
		margin-bottom: 1rem;
		opacity: 1;
		transform: none;
		-webkit-transition: all 0.5s ease;
		-moz-transition: all 0.5s ease;
		-o-transition: all 0.5s ease;
		transition: all 0.5s ease;
		.card-body {
			padding: 0.5rem;
			ul {
				padding-inline-start: 25px;
			}
			input {
				width: 100%;
			}
			p:last-child {
				margin-bottom: 0;
			}
		}
	}
	.hide-left {
		opacity: 0;
		transform: translateX(-20px);
	}


	.form-bubble {
		background-color: $secondary-bg;
	}

	[data-toggle="collapse"] .fa:before {  
		content: "\f13a";
	}

	[data-toggle="collapse"].collapsed .fa:before {
		content: "\f139";
	}

	label {
		font-size: 14px;
		font-weight: bold;
		margin: 0;
		//color: rgb(86, 9, 109);
	}
</style>
