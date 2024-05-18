const Database_Connection = require("./Database");
const Notes = require("./Routes/Notes");
const express = require("express");
const CORS = require("cors");
const Authentication = require("./Routes/Authentication");
const app = express();
const port = 5000;
Database_Connection();
app.use(CORS());
app.use(express.json());
app.use("/auth", Authentication);
app.use("/Notes", Notes);
app.get("/", (req, res) => {
  res.send("Hello world");
});
app.listen(port, () => {
  console.log(`My Notebook App Is Up On PORT - ${port}`);
});
module.exports = app;
