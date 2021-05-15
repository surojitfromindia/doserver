//@ts-check
const { model, Schema } = require("mongoose");

const PTypeSchema = new Schema({
  typeText: { type: String, enum: ["write", "read", "quiz", "ans", "q"] },
});
const PType = model("ptype", PTypeSchema);

const TopicSchema = new Schema({
  type: { type: PTypeSchema, required: true },
  done: { type: Boolean, default: false },
  des: { type: String, required: true },
  lenDes: { type: String, required: false },
});
const Topic = model("topic", TopicSchema);

const QuestionSchema = new Schema({
  type: { type: PTypeSchema, required: true },
  qtext: { type: String, required: true },
  reference: { type: String, required: false },
  ans: { type: String, required: false },
});
const Question = model("question", QuestionSchema);

const SubjectSchema = new Schema({
  subName: { type: String, required: true },
  done: { type: Boolean, default: false },
  topic: { type: [TopicSchema], required: false },
  question: { type: [QuestionSchema], required: false },
});

const Subject = model("subjects", SubjectSchema);

module.exports = { Subject, SubjectSchema, PType, Question, Topic };
