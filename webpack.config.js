const path = require("path");
const HTMLPlugin = require("html-webpack-plugin");

module.exports = {
  mode: process.env.NODE_ENV === "production" ? "production" : "development",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: "ts-loader",
          options: {
            transpileOnly: true,
          },
        },
      },
    ],
  },
  resolve: {
    extensions: [".js", ".ts", ".tsx"],
  },
  devServer: {
    port: 8080,
    open: true,
    historyApiFallback: {
      rewrites: [{ from: /^\/*/, to: "/" }],
    },
  },
  plugins: [
    new HTMLPlugin({
      template: path.join(__dirname, "public/index.html"),
    }),
  ],
};
