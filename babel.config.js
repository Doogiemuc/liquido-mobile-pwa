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
			"comments": false
		},
		"test": {
			"presets": [
				[
					"@babel/env",
					{"targets": {"node": "current"}}
				]
			]
		}
	}
}
