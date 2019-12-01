const express = require("express");
const app = express();
const axios = require("axios");
const path = require("path");

app.use(express.static(path.join(__dirname, "client", "build")));

app.listen(process.env.PORT || 3000);
