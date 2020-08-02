<template>
	<div>
		<div class="container">
			<h2 class="page-title"><i class="fas fa-person-booth"></i>&nbsp;{{$t('castVoteTitle')}}</h2>

			<p>{{$t('castVoteInfo')}}</p>

			<div id="ballot" class="ballot">
				<h2 class="ballot-title">{{$t('yourBallot')}}</h2>
				<draggable 
					v-model="ballot"
					:swap-threshold="0.5"
					:delay="50"
					:animation="500"
					:canScrollX="false">

						<law-panel
							v-for="prop in ballot"
							class="mb-2 shadow-sm"
							:law="prop"
							:read-only="false"
							:key="prop.id"
						/>

				</draggable>
			</div>
		
			<div class="text-right mb-3">
				<b-button	variant="primary"	size="lg" @click="clickCastVote()">
					{{$t('castVote')}}&nbsp;<i class="fas fa-angle-double-right"></i>
				</b-button>
			</div>

			<div v-if="voteCastedSuccessfully" class="alert alert-success" v-html="$t('voteCastedSuccessfully')"></div>
			<div v-if="voteCastedError" class="alert alert-danger" v-html="$t('voteCastedError')"></div>

		</div>
	</div>
</template>

<script>
import liquidoHeader from "../components/liquido-header"
import lawPanel from "../components/law-panel"
//import Sortable from 'sortablejs'
import draggable from "vuedraggable"
import _ from 'lodash'

export default {
	i18n: {
		messages: {
			en: {
				castVoteTitle: 'Cast your vote',
				castVoteInfo: 'Please sort the proposals into your personally preferred order. With your favorite proposal at the top.',
				castVote: 'Cast vote',
				yourBallot: 'Your ballot',
			},
			de: {
				castVoteTitle: 'Abstimmen',
				castVoteInfo: 'Bitte sortiere die Vorschläge in die von dir favorisierte Reihenfolge. Mit deinem besten Favoriten ganz oben.',
				castVote: 'Diese Stimme abgeben',
				yourBallot: 'Dein Stimmzettel',
				voteCastedSuccessfully: "<p>Deine Stimme wurde erfolgreich gezählt.</p><p>In <span class='liquido'></span> kannst du deinen Stimmzettel auch jetzt noch ändern, so lange die Wahlphase dieser Abstimmung noch läuft.</p>"+
					"<p>Du erhälst eine Benachrichtigung, sobald die Abstimmung abgeschlossen ist. Dann kannst du das Ergebnis der Wahl sehen.</p>",
				voteCastedError: "Es gab leider einen technischen Fehler beim Abgeben deiner Stimme. Bitte versuche es später noch einmal."
			}
		}
	},
	components: { liquidoHeader, lawPanel, draggable },
	props: {
		'pollId': { type: String, required: true }
	},
  data() {
    return {
			poll: undefined,
			ballot: [],
			voteCastedSuccessfully: false,
			voteCastedError: false,
    }
  },
  created() {
		this.poll = this.$root.store.getPollById(this.pollId)
		if (!this.poll) throw new Error("Cannot find poll(id="+this.pollId+")")		//TODO: show user error message to user. offer back button
		this.ballot = _.cloneDeep(this.poll.proposals)
	},
  mounted() {},
  computed: {},
  methods: {
		clickCastVote() {
			this.voteCastedError = false
			this.voteCastedSuccessfully = false
			this.$api.castVote(this.poll.id, this.ballot)
				.then(poll => {
					console.log("Vote casted successfully")
					this.voteCastedSuccessfully = true
					this.scrollToBottom()
				})
				.catch(err => {
					console.error("Cannot cast vote", err)
					this.voteCastedError = true
					this.scrollToBottom()
				})
		},

		scrollToBottom() {
			this.$nextTick(() => {
				$("html, body").animate({ scrollTop: $(document).height() }, 1000);
			})
		},
	}
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
