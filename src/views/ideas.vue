<template>
	<div>
		<liquido-header></liquido-header>
		<div class="mb-1">&nbsp;</div>

		<div v-if="ideas.length > 3" class="container mb-3">
			 <liquido-input v-model="searchTitle" id="searchInput" :label="$t('Search')" :status="null">
				 <template v-slot:iconRight>
					 <i class="fas fa-times mr-1" @click="clearSearch()"></i>
				 </template>
			 </liquido-input>
		</div>

		<div class="container mb-3">
			<law-panel v-for="idea in filteredIdeas" :law="idea" :key="idea.id" class="shadow-sm mb-3"></law-panel>
		</div>

		<div class="container mb-3">
			<div v-if="filteredIdeas.length === 0" class="alert alert-primary" v-html="$t('noIdeas')"></div>
			<div v-else class="alert alert-primary" v-html="$t('addIdeaHint')"></div>
		</div>
	</div>
</template>

<script>

import moment from 'moment'
import liquidoHeader from '../components/liquido-header'
import liquidoInput from '../components/liquido-input'
import lawPanel from "../components/law-panel"

export default {
	i18n: {
		messages: {
			en: {
				Search: "Search",
				noIdeas: "There are no <b>ideas</b> yet. You can add your idea here with the lightbulb below. When your idea receives enough likes, then it will become a <b>proposal</b>. In a <p>poll</p> you can then vote on your and other proposals.",
				addIdeaHint: "To add your idea here, just click the lightbulb below."
			},
			de: {
				Search: "Suche",
				noIdeas: "Momentan gibt es noch keine <b>Ideen</b>. Mit der Glühbirne unten kannst du deine Idee hier hinzufügen. When deine Idee genügend likes erhält, dann wird sie zu einem <b>Vorschlag</b>. In einer <b>Wahl</b> könnt ihr dann über deinen und andere Vorschläge abstimmen.",
				addIdeaHint: "Um deine Idee hier hinzuzufügen, klicke einfach auf die Glühbirne unten."
			}
		}
	},
	components: { liquidoHeader, liquidoInput, lawPanel },
	data() {
		return {
				searchTitle: undefined,
				ideas: [
					{
						id: 2001,
						title: "Proposal One qurg ASD asdfcvvef fdadsf ddd fff ddccc c ewe e",
						description: "Just an example proposal Bei relativ positionierten Elementen (position: relative) wird das Element aus seiner normalen Position im Elementfluss verschoben. Dabei gilt: Wenn die top Eigenschaft definiert wurde, überschreibt diese den Wert der bottom Eigenschaft. Wenn top den Wert auto besitzt, ist der berechnete Wert für bottom gleich dem Wert der top Eigenschaft mit umgedrehtem Vorzeichen. Wenn beide Eigenschaften nicht den Wert auto besitzen, wird bottom ignoriert und auf auto gesetzt.",
						status: "VOTING",
						createdAt: new Date(),

						updatedAt: new Date(),
						area: {
							id: 4001,
							title: "Example Area"
						},
						supporters: [
							
						],
						numSupporters: 15,
						supportedByCurrentUser: true,
						createdBy: {
							id: 7001,
							email: "user1@liqudo.vote",
							profile: {
								name: "User1longname Mobileasdf",
								mobilephone: "#491234517",
								picture: "/img/avatars/Avatar1.png",
							}
						}
					},
					{
						id: 2002,
						title: "Proposal Two",
						description: "Yet another example proposal xcvxclk c vd xc asdf cxvyxcv yxcv xycv ",
						status: "VOTING",
						createdAt: new Date(),
						updatedAt: new Date(),
						area: {
							id: 4002,
							title: "Example Area"
						},
						supporters: [
							
						],
						numSupporters: 9,
						supportedByCurrentUser: false,
						createdBy: {
							id: 7002,
							email: "user2@liqudo.vote",
							profile: {
								name: "User2 Mobile",
								mobilephone: "#491234518",
								picture: "/img/avatars/Avatar2.png",
							}
						}
					},
					{
						id: 2003,
						title: "Proposal Three with a very long title that will break more than three lines just to besure we make it very long",
						description: "Yet another example proposal xcvxclk c vd xc asdf cxvyxcv yxcv xycv ",
						status: "VOTING",
						createdAt: new Date(),
						updatedAt: new Date(),
						area: {
							id: 4002,
							title: "Example Area"
						},
						supporters: [
							
						],
						numSupporters: 92345,
						supportedByCurrentUser: true,
						createdBy: {
							id: 7002,
							email: "user4@liqudo.vote",
							profile: {
								name: "User4 Mobile",
								mobilephone: "#491234514",
								picture: "/img/avatars/Avatar4.png",
							}
						}
					}
				],
		}
	},
	created() {},
	mounted() {},
	computed: {
		filteredIdeas() {
			if (this.searchTitle === undefined || this.searchTitle === "") return this.ideas
			var regex = new RegExp(this.searchTitle, "i")
			return this.ideas.filter(idea => regex.test(idea.title) || regex.test(idea.description))
		}
	},
	methods: {
		clearSearch() {
			this.searchTitle = ""
		}
	},

}

</script>

<style lang="scss">

</style>
