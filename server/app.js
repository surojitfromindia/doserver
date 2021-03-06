const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const { api } = require("./routes/API");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(
    // "mongodb+srv://user_surojit:passsurojit@cluster0.3yu8q.mongodb.net/DoneDbDevelopment", //old
    "mongodb+srv://user_shop:1l5B98yYNc2FQaWp@cluster0.3yu8q.mongodb.net/DoneDbDevelopment",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then((connection) => {
    app.get("/", (_req, res) => {
      res.send(`Welcome, Runnig database ${connection.connection.name}`);
    });

    //router
    app.use("/api", api);

    app.listen(process.env.PORT || 5000, () => {
      console.log("server is listening");
    });
  })
  .catch((err) => {
    console.log(err);
    console.log("some error occured while connection to db");
  });
