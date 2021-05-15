const {
  copyLessonsFromStudyGroup,
  getOnlyNewLessonOfGroup,
  getOnlyOldLessonOfGroup
} = require("../server/Controllers/Student");
const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/DoneDbDevelopment", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    (async () => {
      //write code here
      // await createNewGroup(aGroup);
      console.log(
        await getOnlyOldLessonOfGroup(
          "Ruskin@double.in",
          "6095a416389f083af4c04eb4"
        )
      );
    })();
  })
  .catch((err) => {
    console.log("some error occured");
  });
