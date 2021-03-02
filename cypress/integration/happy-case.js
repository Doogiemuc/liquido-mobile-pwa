/**
 * End-2-end HAPPY CASE test for liquido-mobile-pwa frontend.
 * This test runs through the easiest possible use case flow.
 * Only the successful "happy path" without any error cases or edge cases.
 */
//import { inspect } from 'util'  // better than JSON.stringify

import config from '../../config/config.test'

let now = Date.now() % 10000
console.log("Running Cypress HAPPY CASE test (test_uuid="+now+")", config, process.env.NODE_ENV)

let fix = {}  // Test fixtures within this test RUN

context('Happy Case', () => {
	before(() => {
		fix.userName   = 'Cypress User-'+now
		fix.userEmail  = 'cypressUser-'+now+'@liquido.me'
		fix.adminName  = 'Cypress Admin-'+now
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
		//GIVEN
		assert.isString(fix.adminName)
		assert.isString(fix.teamName)
		assert.isString(fix.adminName)

		//WHEN
		cy.visit("/")
		cy.get('#userNameInput', {timeout: 8000}).type(fix.adminName).type("{enter}")  // implicitly checks that #userNameInput is not disabled
		cy.get('#createNewTeamButton').click()
		cy.get('#teamNameInput').type(fix.teamName)
		cy.get('#adminEmailInput').type(fix.adminEmail)
		cy.get('#createNewTeamOkButton').click()

		//THEN
		cy.get('#welcomeChatErrorModal').should('not.exist')   // no error modal is shown
		cy.get('#newTeamCreatedBubble')
		//TODO: cy.get("#inviteLink").should('contain', 'http')
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
		cy.get('#createdSuccessfullyButton').click()
		//THEN the poll is shown with that proposal
		cy.get('#poll-show').should('be.visible')
		cy.get('.law-title').should('contain.text', fix.proposalTitle)

	})

	//TODO: create test with mocked error response to check error modal
	
	it('Join team', function() {
		//GIVEN inviteCode and data for new member
		assert.isString(fix.inviteCode, "Need inviteCode to test joinTeam")
		assert.isString(fix.userName)
		assert.isString(fix.userEmail)
		assert.isString(fix.pollTitle, "Need existing poll to test joinTeam")
		assert.isString(fix.proposalTitle, "Need existing proposal to test joinTeam")

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
		cy.visit("/devLogin?userEmail="+fix.userEmail+"&teamName="+fix.teamName)
		cy.get("#devLoginSuccessful").should('be.visible')
		//WHEN  goint to team-home
		cy.get('#GoToTeamButton').click()
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
		cy.visit("/devLogin?userEmail="+fix.userEmail+"&teamName="+fix.teamName)
		cy.get("#devLoginSuccessful").should('be.visible')
		// AND a poll in voting
		cy.get("#GoToPollsButton").click()
		cy.get("#elaborationArrow").click()
		cy.get(".poll-panel-title").first().then(pollTitle => {
			expect(pollTitle, 'Need poll in elaboration').to.contain.text(fix.pollTitle)
			pollTitle.click()
			//Cypress.$(pollTitle).click()
		})
		
		// WHEN user adds a proposal
		cy.get("#addProposalButton").click()  // This might not be visible, when that user already added a proposal to the poll. => Not happy case
		cy.get("#propTitle").type(fix.proposalTitle2)
		cy.get("#propDescription").type(fix.proposalDescription2)
		cy.get("#saveProposalButton").click()
		cy.get('#createdSuccessfullyButton').click()		
		
		//THEN the poll is shown with that proposal
		cy.get('#poll-show').should('be.visible')
		cy.get('.law-title').should('contain.text', fix.proposalTitle2)
	})
	
	/*
	it('Cast a vote', function() {
		//GIVEN a logged in user
		cy.visit("/devLogin?userEmail="+fix.userEmail+"&teamName="+fix.teamName)
		cy.get("#devLoginSuccessful").should('be.visible')
		// AND a poll in voting
		cy.get("#GoToPollsButton").click()
		cy.get("#votingArrow").click()

		cy.get(".poll-panel").then(pollPanel => {
			expect(pollPanel, 'Polls in Voting').to.have.length.of.at.least(1)
			Cypress.$(pollPanel).click()
		})
	})
	
	/* TODO
	it('cleanup DB', function() {
		
	})
	*/
	

})