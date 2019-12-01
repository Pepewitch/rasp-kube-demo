const express = require("express");
const app = express();
const axios = require("axios");
const path = require("path");

app.get("/data", async (req, res) => {
  let serverRes;
  try {
    serverRes = await axios
      .get(`http://rasp-database-service:5000/data`)
      .then(res => res.data);
  } catch (error) {
    serverRes = error.message;
  }
  return res.status(200).send(serverRes);
});

app.get("/summary", async (req, res) => {
  let serverRes;
  try {
    serverRes = await axios
      .get(`http://rasp-summary-service:5000/data`)
      .then(res => res.data);
  } catch (error) {
    serverRes = error.message;
  }
  return res.status(200).send(serverRes);
});

app.listen(process.env.PORT || 4000);
