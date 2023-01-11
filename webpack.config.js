const dotenv = require("dotenv");
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// const CopyPlugin = require('copy-webpack-plugin');
const CompressionPlugin = require("compression-webpack-plugin");
const webpack = require("webpack");
dotenv.config();

const vendors = [
  "./src/frontend/scss/bootstrap.scss",
  "./node_modules/select2/dist/js/select2.min.js",
  // './src/frontend/js/_bootstrap.ts',
  // './node_modules/bootstrap/dist/js/bootstrap.js',
];

const mainAssets = [
  "./src/frontend/scss/main.scss",
];

const dataTableAssets = [
  "./node_modules/datatables.net-bs4/css/dataTables.bootstrap4.css",
  "./node_modules/datatables.net-bs4/js/dataTables.bootstrap4.js",
  "./node_modules/datatables.net-responsive-bs4/css/responsive.bootstrap4.css",
  "./node_modules/datatables.net-responsive-bs4/js/responsive.bootstrap4.js",
  "./node_modules/datatables.net-fixedheader-bs4/css/fixedHeader.bootstrap4.css",
  "./node_modules/datatables.net-fixedheader-bs4/js/fixedHeader.bootstrap4.js",
];

const pages = {
  "dashboard": {
    import: "./src/frontend/js/dashboard.ts",
    dependOn: "dataTables",
  },
};

const entryFiles = {
  vendors,
  main: {
    import: mainAssets,
    dependOn: "vendors",
  },
  dataTables: {
    import: dataTableAssets,
    dependOn: "main",
  },
};

Object.keys(pages).forEach((page) => {
  if (typeof pages[page] === "string" || Array.isArray(pages[page])) {
    entryFiles[page] = {
      dependOn: "main",
      import: pages[page],
    };
  } else if (typeof pages[page] === "object") {
    entryFiles[page] = {
      dependOn: pages[page].dependOn,
      import: pages[page].import,
    };
  }

  // if ( Array.isArray(pages[page]) ) {
  //   entryFiles[page].push(...pages[page])
  // } else {
  //   entryFiles[page].push(pages[page])
  // }
});

const plugins = [
  // new CopyPlugin({
  //   patterns: [
  //     { from: './src/frontend/images', to: 'images' }
  //   ],
  // }),
  new MiniCssExtractPlugin({
    filename: "[name].bundle.css",
  }),
  new webpack.ProvidePlugin({
    $: "jquery",
    jQuery: "jquery",
    "window.jQuery": "jquery",
    "window.$": "jquery",
    Buffer: ["buffer", "Buffer"],
    process: "process/browser",
  }),
];

if (process.env.NODE_ENV === "development") {
  // plugins.push(new webpack.debug.ProfilingPlugin())
} else {
  plugins.push(new CompressionPlugin());
}

module.exports = {
  mode:
    process.env.NODE_ENV === "staging" ? "production" : process.env.NODE_ENV,
  entry: entryFiles,
  devtool: process.env.NODE_ENV === "production" ? false : "source-map", // Can use 'eval' for faster builds in dev mode
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              configFile: "src/frontend/js/tsconfig.json",
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          // Translates CSS into CommonJS
          {
            loader: "css-loader",
            options: {
              sourceMap: process.env.NODE_ENV !== "production",
            },
          },
          // Compiles Sass to CSS
          {
            loader: "sass-loader",
            options: {
              sourceMap: process.env.NODE_ENV !== "production",
            },
          },
        ],
      },
      {
        test: /\.(png|jpg|gif|svg|woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
      },
      // { parser: { amd: false } }
    ],
  },
  plugins,
  resolve: {
    extensions: [".ts", ".js", ".json"],
    fallback: {
      crypto: false,
      stream: false,
      assert: false,
      http: false,
      https: false,
      os: false,
      util: require.resolve("util/"),
      url: require.resolve("url/"),
      events: require.resolve("events/"),
      // 'crypto': require.resolve('crypto-browserify'),
      // 'stream': require.resolve('stream-browserify'),
      // 'http': require.resolve('stream-http'),
      // 'https': require.resolve('https-browserify'),
      // 'os': require.resolve('os-browserify/browser')
    },
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "./public/assets"),
    // publicPath: process.env.NODE_ENV === 'production' ? 'https://static.nftvaluations.com/assets/' : '/assets/',
    publicPath: "auto",
    clean: true,
  },
};
