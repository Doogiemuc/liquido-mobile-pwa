<template>
	<b-modal 
		:id="id"
		ref="modalRef"
		centered
		ok-only
		no-close-on-backdrop
		:content-class="modalContentClass"
	>
		<template #modal-header>
			<i :class="headerIconClass"></i>
			<div class="header-icon-shadow">&nbsp;</div>
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
			console.log("showing", this.id)
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
	.header-icon-danger {
		color: darkred;
		background-color: #dc3545;
	}
	.header-icon-success {
		background-color: green;
	}
	.header-icon-info {
		color: $primary;
	}
	.header-icon-warn {
		color: darkgoldenrod;
	}
	.header-icon-shadow {
		z-index: 2010;   // behind icon
		position: absolute;
		top: 0.8rem;
		left: 0;
		right: 0;
		width: 6rem;
		height: 1rem;
		margin: 0 auto;
		//background-color: rgba(0, 0, 0, 0);
		border-radius: 50%;
		//border: 1px solid red;
		box-shadow: 0 20px 10px 2px rgba(0, 0, 0, 0.5) ;
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
}

.modal-content.bg-danger .ok-button {
	background-color: darkred;
}
.modal-content.bg-success .ok-button {
	background-color: darkgreen;
}
.modal-content.bg-warning .ok-button {
	background-color: darkgoldenrod;
}

</style>
