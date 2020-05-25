<template>
	<div class="liquido-input">
 		<label v-if="label" :for="id">{{label}}</label>
		<input 
			:id="id" 
			v-model="inputValue" 
			class="form-control" 
			:class="validClass"
			:type="type" 
			:placeholder="placeholder"
			:maxlength="maxlength"
			v-on:input="$emit('input', $event.target.value)"
			v-on:blur="$emit('blur', $event.target.value)"
		>
		<div v-if="invalidFeedback" class="invalid-feedback">{{invalidFeedback}}</div>
	</div>
</template>

<script>
/**
 * HTML Form Input field with validation feedback
 * 
 * This input field can have three states:
 *  - null:  Input has not been validated yet. Will not show any validation feedback
 *  - false: Value is currently invalid. Marked in red and show invalid-feedback message
 *  - true:  Input has been validated and is value is valid. Marked in green and may show valid-feedback message
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
		value: String,
		label: String,
		placeholder: String,
		type: { type: String, required: false, default: "Text" },
		maxlength: Number,
		invalidFeedback: String,
		status: { type: Boolean, required: false, default: null },
	},
  data() {
    return {
			inputValue: this.value
		}
  },
  mounted() { },
  computed: {
		validClass() {
			return { 'is-valid' : this.status === true, 'is-invalid' : this.status === false }   // status === null will set no class at all
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
}
</style>
