const { Question, Subject, Group } = require("../Models/ModelExports");
var subject = exports;

/**
 *@param {Question} question question on this subject
 */
subject.createASubject = async (question) => {
  try {
    let Q = new Question(question);
    let rQ = await Q.save();
  } catch (err) {
    console.log(err);
  }
};

/**
 *
 * @param {Subject} subject the subject that teacher want to add
 * @param {String} groupId
 */
 subject.pushASubject = (subject, groupId) => {
  try {
    //get the Group
    let exist = Group.findOne({
      $and: [
        { _id: groupId },
        { "NewLesson.allSubjects.subName": subject.subName },
      ],
    });
  } catch (error) {}
};
