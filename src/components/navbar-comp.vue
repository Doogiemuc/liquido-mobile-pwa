<template>
	<nav class="navbar fixed-top bg-white container-lg">
		<i class="fa fa-university nav-icon"></i>
		<router-link to="/"><h1 class="navbar-brand m-0"><span class="liquido" /></h1></router-link>
		<button
			class="navbar-toggler collapsed"
			type="button"
			data-toggle="collapse"
			data-target="#liquidoNavBar"
			aria-controls="liquidoNavBar"
			aria-expanded="false"
			aria-label="Toggle navigation"
		>
			<span class="icon-bar"></span>
			<span class="icon-bar"></span>
			<span class="icon-bar"></span>
		</button>

		<div id="liquidoNavBar" class="collapse navbar-collapse">
			<ul class="navbar-nav mr-auto">
				<li class="nav-item active">
					<router-link to="/team" class="nav-link">Team</router-link>
				</li>
				<li>
					<router-link to="/castVote" class="nav-link">Cast Vote</router-link>
				</li>
				<li>
					<router-link to="/about" class="nav-link">About</router-link>
				</li>
				<li>
					<router-link to="/search" class="nav-link">Search</router-link>
				</li>
			</ul>
		</div>
	</nav>
</template>

<script>
import { get } from "vuex-pathify"

export default {
	name: "Navbar",
	components: {},
	mixins: [],
	data() {
		return {
			modalComp: null,
			showMobileNav: false,
		}
	},
	beforeCreate() {},
	created() {},
	beforeMount() {},
	mounted() {
		// Close the navbar when clicked. https://stackoverflow.com/questions/14203279/bootstrap-close-responsive-menu-on-click
		$('.navbar-collapse ul li a:not(.dropdown-toggle)').bind('click', function () {
			$('.navbar-toggler:visible').click();
		});
	},
	computed: {
		showNavbar: get("ui/showNavbar"),
		isLoggedIn: get("account/isAuthenticated"),
		userRole: get("account/userRole"),
		isAdmin: function() {
			return this.userRole === "ADMIN"
		},
	},
	methods: {
		closeModal() {
			this.modalComp = null
		},
		openSignup() {
			this.modalComp = () => import("@/components/signup-form")
		},
		openLogin() {
			this.modalComp = () => import("@/components/login-form")
		},
		logout() {
			this.$accountAPI.logout()
			this.$buefy.toast.open({
				duration: 1000,
				message: "Signed Out",
				position: "is-top",
				type: "is-dark",
			})
			this.$router.push("/")
		},
		toggleMobileNav() {
			this.showMobileNav = !this.showMobileNav
		},
	},
	beforeUpdate() {},
	updated() {},
	beforeDestroy() {},
}
</script>

<style lang="scss">
nav.navbar {
	color: $primary;
	font-size: 1.25rem;
	border-bottom: 1px solid $primary;
	padding: 0 0.5rem;
}
.navbar-toggler {
	padding: 0.25rem !important;
	border: none !important;
	.icon-bar {
		display: block;
		width: 22px;
		height: 2px;
		border-radius: 1px;
		transition: 300ms ease-in-out;
		background-color: blue;
		position: relative;
	}
	.icon-bar + .icon-bar {
		margin-top: 4px;
	}
	// beautiful animation for the icon when collapsing
	.icon-bar:nth-child(1) {
		opacity: 0;
	}
	.icon-bar:nth-child(3) {
		-webkit-transform: rotate(-45deg);
		-ms-transform: rotate(-45deg);
		-o-transform: rotate(-45deg);
		transform: rotate(-45deg);
		top: -7px;
	}
	.icon-bar:nth-child(2) {
		-webkit-transform: rotate(45deg);
		-ms-transform: rotate(45deg);
		-o-transform: rotate(45deg);
		transform: rotate(45deg);
		top: 0px;
	}
	&.collapsed {
		.icon-bar {
			-webkit-transform: rotate(0deg);
			-ms-transform: rotate(0deg);
			-o-transform: rotate(0deg);
			transform: rotate(0deg);
			top: 0;
			opacity: 1;
		}
	}
}
</style>
