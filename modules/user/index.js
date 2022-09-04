const express = require("express");
const router = express.Router();
const uModal = require("../user/userModal");
const message = require("../../config/message");
const jwt = require("jsonwebtoken");
const config = require("../../config");
const midleware = require("../../middleware/validation");
const Promise = require("bluebird");
//const client = require("../../modules/email");
const cmethod = require("../../middleware/common-fun");
const moment = require("moment");
const userDao = require("./userDao");
const axios = require("axios");
var mongoose = require("mongoose");
const { update } = require("lodash");
const fs = require("fs");
const http = require("http");
const { dirname } = require("path");
const path = require("path");


// User Registartion  Routers
router.post(
  "/create",
  [midleware.validateFieldValue(config.regReqfields, config.regReqfieldsVal)],
  async (req, res) => {
    const postData = req.body;
    let lang = req.headers["lang"] || config.lang;
    postData.email = postData.email.trim().toLowerCase();
    let query = {
      $and: [{ email: postData.email }, { userType: postData.userType }],
    };
    userDao
      .findUser(query)
      .then(async (result) => {
        if (result == null || result.length == 0) {
          userDao.userRegiter(res, postData);
        } else {
          cmethod.returrnErrorMessage(res, message[lang].userexist);
        }
      })
      .catch((err) => {
        cmethod.returnSreverError(res, message[eng].technicalError, err);
      });
  }
);

// update User

router.patch(
  "/update",
  [midleware.validateFieldValue(["userId"], ["userId"])],
  (req, res) => {
    let postData = req.body;
    let lang = req.headers["lang"] || config.lang;
   

    let queryCond = {
      $and: [
        { _id: mongoose.Types.ObjectId(postData.userId) },   
      ],
    };
    delete postData.userId;
    uModal.User.findOneAndUpdate(
      queryCond,
      { $set: postData },
      { new: true },
      async function (err, data) {
        if (err) {
          cmethod.returnSreverError(res, message[lang].technicalError, err);
        } else {
          cmethod.returnSuccess(
            res,
            data,
            false,
            message[lang].update
          );
        }
      }
    );
  }
);

// User List api
router.post(
  "/list",
  [
    midleware.validateFieldValue(
      ["userId", "pageLimit", "page", "search"],
      ["page"]
    ),
  ],
  (req, res) => {
    let postData = req.body;
    let query = [];
    let lang = req.headers["lang"] || config.lang;
    
    if (postData.userId) {
      query.push({
        $match: {
          $and: [{ _id: mongoose.Types.ObjectId(postData.userId) }],
        },
      });
    } 
    const sQuery = [...query];

    query.push({
      $project: {
        _id: 1,
        fName:1,
        lname:1,
        email:1,
        contact:1        
      },
    });

    // Set the order of the query result
    query.push({ $sort: { createdAt: -1 } });
    // Clone to query before preparing to pagination
    sQuery.push({ $count: "recordCount" });
    // set Pagination if required
    if (postData.page) {
      query.push({
        $skip: cmethod.pageOffset(postData.page, postData.pageLimit),
      });
      query.push({ $limit: cmethod.pageLimit(postData.pageLimit) });
    }

    userDao
      .findUserAggregation(query)
      .then(function (data) {
        userDao
          .findUserAggregation(sQuery)
          .then(async function (dCount) {
            let tptCnt = 0;
            if (dCount.length > 0) {
              tptCnt = dCount[0].recordCount;
            }
           res.status(200).json({
              status: true,
              result: data,
              message: "",
              hasMore: cmethod.hasMoreCount(
                tptCnt,
                postData.page,
                postData.pageLimit
              ),
              totalCount: tptCnt,
            });
          })
          .catch((err) => {
            cmethod.returnSreverError(res, message[lang].technicalError, err);
          });
      })
      .catch((err) => {
        cmethod.returnSreverError(res, message[lang].technicalError, err);
      });
  }
);

router.delete(
  "/delete",
  [midleware.validateFieldValue(["userId"], ["userId"])],
  (req, res) => {
    let lang = req.headers["lang"] || config.lang;
    let postData = req.body;
    let queryCond = { _id: mongoose.Types.ObjectId(postData.userId) };
    uModal.User.deleteOne(queryCond, function (err, data) {
      if (err) {
        cmethod.returnSreverError(res, message[lang].technicalError, err);
      } else {
        cmethod.returnSuccess(res, [], false, message[lang].Deleteed);
      }
    });
  }
);

// contact List

module.exports = router;
