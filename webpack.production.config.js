'use strict'

const path = require('path')
const glob = require('glob')
const webpack = require('webpack')

// Compute the entry-points for Sia-UI.
let entrypoints = {}
const plugins = glob.sync("./plugins/*/js/index.js")
plugins.forEach((plugin) => {
	entrypoints[path.dirname(path.dirname(plugin))] = plugin
})

entrypoints["renderer"] = ['babel-polyfill', path.resolve('./js/rendererjs/index.js')]
entrypoints["main"] = path.resolve('./js/mainjs/index.js')
entrypoints["pluginapi"] = ['babel-polyfill', path.resolve('./js/rendererjs/pluginapi.js')]


module.exports = {
	entry: entrypoints,
	plugins: [
		new webpack.DefinePlugin({
			"process.env": {
				NODE_ENV: JSON.stringify("production")
			}
		})
	],
	output: {
		path: path.resolve("./dist"),
		filename: '[name].js'
	},
	resolve: {
		root: path.resolve('./node_modules')
	}, 
	resolveLoader: {
		root: path.resolve('./node_modules'),
	},
	node: {
		__dirname: false,
		__filename: false,
	},
	target: 'electron',
	module: {
		// this noParse is to deal with an issue with validate.js not being packed properly.
		// see this issue: https://github.com/webpack/webpack/issues/138 for more information.
		noParse: /node_modules\/json-schema\/lib\/validate\.js/,
		preLoaders: [
			{
				test: /\.json$/,
				loader: 'json-loader',
			}
		],
		loaders: [
			{
				test: /\.js?$/,
				loader: 'babel',
				exclude: /node_modules/,
				query: {
					presets: ['react', 'es2015', 'stage-3']
				}
			}
		]
	}
}
