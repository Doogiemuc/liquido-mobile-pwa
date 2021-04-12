/**
 * End-2-end HAPPY CASE test for liquido-mobile-pwa frontend.
 * This test runs through the easiest possible use case flow.
 * Only the successful "happy path" without any error cases or edge cases.
 */
//import { inspect } from 'util'  // better than JSON.stringify

import config from '../../config/config.test'

let now = Date.now() % 10000
console.log("Running Cypress HAPPY CASE test (test_uuid="+now+")", "NODE_ENV="+process.env.NODE_ENV, "Liquido config:", config)

let fix = {}  // Test fixtures within this test RUN

/* When one of test steps of happy case fails, then abort the whole test run. */
afterEach(function() {
  if (this.currentTest.state === 'failed') {
		console.log("Cypress test step in happy case failed. Aborting.")
    Cypress.runner.stop()
  }
});


context('Happy Case', () => {

	/** 
	 * Create test fixtures for this test run. 
	 * Each happy case run creates a new admin in a new team.
	 */
	before(() => {
		fix.userName   = 'Cypress User-'+now
		fix.userEmail  = 'cypressUser-'+now+'@liquido.me'
		fix.adminName  = 'Cypress Admin-'+now
		fix.adminMobilephone = '+49151555'+now
		fix.adminEmail = 'cypressAdmin-'+now+'@liquido.me'
		fix.teamName   = 'Cypress Team '+now
		fix.inviteCode = undefined
		fix.pollTitle  = 'Cypress Poll '+now
		fix.proposalTitle  = 'Cypress Proposal '+now
		fix.proposalDescription = now + ' lorem ipsum best description ever that needs to be a bit longer because we want to test things like clipping and many more useless UX magic'
		fix.proposalTitle2  = 'Second Proposal '+now
		fix.proposalDescription2 = now + ' Description of Second proposal. lorem ipsum best description ever that needs to be a bit long'
	})

	beforeEach(() => {
		console.log("===================================================")
		console.log("    TEST CASE >>>", Cypress.mocha.getRunner().suite.ctx.currentTest.title, "<<<")
		console.log("===================================================")
	})

	it('Create new team, poll and add first proposal', function() {
		//GIVEN some prepared test data
		assert.isString(fix.adminName)
		assert.isString(fix.teamName)
		assert.isString(fix.adminName)

		//WHEN we create a new team
		cy.visit("/")
		cy.get("#welcome-chat")
		cy.get('#userNameInput', {timeout: 8000}).type(fix.adminName).type("{enter}")  // implicitly checks that #userNameInput is not disabled
		cy.get('#createNewTeamButton').click()
		cy.get('#teamNameInput').type(fix.teamName)
		cy.get('#adminMobilephoneInput').type(fix.adminMobilephone)
		cy.get('#adminEmailInput').type(fix.adminEmail)
		cy.get('#createNewTeamOkButton').click()

		//THEN new team is created successfully 
		cy.get('#welcomeChatErrorModal').should('not.exist')   // no error modal is shown
		cy.get('#newTeamCreatedBubble').then(() => {
		// AND a JWT was put into the browser's localStorage
			fix.jwt = localStorage.getItem("LIQUIDO_JWT")
			assert.isString(fix.jwt, "Expected to find a JWT in localStorage!")
		})
		
		// AND there is an invite link and invite code
		cy.get("#inviteLink").should('contain', 'http')
		cy.get('#newTeamInviteCode').invoke('text').should('have.length.of.at.least', 6)
		cy.get('#newTeamInviteCode').then(inviteCodeElem => {
			fix.inviteCode = inviteCodeElem.text()
			console.log("New team inviteCode=", fix.inviteCode)
			cy.log("InviteCode="+fix.inviteCode)
		})
		cy.get('#gotoCreatePollButton').click()

		// ============= create poll
		//GIVEN
		cy.get('#poll-create')
		//WHEN adding a poll
		cy.get('#pollTitleInput').type(fix.pollTitle)
		cy.get('#createPollButton').click()
		//THEN newly created poll should be shown
		cy.get('#poll-show')
		cy.get('.poll-panel-title').should('contain.text', fix.pollTitle)
		cy.get('#addProposalButton').should('be.visible')

		// ============ add first proposal
		//GIVEN a newly created poll
		cy.get('#addProposalButton').click()
		//WHEN adding a proposal
		cy.get('#propTitle').type(fix.proposalTitle)
		cy.get('#propDescription').type(fix.proposalDescription, { delay: 1 })
		cy.get('#saveProposalButton').click()
		cy.get('#proposalSuccessfullyAddedModal #modalPrimaryButton').click()
		//THEN the poll is shown with that proposal
		cy.get('#poll-show')
		cy.get('.law-title').should('contain.text', fix.proposalTitle)

	})

		//TODO: create test with mocked error response to check error modal

	it('Returning user is automatically logged in', function() {
		//GIVEN a team and a jwt
		assert.isString(fix.teamName, "Need to be logged into a team already.")
		assert.isString(fix.jwt, "Need jwt from last test step.")

		// WHEN we simulate that the jwt is stored in localStorage
		localStorage.setItem("LIQUIDO_JWT", fix.jwt)
		//  AND visist the root start page
		cy.visit("/")
		// THEN we are automatically forwarded to team-home for that team.
		cy.get('#team-home').should('contain.text', fix.teamName)
	})
	
	it('Join team', function() {
		//GIVEN inviteCode and data for new member
		assert.isString(fix.inviteCode, "Need inviteCode to test joinTeam")
		assert.isString(fix.userName)
		assert.isString(fix.userEmail)
		assert.isString(fix.pollTitle, "Need existing poll to test joinTeam")
		assert.isString(fix.proposalTitle, "Need existing proposal to test joinTeam")

		//GIVEN user is not logged in
		cy.clearLocalStorage()   // just to be sure

		//WHEN joining a team
		cy.visit("/")
		cy.get('#userNameInput', {timeout: 8000}).type(fix.userName).type("{enter}")  // implicitly checks that #userNameInput is not disabled
		cy.get('#joinTeamButton').click()
		cy.get('#inviteCodeInput').type(fix.inviteCode)
		cy.get('#emailInput').type(fix.userEmail)
		cy.get('#joinTeamOkButton').click()

		//THEN team-home is shown
		cy.get('#joinedTeamBubble').should('contain.text', fix.teamName)
		cy.get('#joinedTeamGoToTeamButton').click()
		cy.get('#team-home').should('contain.text', fix.teamName)

		//WHEN navigating to team's polls
		cy.get("#gotoPollsButton").click()
		cy.get("#polls")

		//THEN poll with proposal should be shown
		cy.get('.poll-panel-title').should('contain.text', fix.pollTitle)
		cy.get('.poll-panel .law-title').should('contain.text', fix.proposalTitle)
	})

	
	it('Show team and its polls', function() {
		//GIVEN a logged in user
		cy.visit("/login?email="+fix.userEmail+"&teamName="+fix.teamName)
		//THEN correct team-home is shown
		cy.get('#team-home').should('contain.text', fix.teamName)

		//WHEN navigating to team's polls
		cy.get('#gotoPollsButton').click()
		//THEN then a poll with the created proposal from above
		cy.get('.poll-panel-title').should('contain.text', fix.pollTitle)
		cy.get('.poll-panel .law-title').should('contain.text', fix.proposalTitle)
		//cy.get('.poll-panel div.list-group').children('.proposal-list-group-item').should('have.length', 1)
	})

	it("User adds proposal", function() {
		assert.isString(fix.pollTitle, "Need existing poll to test joinTeam")

		//GIVEN a logged in user
		cy.visit("/login?email="+fix.userEmail+"&teamName="+fix.teamName)
		//WHEN going to polls
		cy.get('#gotoPollsButton').click()
		//THEN we see our poll in elaboration with the correct title
		cy.get("#elaborationArrow").click()
		cy.contains(".poll-panel-title", fix.pollTitle).click()
		
		// WHEN user adds a proposal
		cy.get("#addProposalButton").click()  // This might not be visible, when that user already added a proposal to the poll. => Not happy case
		cy.get("#propTitle").type(fix.proposalTitle2)
		cy.get("#propDescription").type(fix.proposalDescription2, { delay: 1 })
		cy.get("#saveProposalButton").click()
		cy.get('#proposalSuccessfullyAddedModal #modalPrimaryButton').click()
		
		//THEN the poll is shown with that proposal
		cy.get('#poll-show')
		cy.get('.law-title').should('contain.text', fix.proposalTitle2)
	})

	it("Admin starts voting phase", function() {
		//GIVEN a logged in admin
		cy.visit("/login?email="+fix.adminEmail+"&teamName="+fix.teamName)
		// AND the poll in elaboration that was created before
		cy.get('#gotoPollsButton').click()
		cy.contains(".poll-panel-title", fix.pollTitle).click()

		// WHEN admin stars voting phase
		cy.get("#startVoteButton").click()

		// THEN sucessModal is shown and poll is in status voting
		cy.get("#votingPhaseStartedModal #modalPrimaryButton").click()
		cy.get(".poll-panel[data-poll-status='VOTING']")
			.should("have.attr", "data-poll-status", "VOTING")  
	})

	
	it("User casts vote", function() {
		//GIVEN a logged in user
		cy.visit("/login?email="+fix.userEmail+"&teamName="+fix.teamName)
		// AND a poll in voting
		cy.get('#gotoPollsButton').click()
		cy.get("#votingArrow").click()
		cy.contains(".poll-panel-title", fix.pollTitle).click()
		cy.get("#goToCastVoteButton").click()
		cy.get("#cast-vote-page")

		// WHEN user casts his vote
		cy.get("#castVoteButton").click()
		
		// THEN success modal is shown
		cy.get("#castVoteSuccessModal").should("be.visible")
		cy.get("#castVoteSuccessModal #modalPrimaryButton").click()
		//  AND user is informed, that he can updated his ballot
		cy.get("#isUpdateableBallotInfo").should("be.visible")

		//WHEN verifing checksum
		cy.get("#verifyBallotButton").click()
		//THEN ballot is valid
		cy.get("#ballotIsVerifiedInfo").should("be.visible")
	})
	
	it("Admin finishes voting phase", function() {
		//GIVEN a logged in admin
		cy.visit("/login?email="+fix.adminEmail+"&teamName="+fix.teamName)
		// AND the poll in elaboration that was created before
		cy.get('#gotoPollsButton').click()
		cy.contains(".poll-panel-title", fix.pollTitle).click()

		// WHEN admin stars voting phase
		cy.get("#finishVoteButton").click()

		// THEN poll is FINISHED
		cy.get("#finishedPollInfo").should("be.visible")
		cy.get(".poll-panel[data-poll-status='FINISHED']")
			.should("have.attr", "data-poll-status", "FINISHED")  
		//  AND there is exactly one winner (because we casted exactly one vote)
		cy.get(".poll-panel .proposal-list-group-item.winner").should("have.length", 1)
	})
	
	/* TODO
	it('cleanup DB', function() {
		
	})
	*/
	

})