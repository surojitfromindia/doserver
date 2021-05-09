const { SignUpToSystem } = require("../server/Controllers/IntoSystem");
const mongoose = require("mongoose");
let nStudent = {
  realStudentID: "Ruskin@double.in",
  age: 22,
  password: "tyystewvvewdv",
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
    })();
  })
  .catch((err) => {
    console.log("some error occured");
  });
