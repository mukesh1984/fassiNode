const querystring = require("querystring");
const http = require("http");
const https = require("https");
//const logger = require("../logger");
const Promise = require("bluebird");
const message = require("../config/message");
const config = require("../config");

// Function to check value is exist in an array or not
var valueExists = function (arr, val) {
  for (var i in arr) {
    if (arr.indexOf(val) != -1) {
      return true;
    }
  }

  return false;
};

module.exports = {
  // Function to validate api's required fields and their fields
  validateFieldValue: function (reqfields, reqreqfieldsVal) {
    return function (req, res, next) {
      let lang = req.headers["lang"] || "eng";

      let bodyFields = [];
      let bodyFieldsValue = [];
      if (typeof req.body != "undefined") {
        for (var i in req.body) {
          bodyFields.push(i);
          bodyFieldsValue.push(req.body[i]);
        }
      }
      // Checking fields
      for (var i in reqfields) {
        //console.log(bodyFields, "===========",(reqfields[i]))
        if (bodyFields.indexOf(reqfields[i]) == -1) {
          res.status(200).json({
            status: false,
            message: message[lang].formfield.replace("[name]", reqfields[i]),
          });
          return false;
        }
      }

      //cehcking fields value

      for (var i in reqreqfieldsVal) {
        // console.log(reqreqfieldsVal[i],"===",req.body[reqreqfieldsVal[i]])
        if (
          bodyFields.indexOf(reqreqfieldsVal[i]) != -1 &&
          req.body[reqreqfieldsVal[i]] === ""
        ) {
          res.status(200).json({
            status: false,
            message: message[lang].formfieldVal.replace(
              "[name]",
              reqreqfieldsVal[i]
            ),
          });
          return false;
        }
      }

      //console.log("Validation code here...", bodyFields);
      next();
    };
  },
  validateFieldValueInline: function (req, res, reqfields, reqreqfieldsVal) {
    let lang = req.headers["lang"] || "eng";

    let bodyFields = [];
    let bodyFieldsValue = [];
    if (typeof req.body != "undefined") {
      for (var i in req.body) {
        bodyFields.push(i);
        bodyFieldsValue.push(req.body[i]);
      }
    }
    // Checking fields
    for (var i in reqfields) {
      //console.log(bodyFields, "===========",(reqfields[i]))
      if (bodyFields.indexOf(reqfields[i]) == -1) {
        res.status(200).json({
          status: false,
          message: message[lang].formfield.replace("[name]", reqfields[i]),
        });
        return false;
      }
    }

    //cehcking fields value

    for (var i in reqreqfieldsVal) {
      // console.log(reqreqfieldsVal[i],"===",req.body[reqreqfieldsVal[i]])
      if (
        bodyFields.indexOf(reqreqfieldsVal[i]) != -1 &&
        req.body[reqreqfieldsVal[i]] === ""
      ) {
        res.status(200).json({
          status: false,
          message: message[lang].formfieldVal.replace(
            "[name]",
            reqreqfieldsVal[i]
          ),
        });
        return false;
      }
    }

    //console.log("Validation code here...", bodyFields);
    return true;
  },
  // Function to generate random String  Ex : - Password for reset
  makerandomString: function (length) {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  },
  // Function to sanitize if rquired to validate any params value
  mongoSanitize: function (param) {
    if (param instanceof Object) {
      for (const key in param) {
        if (/^\$/.test(key)) {
          delete param[key];
        }
      }
    }
    return param;
  },
  // Function to shuffle array elements
  shuffleArray: function (sourceArray) {
    for (var i = 0; i < sourceArray.length - 1; i++) {
      var j = i + Math.floor(Math.random() * (sourceArray.length - i));

      var temp = sourceArray[j];
      sourceArray[j] = sourceArray[i];
      sourceArray[i] = temp;
    }
    return sourceArray;
  },
  // Function to format the number  Ex : 1000 into 1K
  nFormatter: function (num) {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(1).replace(/\.0$/, "") + "B";
    }
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
    }
    return num;
  },

  makeOffset: function (page) {
    if (page == 1 || page == 0) {
      return 0;
    }
    return (page - 1) * config.PageLimit;
  },

  hasMore: function (mediaCount, offset) {
    var countCurrentRecord = config.PageLimit + offset;
    if (mediaCount > countCurrentRecord) {
      return true;
    }
    return false;
  },

  dateFormat: function (date, format = null) {
    // return date;
    try {
      var myDate = new Date(date);
      return myDate;
    } catch (error) {
      console.log(error);
    }
  },
  getDate: function (date) {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  },
  conertHHMMSS: function (totalSeconds) {
    let hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;
    minutes = String(minutes).padStart(2, "0");
    hours = String(hours).padStart(2, "0");
    seconds = String(seconds).padStart(2, "0");
    if (hours != "00") {
      return hours + ":" + minutes + ":" + seconds;
    } else {
      return minutes + ":" + seconds;
    }
  },
  convertDateTime: function (dateObj) {
    //  console.log(dateObj.getMonth(),"===============",dateObj)
    return (
      this.getDate(dateObj) +
      " " +
      dateObj.getHours() +
      ":" +
      dateObj.getMinutes() +
      ":" +
      dateObj.getSeconds()
    );
  },
};
