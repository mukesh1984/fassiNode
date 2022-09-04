const mongoose = require("mongoose");
var autoIncrement = require('mongoose-auto-increment');
mongoose.Promise = global.Promise;

  const option = { useNewUrlParser: true,useUnifiedTopology: true };
  
  const connWriteFunc = () => {
    const db = mongoose.createConnection(process.env.MONGODB_WRITE_URI, option);  
    db.on("error", console.error.bind(console, "Write MongoDB Connection Error>> : "));
    db.once("open", function() {
      console.log("Write MongoDB Connection ok!");
         mongoose.set("debug", true);
         global.defaultSettings = { language: "eng" };
    });
    //autoIncrement.initialize(db);
    return db;
  };

  const connReadFunc = () => {
    const db = mongoose.createConnection(process.env.MONGODB_READ_URI, option);  
    db.on("error", console.error.bind(console, "Read MongoDB Connection Error>> : "));
    db.once("open", function() {
      mongoose.set("debug", true);
      global.defaultSettings = { language: "eng" };
      console.log("Read MongoDB Connection ok!");
    });
    //autoIncrement.initialize(db);
    return db;
  };
  let  connWrite = connWriteFunc()
  let  connRead  = connReadFunc()
  autoIncrement.initialize(connWrite)
  autoIncrement.initialize(connRead)
 //console.log(connWrite())
module.exports = { connWrite,connRead };
