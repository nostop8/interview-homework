var { name: appName } = require("../package.json");
process.env.DEBUG = appName;
const debug = require("debug")(appName);

module.exports = debug;
