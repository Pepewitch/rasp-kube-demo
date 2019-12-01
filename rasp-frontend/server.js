const express = require("express");
const app = express();
const path = require("path");

app.use(express.static(path.join(__dirname, "client", "build")));

app.get("*", (req, res) => {
  return res
    .status(200)
    .sendFile(path.join(__dirname, "client", "build", "index.html"));
});

app.listen(process.env.PORT || 3000);
