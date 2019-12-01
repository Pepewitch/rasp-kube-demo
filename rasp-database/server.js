const express = require("express");
const data = require("./data.json");

const app = express();

app.get("*", (req, res) => {
  return res.status(200).send(data);
});

app.listen(process.env.PORT || 5000);
