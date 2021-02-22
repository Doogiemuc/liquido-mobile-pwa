<template>
	<b-modal 
		:id="id"
		ref="modalRef"
		centered
		no-close-on-backdrop
		:content-class="modalContentClass"
	>
		<template #modal-header>
			<i :class="headerIconClass" class="bounce-anim-icon"></i>
			<div class="header-icon-shadow bounce-anim-shadow">&nbsp;</div>
		</template>
		<template #default>
			<slot>{{ message }}</slot>
		</template>
		<template #modal-footer="{ ok }">
			<b-button variant="primary" class="ok-button" @click="ok()">
				{{ $t('Ok') }}
			</b-button>
		</template>
	</b-modal>
</template>

<script>
/**
 * Bootstrap modal for info, success, warning and error messages.
 */
export default {

	name: "PopupModal",

	props: {
		id: { type: String, required: true },
		type: { type: String, required: false, default: "info" },
		message: { type: String, required: true },
		contentClass:  { type: String, required: false, default: "" },
	},
	data() {
		return {
		}
	},
	computed: {
		headerIconClass() {
			switch (this.type) {
				case "primary":
					return "far fa-check-circle header-icon header-icon-primary"
				case "success":
					return "far fa-check-circle header-icon header-icon-success"
				case "warn":
				case "warning":
					return "fas fa-exclamation-circle header-icon header-icon-warn"
				case "danger":
				case "error":
					return "fas fa-exclamation-circle header-icon header-icon-danger"
				default:
					return "fas fa-info-circle header-icon header-icon-info"
			}
		},
		modalContentClass() {
			switch (this.type) {
				case "primary":
					return "bg-primary text-white " + this.contentClass
				case "success":
					return "bg-success text-white " + this.contentClass
				case "warn":
				case "warning":
					return "bg-warning text-dark" + this.contentClass
				case "danger":
				case "error":
					return "bg-danger text-white" + this.contentClass
				default:
					return "bg-info text-white " + this.contentClass
			}
		}
	},
	methods: {
		show() {
			this.$bvModal.show(this.id)
		},
		hide() {
			this.$bvModal.hide(this.id)
		},
		close() {   // be nice to your callers :-)
			this.$bvModal.hide(this.id)
		},
		toggle() {
			this.$refs["modalRef"].toggle()
		}
	},
}
</script>

<style lang="scss">
.modal-content {
	.modal-header {
		border-bottom: none;   // "Less is more in UI-design!"
		height: 3rem;
	}
	.header-icon {
		z-index: 2020;
		position: absolute;
		text-align: center;
		top: -3.5rem;
		left: 0;
		right: 0;
		width: 6rem;
		margin: 0 auto;
		font-size: 6rem;
		border-radius: 50%;
	}

	/* 
	This is an unbelievable cool animated 3D shadow below the bouncing header icon. CSS ftw :-) 
	The object that casts the shadow is a transparent oval.
	The actual shadow is well below the oval. So that the oval does not cover the shadow.
	And it is behind the icon, but above the modal.
	*/
	.header-icon-shadow {
		z-index: 2010;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		width: 5rem;
		height: 1rem;
		margin: 0 auto;
		background-color: rgba(0, 0, 0, 0);
		border-radius: 50%;
		//border: 1px solid red; // for debugging :-)
		box-shadow: -5px 1.2rem 10px 2px rgba(0, 0, 0, 0.5);
	}
	.header-icon-danger {
		color: darkred;
		background-color: #dc3545;
	}
	.header-icon-success {
		background-color: darkgreen;
	}
	.header-icon-info {
		color: $primary;
	}
	.header-icon-warn {
		color: darkgoldenrod;
	}
	.modal-footer {
		justify-content: center;
		border-top: none;
	}
	.ok-button {
		//font-weight: bold;
		width: 100%;
		border: none;
	}

	/* Unbelievably clever 3D shadow bounce animation */
	.bounce-anim-icon {
		animation-direction: alternate-reverse;
		animation-duration: 1s;
		animation-iteration-count: infinite;
		animation-name: bounce-anim-icon;
		transition-timing-function: linear;
	}
	@keyframes bounce-anim-icon {
		from {
			transform: scale(1.0, 0.8) translateY(12%);
			animation-timing-function: linear;
		}
		25% {
			transform: scale(1.0, 1.0) translateY(0); 
			animation-timing-function: cubic-bezier(0.0, 0.5, 0.5, 1.0);
		}
		to  {
			transform: scale(1.0, 1.0) translateY(-20px);
			animation-timing-function: cubic-bezier(0.5, 0.0, 1.0, 0.5)
		}
	}

	.bounce-anim-shadow {
		animation-direction: alternate-reverse;
		animation-duration: 1s;
		animation-iteration-count: infinite;
		animation-name: bounce-anim-shadow;
	}
	@keyframes bounce-anim-shadow {
		from {
			transform: scaleX(1.0);
		}
		50%,
		to  {
			transform: scaleX(0.8)
		}
	}

	&.bg-primary .btn {
		background-color: grey;
	}
	&.bg-danger .btn {
		background-color: darkred;
	}
	&.bg-success .btn {
		background-color: darkgreen;
	}
	&.bg-warning .btn {
		background-color: darkgoldenrod;
	}

}



</style>
