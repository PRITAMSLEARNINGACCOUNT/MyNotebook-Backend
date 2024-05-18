const express = require("express");
const mongoose = require("mongoose");
const AuthDB = require("../Database_Schemas/User_Authentication");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const Bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
require("dotenv").config();
router.post("/register", body("Email").isEmail(), async (request, response) => {
  const Validation = await validationResult(request);
  if (!Validation.isEmpty()) {
    return response.status(400).json({ errors: Validation.array() });
  } else {
    const Hashed_Pass = await Bcrypt.hash(request.body.Password, 10);
    const Temp_Username = request.body.Username;
    const Model = mongoose.model("UserCollection", AuthDB);
    let User = await Model.findOne({ Email: request.body.Email });
    if (User) {
      return response.status(400).json({
        Result: "Email Address Is Already Registered\n",
      });
    }
    Model.findOne({ Username: Temp_Username })
      .exec()
      .then((user) => {
        if (user) {
          return response.status(400).json({
            Result:
              "Please Choose A Different Username Because The Username You Chose Already Exist In The Database\n",
          });
        } else {
          let User_data = {
            First_Name: request.body.First_Name,
            Last_Name: request.body.Last_Name,
            Username: request.body.Username,
            Password: Hashed_Pass,
            Email: request.body.Email,
          };
          const UserData = new Model(User_data);
          UserData.save();
          return response
            .status(200)
            .json({ Result: "User Created Successfully\n" });
        }
      });
  }
});


router.post(
  "/login",
  [body("Username").notEmpty(), body("Password").notEmpty()],
  async (request, response) => {
    const Validation = await validationResult(request);
    if (!Validation.isEmpty()) {
      return response.status(400).json({ errors: Validation.array() });
    } else {
      const Model = mongoose.model("UserCollection", AuthDB);
      const User_Match = await Model.findOne({
        Username: request.body.Username,
      });
      if (User_Match) {
        if (!Bcrypt.compareSync(request.body.Password, User_Match.Password)) {
          return response.status(401).json({ Error: "Authentication Failed" });
        }
        // console.log(process.env.JWT_SECRET);
        let JWT_Token = await JWT.sign(
          JSON.stringify({
            ID: User_Match._id,
            Username: request.body.Username,
          }),
          process.env.JWT_SECRET
        );
        response.json({ Token: JWT_Token });
      } else {
        response.status(401).json({ Error: "Authentication Failed" });
      }
    }
  }
);

module.exports = router;
