const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { connWrite,connRead}  = require('./../../config/database')
const bcrypt = require("bcryptjs");
const userSchema = new Schema(
  {
    fName:{ type:String, index:true},
    lName:{type:String, index:true},
    email: {type: String,index: true},
    password:{type: String,index: true},
    token:{type: String,index: true},
    contact: { type: Number,index: true },    
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);

userSchema.methods.hashPassword = async function (password) {
  try {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    throw new Error("Hashing failed", error);
  }
};

userSchema.methods.generateHash = function (password) {
  return bcrypt.hash(password, bcrypt.genSalt(10));
};

userSchema.methods.validPassword = function (password) {
  console.log("checking" + bcrypt.compareSync(password, this.password));
  ///console.log(this.hashPassword(password));
  return bcrypt.compareSync(password, this.password);
  //return this.hashPassword(password)
};

userSchema.index({ email: 1},{ collation: { locale: 'en', strength: 2 } });

const User = connWrite.model("users", userSchema);
const UserRead = connRead.model("users", userSchema);

module.exports = { User,UserRead};
module.exports.hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    throw new Error("Hashing failed", error);
  }
};
