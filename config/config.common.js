/**
 * Common configuration that is used in all environments.
 * This file is merged into the environment specific configs.
 */

export default {
	mockBackend: false,
	usernameMinLength: 5,
	inviteCodeLength: 6,			// used for validating inviteCodes in welcome-chat.vue
	pollTitleMinLength: 10,
}