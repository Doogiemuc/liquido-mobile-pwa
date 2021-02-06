import Vue from "vue"
import Router from "vue-router"
import welcomeChat from "@/views/welcome-chat"
import loginPage from "@/views/login-page"


Vue.use(Router)

const routes = [
	{
		path: "/",
		name: "index",
		redirect: "/welcome", //TODO: redirect depending on auth token
		meta: {
			public: true
		}
	},
	{
		path: "/login",
		name: "login",
		component: loginPage,
		meta: {
			public: true
		}
	},
	{
		path: "/devLogin",
		name: "devLogin",
		component: () => import("@/services/dev-login"),
		props: (route) => ({
			userEmail: route.query.userEmail,
			teamName: route.query.teamName
		}),
		meta: {
			public: process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test"
		}
	},
	{
		path: "/welcome",
		component: welcomeChat,
		meta: {
			public: true
		}
	},
	{
		path: "/team",
		name: "teamHome",
		component: () => import("@/views/team-home"),
	},
	{
		path: "/polls",
		name: "polls",
		component: () => import("@/views/polls"),
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
		//props: true,  //MAYBE: where to go "back" ?
		meta: {
			public: true
		}
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

/**
 * Check if routeis public or requires authentication.
 * Forward to /login if required but not authenticated.
 */
router.beforeEach((routeTo, routeFrom, next) => {
	// Keep in mind that next() must exactly be called once in this method.
	if (routeTo.meta.public) {
		return next()
	} else	
	// forward to login if not authenticated.
	if (!router.app.$api.isAuthenticated()) {
		console.log("Forwarding to /login")
		return next("/login")
	} else {
		return next()
	}
})

export default router
