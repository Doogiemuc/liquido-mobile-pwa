/**
 * End-2-end HAPPY CASE test for liquido-mobile-pwa frontend
 */

//const { expect } = require("chai")

//import { inspect } from 'util'  // better than JSON.stringify

let fix = {}
let now = Date.now() % 10000

context('Happy Case', () => {
	before(() => {
		fix.userName   = 'Cypress User-'+now
		fix.userEmail  = 'cypress-'+now+'@liquido.me'
		fix.adminName  = 'Cypress Admin-'+now
		fix.adminEmail = 'cypressAdmin-'+now+'@liquido.me'
		fix.teamName   = 'Cypress Team '+now
		fix.inviteCode = undefined
	})

	beforeEach(() => {
		console.log("===================================================")
		console.log("    TEST CASE >>>", Cypress.mocha.getRunner().suite.ctx.currentTest.title, "<<<")
		console.log("===================================================")
	})

	it('Liquido mobile backend API is available', () => {
		cy.request({
			url: Cypress.env("LIQUIDO_API"),   // This URL is configured in /cypress.json
			timeout: 1000
		}).then(res => {
			if (res.status === 200) {
				console.log("Liquido mobile backend API is reachable at "+Cypress.env("LIQUIDO_API"))
			} else {
				console.error("Cannot connect to liquido mobile backend API at"+Cypress.env("LIQUIDO_API"))
				cy.log("Cannot connect to liquido mobile backend API at"+Cypress.env("LIQUIDO_API"))
				Cypress.runner.stop();
			}
		})
	})

	it('Create new team', function() {
		//GIVEN
		assert.isString(fix.adminName)
		assert.isString(fix.teamName)
		assert.isString(fix.adminName)

		//WHEN
		cy.visit("/")
		cy.get('#userNameInput').type(fix.adminName).type("{enter}")  // implicitly checks that #userNameInput is not disabled
		cy.get('#createNewTeamButton').click()
		cy.get('#teamNameInput').type(fix.teamName)
		cy.get('#adminEmailInput').type(fix.adminEmail)
		cy.get('#createNewTeamOkButton').click()

		//THEN
		cy.get('#newTeamCreatedBubble')
		cy.get("#inviteLink").should('contain', 'http')
		cy.get('#newTeamInviteCode').invoke('text').should('have.length.of.at.least', 5)
		cy.get('#newTeamInviteCode').then(inviteCodeElem => {
			fix.inviteCode = inviteCodeElem.text()
			console.log("New team inviteCode=", fix.inviteCode)
			cy.log("InviteCode="+fix.inviteCode)
		})
	})

	//TODO: create test with mocked error response to check error modal
	
	it('Join team', function() {
		//GIVEN
		assert.isString(fix.inviteCode, "Need inviteCode to test joinTeam")
		assert.isString(fix.userName)
		assert.isString(fix.userEmail)

		//WHEN
		cy.visit("/")
		cy.get('#userNameInput').type(fix.userName).type("{enter}")  // implicitly checks that #userNameInput is not disabled
		cy.get('#joinTeamButton').click()
		cy.get('#inviteCodeInput').type(fix.inviteCode)
		cy.get('#emailInput').type(fix.userEmail)
		cy.get('#joinTeamOkButton').click()

		//THEN
		cy.get('#joinedTeamBubble')		
	})

	it('cleanup DB', function() {
		//TODO: 
	})
	

})