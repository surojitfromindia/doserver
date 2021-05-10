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

/**
 * Will Remove Every record from System Database of the following user's.
 * But won't unregister from already registerd courses.
 * @param {string} realStudentIDF user's email
 * @param {string} passwordF user's password
 */
async function DeleteFromSystem(realStudentIDF, passwordF) {
  try {
    let exsist = await Cred.exists({
      realStudentID: realStudentIDF,
      password: passwordF,
    });
    if (exsist) {
      //delete them from  student, cred. follow the order.
      let { realStudentID } = await Student.findOneAndDelete(
        {
          realStudentID: realStudentIDF,
        },
        { useFindAndModify: false }
      );
      await Cred.findOneAndRemove(
        { realStudentID: realStudentIDF },
        { useFindAndModify: false }
      );
      console.log(`${realStudentID} has been deleted`);
    } else {
      console.log("User Doesn't exist");
    }
  } catch (err) {
    console.log(err);
    console.log("some error happened when tried to Delete");
  }
}

module.exports = {
  SignUpToSystem,
  DeleteFromSystem,
};
