import Vue from "vue"
import Router from "vue-router"
import welcomeChat from "@/views/welcome-chat"
import loginPage from "@/views/login-page"
import EventBus from "./event-bus"
//import liquidoApi from "@/services/liquido-graphql-client"

Vue.use(Router)

const routes = [
	{
		path: "/",
		name: "index",
		redirect: "/team"
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

const LIQUIDO_JWT_KEY  = "LIQUIDO_JWT"

/**
 * Store jwt in localStorage on login.
 */
/* eslint-disable no-unused-vars */
EventBus.$on(EventBus.LOGIN, ({team, user, jwt}) => {
	//console.log("Storing JWT in local storage", jwt)
	localStorage.setItem(LIQUIDO_JWT_KEY, jwt)
})

/**
 * Remove jwt from localStorage on logout
 */
EventBus.$on(EventBus.LOGOUT, () => {
	localStorage.removeItem(LIQUIDO_JWT_KEY)
})

async function tryToAuthenticate() {
	let jwt = localStorage.getItem(LIQUIDO_JWT_KEY);
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
 * IF navigating to "/" and not authenticated, 
 *   
 * IF route is public, then allow navigation.
 * ELSE IF user is not yet authenticated
 *   Check if we can get a JWT from localstorage and try to authenticate with it.
 *   IF still not authenticated, then forward to /login
 */
router.beforeEach((routeTo, routeFrom, next) => {
	// Keep in mind that next() must exactly be called once in this method.

	let isAuthenticated = router.app.$api.isAuthenticated()
	
	if (isAuthenticated) {
		next()
	}
	else if (routeTo.meta.public) {
		next()
	} 
	else {		
		tryToAuthenticate()
			.then(() => next())
			.catch(() => {
				if (routeTo.path === "/" || routeTo.path === "/index.html") {
					console.log("Forwarding to welcome")
					next({name: "welcome"})
				}	else {
					console.debug("Forwarding to login")
					next({name: "login"})
				}
			})
	}
})

export default router

