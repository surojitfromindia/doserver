const {
  ValidateAndRegister,
} = require("../server/Controllers/registerToCourse");
const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/DoneDbDevelopment", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    (async () => {
      await ValidateAndRegister(
        "opin@double.in", //studentRealID
        "6095a416389f083af4c04eb4", // study group id
        "77825S" // group secrate code
      );
    })();
  })
  .catch((err) => {
    console.log("some error occured");
  });
