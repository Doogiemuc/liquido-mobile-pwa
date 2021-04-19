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
		/*
		 * These are my (very impinionated) settings for clean code.
		 */
		"max-len": ["warn", { "code": 200 }], // we do have 4K monitors nowadays!
		"arrow-parens": 0,
		"generator-star-spacing": 0,
		"no-console": "off",   // I love console output. Also in PROD  :-)    process.env.NODE_ENV === "production" ? "error" : "off",
		"no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
		indent: ["error", "tab", { SwitchCase: 1 }],   // Tabs, Tabs and only with tabs, each individual developer can decide his indent size on his screen.
		eqeqeq: 1,
		"no-var": 2,
		quotes: [    // Allow only double quoted strings. Phhew this one drove me nuts. But I think it was worth it.
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
