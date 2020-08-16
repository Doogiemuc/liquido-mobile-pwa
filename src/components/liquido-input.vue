<template>
	<div class="liquido-input">
		<label v-if="label" :for="id" :class="{ disabled: disabled }">
			{{
			label
			}}
		</label>
		<input
			:id="id"
			:name="name"
			:value="value"
			:class="validClass"
			:type="type"
			:placeholder="placeholder"
			:disabled="disabled"
			:maxlength="maxlength"
			class="form-control"
			@keyup="keyup"
			@input="$emit('input', $event.target.value)"
			@blur="blur"
		/>
		<div class="iconRight">
			<slot name="iconRight"></slot>
		</div>
		<div v-if="invalidFeedback" class="invalid-feedback">{{ invalidFeedback }}</div>
	</div>
</template>

<script>
/**
 * HTML Form Input field with validation feedback
 * ==============================================
 *
 * This input field can have three states:
 *  - null:  Input has not been validated yet. Will not show any validation feedback
 *  - false: Value is currently invalid. Marked in red and show invalid-feedback message
 *  - true:  Input has been validated and is value is valid. Marked in green and may show valid-feedback message
 *
 * The one and only delicate logic for validating an input field
 * =============================================================
 *
 * When the field is new or untouched, then do not show any error message.
 * When the field is focused for the first time and the content may still be invalid, then do not show an error message yet.
 * While the user types for the first time, then do not show any validation error yet.
 *
 * When the field becomes valid for the first time, then show green success feedback.
 *
 * When the user submits the field, eg. by pressing enter (or "done" on the iOS keyboard), then validate the field and show validation feedback message red or green.
 *
 * When the field was validated before, then update the validation feedback message according to the current value.
 *
 * (Goal: Only ever show an error message, when the field was successfully valid before at least once or the user tried to submit the field.)
 *
 * Example Usage
 * =============
 *
 *   <liquido-input v-model="idea.title" id="ideaTitleInput" :label="$t('ideaTitle')" :validFunc="isTitleValid" validateOn="blur"></liquido-input>
 */
export default {
	name: "LiquidoInput",
	props: {
		id: String,
		name: String,
		value: String,
		label: String,
		placeholder: String,
		type: { type: String, required: false, default: "Text" },
		disabled: Boolean,
		maxlength: Number,
		invalidFeedback: String,
		validFunc: { type: Function, required: false, default: () => true },
		validateOn: { type: String, required: false, default: "keyup" }, //TODO: these could be arrays, e.g. validateOn: ["keyup", "blur"]
		forceValidateOn: { type: String, required: false, default: "blur" },
	},
	data() {
		return {
			/**
			 * 'state' can be one of
			 * null  - field has not been validated yet. -> Do not show an error message yet
			 * false - fields value is currently invlaid -> show error message
			 * true  - fields value is valid -> show field in green with checkmark
			 */
			state: null,
		}
	},
	mounted() {},
	computed: {
		/**
		 * Compute wether to add the is-valid or is-invalid pseudo class depending on the input's "state"
		 * If state == null, e.g. when the field was not validated at all yet, then no pseudo class is added.
		 */
		validClass() {
			return {
				"is-valid": this.state === true,
				"is-invalid": this.state === false,
				// state === null will set no class at all
			}
		},
	},
	methods: {
		keyup(evt) {
			if (this.validateOn === "keyup") {
				this.validateField()
			}
			this.$emit("keyup", evt) // let event bubble up
		},

		blur(evt) {
			if (this.forceValidateOn === "blur") {
				this.validateField(true)
			}
			this.$emit("blur", evt)
		},

		/**
		 * Validate the current value of the field with <pre>validFunc</pre>
		 * If valid, then this.state will be set to true and field will be marked in green.
		 * If invalid and then mark the field as invalid but only if it was validated successfully before or parameter force is given as true.
		 * @param force enable error message when fields value is invalid
		 */
		validateField(force = false) {
			let valid = this.validFunc(this.value)
			if (valid) {
				this.state = true
			} else {
				if (this.state !== null || force) this.state = false
			}
		},
	},
}
</script>

<style lang="scss" scoped>
.liquido-input {
	position: relative;
	padding-top: 12px;
	margin-bottom: 1rem;
	label {
		position: absolute;
		color: #666;
		font-size: 0.8rem;
		font-weight: normal;
		top: 0;
		left: 5px;
		padding: 0 3px;
		background: white;
		border-radius: 5px;
		&.disabled {
			background-color: #e9ecef;
		}
	}

	.iconRight {
		position: absolute;
		top: 18px;
		right: 10px;
	}
}
</style>
