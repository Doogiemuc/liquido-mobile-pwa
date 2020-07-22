const routes = [
  {
    path: "/",
    name: "index",
    component: () => import("@/views/index-page"),
	},
	{
    path: "/createPoll",
    name: "createPoll",
    component: () => import("@/views/poll-create"),
	},
  {
    path: "/polls",
    name: "polls",
    component: () => import("@/views/polls"),
	},
	{
    path: "/polls/:pollId",
    name: "showPoll",
		component: () => import("@/views/poll-show"),
		props: true
  },
  {
    path: "/polls/:pollId/add",
    name: "addProposal",
    component: () => import("@/views/proposal-add"),
    props: true
  },
	{
		path: "/team",
		name: "teamHome",
		component: () => lazyLoadView(import("@/views/team-home")),
	},
	{
    path: "/castVote",
    name: "castVote",
		component: () => lazyLoadView(import("@/views/cast-vote")),
		meta: {
      requiresAuth: true,
    },
  },
	{
    path: "/404",
    name: "pageNotFound",
    component: () => lazyLoadView(import("@/views/not-found-page")),
    props: true,
  },
  {
    path: "*",
    redirect: "404",
  },
]

// Lazy-loads view components, but with better UX. A loading view
// will be used if the component takes a while to load, falling
// back to a timeout view in case the page fails to load. You can
// use this component to lazy-load a route with:
//
// component: () => lazyLoadView(import('@views/my-view'))
//
// NOTE: Components loaded with this strategy DO NOT have access
// to in-component guards, such as beforeRouteEnter,
// beforeRouteUpdate, and beforeRouteLeave. You must either use
// route-level guards instead or lazy-load the component directly:
// component: () => import('@views/my-view')
function lazyLoadView(AsyncView) {
  const AsyncHandler = () => ({
    component: AsyncView,
    // A component to use while the component is loading.
    loading: require("@/views/loading-page").default,
    // A fallback component in case the timeout is exceeded
    // when loading the component.
    error: require("@/views/timeout-page").default,
    // Delay before showing the loading component.
    // Default: 200 (milliseconds).
    delay: 400,
    // Time before giving up trying to load the component.
    // Default: Infinity (milliseconds).
    timeout: 10000,
  })

  return Promise.resolve({
    functional: true,
    render(h, { data, children }) {
      // Transparently pass any props or children
      // to the view component.
      return h(AsyncHandler, data, children)
    },
  })
}

export default routes
