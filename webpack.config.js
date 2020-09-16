const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

// глобальная переменная nodejs в которой хранится режим сборки
const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

// в зависимости от режима сборки, добавлять хешь к файлу или нет
const filename = (name, ext) => (isDev ? `${name}.[hash].${ext}` : `${name}.min.${ext}`);

module.exports = {
    mode: 'development',
    entry: path.resolve(__dirname, 'src/js/app.js'),
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: filename('bundle', 'js'),
    },
    devServer: {
        port: 4000,
        host: '0.0.0.0',
    },
    optimization: {
        minimize: true,
        minimizer: [
            // Минимизация JS
            new TerserPlugin({
                exclude: '/node_modiles',
                test: /\.js(\?.*)?$/i,
                cache: true,
                terserOptions: {
                    output: {
                        comments: isDev,
                    },
                },
            }),
        ],
    },
    plugins: [
        new HTMLWebpackPlugin({
            title: 'Plugins JS',
            filename: path.resolve(__dirname, 'dist/index.html'),
            template: path.resolve(__dirname, 'src/index.html'),
            minify: {
                collapseWhitespace: isProd,
            },
        }),
        new CleanWebpackPlugin({}),
        new MiniCssExtractPlugin({
            filename: filename('style', 'css'),
        }),
        // Минимизация
        new OptimizeCSSAssetsPlugin({}),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, 'src/img'),
                    to: path.resolve(__dirname, 'dist/img'),
                },
                {
                    from: path.resolve(__dirname, 'src/font-awesome/fonts'),
                    to: path.resolve(__dirname, 'dist/fonts'),
                },
            ],
        }),
    ],
    module: {
        rules: [
            {
                test: /\.css$/i,
                // css-loader позволяет понимать import '*.css' в js файлах
                // style-loader позволяет вставить css в секцию head в html в виде тега <style>
                // лоадеры выполняются в обратном порядке, сначала css-loader, потом style-loader
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
            {
                test: /\.(ttf|woff|woff2|eot|svg)$/i,
                loader: 'file-loader',
                options: {
                    name: 'fonts/[name].[ext]',
                },
            },
            {
                test: /\.(jpg|JPG|jpeg|png|tiff|gif)$/,
                loader: 'file-loader',
                options: {
                    name: 'img/[name].[ext]',
                },
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                    },
                    'css-loader',
                    {
                        loader: 'resolve-url-loader',
                    },
                    'sass-loader',
                ],
            },
            {
                test: /\.js$/i,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },
        ],
    },
};
