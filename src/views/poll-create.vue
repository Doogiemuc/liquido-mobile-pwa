<template>
	<div>
		<liquido-header></liquido-header>

		<div class="container-lg mt-3">
			
			<b-card class="chat-bubble shadow-sm">
				<a class="float-right" data-toggle="collapse" href="#collapseInfo" role="button" aria-expanded="true" aria-controls="collapseOne">
					<i class="fa" aria-hidden="true"></i>
				</a>
				<div class="collapse show" id="collapseInfo" v-html="$t('createPollInfo')"></div>
			</b-card>

			<h2><i class="fas fa-poll"></i> {{$t('newPoll')}}</h2>

			<b-card class="chat-bubble form-bubble">
				<liquido-input v-model="poll.title" id="pollTitleInput" :label="$t('pollTitle')" :status="pollTitleStatus" @blur="pollTitleValidated = true"></liquido-input>
			</b-card>

			<b-button variant="primary" class="float-right mb-3" @click="clickSavePoll()">{{$t('Save')}}</b-button>

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
				createPollInfo: '<p>Eine Abstimmung hat einen Titel und besteht aus mehreren Wahlvorschlägen (<i class="fas fa-vote-yea"></i>). Jeder in deinem Team kann seine Idee zur Abstimmung hinzufügen.<p>'+
					 '<p>Bevor eine Idee (<i class="fas fa-lightbulb"></i>) jedoch zum Wahlvorschlag werden kann, muss sie erst genügend Unterstützer finden.</p>'+
					 'asfd',
				pollTitle: 'Titel der Abstimmung',
				pollTitleInvalid: 'Titel ist zu kurz',

			}
		}
	},
	name: "createPollPage",
	components: { liquidoHeader, liquidoInput },
	data() {
		return {
			poll: {},
			pollTitleValidated: false,

		}
	},
	created() {},
	mounted() {},
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
