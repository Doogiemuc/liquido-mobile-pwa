<template>
	<b-card no-body class="law-panel">
		<div>
			<h4 class="law-title"><i :class="iconForLaw" class="title-icon"></i>&nbsp;{{law.title}}</h4>
		</div>
		<div class="subtitle d-flex">
			<div class="flex-fixed-width user">
				<i class="far fa-user"></i>&nbsp;{{ law.createdBy.profile.name }}
			</div>
			<div class="createdAt">
				<i class="far fa-clock"></i>&nbsp;{{ getFromNow(law.createdAt) }}
			</div>
			<div class="like-button flex-grow-1 text-right" :class="{ supported: law.supportedByCurrentUser }">
				<i :class="{'far': !law.supportedByCurrentUser, 'fas': law.supportedByCurrentUser}" class="fa-thumbs-up"></i>&nbsp;{{law.numSupporters}}
			</div>
		</div>
		<div class="d-flex">
			<div class="flex-fixed-width">
				<img :src="'https://picsum.photos/seed/'+law.id+'/100'" alt="Image" class="law-image"/>
			</div>
			<div class="law-description">
				{{law.description}}
			</div>
		</div>
  </b-card>
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
					return "far fa-lightbulb"
				case "PROPOSAL":
					return "far fa-file-alt"
				case "ELABORATION":
					return "far fa-comments"
				case "VOTING":
					return "fas fa-vote-yea"
				case "LAW":
					return "fas fa-balance-scale-left"
				case "DROPPED":
					return "far fa-window-close"
				case "RETENTION":
					return "fas fa-temperature-low"
				case "RETRACTED":
					return "fas fa-backspace"
				default:
					return "fas fa-university"
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
$avatar_size: 90px;

.law-panel {
	height: 30px + 25px + $avatar_size + 5px;  // title + subtitle + avatar_img + padding-bottom
	overflow: hidden;
	padding: 0 5px 5px 5px;

	.flex-fixed-width {
		flex: 0 0 100px;
		//border: 1px solid red;
	}

	.law-title {
		height: 30px;
		line-height: 30px;
		margin: 0;
		font-size: 18px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.title-icon {
		font-size: 80%;
	}

	.subtitle {
		font-size: 10px;
		//line-height: 15px;
		height: 18px;
		min-height: 18px;
		color: #BBB;
		margin-bottom: 5px;
		//border-bottom: 1px solid #BBB;
		//-webkit-box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075) !important;
		//box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075) !important;
	}

	.law-image {
		//margin: 5px;
		border-radius: 5px;
		min-width: $avatar_size;
		max-width: $avatar_size;
		width: $avatar_size;
		min-height: $avatar_size;
		max-height: $avatar_size;
		height: $avatar_size;
	}

	.law-description {
		font-size: 12px;
	}
}

.supported {
	color: green;
}

</style>
