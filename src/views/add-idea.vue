<template>
	<div class="container-lg">

		<p>{{$t('addIdea')}}</p>

		<b-card class="chat-bubble shadow-sm">  
			<form id="addIdeaForm">
				<liquido-input v-model="idea.title" id="ideaTitleInput" :label="$t('ideaTitle')" :status="titleStatus" @blur="titleValidated = true" :invalid-feedback="$t('titleInvalid')"></liquido-input>

				<div class="form-group">
					<label for="descriptionInput">{{$t('ideaDescription')}}</label>
					<b-form-input id="descriptionInput" v-model="idea.description" type="text" maxlength="1000" placeholder="Description" trim @blur="descriptionTouched = true"></b-form-input>
					<div class="invalid-feedback">{{$t('descriptionInvalid')}}</div>
				</div>

				<div class="d-flex justify-content-between align-items-center">
					<small class="ml-1"><a href="#" @click="cancelAddIdea()">{{$t('Cancel')}}</a></small>
					<b-button variant="primary" :disabled="addIdeaButtonDisabled" @click="addIdea()">{{$t('Add')}} <i class="fas fa-angle-double-right"></i></b-button>
				</div>
			</form>
		</b-card>
		
		
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
				ideaDescription: 'Describe your idea',
				titleInvalid: 'Please add a title for your idea',
				descriptionInvalid: 'Please describe your idea a bit more detailed!',
				Add: 'Add',
			},
			de: {
				addIdea: 'Hier kannst du deinen Wahlvorschlag für die Abstimmung als neue Idee hinzufügen.',
				ideaTitle: 'Titel deiner Idee',
				ideaDescription: 'Beschreibe deine Idee',
				titleInvalid: 'Titel benötigt',
				descriptionInvalid: 'Bitte beschreibe deine Idee etwas genauer!',
				Add: 'Speichern'
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
		titleStatus() {
			if (this.idea.title && this.idea.title.replace(/\s/g, '').length >= 4) return this.titleValidated = true
			return this.titleValidated ? false : null
		},

		addIdeaButtonDisabled() {
			return true;
		},

	},
	created() {},
	mounted() {},
	methods: {

	},
}

</script>

<style lang="scss">

.chat-bubble {
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

.chat-right {
	background-color: #e9fce9;
	margin-left: 2rem;
	margin-bottom: 1rem;
}

.transition-all {
	-webkit-transition: all 0.5s ease;
	-moz-transition: all 0.5s ease;
	-o-transition: all 0.5s ease;
	transition: all 0.5s ease;
}

.liquido-input {
	position: relative;
	padding-top: 12px;
	margin-bottom: 1rem;
	label {
		position: absolute;
		font-size: 1rem;
		top: 0;
		left: 5px;
		padding: 0 3px;
		background: white;
		border-radius: 5px;
	}
}

</style>
