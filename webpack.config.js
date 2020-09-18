const path = require("path");

module.exports = {
  entry: {
    index: ["./src/index.ts"],
    index2: ["./src/index2.ts"],
  },
  mode: "development",
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.md$/,
        use: {
          loader: "remark-loader",
        },
      },
    ],
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
  },
  resolve: {
    extensions: [".md", ".ts", ".js"],
  },
  target: "node",
};
