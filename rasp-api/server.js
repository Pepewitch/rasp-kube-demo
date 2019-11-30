const express = require("express");
const data = require("./data.json");

const app = express();

app.get("/data", (req, res) => {
  return res.status(200).send(data);
});

app.get("*", (req, res) => {
  return res.status(200).send("This is server response");
});

app.listen(process.env.PORT || 3000);
