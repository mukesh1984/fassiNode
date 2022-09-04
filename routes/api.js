const userModule = require("../modules/user");
module.exports = function (app) {
  app.use("/api/user", userModule);
};
