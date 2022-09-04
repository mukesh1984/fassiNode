const uModal = require("../user/userModal");
const message = require("../../config/message");
const jwt = require("jsonwebtoken");
const config = require("../../config");
const midleware = require("../../middleware/validation");
const Promise = require("bluebird");
//const client = require("../../modules/email");
const cmethod = require("../../middleware/common-fun");
const moment = require("moment");
var axios = require('axios');
var mongoose = require("mongoose");
const { connWrite,connRead}  = require('./../../config/database')
// User Registartion  function
const userRegiter = async function (res, postData, lang) {
  const jwttoken = jwt.sign(
    { email: postData.email},
    config.secret,
    { expiresIn: config.tokenLife }
  );
  postData.password = await uModal.hashPassword(postData.password);
  //postData.dob = new Date(postData.dob);
  postData.token = jwttoken;
  const newUser = new uModal.User(postData);
  newUser.save(postData, async function (err, data) {
    if (err) {
      cmethod.returnSreverError(res, message.technicalError, err);
    } else {
        cmethod.returnSuccess(res, data, false, message.signupsuccess);
    }
  });
};


const findUserAggregation = function (query) {
  return new Promise(function (resolve, reject) {
    uModal.UserRead.aggregate(query, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};


const findUser = async function (query) {
  return new Promise(function (resolve, reject) {
    uModal.UserRead.find(query, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};



module.exports = {
  userRegiter,
  findUserAggregation,
  findUser,
};
