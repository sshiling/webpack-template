const HtmlWebpackPlugin = require('html-webpack-plugin');         // to create html templates
const devMode = process.env.NODE_ENV !== 'production';            //
const TerserPlugin = require('terser-webpack-plugin');            // js optimize
const MiniCssExtractPlugin = require('mini-css-extract-plugin');  // css minimize
const {CleanWebpackPlugin} = require('clean-webpack-plugin');     // clear dist before each build
const path = require('path');

module.exports = {
    // app entry point
    mode: 'development',
    entry: {
        app: './src/index.js',
        print: './src/print.js',
        another: './src/another-module.js',
    },
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './dist',
    },

    // additional modules
    module: {
        rules: [
            // css/sass/scss loader with css minify
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: process.env.NODE_ENV === 'development',
                        },
                    },
                    'css-loader',
                    'sass-loader',
                ],
            },

            // images loader with img optimisation
            {
                test: /\.(gif|png|jpe?g|svg)$/i,
                use: [
                    'file-loader',
                    {
                        loader: 'image-webpack-loader',
                        options: {
                            mozjpeg: {
                                progressive: true,
                                quality: 65
                            },
                            // optipng.enabled: false will disable optipng
                            optipng: {
                                enabled: false,
                            },
                            pngquant: {
                                quality: [0.65, 0.90],
                                speed: 4
                            },
                            gifsicle: {
                                interlaced: false,
                            },
                            // the webp option will enable WEBP
                            webp: {
                                quality: 75
                            }
                        }
                    },
                ],
            },

            // fonts loader
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    'file-loader',
                ],
            },

            // csv loader
            {
                test: /\.(csv|tsv)$/,
                use: [
                    'csv-loader',
                ],
            },

            // xml loader
            {
                test: /\.xml$/,
                use: [
                    'xml-loader',
                ],
            },
        ],
    },

    plugins: [
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: devMode ? '[name].css' : '[name].[hash].css',
            chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
        }),

        // clean dist before build
        new CleanWebpackPlugin(),

        // create index.html and include bundle.js in it
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'src/assets/index.html'
        })
    ],

    // js optimize
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin()],
        splitChunks: {
            chunks: 'all',
        },
    },

    // convert into bundle and put into dist directory
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
};
