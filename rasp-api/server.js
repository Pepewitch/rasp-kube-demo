const express = require("express");

const app = express();

app.get("*", (req, res) => {
  return res.status(200).send("This is server response");
});

app.listen(process.env.PORT || 3000);
