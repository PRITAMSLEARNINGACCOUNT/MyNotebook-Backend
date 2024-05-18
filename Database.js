const mongoose = require("mongoose");
function Connected_to_db() {
  mongoose
    .connect(
      "mongodb+srv://pritamstech:PS0896721234@learningcluster.v3xrpyk.mongodb.net/UserDetails"
    )
    .then(() => {
      console.log("Connected To Mongodb Successfully");
    });
}
module.exports = Connected_to_db;
