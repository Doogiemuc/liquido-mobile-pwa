<template>
	<header id="liquidoHeader" class="liquido-header shadow-sm">
		<div class="container">
			<div class="row no-gutters align-items-center">
				<div class="col header-left">
					<i
						v-if="backLink"
						class="fas fa-angle-left"
						@click="goBack()"
					/>
				</div>
				<div class="col-8 liquido-title">
					<i class="fas fa-university" />&nbsp;
					<span class="liquido" @click="clickLiquidoTitle()" />
				</div>
				<div class="col header-right">
					<i v-if="isAuthenticated" id="gotoTeamButton" class="fas fa-users" @click="gotoTeam()" />
				</div>
			</div>
		</div>
	</header>
</template>

<script>
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
		}
	},
	computed: {
		height() {
			return $("#liquidoHeader").height()
		},
		isAuthenticated() {
			return this.$api.isAuthenticated()
		}
	},
	mounted() {
		// make header smaller when user scrolls down
		$("#app").scroll(this.transitionHeader)
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

		gotoTeam() {
			if (this.$route.path !== "/welcome" && this.$route.path !== "/team") {
				this.$router.push({name: "teamHome"})
			}
		},

		/** check if current $route.path starts with the given pathPrefix. so that we can add the .active class to the outer li element */
		isPathActive(pathPrefix) {
			return this.$route.path.indexOf(pathPrefix) === 0
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
	border-bottom: 1px solid rgba(0, 0, 255, 0.3);
	font-size: 1.5rem;

	.liquido-title {
		text-align: center;
	}
	.header-right {
		font-size: 1rem;
		text-align: right;
		//margin-right: 15px;
	}
	.header-left {
		text-align: left;
		//margin-left: 15px;
	}
}

.liquido-header.scrolled {
	font-size: 1rem;
}

</style>
