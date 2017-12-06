const path = require('path');

module.exports = {
    context: __dirname,
    entry : {
        app : './index.js'
    },
    output : {
        path : path.resolve(__dirname, 'dist'),
        filename : 'bundle.js',
        publicPath : '/dist/'
    },
    resolve : {
        extensions : ['.scss','.js']
    },
    devServer : {
        host : '0.0.0.0',
        port : 8080,
        inline : true
    },
    module: 
    {
        rules: 
        [
            { 
                test : /(\.js|.jsx)$/,
                exclude : /(node_modules|bower_components)/,
                use : {
                    loader : 'babel-loader',
                    options : 
                    {
                        presets : ['@babel/preset-env']
                    }
                },
            },
            {
                test: /\.scss$/,
                loaders: ["style-loader","css-loader","sass-loader"]
            }
        ]
    }
};