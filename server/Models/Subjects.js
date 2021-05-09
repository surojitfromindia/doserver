const { model, Schema } = require("mongoose");

const SubjectSchema = new Schema({
  subName: { typr: String, required: true },
});

const TopicSchema = new Schema({
  type: { type: String },
});
