import assert from 'assert';
import api from "../../src/services/liquido-api.js"
//const api = require("../../src/services/liquido-api.js")

describe('Array', function () {

	beforeEach(function(){
		console.log("=====================", this.currentTest.title, "====================="); 
	})

	it('backend is available', async function () {
		let res = await api.backendIsAvailable()
		console.log("Response from backend:\n", res.data)
		assert.strictEqual(res.data.status, "ok")
	})


})

// Little utility for mocking
async function stall(stallTime = 3000) {
	await new Promise(resolve => setTimeout(resolve, stallTime))
}
