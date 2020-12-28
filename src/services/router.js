import Vue from "vue"
import Router from "vue-router"

Vue.use(Router)

const routes = [
	{
		path: "/",
		name: "index",
		redirect: "/welcome", //TODO: redirect depending on auth token
	},
	{
		path: "/devLogin",
		name: "devLogin",
		component: () => import("@/services/dev-login"),
		props: (route) => ({
			userEmail: route.query.userEmail,
			teamName: route.query.teamName
		})
	},
	{
		path: "/welcome",
		component: () => import("@/views/welcome-chat"),
	},
	{
		path: "/team",
		name: "teamHome",
		component: () => import("@/views/team-home"),
		meta: {
			requiresAuth: true,
		},
	},
	{
		path: "/polls",
		name: "polls",
		component: () => import("@/views/polls"),
		meta: {
			requiresAuth: true,
		},
	},
	{
		path: "/polls/create",
		name: "createPoll",
		component: () => import("@/views/poll-create"),
	},
	{
		path: "/polls/:pollId",
		name: "showPoll",
		component: () => import("@/views/poll-show"),
		props: true,
		meta: {
			requiresAuth: true,
		},
	}, 
	{
		path: "/polls/:pollId/add",
		name: "addProposal",
		component: () => import("@/views/proposal-add"),
		props: true,
	},
	{
		path: "/polls/:pollId/castVote",
		name: "castVote",
		component: () => import("@/views/cast-vote"),
		props: true,
	},
	{
		path: "/404",
		name: "pageNotFound",
		component: () => import("@/views/not-found-page"),
		props: true,
	},
	{
		path: "*",
		redirect: "404",
	},
]

const router = new Router({
	mode: "history",   //TODO: Router History mode needs server configuration
	base: process.env.BASE_URL,
	/*
	scrollBehavior(to, from, savedPosition) {
		if (savedPosition) {
			console.log("Returning to saved scroll position", savedPosition)
			return savedPosition
		} else {
			return { x: 0, y: 0 }
		}
	},
	*/
	routes,
})

// route checks for authentication and redirects
router.beforeEach((routeTo, routeFrom, next) => {

	//TODO: every route except welcome requires auth

	const requiresAuth = routeTo.matched.some((route) => route.meta.requiresAuth)
	const redirectIfAuthenticated = routeTo.matched.some(
		(route) => route.meta.redirectIfAuthenticated
	)
	// If auth isn't required for the route, just continue.
	if (!requiresAuth && !redirectIfAuthenticated) return next()

	let isAuthenticated = router.app.$api.isAuthenticated()

	if (requiresAuth && !isAuthenticated) return next("/login")

	if (isAuthenticated && redirectIfAuthenticated) {
		return next("/")
	}

	return next()
})

export default router
