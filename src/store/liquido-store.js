/**
 * This is a very simple Store singleton.
 * 
 * See https://vuejs.org/v2/guide/state-management.html#Simple-State-Management-from-Scratch
 * 
 * (I don't need - and sorry yes, I also don't like - VUEX :) Its plain simply overengeneered.
 */

export default {
	debug: true,

	// These attributes are reactive.
	showFooter: true,
	user: {
		name: undefined,
		email: undefined
	},
	team: {
		name: undefined,
		inviteCode: undefined,
		qrCode: undefined
	},
	
	// These methods change the content of the store ("mutations" in vuex)
	setShowFooter(showFooter) {
		this.showFooter = showFooter
	}

}