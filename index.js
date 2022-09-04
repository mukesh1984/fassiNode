//set Global config
const dotenv = require("dotenv");
dotenv.config();

// Import logger
//var logger = require("./logger").logger;

//Generic basic auth Authorization header field parser for whatever.
var auth = require("basic-auth");

var compare = require("tsscmp");

const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const path = require("path");
const db = require('./config/database');
const cors = require("cors");
const helmet = require("helmet");
const errorHandler = require("errorhandler");
const app = express();
const message = require("./config/message");
// Set Body data as Json
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const mongoose = require("mongoose");
const mongodbUri = require("mongodb-uri");
const MongoStore = require("connect-mongodb-session")(session);
//const config = require("./config");


//handle bodyParser.json() errors
app.use((err, req, res, next) => {
  if (err) {
    res.status(400).json({ status: false, message: message.invalidRequest });
  } else {
    next();
  }
});
// set server home directory
app.locals.rootDir = __dirname;

//Configure mongoose's promise to global promise
mongoose.promise = global.Promise;
const isProduction = process.env.NODE_ENV === "production";
app.use(cors({ origin: true }));
app.options("*", cors());
app.use(
  session({
    secret: "passport-validation",
    cookie: { maxAge: 6000000000000 },
    resave: false,
    saveUninitialized: false,
  })
);
if (!isProduction) {
  app.use(errorHandler());
}
app.enable("trust proxy");
app.use(helmet());
app.use(cookieParser("5TOCyfH3HuszKGzFZntk"));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: "pAgGxo8Hzg7PFlv1HpO8Eg0Y6xtP7zYx",
    cookie: {
      path: "/",
      httpOnly: true,
      maxAge: 3600000 * 24,
    },
    store: "",
  })
);

//set static folder
app.use(express.static(path.join(__dirname, "public")));

 const basicAuth = require("./middleware/basic-auth");
 app.use(basicAuth.basicAuthentication);


// Verify JWT token
const jwtToken = require("./middleware/jwt-auth");
app.use(jwtToken);

global.__basedir = __dirname;

// Call API Route
//app.use('/', require('./routes/api'))(app);
require("./routes/api")(app);
//set PORT

// Ran on all routes
app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-cache, no-store");
  res.setHeader("Connection", "close");
  next();
});

app.on("uncaughtException", (err) => {
  console.error(colors.red(err.stack));
  process.exit(2);
});

require('./config/database')

const PORT = process.env.PORT || 5000;
/// Initalizing app on the specific PORT
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
