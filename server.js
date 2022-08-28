const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { connectDB } = require("./db/connect");
const dotenv = require("dotenv");
const Routes = require("./routes/index");

app = express();

dotenv.config();

app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 3001;

//routes
app.use("/", Routes);

connectDB((err) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(PORT);
    console.log(`Connected to DB and listening on ${PORT}`);
  }
});
