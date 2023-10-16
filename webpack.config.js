const path = require("path");
const ModuleFederationPlugin =
  require("webpack").container.ModuleFederationPlugin;
const deps = require("./package.json").dependencies;
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require("webpack");

module.exports = {
  entry: "./src/bootstrap.js",
  mode: "development",
  cache: false,
  target: "web",
  output: {
    publicPath: "auto",
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
    // Uncomment this, if you're using react@17
    // fallback: {
    //   "react/jsx-runtime": "react/jsx-runtime.js",
    //   "react/jsx-dev-runtime": "react/jsx-dev-runtime.js",
    // },
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
          },
          "postcss-loader",
        ],
        include: /\.module\.css$/,
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.jsx?$/,
        use: [
          {
            loader: "babel-loader",
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new webpack.ProvidePlugin({
      React: "react",
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
    new MiniCssExtractPlugin({
      filename: "assets/main.css",
    }),
    new ModuleFederationPlugin({
      name: "app_name", // Change this
      filename: "remoteEntry.js",
      exposes: {
        // your custom components, functions, you wanna expose
        "./ModuleName": "./src/ExposedApp.js",
      },
      shared: [
        deps,
        {
          react: {
            eager: true,
            singleton: true,
            requiredVersion: deps.react,
          },
        },
        {
          "react-dom": {
            eager: true,
            singleton: true,
            requiredVersion: deps["react-dom"],
          },
        },
      ],
    }),
  ],
  devtool: "source-map",
  devServer: {
    hot: true,
    static: path.join(__dirname, "dist"),
    port: 3002,
    historyApiFallback: true,
  },
};
