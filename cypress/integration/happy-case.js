/**
 * End-2-end HAPPY CASE test for liquido-mobile-pwa frontend
 */

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
		cy.visit("/")
		//cy.get('#userNameInput', { timeout: 10000 }).should('not.be.disabled')
		cy.get('#userNameInput').type(fix.adminName).type("{enter}")  // implicitly checks that #userNameInput is not disabled
		cy.get('#createNewTeamButton').click()
		cy.get('#teamNameInput').type(fix.teamName)
		cy.get('#adminEmailInput').type(fix.adminEmail)
		cy.wait(500)
		cy.get('#createNewTeamOkButton').click()

		//TODO: create test with mocked error response to check error model

		

	})

})