const { model, Schema } = require("mongoose");
const { SubjectSchema } = require("./Subjects");

//This wil have all the subjects
const LessonsSchema = new Schema({
  lesson_status: {
    type: String,
    Enum: ["upcoming", "today", "old"],
    required: true,
    default: "today",
  },
  lesson_date: { type: Date, default: Date.now },
  allSubjects: { type: [SubjectSchema], required: false },
});

const Lesson = model("lesson", LessonsSchema);

module.exports = { Lesson, LessonsSchema };
