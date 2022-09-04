module.exports = Object.freeze({
  baseURL: process.env.BASE_URL,
  PORT: process.env.PORT,
  basicAuth: {
    username: "test",
    password: "test",
    passURL: [
     
    ],
  },
  lang: "eng",
  errorShow: true,
  secret: "some-secret-refresh-token-shit-update",
  refreshTokenSecret: "some-secret-refresh-token-shit",
  port: 5000,
  tokenLife: "30d",
  
  regReqfields: [
    "email",
    "fName",
    "lName",
    "contact",
    "password"
  ],
  regReqfieldsVal: [
    "email",
    "fName",
    "lName",
    "contact",
    "password"
  ],

  existURL: [
    "/api/user/create",
    "/api/user/list",
    "/api/user/update",
    "/api/user/delete"
  ],
  passURL: [
    "/api/user/create",
    "/api/user/list",
    "/api/user/update",
    "/api/user/delete"    
  ],
});
