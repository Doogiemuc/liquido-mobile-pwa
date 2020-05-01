<template>
	<nav class="navbar fixed-top bg-white container-lg">
		<router-link to="/"><h1 class="navbar-brand mb-0"><i class="fa fa-university"></i>&nbsp;<span class="liquido" /></h1></router-link>
		<button
			class="navbar-toggler collapsed"
			type="button"
			data-toggle="collapse"
			data-target="#navbarSupportedContent"
			aria-controls="navbarSupportedContent"
			aria-expanded="false"
			aria-label="Toggle navigation"
		>
			<span class="icon-bar"></span>
			<span class="icon-bar"></span>
			<span class="icon-bar"></span>
		</button>

		<div id="navbarSupportedContent" class="collapse navbar-collapse">
			<ul class="navbar-nav mr-auto">
				<li class="nav-item active">
					<router-link to="/team" class="navbar-item">Team</router-link>
				</li>
				<li>
					<a class="nav-link" href="/about">About</a>
				</li>
				<li>
					<a class="nav-link" href="/search">Search</a>
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
	mounted() {},
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
