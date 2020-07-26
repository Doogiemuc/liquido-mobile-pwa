/**
 * This is a very simple Store singleton.
 * 
 * See https://vuejs.org/v2/guide/state-management.html#Simple-State-Management-from-Scratch
 * 
 * (I don't need - and sorry yes, I also don't like - VUEX :) Its plain simply overengeneered.
 */

import { uniqueId } from "lodash";

// just a dummy to create test data
var addDays = function(date, days) {
	var result = new Date(date);
	result.setDate(result.getDate() + days);
	return result;
}


export default {
	// All these attributes are even reactive.

	/** Currently logged in User */
	user: {
		profile: {
			name: "Demo Admin",
		},
		email: "admin1@liquido.me",
		isAdmin: true
	},

	/** Users team */
	team: {
		name: undefined,
		inviteCode: undefined,
		qrCode: undefined
	},

	//** Current status filter on the /polls page */
	pollStatusFilter: undefined,

	//
	// ==========DUMMY DATA FOR TESTING ==========
	//

	polls: [
		{
			id: 99,
			title: "Ich bin eine neue erstellte Abstimmung",
			status: "ELABORATION",
			votingStartAt: addDays(new Date(), 10),
			votingEndAt:   addDays(new Date(), 20),
		},
		{
			id: 101,
			title: "Example poll in voting with a very long titela asddfasdf dd",
			status: "VOTING",
			votingStartAt: addDays(new Date(), -1),
			votingEndAt:   addDays(new Date(), +9),

			proposals: [
				{
					id: 2001,
					title: "Proposal One qurg ASD asdfcvvef fdadsf ddd fff ddccc c ewe e",
					description: "Just an example proposal Bei relativ positionierten Elementen (position: relative) wird das Element aus seiner normalen Position im Elementfluss verschoben. Dabei gilt: Wenn die top Eigenschaft definiert wurde, überschreibt diese den Wert der bottom Eigenschaft. Wenn top den Wert auto besitzt, ist der berechnete Wert für bottom gleich dem Wert der top Eigenschaft mit umgedrehtem Vorzeichen. Wenn beide Eigenschaften nicht den Wert auto besitzen, wird bottom ignoriert und auf auto gesetzt.",
					status: "VOTING",
					createdAt: new Date(),

					updatedAt: new Date(),
					area: {
						id: 4001,
						title: "Example Area"
					},
					supporters: [
						
					],
					numSupporters: 15,
					supportedByCurrentUser: true,
					createdBy: {
						id: 7001,
						email: "user1@liqudo.vote",
						profile: {
							name: "User1longname Mobileasdf",
							mobilephone: "#491234517",
							picture: "/img/avatars/Avatar1.png",
						}
					}
				},
				{
					id: 2002,
					title: "Proposal Two",
					description: "Yet another example proposal xcvxclk c vd xc asdf cxvyxcv yxcv xycv ",
					status: "VOTING",
					createdAt: new Date(),
					updatedAt: new Date(),
					area: {
						id: 4002,
						title: "Example Area"
					},
					supporters: [
						
					],
					numSupporters: 9,
					supportedByCurrentUser: false,
					createdBy: {
						id: 7002,
						email: "user2@liqudo.vote",
						profile: {
							name: "User2 Mobile",
							mobilephone: "#491234518",
							picture: "/img/avatars/Avatar2.png",
						}
					}
				},
				{
					id: 2003,
					title: "Proposal Three with a very long title that will break more than three lines just to besure we make it very long",
					description: "Yet another example proposal xcvxclk c vd xc asdf cxvyxcv yxcv xycv ",
					status: "VOTING",
					createdAt: new Date(),
					updatedAt: new Date(),
					area: {
						id: 4002,
						title: "Example Area"
					},
					supporters: [
						
					],
					numSupporters: 92345,
					supportedByCurrentUser: true,
					createdBy: {
						id: 7002,
						email: "user4@liqudo.vote",
						profile: {
							name: "User4 Mobile",
							mobilephone: "#491234514",
							picture: "/img/avatars/Avatar4.png",
						}
					}
				}
			],
			area: {
				id: 4001,
				title: "Example Area"
			},
			winner: undefined,
			duelMatrix: undefined
		},

		{
			id: 102,
			title: "Example poll in elaboration",
			status: "ELABORATION",
			votingStartAt: addDays(new Date(), -5),
			votingEndAt:   addDays(new Date(), +9),

			proposals: [
				{
					id: 2001,
					title: "Proposal One qurg ASD asdfcvvef fdadsf ddd fff ddccc c ewe e",
					description: "Just an example proposal Bei relativ positionierten Elementen (position: relative) wird das Element aus seiner normalen Position im Elementfluss verschoben. Dabei gilt: Wenn die top Eigenschaft definiert wurde, überschreibt diese den Wert der bottom Eigenschaft. Wenn top den Wert auto besitzt, ist der berechnete Wert für bottom gleich dem Wert der top Eigenschaft mit umgedrehtem Vorzeichen. Wenn beide Eigenschaften nicht den Wert auto besitzen, wird bottom ignoriert und auf auto gesetzt.",
					status: "VOTING",
					createdAt: new Date(),

					updatedAt: new Date(),
					area: {
						id: 4001,
						title: "Example Area"
					},
					supporters: [
						
					],
					numSupporters: 15,
					supportedByCurrentUser: true,
					createdBy: {
						id: 7001,
						email: "user1@liqudo.vote",
						profile: {
							name: "User1longname Mobileasdf",
							mobilephone: "#491234517",
							picture: "/img/avatars/Avatar1.png",
						}
					}
				},
				{
					id: 2002,
					title: "Proposal Two",
					description: "Yet another example proposal xcvxclk c vd xc asdf cxvyxcv yxcv xycv ",
					status: "VOTING",
					createdAt: new Date(),
					updatedAt: new Date(),
					area: {
						id: 4002,
						title: "Example Area"
					},
					supporters: [
						
					],
					numSupporters: 9,
					supportedByCurrentUser: false,
					createdBy: {
						id: 7002,
						email: "user2@liqudo.vote",
						profile: {
							name: "User2 Mobile",
							mobilephone: "#491234518",
							picture: "/img/avatars/Avatar2.png",
						}
					}
				},
				{
					id: 2003,
					title: "Proposal Three with a very long title that will break more than three lines just to besure we make it very long",
					description: "Yet another example proposal xcvxclk c vd xc asdf cxvyxcv yxcv xycv ",
					status: "VOTING",
					createdAt: new Date(),
					updatedAt: new Date(),
					area: {
						id: 4002,
						title: "Example Area"
					},
					supporters: [
						
					],
					numSupporters: 92345,
					supportedByCurrentUser: true,
					createdBy: {
						id: 7002,
						email: "user4@liqudo.vote",
						profile: {
							name: "User4 Mobile",
							mobilephone: "#491234514",
							picture: "/img/avatars/Avatar4.png",
						}
					}
				}
			],
			area: {
				id: 4001,
				title: "Example Area"
			},
			winner: undefined,
			duelMatrix: undefined
		},

		{
			id: 103,
			title: "Poll numbe two",
			status: "ELABORATION",
			votingStartAt: addDays(new Date(), -1),
			votingEndAt:   addDays(new Date(), +9),

			proposals: [
				{
					id: 2001,
					title: "Proposal One qurg ASD asdfcvvef fdadsf ddd fff ddccc c ewe e",
					description: "Just an example proposal Bei relativ positionierten Elementen (position: relative) wird das Element aus seiner normalen Position im Elementfluss verschoben. Dabei gilt: Wenn die top Eigenschaft definiert wurde, überschreibt diese den Wert der bottom Eigenschaft. Wenn top den Wert auto besitzt, ist der berechnete Wert für bottom gleich dem Wert der top Eigenschaft mit umgedrehtem Vorzeichen. Wenn beide Eigenschaften nicht den Wert auto besitzen, wird bottom ignoriert und auf auto gesetzt.",
					status: "VOTING",
					createdAt: new Date(),

					updatedAt: new Date(),
					area: {
						id: 4001,
						title: "Example Area"
					},
					supporters: [
						
					],
					numSupporters: 15,
					supportedByCurrentUser: true,
					createdBy: {
						id: 7001,
						email: "user1@liqudo.vote",
						profile: {
							name: "User1longname Mobileasdf",
							mobilephone: "#491234517",
							picture: "/img/avatars/Avatar1.png",
						}
					}
				},
				{
					id: 2002,
					title: "Proposal Threeeeeeee eee e e e",
					description: "Yet another example proposal xcvxclk c vd xc asdf cxvyxcv yxcv xycv ",
					status: "VOTING",
					createdAt: new Date(),
					updatedAt: new Date(),
					area: {
						id: 4002,
						title: "Example Area"
					},
					supporters: [
						
					],
					numSupporters: 9,
					supportedByCurrentUser: false,
					createdBy: {
						id: 7002,
						email: "user2@liqudo.vote",
						profile: {
							name: "User2 Mobile",
							mobilephone: "#491234518",
							picture: "/img/avatars/Avatar2.png",
						}
					}
				},
				{
					id: 2003,
					title: "Proposal Three with a very long title that will break more than three lines just to besure we make it very long",
					description: "Yet another example proposal xcvxclk c vd xc asdf cxvyxcv yxcv xycv ",
					status: "VOTING",
					createdAt: new Date(),
					updatedAt: new Date(),
					area: {
						id: 4002,
						title: "Example Area"
					},
					supporters: [
						
					],
					numSupporters: 92345,
					supportedByCurrentUser: true,
					createdBy: {
						id: 7002,
						email: "user4@liqudo.vote",
						profile: {
							name: "User4 Mobile",
							mobilephone: "#491234514",
							picture: "/img/avatars/Avatar4.png",
						}
					}
				}
			],
			area: {
				id: 4001,
				title: "Example Area"
			},
			winner: undefined,
			duelMatrix: undefined
		},

		{
			id: 104,
			title: "Poll numbe four",
			status: "ELABORATION",
			votingStartAt: addDays(new Date(), -1),
			votingEndAt:   addDays(new Date(), +9),

			proposals: [
				{
					id: 2001,
					title: "Proposal One qurg ASD asdfcvvef fdadsf ddd fff ddccc c ewe e",
					description: "Just an example proposal Bei relativ positionierten Elementen (position: relative) wird das Element aus seiner normalen Position im Elementfluss verschoben. Dabei gilt: Wenn die top Eigenschaft definiert wurde, überschreibt diese den Wert der bottom Eigenschaft. Wenn top den Wert auto besitzt, ist der berechnete Wert für bottom gleich dem Wert der top Eigenschaft mit umgedrehtem Vorzeichen. Wenn beide Eigenschaften nicht den Wert auto besitzen, wird bottom ignoriert und auf auto gesetzt.",
					status: "VOTING",
					createdAt: new Date(),

					updatedAt: new Date(),
					area: {
						id: 4001,
						title: "Example Area"
					},
					supporters: [
						
					],
					numSupporters: 15,
					supportedByCurrentUser: true,
					createdBy: {
						id: 7001,
						email: "user1@liqudo.vote",
						profile: {
							name: "User1longname Mobileasdf",
							mobilephone: "#491234517",
							picture: "/img/avatars/Avatar1.png",
						}
					}
				},
				{
					id: 2002,
					title: "Proposal Two",
					description: "Yet another example proposal xcvxclk c vd xc asdf cxvyxcv yxcv xycv ",
					status: "VOTING",
					createdAt: new Date(),
					updatedAt: new Date(),
					area: {
						id: 4002,
						title: "Example Area"
					},
					supporters: [
						
					],
					numSupporters: 9,
					supportedByCurrentUser: false,
					createdBy: {
						id: 7002,
						email: "user2@liqudo.vote",
						profile: {
							name: "User2 Mobile",
							mobilephone: "#491234518",
							picture: "/img/avatars/Avatar2.png",
						}
					}
				},
				{
					id: 2003,
					title: "Proposal Three with a very long title that will break more than three lines just to besure we make it very long",
					description: "Yet another example proposal xcvxclk c vd xc asdf cxvyxcv yxcv xycv ",
					status: "VOTING",
					createdAt: new Date(),
					updatedAt: new Date(),
					area: {
						id: 4002,
						title: "Example Area"
					},
					supporters: [
						
					],
					numSupporters: 92345,
					supportedByCurrentUser: true,
					createdBy: {
						id: 7002,
						email: "user4@liqudo.vote",
						profile: {
							name: "User4 Mobile",
							mobilephone: "#491234514",
							picture: "/img/avatars/Avatar4.png",
						}
					}
				}
			],
			area: {
				id: 4001,
				title: "Example Area"
			},
			winner: undefined,
			duelMatrix: undefined
		}
	],
	
	//
	// ========== These methods change the content of the store ("mutations" in vuex) ==========
	//

	isAdmin() {
		return this.user.isAdmin
	},

	setPollStatusFilter(newVal) {
		this.pollStatusFilter = newVal
	},

	getPollStatusFilter(newVal) {
		return this.pollStatusFilter
	},


	getPollById(pollId) {
		return this.polls.find(poll => poll.id == pollId)
	},

	setShowFooter(showFooter) {
		this.showFooter = showFooter
	},

	getCurrentUser() {
		return this.user
	},

	getToken() {
		return "dummy-JWT-token"
	},

	/** Find a poll by its ID. May return undefined if ID is not found! */
	getPollById(pollId) {
		return this.polls.find(p => p.id == pollId)   // pollId might be a String or a Number!
	},

	getProposalById(poll, proposalId) {
		return poll.proposals.find(prop => prop.id == proposalId)
	},

	savePoll(poll) {
		if (!typeof poll === "object") return Promise.reject("Cannot savePoll. Need poll object")
		if (!poll.title) return Promise.reject("Cannot savePoll. Need title")
		//TODO: savePoll() call backend
		if (!poll.id) {
			console.log("Creating new poll: '"+poll.title+"'")
			poll.id = uniqueId()
			poll.status = "ELABORATION"
			this.polls.push(poll)
		} else {
			var existingPoll = this.polls.find(p => p.id === poll.id)
			if (existingPoll === undefined) return Promise.reject("Cannot savePoll. Cannot find poll with id="+poll.id)
			existingPoll = poll
			poll.id = existingPoll.id
			console.log("poll(id="+poll.id+") saved.")
		}
		return Promise.resolve(poll)
	},

	/**
	 * Add or update a proposal in a poll.
	 * @param {Object} poll An existing poll
	 * @param {Object} proposal a new proposal to add (without an ID) or an existing proposal that shall be updated (with ID)
	 */
	saveProposal(poll, proposal) {
		if (!poll || !poll.id) return Promise.reject("Need poll to saveProposal()")
		if (!proposal) return Promise.reject("Need proposal to saveProposal()")
		// more sanity checks in the backend ...
		if (!poll.proposals) poll.proposals = []
		proposal.createdBy = this.getCurrentUser()
		if (proposal.id) {
			// update existing proposal
			var prop = this.getProposalById(poll, proposal.id)
			prop = proposal
			console.log("Updated proposal in poll(id="+poll.id+"): '"+prop.title+"'")
		} else {
			proposal.id = uniqueId()
			poll.proposals.push(proposal)
			console.log("Added new proposal to poll(id="+poll.id+"): '"+proposal.title+"'")
		}
		
		return Promise.resolve(poll)
	}

}