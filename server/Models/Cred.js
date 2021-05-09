const { model, Schema } = require("mongoose");

const CredSchema = Schema({
  realStudentID: { type: String, required: true }, //same as gmail/email
  age: { type: Number, min: 5, max: 100 },
  password: { type: String, required: true },
});

const Cred = model("cred", CredSchema);

module.exports = Cred;
