const { model, Schema } = require("mongoose");

const StudentSchema = Schema({
  realStudentID: { type: String, required: true },
  groupsId: { type: [String], required: false },
});

const Student = model("student", StudentSchema);

module.exports = Student;
