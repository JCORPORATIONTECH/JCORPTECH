/**
 * Created by yijaejun on 01/02/2017.
 */
var entryPointsPathPrefix = './public/javascripts/';

module.exports = {
	entry : {
		'test-es6': entryPointsPathPrefix + 'test-es6.js',
		'impl_login': entryPointsPathPrefix + 'impl_login.js',
	},
	output: {
		path: './public/javascripts/dist',
		filename: '[name].js'
	},
	module: {
		loaders: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				query: {
					presets: ['es2015']
				}
			}
		]
	}
};