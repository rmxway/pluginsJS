const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

// глобальная переменная nodejs в которой хранится режим сборки
const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

// в зависимости от режима сборки, добавлять хешь к файлу или нет
const filename = (name, ext) =>
    isDev ? `${name}.${ext}` : `${name}.[hash].${ext}`;

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
        watchContentBase: true,
    },
    plugins: [
        new HTMLWebpackPlugin({
            title: 'MyApp',
            template: path.resolve(__dirname, 'src/index.html'),
            minify: {
                collapseWhitespace: isProd,
            },
        }),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: filename('style', 'css'),
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, 'src/img'),
                    to: path.resolve(__dirname, 'dist/img'),
                },
            ],
        }),
    ],
    module: {
        rules: [
            {
                test: /\.html$/,
                use: ['html-loader'],
            },
            {
                test: /\.css$/i,
                // css-loader позволяет понимать import '*.css' в js файлах
                // style-loader позволяет вставить css в секцию head в html в виде тега <style>
                // лоадеры выполняются в обратном порядке, сначала css-loader, потом style-loader
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(ttf|woff|woff2|eot|svg)$/i,
                use: ['file-loader'],
            },
            {
                test: /\.(jpg|jpeg|png|tiff|gif)$/i,
                use: ['file-loader'],
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: isDev,
                            reloadAll: true,
                        },
                    },
                    'css-loader',
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
