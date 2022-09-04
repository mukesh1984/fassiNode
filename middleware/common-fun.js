const db = require("../config/database");
const config = require("../config");
const Promise = require("bluebird");

module.exports = {
  pageOffset: function (page, pageLimit) {
    if (!pageLimit) {
      pageLimit = config.pageLimit;
    }

    if (page == 1 || page == 0) {
      return 0;
    }
    return (page - 1) * pageLimit;
  },
  pageLimit: function (pageLimit) {
    if (pageLimit) {
      return parseInt(pageLimit);
    }

    return config.pageLimit;
  },
  hasMoreCount: function (count, page, pageLimit) {
    pageLimit = pageLimit ? pageLimit : config.pageLimit;
    let numOfPage = Math.ceil(count / pageLimit);
    if (page < numOfPage) {
      return true;
    } else {
      return false;
    }
  },
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
  returnSuccess: function (res, result, hasMore, message, totalCount) {
    if (arguments.length == 5) {
      res.status(200).json({
        status: true,
        result: result,
        message: message,
        hasMore: hasMore,
        totalCount: totalCount,
      });
    } else if (arguments.length == 4) {
      res.status(200).json({
        status: true,
        result: result,
        message: message,
        hasMore: hasMore,
      });
    } else if (arguments.length == 3) {
      res.status(200).json({ status: true, result: result, hasMore: hasMore });
    } else {
      res.status(200).json({ status: true, result: result });
    }
  },
  returrnErrorMessage(res, message) {
    res.status(200).json({ status: false, message: message });
  },
  returnSreverError: function (res, message, error, errorCode) {
    if (config.errorShow) {
      // console.log("returnSreverError Error=>>", error);
      if (arguments.length == 4) {
        res.status(500).json({
          status: false,
          message: message,
          errorCode: errorCode,
          error: error,
        });
      } else if (arguments.length == 3) {
        res.status(500).json({ status: false, message: message });
      } else {
        res.status(500).json({ status: false, message: message });
      }
    } else {
      if (arguments.length == 3) {
        res
          .status(500)
          .json({ status: false, message: message, errorCode: errorCode });
      } else if (arguments.length == 2) {
        res.status(500).json({ status: false, message: message });
      } else {
        res.status(500).json({ status: false, message: message });
      }
    }
  },
  returnNotFoundError: function (res, message, error, errorCode) {
    if (config.errorShow) {
      // console.log("returnNotFoundError Error=>>", error);
      if (arguments.length == 4) {
        res.status(400).json({
          status: false,
          message: message,
          errorCode: errorCode,
          //error: error,
        });
      } else if (arguments.length == 3) {
        res.status(400).json({ status: false, message: message, error: error });
      } else {
        res.status(400).json({ status: false, message: message });
      }
    } else {
      if (arguments.length == 3) {
        res
          .status(400)
          .json({ status: false, message: message, errorCode: errorCode });
      } else if (arguments.length == 2) {
        res.status(400).json({ status: false, message: message });
      } else {
        res.status(400).json({ status: false, message: message });
      }
    }
  },
  abbrNum: function (number, decPlaces) {
    decPlaces = Math.pow(10, decPlaces);
    let abbrev = ["K", "M", "B", "T"];

    for (var i = abbrev.length - 1; i >= 0; i--) {
      // Convert array index to "1000", "1000000", etc
      var size = Math.pow(10, (i + 1) * 3);

      // If the number is bigger or equal do the abbreviation
      if (size <= number) {
        // Here, we multiply by decPlaces, round, and then divide by decPlaces.
        // This gives us nice rounding to a particular decimal place.
        number = Math.round((number * decPlaces) / size) / decPlaces;

        // Add the letter for the abbreviation
        number += abbrev[i];

        // We are done... stop
        break;
      }
    }

    return number;
  },
  startTimeString: function (sTime) {
    let month = parseInt(sTime.getMonth()) + parseInt(1);
    let sTString =
      sTime.getFullYear() +
      "-" +
      ((month < 10 ? "0" : "") + month) +
      "-" +
      ((sTime.getDate() < 10 ? "0" : "") + sTime.getDate()) +
      "T" +
      "00:00:00.000Z";

    return sTString;
  },
  endTimeString: function (sTime) {
    let month = parseInt(sTime.getMonth()) + parseInt(1);
    let eTString =
      sTime.getFullYear() +
      "-" +
      ((month < 10 ? "0" : "") + month) +
      "-" +
      ((sTime.getDate() < 10 ? "0" : "") + sTime.getDate()) +
      "T" +
      "23:59:59.999Z";
    return eTString;
  },
};
