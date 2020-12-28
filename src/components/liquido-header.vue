<template>
	<header id="liquidoHeader" class="liquido-header shadow-sm">
		<div class="container">
			<div class="row no-gutters align-items-center">
				<div class="col header-left">
					<i
						v-if="backLink"
						class="fas fa-angle-double-left"
						@click="goBack()"
					/>
				</div>
				<div class="col-8 liquido-title">
					<i class="fas fa-university" />&nbsp;
					<span class="liquido" @click="clickLiquidoTitle()" />
				</div>
				<div class="col header-right">
					<i v-if="$route.path !== '/welcome'" class="fas fa-users" @click="gotoTeam()" />
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
			if (this.$route.path !== "/welcome" && this.$route.path !== "/polls") {
				this.$router.push({name: "polls"})
			}
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
		margin-right: 15px;
	}
	.header-left {
		text-align: left;
		margin-left: 15px;
	}
}

.liquido-header.scrolled {
	font-size: 1rem;
}

/* Arrows for nav links */

$inactiveNavArrowBg: #fdfdff;

#navArrows {
	flex-wrap: nowrap;
	padding: 0;
	//min-width: 350px;
	justify-content: center;
	font-family: "Libre Baskerville", serif;
	font-size: 1.7rem;
	margin-bottom: 1rem;
	transition: 0.3s;
	.icon-title {
		font-size: 10px;
		line-height: 1;
	}
}

$arrowSize: 28px;

#navArrows > li {
	margin: 0 $arrowSize * 0.5;
	position: relative;
	flex-grow: 1;
	flex-basis: 0; // make all li elemns the same width (independant of their content)
	transition: 0.3s;
}
#navArrows a {
	display: block;
	white-space: nowrap;
	overflow: hidden;
	//text-overflow: ellipsis;
	color: $primary;
	height: 2 * $arrowSize;
	line-height: 40px; // vertically center text in arrows
	background-color: $inactiveNavArrowBg;
	transition: 0.3s;
}
/* Wings before each element */
#navArrows li:not(:first-child) > a:before {
	position: absolute;
	content: "";
	top: 0px;
	left: -$arrowSize * 0.75;
	width: 0px;
	height: 0px;
	border-style: solid;
	border-width: $arrowSize 0 $arrowSize $arrowSize * 0.75;
	border-color: $inactiveNavArrowBg $inactiveNavArrowBg $inactiveNavArrowBg
		transparent;
	z-index: 150;
	transition: 0.3s;
}
/* Rounded corners for first element at the left */
#navArrows > li:first-child > a {
	border-top-left-radius: $arrowSize * 0.3;
	border-bottom-left-radius: $arrowSize * 0.3;
}

/* Arrows after each element */
#navArrows > li:not(:last-child) > a:after {
	position: absolute;
	content: "";
	top: 0px;
	right: -$arrowSize * 0.75;
	width: 0px;
	height: 0px;
	border-style: solid;
	border-width: $arrowSize 0 $arrowSize $arrowSize * 0.75;
	border-color: transparent transparent transparent $inactiveNavArrowBg;
	z-index: 150;
	transition: 0.3s;
}
/* Rounded corners for last element at the right */
#navArrows > li:last-child > a {
	border-top-right-radius: $arrowSize * 0.3;
	border-bottom-right-radius: $arrowSize * 0.3;
}

/* Navbar arrows become smaller when user scrolled upwards */
#navArrows.scrolled {
	margin-top: 10px;
	margin-bottom: 10px;
	li {
		margin: 0 8px;
	}
	a {
		height: 30px;
		line-height: 33px;
	}
}

#navArrows.scrolled > li:not(:first-child) > a:before {
	left: -10px;
	border-width: 15px 0 15px 10px;
}
#navArrows.scrolled > li:not(:last-child) > a:after {
	right: -10px;
	border-width: 15px 0 15px 10px;
}

//.icon-title {
//display: none;   //TODO: then width of arrows jumps :-(
//}

/* Navbar arrows when active */
#navArrows li.active a {
	color: white;
	background-color: $primary;
}
#navArrows li.active a:before {
	border-color: $primary $primary $primary transparent;
}
#navArrows li.active a:after {
	border-color: transparent transparent transparent $primary;
}

/* Navbar arrows when disabled */
#navArrows li.disabled a {
	background-color: #ddd;
}
#navArrows li.disabled a:before {
	border-color: #ddd #ddd #ddd transparent;
}
#navArrows li.disabled a:after {
	border-color: transparent transparent transparent #ddd;
}
</style>
