const { model, Schema } = require("mongoose");
const { LessonsSchema } = require("./Lesson");
const StudentSchema = Schema({
  realStudentID: { type: String, required: true },
  groupsId: { type: [String], required: false },
  groupsLessons: [
    //groups
    {
      groupId: { type: String, required: false },
      NewLesson: { type: LessonsSchema, required: false },
      OldLessons: { type: [LessonsSchema], required: false },
      UpcomingLesson: { type: LessonsSchema, required: false },
    },
  ],
  createdGroupId: { type: [String], required: false },
});

const Student = model("student", StudentSchema);

module.exports = Student;
