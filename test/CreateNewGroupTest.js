const { createNewGroup } = require("../server/Controllers/Group");
const {
  ValidateAndRegister,
} = require("../server/Controllers/registerToCourse");
const mongoose = require("mongoose");
let aGroup = {
  group_name: "ABC School",
  admin: "J Hope",
  private: false,
  secrateKey: "77825S",
};

mongoose
  .connect("mongodb://localhost:27017/DoneDbDevelopment", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    (async () => {
      //write code here
      // await createNewGroup(aGroup);
      await ValidateAndRegister(5, "6095a416389f083af4c04eb4", "77825S");
    })();
  })
  .catch((err) => {
    console.log("some error occured");
  });
