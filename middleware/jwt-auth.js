"use strict";
const jwt = require("jsonwebtoken");
const config = require("../config");
const message = require("../config/message");
const uModal = require("./../modules/user/userModal");
const cmethod = require("../middleware/common-fun");

module.exports = (req, res, next) => {
  if (
    config.passURL.indexOf(req.url) == -1 &&
    config.passURL.indexOf(req._parsedUrl.pathname) == -1 &&
    req.url.indexOf("/public/videos/") == -1 &&
    req.url.indexOf("/public/thumbnails/" == -1)
  ) {
    const token = req.headers["x-access-token"] || "";
    const lang = req.headers["lang"] || "eng";
    if(req.url.indexOf('user/update') == -1){
      req.body.lang  = lang
    }
    // decode token
    uModal.User.find({ token: token }, function (err, data) {
      // /console.log(message[lang].Notoken);

      if (data == null || data.length == 0) {
        return cmethod.returnSreverError(res, message[lang].Notoken, err, 101);
      } else {
        if (token) {
          // verifies secret and checks exp
          jwt.verify(token, config.secret, function (err, decoded) {
            if (err) {
              return cmethod.returnSreverError(
                res,
                message[lang].Unauthorized,
                err,
                102
              );
            }
            req.decoded = decoded;
            next();
          });
        } else {
          // if there is no token
          // return an error
          return cmethod.returnSreverError(
            res,
            message[lang].Notoken,
            err,
            101
          );
        }
      }
    })
      .clone()
      .catch((err) => {
        return cmethod.returnNotFoundError(
          res,
          message[lang].Notoken,
          err,
          104
        );
      });
  } else {
    next();
  }
};
