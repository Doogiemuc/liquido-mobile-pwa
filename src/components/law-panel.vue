<template>
	<div class="law-panel">
		<b-card :img-src="law.createdBy.profile.picture" 
			img-alt="Law image" img-left 
			class="law-card" 
			:class="{ 'no-select': readOnly }"
			:title="law.title"
			no-body
		>
			<b-card-body>
				<b-card-title>{{law.title}}</b-card-title>
				<b-card-text>
					{{law.description}}
					<div class="author">
						<i class="far fa-user"></i>&nbsp;{{ law.createdBy.profile.name }}&nbsp;
						<span :class="{ supported: law.supportedByCurrentUser }">
							<i :class="{'far': !law.supportedByCurrentUser, 'fas': law.supportedByCurrentUser}" class="fa-thumbs-up">&nbsp;{{law.numSupporters}}</i>
						</span>
					</div>
				</b-card-text>
			</b-card-body>
		</b-card>
	</div>
</template>

<script>
import moment from "moment"

export default {
  name: "LawCard",
  components: {},
  props: {
    law: { type: Object, required: true },
    readOnly: { type: Boolean, required: false, default: false },
  },
  mixins: [],
  data() {
    return {}
  },
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {},
  computed: {
    iconForLaw() {
      switch (this.law.status) {
        case "IDEA":
          return { pack: "far", icon: "lightbulb" }
        case "PROPOSAL":
          return { pack: "far", icon: "file-alt" }
      case "ELABORATION":
          return { pack: "far", icon: "comments" }
        case "VOTING":
          return { pack: "fas", icon: "vote-yea" }
      case "LAW":
          return { pack: "fas", icon: "balance-s cale-left" }
      case "DROPPED":
          return { pack: "far", icon: "window-close" }
        case "RETENTION":
          return { pack: "fas", icon: "temperature-low" }
      case "RETRACTED":
          return { pack: "fas", icon: "backspace" }
        default:
          return { pack: "fas", icon: "university" }
      }
    },
  },
  methods: {
    getFromNow: function(dateVal) {
      return moment(dateVal).fromNow()
    },
  },
  filters: {},
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},
}
</script>

<style lang="scss" scoped>
$avatar_size: 84px;

.law-card {
	height: 94px;
	//max-height: $avatar_size;
	//min-height: $avatar_size;

	.card-body {
		padding: 0.25rem;
		font-size: 12px;
		line-height: 15px;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	
	.card-title {
		line-height: 20px;
		font-size: 16px;
		margin-bottom: 3px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	
	.card-img-left {
		margin: 0.25rem;
		border-radius: 0.25rem;
		min-width: $avatar_size;
		max-width: $avatar_size;
		width: $avatar_size;
		min-height: $avatar_size;
		max-height: $avatar_size;
		height: $avatar_size;
	}
}
	
.author {
	font-size: 10px;
	line-height: 15px;
	color: grey;
	background-color: #f3f3f3;
	border-top-left-radius: 15px;
	// border-bottom-left-radius: 15px;
	border-left: 5px solid white;
	box-shadow: inset 2px 2px 2px 0px rgba(100,100,100, 0.1);
	padding: 3px 5px 0 10px; // need some more white pixels above to hide h2 behind
	position: absolute;
	right: 0;
	bottom: 0;	
}
.supported {
	color: green;
}

</style>
