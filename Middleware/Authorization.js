const JWT = require("jsonwebtoken");
const mongoose = require("mongoose");
const AuthDB = require("../Database_Schemas/User_Authentication");
require("dotenv").config();
const Authorization = async (Request, Response, Next) => {
  try {
    let USER = JWT.verify(Request.headers.token, process.env.JWT_SECRET);
    const Model = mongoose.model("UserCollection", AuthDB);
    let Result = await Model.findById(USER.ID);
    if (Result === undefined) {
      Response.status(500).json({ Error: "Internal Server Error" });
    } else if (Result === null) {
      Response.status(500).json({ Error: "Internal Server Error" });
    } else {
      Request.USERID = Result.id;
    }
    // console.log(Result.id);
    Next();
  } catch (error) {
    Response.status(500).json({ Error: "Internal Server Error" });
  }
};
module.exports = Authorization;
