const { model, Schema } = require("mongoose");
const { LessonsSchema } = require("./Lesson");
const GroupSchema = Schema({
  group_name: { type: String, required: true, max: 20, min: 3 },
  admin: { type: String, required: true },
  teachersId: { type: [String], required: false }, //the regular login ids
  studentsId: { type: [String], required: false }, //the regular login ids
  private: { type: Boolean, default: false, required: true }, // set if this group is private
  secrateKey: { type: String, required: true }, //a secrate key to share.
  NewLesson: { type: LessonsSchema, required: false },
  OldLesson: { type: [LessonsSchema], required: false },
  UpcomingLesson: { type: LessonsSchema, required: false },
});

const Group = model("group", GroupSchema);

module.exports = Group;
