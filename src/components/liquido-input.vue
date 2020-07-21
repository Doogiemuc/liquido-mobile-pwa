<template>
	<div class="liquido-input">
 		<label v-if="label" :for="id">{{label}}</label>
		<input 
			:id="id" 
			:name="name"
			:value="value" 
			class="form-control" 
			:class="validClass"
			:type="type" 
			:placeholder="placeholder"
			:disabled="disabled"
			:maxlength="maxlength"
			v-on:input="$emit('input', $event.target.value)"
			v-on:blur="$emit('blur', $event.target.value)"
		>
		<div class="iconRight">
			<slot name="iconRight"></slot>
		</div>
		<div v-if="invalidFeedback" class="invalid-feedback">{{invalidFeedback}}</div>
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
 * When the field is new and untouched, then do not show any error message.
 * When the field is focused for the first time and the content is still invalid, then do not show an error message yet.
 * When the field validates, for example, because the user has entered enough characters, then immidiately show the field as valid with a gree border and a checkmark.
 * When the user presses enter or blurs the field (or clicks on "done" on the iOS keyboard), then validate the current value and show corresponding valid/invalid message.
 * (Goal: Only ever show an error message, when the field was touched by the user before.)
 * 
 * Example Usage
 * =============
 * 
 *   <liquido-input v-model="idea.title" id="ideaTitleInput" :label="$t('ideaTitle')" :status="titleStatus" @blur="titleValidated = true"></liquido-input>
 */
export default {
	name: "liquido-input",
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
		state: { type: Boolean, required: false, default: null },
	},
  data() {
    return {
		}
  },
  mounted() { },
  computed: {
		validClass() {
			return { 'is-valid' : this.state === true, 'is-invalid' : this.state === false }   // status === null will set no class at all
		}
	},
  methods: {
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
		font-size: 1rem;
		top: 0;
		left: 5px;
		padding: 0 3px;
		background: white;
		border-radius: 5px;
	}
	.iconRight {
		position: absolute;
		top: 18px;
		right: 5px;
	}
}
</style>
