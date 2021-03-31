import Vue from "vue"
import Router from "vue-router"
import welcomeChat from "@/views/welcome-chat"
import loginPage from "@/views/login-page"
//import EventBus from "./event-bus"
//import liquidoApi from "@/services/liquido-graphql-client"

Vue.use(Router)

const routes = [
	{
		path: "/",
		name: "index",
		// Will forward to /welcome or /team if authenticated
	},
	{
		path: "/login",
		name: "login",
		component: loginPage,
		props: route => ({ 
			email: route.query.email,
			teamName: route.query.teamName
		}),
		meta: {
			public: true
		}
	},
	{
		path: "/welcome",
		name: "welcome",
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

async function tryToAuthenticate() {
	let jwt = localStorage.getItem(router.app.$api.LIQUIDO_JWT_KEY);
	if (jwt) {
		return router.app.$api.loginWithJwt(jwt)
			.then(res => {
				console.log("Successfully authenticated from localStorage")
				return Promise.resolve(res)
			})
			.catch(err => {
				console.warn("tryToAuthenticate failed", err)
				return Promise.reject()
			})
	}
	else return Promise.reject()
}


/**
 * Vue Router - Navigation guard
 * 
 * IF user is already authenticated, do normal navigation
 * ELSE IF route is public, then also allow navigation.
 * ELSE try to authenticate from localStorage
 *   IF that is successful THEN allow navigation ELSE 
 *     IF navigation to root "/", forward to "/welcome"   <= first time visitor
 *     ELSE forard to "/login"    <= unauthenticated user used deepLink
 */
router.beforeEach((routeTo, routeFrom, next) => {
	// Keep in mind that next() must exactly be called once in this method.

	if (routeTo.path === "/" || routeTo.path === "/index.html") {
		tryToAuthenticate()
			.then(() => next({name: "teamHome"}))
			.catch(() => next({name: "welcome"}))
	}
	else if (router.app.$api.isAuthenticated()) {
		next()
	}
	else if (routeTo.meta.public) {
		next()
	} 
	else {		
		tryToAuthenticate()
			.then(() => next())
			.catch(() => {
				console.debug("Forwarding to login")
				next({name: "login"})
			})
	}
})

export default router

