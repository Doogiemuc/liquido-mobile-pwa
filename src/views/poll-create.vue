<template>
	<div>
		<div class="container">
			<h2 class="page-title">
				<i class="fas fa-poll"></i>
				{{ $t("newPoll") }}
			</h2>

			<b-card class="chat-bubble form-bubble">
				<liquido-input
					id="pollTitleInput"
					v-model="poll.title"
					:label="$t('pollTitle')"
					:validFunc="isPollTitleValid"
					:invalid-feedback="$t('pollTitleInvalid')"
					@blur="pollTitleValidated = true"
				></liquido-input>

				<div class="d-flex justify-content-between align-items-center">
					<small class="ml-1">
						<a href="#" @click="cancelCreatePoll()">{{ $t("Cancel") }}</a>
					</small>
					<b-button
						:disabled="createPollButtonDisabled"
						variant="primary"
						class="float-right"
						@click="clickCreateNewPoll()"
					>
						{{ $t("create") }}
						<i class="fas fa-angle-double-right"></i>
					</b-button>
				</div>
			</b-card>

			<b-card class="chat-bubble shadow-sm my-5">
				<!-- a class="float-right px-1" data-toggle="collapse" href="#collapseInfo" role="button" aria-expanded="true" aria-controls="collapseOne">
					<i class="fa" aria-hidden="true"></i>
				</a-->
				<div v-html="$t('createPollInfo')"></div>
			</b-card>
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
				newPoll: "Neue Abstimmung",
				createPollInfo:
					'<p>Eine Abstimmung (<i class="fas fa-poll"></i>) enthält mehrere Wahlvorschläge (<i class="fas fa-vote-yea"></i>) und läuft über zwei Phasen:<p>' +
					'<p>(1) Während der Elaborationsphase kann jeder in deinem Team seinen Vorschlag zur Abstimmung hinzufügen. Diese können dann diskutiert (<i class="fas fa-comments"></i>) werden.</p>' +
					'<p>(2) Wenn du als Admin die Wahlphase der Abstimmung gestartet hast, dann kann jeder im Team seine Stimme abgeben. (<i class="fas fa-person-booth"></i>)</p>',
				pollTitle: "Titel der Abstimmung",
				pollTitleInvalid: "Titel ist zu kurz. Bitte mind. 10 Zeichen.",
				create: "Anlegen",
				createdSuccessfully: " erfolgreich angelegt",
			},
		},
	},
	name: "CreatePollPage",
	components: { liquidoInput },
	data() {
		return {
			poll: {},
		}
	},
	mounted() {
	},
	computed: {
		createPollButtonDisabled() {
			return !this.isPollTitleValid(this.poll.title)
		},
	},
	methods: {
		isPollTitleValid(val) {
			return val !== undefined && val !== null && val.trim().length >= 10
		},
		cancelCreatePoll() {
			this.$router.push("/polls")
		},
		clickCreateNewPoll() {
			this.$root.store.savePoll(this.poll).then((createdPoll) => this.$router.push("/polls/" + createdPoll.id))
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
	background-color: $input-bg;
}
</style>
