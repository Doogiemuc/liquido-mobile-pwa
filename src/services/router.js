import Vue from "vue"
import Router from "vue-router"
import welcomeChat from "@/views/welcome-chat"
import loginPage from "@/views/login-page"
import config from "config"

Vue.use(Router)

const routes = [
	{
		path: "/",
		name: "index",
		// Will forward anonymous to /welcome 
		// With valid JWT to /team
		// and with expired JWT to /login
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
	//vue-router History mode needs web-server configuration https://router.vuejs.org/guide/essentials/history-mode.html#example-server-configurations
	//TODO: mode: "history",   
	mode: "hash",
	base: config.BASE_URL || "/",
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

const IS_ALREADY_AUTHENTICATED = -1
const IS_ANONYMOUS = -99

/**
 * On every request we try to authenticate the current user.
 * IF the user is already successfully authenticated (JWT, team & user info is loaded)
 * THEN return immideately (even if the JWT might be expired)
 * IF there is a stored JWT in localStorage, 
 * THEN try to authenticate with it against the backend.
 * IF this fails, then remove the (expired or invalid) JWT from localstorage
 * ELSE return login information
 * 
 * @return A Promise that will resolve to the login data or reject when no or invalid JWT.
 */
async function tryToAuthenticate() {
	if (router.app.$api.isAuthenticated()) return Promise.resolve(IS_ALREADY_AUTHENTICATED);  // although JWT could be expired, but this way we save one backend call
	let jwt = localStorage.getItem(router.app.$api.LIQUIDO_JWT_KEY);
	if (jwt) {
		return router.app.$api.loginWithJwt(jwt)
			.then(res => {
				console.log("Successfully authenticated from localStorage")
				return Promise.resolve(res)
			})
			.catch(err => {
				// return liquido error code, eg. JWT_TOKEN_EXPIRED or JWT_TOKEN_INVALID
				let errCode = err.response &&	err.response.data ? err.response.data.liquidoErrorCode : -1
				if (errCode === router.app.$api.err.JWT_TOKEN_EXPIRED || errCode === router.app.$api.err.JWT_TOKEN_INVALID) {
					console.debug("Deleting expired JWT from localStorage")
					localStorage.removeItem(router.app.$api.LIQUIDO_JWT_KEY);  // delete expired JWT
				}
				return Promise.reject(errCode)
			})
	}
	else return Promise.reject(IS_ANONYMOUS) // no JWT, not authenticated at all
}


/**
 * Vue Router - Navigation guard
 * 
 * 1) Try to authenticate
 *
 * IF user is already authenticated THEN continue
 * ELSE IF there is a stored JWT in localStorage
 * THEN try to login with it at the backend.
 * 
 * IF user is now authenticated
 * 	IF an authenticated user navigates to '/'
 *  THEN forard him directly to his team-home page.
 *  ELSE let him continue
 * 
 * IF user is still not authenticated
 *   IF route is public then continue
 *   ELSE IF he navigates to "/" forward him to "/welcome"
 *   ELSE forward to "/login"
 */
router.beforeEach((routeTo, routeFrom, next) => {

	console.log("vue-router: routeTo.path="+routeTo.path, routeTo)

	// Keep in mind that next() must exactly be called once in this method.
	tryToAuthenticate().then(() => {
		if (routeTo.path === "/" || routeTo.path === "/index.html") {
			next({name: "teamHome"})
		} else {
			next()
		}
	}).catch(() => {
		if (routeTo.meta.public) {
			next()
		} else if (routeTo.path === "/" || routeTo.path === "/index.html") {
			next({name: "welcome"})
		}	else {		
			console.debug("Forwarding to login")
			next({name: "login"})
		}
	})	
})

export default router

