const express = require("express");
const app = express();
const axios = require("axios");
const path = require("path");

app.use(express.static(path.join(__dirname, "client", "build")));
app.get("/data", async (req, res) => {
  let serverRes;
  try {
    serverRes = await axios
      .get(`http://rasp-api-service:8080/data`)
      .then(res => res.data);
  } catch (error) {
    serverRes = error.message;
  }
  return res.status(200).send(serverRes);
});
app.get("*", async (req, res) => {
  let serverRes;
  try {
    serverRes = await axios.get(process.env.API_ENDPOINT).then(res => res.data);
  } catch (error) {
    serverRes = error.message;
  }
  return res.status(200).send(`
    <html>
      <body>
        <div style="display: block">THIS IS FRONTEND RESPONSE</div>
        <div style="display: block">THIS IS SERVER RESPONSE : ${serverRes}</div>
      </body>
    </html>
  `);
});

app.listen(process.env.PORT || 4000);
