	<template>
	<div class="container-lg">

		<div class="alert alert-primary" v-html="$t('addIdea')"></div>

		<b-card class="chat-bubble shadow-sm">  
			<i class="far fa-lightbulb lightbulb-bg"></i>
			<form id="addIdeaForm">
				<liquido-input v-model="idea.title" id="ideaTitleInput" :label="$t('ideaTitle')" :state="titleState" @blur="titleValidated = true" :invalid-feedback="$t('titleInvalid')"></liquido-input>

				<div class="form-group">
					<b-form-textarea id="descriptionInput" v-model="idea.description" :placeholder="$t('describeYourIdea')" :state="ideaDescriptionState"  rows="3" max-rows="10" @blur="descriptionValidated = true"></b-form-textarea>
					<div class="invalid-feedback">{{$t('descriptionInvalid')}}</div>
				</div>

				<div class="form-group">
					<b-form-file id="ideaImageInput" accept="image/jpeg, image/png, image/gif" :placeholder="$t('addImage')"></b-form-file>
				</div>
			</form>
		</b-card>

		<div class="text-right">
			<b-button variant="primary" :disabled="addIdeaButtonDisabled" @click="saveIdea()">{{$t('save')}} <i class="fas fa-angle-double-right"></i></b-button>
		</div>

	</div>
</template>

<script>

import liquidoInput from '../components/liquido-input'

export default {
	i18n: {
		messages: {
			en: {
				addIdea: 'Here you can add your proposal to the poll as a new idea',
				ideaTitle: 'Idea Title',
				describeYourIdea: 'Describe your idea ...',
				titleInvalid: 'Please add a title for your idea',
				descriptionInvalid: 'Please describe your idea a bit more detailed!',
				addImage: 'Add image or graphic',
				save: 'Save idea',
			},
			de: {
				addIdea: 'Hier kannst du eine neue <b>Idee</b>(<i class="far fa-lightbulb"></i>) hinzufügen. Wenn deine Idee genügend Unterstützer findet, wird sie zum <b>Wahlvorschlag</b>(<i class="fas fa-vote-yea"></i>). Über mehrere alternative Vorschläge könnt ihr dann in einer <b>Wahl</b>(<i class="fas fa-person-booth"></i>) abstimmen.',
				ideaTitle: 'Titel deiner Idee',
				describeYourIdea: 'Beschreibe deine Idee ...',
				titleInvalid: 'Titel benötigt',
				descriptionInvalid: 'Bitte beschreibe deine Idee etwas genauer!',
				addImage: 'Bild/Grafik hinzufügen',
				save: 'Idee speichern'
			}
		}
	},
	name: "IndexComponent",
	components: { liquidoInput },
	data() {
		return {
			idea: {
				id: undefined,
				title: undefined,
				description: undefined,
			},
			titleValidated: false,
			descriptionValidated: false,
		}
	},
	
	computed: {
		titleState() {
			if (this.idea.title && this.idea.title.replace(/\s/g, '').length >= 4) return this.titleValidated = true
			return this.titleValidated ? false : null
		},

		ideaDescriptionState() {
			if (this.idea.description && this.idea.description.replace(/\s/g, '').length >= 40) return this.descriptionValidated = true
			return this.descriptionValidated ? false : null
		},

		addIdeaButtonDisabled() {
			return !this.titleState || !this.ideaDescriptionState;
		},

	},
	created() {},
	mounted() {},
	methods: {
		saveIdea() {
			console.log("")
		}
	},
}

</script>

<style lang="scss">

.chat-bubble {
	z-index: 10;
	background-color: #FBFBFB;
	margin-bottom: 1rem;
	opacity: 1;
	transform: none;
	max-height: 1000px;
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
	}
}

.lightbulb-bg{
	position: absolute;
	top: 5px;
	left: 50%;
	transform: translateX(-50%);
	font-size: 14rem;
	color: rgba(0,0,0,0.1);
	z-index: -1;
}

#descriptionInput, #ideaTitleInput, #ideaImageInput {
	background-color: rgba(255,255,255,0.8);
}

</style>
