<template>
	<div>
		<h2 id="poll-create" class="page-title">
			<i class="fas fa-poll" />
			{{ $t("newPoll") }}
		</h2>

		<b-card class="chat-bubble input-bubble">
			<liquido-input
				id="pollTitleInput"
				v-model="pollTitle"
				:label="$t('pollTitle')"
				:valid-func="isPollTitleValid"
				:invalid-feedback="$t('pollTitleInvalid')"
				@blur="pollTitleValidated = true"
			/>

			<div class="d-flex justify-content-between align-items-center">
				<small class="ml-1">
					<a href="#" @click="cancelCreatePoll()">{{ $t("Cancel") }}</a>
				</small>
				<b-button
					id="createPollButton"
					:disabled="createPollButtonDisabled"
					variant="primary"
					class="float-right"
					@click="clickCreateNewPoll()"
				>
					{{ $t("create") }}
					<i class="fas fa-angle-double-right" />
				</b-button>
			</div>
		</b-card>

		<div class="alert alert-admin my-3">
			<div v-html="$t('createPollInfo')" />
		</div>
	</div>
</template>

<script>
import liquidoInput from "../components/liquido-input"

export default {
	i18n: {
		messages: {
			en: {},
			de: {
				newPoll: "Neue Abstimmung anlegen",
				createPollInfo:
					"<p>Nur du als Admin kannst neue Abstimmungen erstellen. Abstimmung laufen durch drei Phasen:</p>"+
					"<p>(1) Eine Abstimmung wird erst einmal diskutiert (<i class='fas fa-comments'></i>). Jeder aus deinem Team "+
					"kann in dieser Phase seinen eigenen Wahlvorschlag (<i class='fas fa-vote-yea'></i>) hinzufügen.</p>" +
					"<p>(2) Wenn du die Wahlphase der Abstimmung startest, kann jeder im Team seine Stimme anonym abgeben. (<i class='fas fa-person-booth'></i>)</p>" +
					"<p>(3) Nachdem du die Wahlphase beendet hast, ist das Wahlergebnis für alle sichtbar.",
				pollTitle: "Titel der Abstimmung",
				pollTitleInvalid: "Titel ist zu kurz. Bitte mind. 10 Zeichen.",
				create: "Anlegen",
			},
		},
	},
	name: "CreatePollPage",
	components: { liquidoInput },
	data() {
		return {
			pollTitle: "",
		}
	},
	computed: {
		createPollButtonDisabled() {
			return !this.isPollTitleValid(this.pollTitle)
		},
	},
	mounted() {
	},
	methods: {
		isPollTitleValid(val) {
			return val !== undefined && val !== null && val.trim().length >= 10
		},
		cancelCreatePoll() {
			this.$router.push("/polls")
		},
		clickCreateNewPoll() {
			return this.$api.createPoll(this.pollTitle)
				.then(createdPoll => this.$router.push("/polls/" + createdPoll.id))
				.catch(err => console.warn("Error", err))
		},
	},
}
</script>

<style lang="scss">

</style>
