import config from '../../config/config.int.js'

context('Happy Case', () => {
	beforeEach(() => {
		console.log("===================================================")
		console.log("======= TEST CASE >>>", Cypress.mocha.getRunner().suite.ctx.currentTest.title, "<<<")
		console.log("===================================================")
	})

	it('Liquido mobile backend API is available', () => {
		cy.request({
			url: config.LIQUIDO_API_URL,
			timeout: 1000
		}).then(res => {
			if (res.status === 200) {
				console.log("Liquido mobile backend API is reachable at "+config.LIQUIDO_API_URL)
			} else {
				console.error("Cannot connect to liquido mobile backend API at"+config.LIQUIDO_API_URL)
				cy.log("Cannot connect to liquido mobile backend API at"+config.LIQUIDO_API_URL)
				Cypress.runner.stop();
			}
		})
	})

	

})