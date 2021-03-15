module.exports = {
	root: true,
	parserOptions: {
		parser: "babel-eslint",
		sourceType: "module",
		ecmaVersion: 2017,
	},
	env: {
		node: true,
		jquery: true,
	},
	rules: {
		"max-len": ["warn", { "code": 200 }], // we do have 4K monitors nowadays!
		"arrow-parens": 0,
		"generator-star-spacing": 0,
		"no-console": process.env.NODE_ENV === "production" ? "error" : "off",
		"no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
		indent: ["error", "tab", { SwitchCase: 1 }],
		eqeqeq: 1,
		"no-var": 2,
		quotes: [
			"error",
			"double",
			{
				avoidEscape: true,
				allowTemplateLiterals: true,
			},
		],

		// Options for plugin:vue/recommended  https://eslint.vuejs.org
		"vue/max-attributes-per-line": ["error", {
			"singleline": 5,      // we do have 4K monitors these days!
			"multiline": {
				"max": 1,
				"allowFirstLine": true
			}
		}],
		"vue/html-indent": ["error", "tab"],
		"vue/attributes-order": "warn",
		"vue/no-v-html": "off",
		"vue/html-self-closing": "off",
		"vue/singleline-html-element-content-newline": "off",
	},
	extends: [
		"plugin:vue/recommended",
		"eslint:recommended",
		//"@vue/prettier",
	],
}
