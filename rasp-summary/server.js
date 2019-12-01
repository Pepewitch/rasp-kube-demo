const express = require("express");

const app = express();

const data = [
  {
    title: "Realtime visitors",
    value: 120
  },
  {
    title: "Peak time",
    value: "12.00"
  },
  {
    title: "Most active day",
    value: "Monday"
  },
  {
    title: "Least active day",
    value: "Tuesday"
  }
];

app.get("*", (req, res) => {
  return res.status(200).send(data);
});

app.listen(process.env.PORT || 5000);
