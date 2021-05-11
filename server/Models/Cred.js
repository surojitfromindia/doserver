const { model, Schema } = require("mongoose");
const { hashSync } = require("bcrypt");

const saltRound = 10;

const hashPassword = (password) => {
  try {
    let hashedPassword = hashSync(password, saltRound);
    return hashedPassword;
  } catch (err) {
    console.log("Some error occured while generation hash");
  }
};

const CredSchema = Schema({
  realStudentID: { type: String, required: true }, //same as gmail/email
  age: { type: Number, min: 5, max: 100 },
  name: { type: String, min: 2, max: 100 },
  password: { type: String, required: true, set: hashPassword },
});

const Cred = model("cred", CredSchema);

module.exports = Cred;
