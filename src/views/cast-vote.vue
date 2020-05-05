<template>
	<section class="section">
		<div class="container">
			<p>
				Now sort these proposals into your personally preferred order. With your favorite proposal at the top.
			</p>

			<div id="ballot" class="ballot">
				<draggable 
					v-model="laws"
					:swap-threshold="0.5"
					:animation="500"
					:canScrollX="false"
				>
						<law-panel
							v-for="law in laws"
							class="mb-2 shadow-sm"
							:law="law"
							:read-only="false"
							:key="law.id"
						/>

				</draggable>
			</div>
		</div>
		<b-button
			variant="primary"
			class="float-right mr-2"
			to="castVote-step2">
				Next&nbsp;<i class="fas fa-angle-double-right"></i>
		</b-button>
	</section>
</template>

<script>
import lawPanel from "../components/law-panel"
//import Sortable from 'sortablejs'
import draggable from "vuedraggable"

export default {
  components: { lawPanel, draggable },
  data() {
    return {
      laws: [
        {
          id: 1,
          title:
            "Just some example very long title gasdkfljasdjf lkdjsa lkf flknwe rtmnwre,m nwm,e rwerfln werflkwe rln welrnlwlerk ",
          description: "Law description which is very helpfull In the example below, we remove the row grid gutters with the no-gutters prop on <b-row> and use md props on <b-col> to make the card horizontal at the md breakpoint. Class rounded-0 removes the rounding of the <b-card-img> corners while class overflow-hidden on <b-card> will appropriately ",
          createdAt: new Date(),
          createdBy: {
            email: "user@liquido.vote",
            profile: {
              name: "John Doe",
              picture: "/img/avatars/Avatar1.png",
            },
          },
          numSupporters: 23,
        },
        {
          id: 2,
          title:
            "Just some example very long title 2 222 asd fag ewtrevcvderv we ew",
          description: "Law description which is very helpfull ...",
          createdAt: new Date(),
          createdBy: {
            email: "user@liquido.vote",
            profile: {
              name: "Able Dune",
              picture: "/img/avatars/Avatar3.png",
            },
          },
          numSupporters: 14,
          supportedByCurrentUser: true,
        },
        {
          id: 3,
          title: "Just some example very long 333333 ",
          description: "Law description which is very helpfull ...",
          createdAt: new Date(),
          createdBy: {
            email: "user@liquido.vote",
            profile: {
              name: "Simon Donahugh",
              picture: "/img/avatars/Avatar2.png",
            },
          },
          numSupporters: 12,
          supportedByCurrentUser: true,
        },
      ],
    }
  },
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {},
  computed: {},
  methods: {},
  filters: {},
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},
}
</script>

<style lang="scss">
.ballot {
	padding: 1rem 0.5rem;
	margin: 0.5rem -0.5rem 1em -0.5rem;
	background: #f0f0f0;
}
.law-panel {
	cursor: grab;
}
.sortable-ghost {
	opacity: 0.1;
}
</style>
