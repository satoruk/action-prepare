const path = require("path");
const nodeExternals = require("webpack-node-externals");

const externals = [
  nodeExternals({
    allowlist: [
      "ajv",
      "js-yaml",
      "openpgp",
      "source-map-support/register",
      /^@actions\//,
      /^lodash/,
    ],
  }),
];

module.exports = {
  // devtool: "inline-source-map",
  devtool: "source-map",
  entry: {
    index: "./src/index.ts",
    index2: ["./src/index2.ts"],
  },
  externals: ["stream"],
  mode: "production",
  // mode: "development",
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
    // format: "cjs",
    path: path.resolve(__dirname, "dist"),
  },
  resolve: {
    extensions: [".md", ".ts", ".js"],
  },
  target: "node",
};
