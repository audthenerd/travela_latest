const DIR = require("path").resolve(__dirname)
const PROD = process.env.NODE_ENV === "production"

module.exports = {
  entry: {
    application: `${DIR}/app/assets/javascripts/application.js`,
  },
  mode: PROD ? "production" : "development",
  output: {
    chunkFilename: "[name].js",
    filename: "[name].js",
    path: `${DIR}public/assets/`,
  },
  resolve: {
    extensions: [".js", ".json", ".css"],
    modules: ["node_modules", `${DIR}/app/assets`],
  },
}