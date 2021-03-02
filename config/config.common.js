/**
 * Common LIQUIDO PWA configuration that is used in all environments.
 * This file is merged into the environment specific configs.
 */

//TODO: this is built-in into vue-cli. We can simply use .env.production files.

export default {
	mockBackend: false,
	usernameMinLength: 5,
	inviteCodeLength: 6,			// used for validating inviteCodes in welcome-chat.vue
	pollTitleMinLength: 10,
	inviteLinkPrefix: "http://www.liquido.me/invite?inviteCode=",
}