//This is a lesson that have all the subjects as an array.
const { Group, Lesson, Subject } = require("../Models/ModelExports");
var lesson = exports;

/**
 *
 * @param {Lesson} lesson
 * @param {String} groupId
 */
lesson.pushALesson = async (lesson, groupId) => {
  try {
    let LessonNew = new Lesson(lesson);
    let rU = await Group.updateOne(
      { _id: groupId },
      {
        NewLesson: LessonNew,
      }
    );
    console.log("New Lessons created");
  } catch (error) {
    console.log(error);
  }
};

