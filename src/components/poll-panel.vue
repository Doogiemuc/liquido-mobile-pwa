<template>
	<b-card no-body class="poll-panel shadow mb-3" :id="poll.id">
		<template v-slot:header>
			<i class="fas fa-angle-double-right goto-poll-icon"></i>
			<i class="fas fa-poll"></i>&nbsp;{{poll.title}}			
		</template>
		<div class="law-panel" v-for="law in poll.proposals" :key="law.id">
			<div>
				<h4 class="law-title"><i :class="getIconForLaw(law)" class="title-icon"></i>&nbsp;{{law.title}}</h4>
			</div>
			<div class="law-subtitle d-flex">
				<div class="createdAt flex-fixed-width">
					<i class="far fa-clock"></i>&nbsp;{{ formatDate(law.createdAt) }}
				</div>
				<div class="user">
					<i class="far fa-user"></i>&nbsp;{{ law.createdBy.profile.name }}
				</div>
				<div class="like-button flex-grow-1 text-right" :class="{ supported: law.supportedByCurrentUser }">
					<i :class="{'far': !law.supportedByCurrentUser, 'fas': law.supportedByCurrentUser}" class="fa-thumbs-up"></i>&nbsp;{{law.numSupporters}}
				</div>
			</div>			
			<div class="d-flex">
				<div class="law-image flex-fixed-width">
					<img :src="'https://picsum.photos/seed/'+law.id+'/100'" alt="Image" class="law-image"/>
				</div>
				<div class="law-description">
					{{law.description}}
				</div>
			</div>
		</div>
	</b-card>
</template>

<script>
import moment from "moment"

export default {
	name: "PollPanel",
	components: {},
	props: {
		poll: { type: Object, required: true },
		readOnly: { type: Boolean, required: false, default: false },
	},
	data() {
		return {}
	},
	mounted() {},
	computed: {
		
	},
	methods: {
		formatDate(dateVal) {
			return moment(dateVal).format("L")
		},

		getIconForLaw(law) {
			switch (law.status) {
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
}
</script>

<style lang="scss" scoped>
/* size of proposal image */
$avatar_size: 70px;

.poll-panel {
	.card-header {
		padding: 5px 10px;
		font-size: 18px;  // same as .law-title
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.poll-proposal {
		margin: 0 10px;
		padding: 10px 0;
	}
	.poll-proposal:not(:last-child) {
		border-bottom: 1px dotted rgba(0, 0, 0, 0.125);	
	}
	.goto-poll-icon {
		color: $primary;
		line-height: 1.5;   // was overwritten  by  "fas"
		float: right;
	}
	// law-panel inside poll panel - list of proposals in poll
	.law-panel {
		height: 30px + 25px + $avatar_size + 15px;  // title + subtitle + avatar_img + padding
		overflow: hidden;
		padding: 10px 10px 10px 10px;
		.law-title {
			margin-bottom: 5px;
			padding: 0;
			font-size: 18px;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
		.law-subtitle {
			font-size: 10px;
			color: #BBB;
			margin-bottom: 5px;
		}
		.flex-fixed-width {
			flex: 0 0 $avatar_size + 10px;
			//border: 1px solid red;
		}
		.law-image {
			border-radius: 5px;
			min-width: $avatar_size;
			max-width: $avatar_size;
			width: $avatar_size;
			min-height: $avatar_size;
			max-height: $avatar_size;
			height: $avatar_size;
			margin-right: 10px;
			
		}
		
		.law-description {
			font-size: 12px;
			height: $avatar_size;
			max-height: $avatar_size;
			overflow: hidden;
		}
		.supported {
			color: green;
		}
	}
	
}


</style>
