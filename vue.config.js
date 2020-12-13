const fs = require("fs")
const PurgecssPlugin = require("purgecss-webpack-plugin")
const glob = require("glob-all")
const path = require("path")


const vueConfig = {
	lintOnSave: undefined,
	devServer: {
		port: 3001,				// 8080 is taken by backend API!
		proxy: {					// Problems with CORS? Vue Dev serve can proxy API requests for your: https://cli.vuejs.org/config/#devserver-proxy
			'^/liquido-api': {
					target: 'http://localhost:8080/',    // the matched path will be appended to this!
					//ws: true,
					//changeOrigin: true
				}
		}
	},
	configureWebpack: {
		// Merged into the final Webpack config
		devtool: "source-map",
		resolve: {
			alias: {
				// make config.<NODE_ENV>.js available from root /config directory (which is one dir above ./src)
				// https://stackoverflow.com/questions/30030031/passing-environment-dependent-variables-in-webpack
				'config': path.join(__dirname, "config/config."+process.env.NODE_ENV)
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

console.log("==================================================")
console.log("===> LIQUIDO Mobile Progressive Web App (PWA) <===")
console.log("==================================================")
console.log("NODE_ENV:  "+process.env.NODE_ENV)
console.log("config.js: "+vueConfig.configureWebpack.resolve.alias.config)
console.log("devServer: http://localhost:"+vueConfig.devServer.port)
console.log("API proxy: "+JSON.stringify(vueConfig.devServer.proxy))
console.log("==================================================")

module.exports = vueConfig