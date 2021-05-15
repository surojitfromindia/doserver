const { Cred, Student } = require("../Models/ModelExports");
const { sign } = require("jsonwebtoken");
const { compare } = require("bcrypt");

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
      return realStudentID;
    } else {
      console.log("User already exist");
      return { message: "User already exist" };
    }
  } catch (err) {
    console.log("some error happened when tried to Sign up", err);
    return { error: "Some error occured." };
  }
}

/**
 * Send toke to the user
 * @param {Object} Cred User infomation required for sucessfull signIn/logIn
 * @returns {Promise} A promise
 */
async function SignIntoToSystem(cred) {
  try {
    let exsist = await Cred.exists({ realStudentID: cred.realStudentID });
    if (exsist) {
      //if user exist then match the passwords
      let { password } = await Cred.findOne({
        realStudentID: cred.realStudentID,
      });
      let isMatched = await compare(cred.password, password);
      if (isMatched) {
        let token = sign(
          { realStudentID: cred.realStudentID },
          `${process.env.PKEY}`,
          { expiresIn: "1h" }
        );
        return { token: token };
      } else {
        return { message: "Password doesn't match" };
      }
    } else {
      console.log("Email is not registerd");
      return { message: "User not exist" };
    }
  } catch (err) {
    console.log("some error happened when tried to Sign up", err);
    return { error: "User not exist" };
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
  SignIntoToSystem,
  DeleteFromSystem,
};
