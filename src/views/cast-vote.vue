<template>
	<div class="container">
		<h2 class="page-title">
			<i class="fas fa-person-booth" />
			&nbsp;{{ $t("castVoteTitle") }}
		</h2>

		<p>{{ $t("castVoteInfo") }}</p>

		<div id="ballot" class="ballot">
			<h2 class="ballot-title">
				{{ $t("yourBallot") }}
			</h2>
			<draggable
				v-model="ballot"
				:swap-threshold="0.5"
				:delay="50"
				:animation="500"
				:can-scroll-x="false"
			>
				<law-panel
					v-for="prop in ballot"
					:key="prop.id"
					:law="prop"
					:read-only="true"
					:collapsed="true"
					class="mb-2 shadow-sm"
				/>
			</draggable>
		</div>

		<div class="text-right mb-3">
			<b-button variant="primary" :disabled="castVoteLoading" @click="clickCastVote()">
				<b-spinner v-if="castVoteLoading" small />
				<i v-if="voteCastedSuccessfully" class="far fa-check-circle" />
				{{ $t("castVote") }}
			</b-button>
		</div>

		<div
			v-if="voteCastedSuccessfully"
			class="alert alert-success"
			v-html="$t('voteCastedSuccessfully')"
		/>
		<div v-if="voteCastedError" class="alert alert-danger" v-html="$t('voteCastedError')" />

		<div v-if="voteCastedSuccessfully" class="text-right mb-3">
			<b-button variant="primary" @click="goToPoll()">
				{{ $t("ok") }}
				<i class="fas fa-angle-double-right" />
			</b-button>
		</div>
	</div>
</template>

<script>
import lawPanel from "../components/law-panel"
//import Sortable from 'sortablejs'
import draggable from "vuedraggable"
import _ from "lodash"

export default {
	i18n: {
		messages: {
			en: {
				castVoteTitle: "Cast your vote",
				castVoteInfo:
					"Please sort the proposals into your personally preferred order. With your favorite proposal at the top.",
				castVote: "Cast vote",
				yourBallot: "Your ballot",
			},
			de: {
				castVoteTitle: "Abstimmen",
				castVoteInfo:
					"Bitte sortiere die Vorschläge in die von dir favorisierte Reihenfolge. Mit deinem besten Favoriten ganz oben.",
				castVote: "Diese Stimme abgeben",
				yourBallot: "Dein Stimmzettel",
				voteCastedSuccessfully:
					"<p>Deine Stimme wurde erfolgreich gezählt.</p><p>In <span class='liquido'></span> kannst du deinen Stimmzettel "+
					"auch jetzt noch ändern, so lange die Wahlphase dieser Abstimmung noch läuft.</p>" +
					"<p>Du erhälst eine Benachrichtigung, sobald die Abstimmung abgeschlossen ist. Dann kannst du das Ergebnis der Wahl sehen.</p>",
				voteCastedError:
					"Es gab leider einen technischen Fehler beim Abgeben deiner Stimme. Bitte versuche es später noch einmal.",
			},
		},
	},
	components: { lawPanel, draggable },
	props: {
		pollId: { type: String, required: true },
	},
	data() {
		return {
			poll: undefined,
			ballot: [],
			castVoteLoading: false,
			voteCastedSuccessfully: false,
			voteCastedError: false,
		}
	},
	computed: {},
	created() {
		this.poll = this.$api.getPollById(this.pollId)
		if (!this.poll) throw new Error("Cannot find poll(id=" + this.pollId + ")") //TODO: show user error message to user. offer back button
		this.ballot = _.cloneDeep(this.poll.proposals)
	},
	mounted() {},
	methods: {
		clickCastVote() {
			this.voteCastedError = false
			this.voteCastedSuccessfully = false
			this.castVoteLoading = true
			this.$api
				.castVote(this.poll.id, this.ballot)
				.then(() => {
					console.log("Vote casted successfully")
					this.castVoteLoading = false
					this.voteCastedSuccessfully = true
					this.$root.scrollToBottom()
				})
				.catch((err) => {
					console.error("Cannot cast vote", err)
					this.castVoteLoading = false
					this.voteCastedError = true
					this.$root.scrollToBottom()
				})
		},

		goToPoll() {
			this.$router.go(-1)
		},
	},
}
</script>

<style lang="scss">
.ballot {
	padding: 1rem 0.5rem;
	margin: 0.5rem -0.5rem 1em -0.5rem;
	background: #f0f0f0;
	border-radius: 4px;
	border: 1px solid #e0e0e0;
}
.ballot-title {
	font-size: 1.5rem;
	text-align: center;
}
.law-panel {
	cursor: grab;
}
.sortable-ghost {
	opacity: 0.1;
}
</style>
