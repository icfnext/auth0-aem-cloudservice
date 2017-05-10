var path = require( 'path' );

module.exports = {
    entry: "./auth0-cloudservice-ui/src/main/app/index.js",
    output: {
        path: path.resolve(__dirname, './auth0-cloudservice-ui/src/main/content/jcr_root/etc/clientlibs/auth0-cloudservice/app'),
        publicPath: '/dist/',
        filename: 'index.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader'
                }
            }
        ]
    }
};