<template>
	<header id="liquidoHeader" class="liquido-header">
		<div class="container">
			<div class="row no-gutters align-items-center">
				<div class="col header-left">
					<i
						v-if="backLink"
						class="fas fa-angle-left"
						@click="goBack"
					/>
				</div>
				<div class="col-8 liquido-title">
					<i class="fas fa-university" />&nbsp;
					<span class="liquido" @click="clickLiquidoTitle()" />
				</div>
				<div class="col header-right">
				</div>
			</div>
		</div>
	</header>
</template>

<script>
import EventBus from "@/services/event-bus"

export default {
	name: "LiquidoHeader",
	i18n: {
		messages: {
			en: {},
			de: {},
		},
	},
	props: {
		// show a "backlink". You can pass an URL or the keyworkd "BACK" to use browsers back
		backLink: { type: String, required: false, default: undefined },
	},
	
	data() {
		return {
			filterByStatus: "ELABORATION",
			isAuthenticated: false
		}
	},
	computed: {
		height() {
			return $("#liquidoHeader").height()
		},
	},
	mounted() {
		// make header smaller when user scrolls down
		//$("#app").scroll(this.transitionHeader)

		// Cannot simply do this with a computed property, because this.$api.isAuthenticated is not reactive. TODO: Can we make it reactive? maybe with Vue.$set ?
		EventBus.$on(EventBus.LOGIN, () => this.isAuthenticated = true)
		EventBus.$on(EventBus.LOGOUT, () => this.isAuthenticated = false)
	},
	methods: {
		transitionHeader() {
			if (document.getElementById("app").scrollTop > 50) {
				$(".liquido-header").addClass("scrolled")
				$("#navArrows").addClass("scrolled")
			} else {
				$(".liquido-header").removeClass("scrolled")
				$("#navArrows").removeClass("scrolled")
			}
		},

		goBack() {
			console.log("liquido-header goBack "+this.backLink)
			if (this.backLink === "BACK") this.$router.go(-1)
			else if (this.backLink) this.$router.push(this.backLink)
		},

		clickLiquidoTitle() {
			/*
			//TOOD: what todo when clicking header? Where to go?
			if (this.$route.path !== "/welcome" && this.$route.path !== "/polls" && this.$route.path !== "/login") {
				this.$router.push({name: "polls"})
			}
			*/
		},

		clickTeamIcon() {
			if (this.$route.path === "/welcome") {
				this.$router.push({name: "login"})
			} else if (this.$route.path !== "/team") {
				this.$router.push({name: "teamHome"})
			}
		},

	},
}
</script>

<style lang="scss" scoped>
.liquido-header {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	z-index: 100;
	transition: 0.3s; /* Add a transition effect when scrolling */
	color: $primary;
	background-color: $header-bg;
	border-bottom: 1px solid rgba(0, 0, 0, 0.3);
	font-size: 1.5rem;

	.liquido-title {
		text-align: center;
	}
	.header-right {
		font-size: 1rem;
		text-align: right;
	}
	.header-left {
		text-align: left;
	}
}

.liquido-header.scrolled {
	font-size: 1rem;
}

</style>
