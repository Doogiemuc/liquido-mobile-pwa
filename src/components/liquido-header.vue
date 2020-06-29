<template>
	<div id="behindHeader">
		<header id="liquidoHeader" class="liquido-header shadow-sm">
			<div class="liquido-brand"><i class="fas fa-university"></i>&nbsp;<span class="liquido"></span></div>

			<ul v-if="showNavArrows" id="navArrows" class="nav nav-arrows container-fluid" >
				<li :class="{'active': isPathActive('/ideas')}"><router-link active-class="active" to="/ideas" id="IdeasArrow">	<i class="far fa-lightbulb"></i>&nbsp;{{$t('ideas')}}</router-link></li>
				<li :class="{'active': isPathActive('/proposals')}"><router-link active-class="active" to="/proposals" id="ProposalsArrow"><i class="fas fa-vote-yea"></i>&nbsp;{{$t('proposals')}}</router-link></li>
				<li :class="{'active': isPathActive('/polls')}"><router-link active-class="active" to="/polls" id="PollsArrow"><i class="fas fa-poll"></i>&nbsp;{{$t('polls')}}</router-link></li>
			</ul>
		</header>
	</div>
</template>

<script>

export default {
	name: "LiquidoHeader",
	i18n: {
		messages: {
			en: {
			},
			de: {
			}
		}
	},
	props: {
		'showNavArrows': { type: Boolean, required: false, default: true },
		'minimizeOnScroll': { type: Boolean, required: false, default: true },
	},
	data() {
		return {}
	},
	methods: {
		transitionHeader() {
			if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
				$('.liquido-header').addClass('scrolled')
				$('#navArrows').addClass('scrolled')
			} else {
				$('.liquido-header').removeClass('scrolled')
				$('#navArrows').removeClass('scrolled')
			}
		},

		/** check if current $route.path starts with the given pathPrefix. so that we can add the .active class to the outer li element */
		isPathActive(pathPrefix) {
			return this.$route.path.indexOf(pathPrefix) === 0
		}
	},

	/**
	 * Make the spacer div behind the fixed header the same hight as the header itself.
	 * Next sibling element should add its own top margin.
	 */
	mounted() {
		var headerHeight = $('#liquidoHeader').css('height')
		$('#behindHeader').css('height', headerHeight)
		if (this.minimizeOnScroll) {
			window.onscroll = () => this.transitionHeader();
		}	
	}
}
</script>

<style lang="scss" scoped>

.liquido-header {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	//height: $stickyNavHeight;
	z-index: 100;
	transition: 0.3s;  /* Add a transition effect when scrolling */
	color: $primary;
	background-color: $secondary-bg;
	border-bottom: 1px solid rgba(0,0,255, 0.3);
	text-align: center;

	.liquido-brand {
		font-size: 24px;
		font-weight: bold;
		margin: 1rem 0;
		transition: 0.3s;  /* Add a transition effect when scrolling */
	}
}

.liquido-header.scrolled {
	.liquido-brand {
		font-size: 0;
		margin: 5px 0 0 0;
	}
}

/* Arrows for nav links */

$inactiveNavArrowBg: #fdfdff;

#navArrows {
	flex-wrap: nowrap;
	margin: 0 auto;
	justify-content: center;
	font-family: 'Libre Baskerville', serif;
	//font-family: Georgia, 'Times New Roman', Times, serif;
	margin-bottom: 1rem;
	padding-left: 15px;  // same as contianer-fluid. Was overwritten by .nav
	//min-width: 350px;	
	transition: 0.3s;
	@media (max-width: 350px) {
		font-size: 12px;
	}
}

#navArrows > li {
	margin: 0 12px;
	position: relative;
	flex-grow: 1;
	transition: 0.3s;
}
#navArrows a {
	display: block;
	color: $primary;
	height: 40px;
	line-height: 40px;   // vertically center text in arrows
	background-color: $inactiveNavArrowBg;
	transition: 0.3s;
}
#navArrows a:before {
	position: absolute;
	content: "";
	top: 0px;
	left: -19px;
	width: 0px;
	height: 0px;
	border-style: solid;
	border-width: 20px 0 20px 20px;
	border-color: $inactiveNavArrowBg $inactiveNavArrowBg $inactiveNavArrowBg transparent;
	z-index: 150;
	transition: 0.3s;
}
#navArrows a:after {
	position: absolute;
	content: "";
	top: 0px;
	right: -20px;
	width: 0px;
	height: 0px;
	border-style: solid;
	border-width: 20px 0 20px 20px;
	border-color: transparent transparent transparent $inactiveNavArrowBg;
	z-index: 150;
	transition: 0.3s;
}

/* Navbar arrows become smaller when user scrolled upwards */
#navArrows.scrolled {
	margin-bottom: 5px;
	a {
		height: 30px;
		line-height: 30px;
	}
	li {
		margin: 0 10px;
	}
	a:before {
		left: -15px;
		border-width: 15px 0 15px 15px;
	}
	a:after {
		right: -15px;
		border-width: 15px 0 15px 15px;
	}
}


/* Navbar arrows when active */
#navArrows li.active a  {
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
#navArrows li.disabled a  {
	background-color: #ddd;
}
#navArrows li.disabled a:before {
	border-color:  #ddd #ddd #ddd transparent;
}
#navArrows li.disabled a:after {
	border-color: transparent transparent transparent #ddd;
}
</style>
