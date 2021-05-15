const {
  SignUpToSystem,
  DeleteFromSystem,
} = require("../server/Controllers/IntoSystem");
const mongoose = require("mongoose");
let nStudent = {
  realStudentID: "opin@double.in",
  age: 21,
  password: "ccwewrewrwe",
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
      await SignUpToSystem(nStudent);
      //await DeleteFromSystem("opin@double.in", "ccwewrewrwe");
    })();
  })
  .catch((err) => {
    console.log("some error occured");
  });
