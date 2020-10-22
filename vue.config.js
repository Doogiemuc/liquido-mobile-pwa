const fs = require("fs")
const PurgecssPlugin = require("purgecss-webpack-plugin")
const glob = require("glob-all")
const path = require("path")

module.exports = {
	lintOnSave: undefined,
	devServer: {
		port: 3001,   // 8080 is take by backend API!
		// proxy: 'http://other_host:4000'    // Problems with CORS? Vue Dev serve can proxy API requests for your: https://cli.vuejs.org/config/#devserver-proxy
	},
	configureWebpack: {
		// Merged into the final Webpack config
		devtool: "source-map",
		resolve: {
			alias: {
				// make config.<env>.js available from root /config directory (which is one dir above ./src)
				'config': path.join(__dirname, "/config")
			}
		},
		plugins: [
			new PurgecssPlugin({
				paths: glob.sync([
					path.join(__dirname, "./public/index.html"),
					path.join(__dirname, "./src/components/**/*.vue"),
					path.join(__dirname, "./src/views/**/*.vue"),
					path.join(__dirname, "./**/*.vue"),
					path.join(__dirname, "./src/**/*.js"),
				]),
				whitelist: [
					"notices",
					"snackbar",
					"notification",
					"toast",
					"is-top",
					"action",
					"is-info",
					"is-warning",
					"is-success",
					"is-danger",
					"is-dark",
					"message",
					"delete",
					"button",
					"loading-overlay",
					"is-valid",
					"is-invalid",
				],
			}),
		],
	},
	css: {
		loaderOptions: {
			sass: {
				prependData: fs.readFileSync("./src/styles/_variables.scss", "utf-8"),
			},
		},
	},
	pwa: {
		name: "LIQUIDO",
		themeColor: "#4DBA87",
		msTileColor: "#000000",
		appleMobileWebAppStatusBarStyle: "black",
	},
}
