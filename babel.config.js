module.exports = {
	"env": {
		"production": {
			"presets": [
				[
					"@vue/app",
					{
						// "modules": false,
						"targets": ["ie >= 9"]
					},
					"@babel/env"
				]
			],
			"plugins": [
				// does not work yet :-( parent?.child === undefiend and does not throw when parent is null. )
				"@babel/plugin-proposal-optional-chaining"
			],
			"comments": false
		},
		"test": {
			"presets": [
				[
					"@babel/env",
					{"targets": {"node": "current"}}
				]
			],
			"plugins": [
				"@babel/plugin-proposal-optional-chaining"
			],
		}
	}
}
