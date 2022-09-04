"use strict";
//Load Modules Start
var auth = require('basic-auth');
var compare = require('tsscmp');
// Load internal Module 
var config = require('../config');
// Load Modules End 

var basicAuthentication = function (req, res, next) {
  // console.log('basicAuthentication');

  var credentials = auth(req);
  // console.log('basicAuthentication',credentials);
  let pathArr = req.path.split('/')
  let newPath = '/'+pathArr[1]+'/'+pathArr[2]+'/'+pathArr[3] 
  //console.log(newPath)
  if (config.existURL.indexOf(newPath) == -1) {
    res.status(404).send({ status: false, error: 'API Not found!', errorCode: 404 })
  } else if (config.basicAuth.passURL.indexOf(req.path) != -1) {
    next();
  } else if (!credentials || !check(credentials.name, credentials.pass, config)) {
    res.statusCode = 401
    res.setHeader('WWW-Authenticate', 'Basic realm="example"')
    res.end('Access denied')
  } else {
    // res.end('Access granted')
    next();
  }
}



// Basic function to validate credentials for example
function check(name, pass, configData) {
  var valid = true

  // Simple method to prevent short-circut and use timing-safe compare
  valid = compare(name, configData.basicAuth.username) && valid
  valid = compare(pass, configData.basicAuth.password) && valid

  return valid
}

module.exports = {
  basicAuthentication
}
