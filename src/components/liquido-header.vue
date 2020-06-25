<template>
	<header class="liquido-header shadow-sm">
		<div class="liquido-brand"><i class="fas fa-university"></i>&nbsp;<span class="liquido"></span></div>

		<ul id="navArrows" class="nav nav-arrows container-fluid" >
			<li><router-link active-class="active" to="/ideas" id="IdeasArrow">	<i class="far fa-comments"></i>&nbsp;{{$t('ideas')}}</router-link></li>
			<li><router-link active-class="active" to="/proposals" id="ProposalsArrow"><i class="far fa-comments"></i>&nbsp;{{$t('proposals')}}</router-link></li>
			<li class="active"><router-link active-class="active" to="/polls" id="PollsArrow"><i class="fas fa-poll"></i>&nbsp;{{$t('polls')}}</router-link></li>
		</ul>
	</header>
</template>

<script>

export default {
	name: "LiquidoHeader",
	i18n: {
		messages: {
			en: {
				welcome: 'Welcome to <span class="liquido"></span> - the free, secure and liquid eVoting platform. With this mobile app you can create polls and then take votes with your team.',
			},
			de: {
				ideas: "Ideen",
				proposals: 'Vorschläge',
				polls: 'Wahlen',  				// Abstimmungen, Umfragen ??
				discussion: 'Diskussion',
				inVoting: 'Abstimmung',
			}
		}
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
		}
	},
	mounted() {
		window.onscroll = () => this.transitionHeader();
	}
}
</script>

<style lang="scss" scoped>

.liquido-header {
	position: fixed;
	top: 0;
	width: 100%;
	//height: $stickyNavHeight;
	z-index: 100;
	transition: 0.3s;  /* Add a transition effect when scrolling */
	color: $primary;
	background-color: rgb(220, 236, 255);
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
		//height: 0;
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
