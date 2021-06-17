const withTM = require("next-transpile-modules")([
  "@material-ui/core",
  "@material-ui/icons"
]); // pass the modules you would like to see transpiled

module.exports = withTM({
  future: {
    webpack5: true, // if you want to use webpack 5
  },
});