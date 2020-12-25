<template>
	<b-card
		:id="law.id"
		no-body
		class="law-panel"
	>
		<div>
			<h4 class="law-title">
				<i
					:class="iconForLaw"
					class="title-icon"
				/>
				&nbsp;{{ law.title }}
			</h4>
		</div>
		<div class="law-subtitle d-flex">
			<div class="createdAt flex-fixed-width">
				<i class="far fa-clock" />
				&nbsp;{{ formatDate(law.createdAt) }}
			</div>
			<div class="user">
				<i class="far fa-user" />
				&nbsp;{{ law.createdBy.profile.name }}
			</div>
			<div
				:class="{ supported: law.supportedByCurrentUser }"
				class="like-button flex-grow-1 text-right"
			>
				<i
					:class="{
						far: !law.supportedByCurrentUser,
						fas: law.supportedByCurrentUser,
					}"
					class="fa-thumbs-up"
				/>
				&nbsp;{{ law.numSupporters }}
			</div>
		</div>
		<div class="d-flex">
			<div class="flex-fixed-width">
				<img
					:src="'https://picsum.photos/seed/' + law.id + '/100'"
					alt="Image"
					class="law-image"
				>
			</div>
			<div class="law-description">
				{{ law.description }}
			</div>
			<a
				v-if="!readOnly"
				class="collapse-icon"
				href="#"
				@click="toggleCollapse()"
			>
				<i class="fa" />
			</a>
		</div>
	</b-card>
</template>

<script>
import moment from "moment"

export default {
	name: "LawCard",
	components: {},
	filters: {},
	mixins: [],
	props: {
		law: { type: Object, required: true },
		readOnly: { type: Boolean, required: false, default: false },
		collapsed: { type: Boolean, required: false, default: false },
	},
	data() {
		return {}
	},
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
	beforeCreate() {},
	created() {},
	beforeMount() {},
	mounted() {
		if (this.collapsed) this.toggleCollapse()
	},
	beforeUpdate() {},
	updated() {},
	beforeDestroy() {},
	methods: {
		formatDate(dateVal) {
			return moment(dateVal).format("L")
		},
		toggleCollapse() {
			$(".law-panel").toggleClass("collapse-law-panel")
			$(".collapse-icon").toggleClass("collapsed")
		},
	},
}
</script>

<style lang="scss" scoped>
$avatar_size: 90px;

.law-panel {
	// Law panel has a fixed height:   title + subtitle + avatar_img + padding
	height: 30px + 25px + $avatar_size + 15px;
	overflow: hidden;
	padding: 5px 10px 10px 10px;

	&.collapse-law-panel {
		height: 55px;
		.like-button {
			margin-right: 1.4rem; // some space for collapse icon
		}
	}

	.flex-fixed-width {
		flex: 0 0 100px;
		//border: 1px solid red;
	}

	.law-title {
		height: 30px;
		line-height: 30px;
		margin: 0;
		padding-top: 0;
		font-size: 18px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.title-icon {
		font-size: 80%;
	}

	.law-subtitle {
		font-size: 10px;
		//line-height: 15px;
		height: 18px;
		min-height: 18px;
		color: #bbb;
		margin-bottom: 5px;
		//border-bottom: 1px solid rgba(0, 0, 0, 0.1);;
		//-webkit-box-shadow: 0 0.1rem 0.2rem rgba(0, 0, 0, 0.1);
		//box-shadow: 0 0.1rem 0.2rem rgba(0, 0, 0, 0.1);
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
		height: $avatar_size;
		max-height: $avatar_size;
		overflow: hidden;
	}
}

.collapse-icon {
	position: absolute;
	bottom: 0;
	right: 10px;
}

.collapse-icon .fa:before {
	content: "\f139";
}

.collapse-icon.collapsed .fa:before {
	content: "\f13a";
}

.supported {
	color: green;
}
</style>
