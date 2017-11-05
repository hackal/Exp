var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: './src/Exp.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'Exp.js'
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
    },
    stats: {
        colors: true
    },
    devtool: 'source-map',
    devServer: {
        contentBase: path.join(__dirname, "dist")
    }
};
