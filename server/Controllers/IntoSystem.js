const { Cred, Student } = require("../Models/ModelExports");

/**
 * Create a new user/student/teacher
 * @param {Object} Cred User infomation for sucessfull registration
 * @returns {Promise} A promise
 */
async function SignUpToSystem(cred) {
  try {
    let exsist = await Cred.exists({ realStudentID: cred.realStudentID });
    if (!exsist) {
      let NewUserWithCred = new Cred(cred);
      let NewStudent = new Student({ realStudentID: cred.realStudentID });
      let { realStudentID } = await NewUserWithCred.save();
      await NewStudent.save();
      console.log(`user with ${realStudentID} is created`);
    } else {
      console.log("user alreay exsist");
    }
  } catch (err) {
    console.log("some error happened when tried to Sign up");
  }
}

module.exports = {
  SignUpToSystem,
};
