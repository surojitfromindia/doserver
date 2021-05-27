//This is a lesson that have all the subjects as an array.
const { Group, Lesson } = require("../Models/ModelExports");
const { forceRefreshNewLessonFromStudyGroup } = require("./Student");
var lesson = exports;

/**
 * Create and push a lesson into NewLesson section of the study group of given groupId.
 * and also to each/selected registered student.
 * This stage can't be changed unless, teacher/admin want to force an update.
 * @param {Lesson} lesson
 * @param {String} groupId
 */
lesson.pushALessonToNewLesson = async (lesson, groupId) => {
  try {
    let LessonNew = new Lesson(lesson);
    await Group.updateOne(
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
/**
 *Force an NewLesson update to a student
 * @param {String} groupId
 * @param {String} secrateKey Admin provided secrate key
 */
lesson.forceNewLessonUpdate = async (groupId, secratekey) => {
  try {
    //get all student's realStudentIDs
    let { secrateKey, studentsId } = await Group.findOne({ _id: groupId });
    //if the secrate keys matchs
    if (secrateKey === secratekey) {
      studentsId.forEach(async (realId) => {
        await forceRefreshNewLessonFromStudyGroup(realId, groupId);
        console.log("updating");
      });
    }
  } catch (err) {}
};

/**A temporary record that hold yet to be modified data.
 *  After finalizing the changes will be reflected onto the NewLesson
 * @param {Lesson} lesson
 * @param {sting} groupId
 *  */

lesson.pushToATempLesson = async (lesson, groupId) => {
  try {
    let LessonTemp = new Lesson({
      allSubjects: lesson,
    });
    console.log(LessonTemp);
    let h = await Group.findOneAndUpdate(
      { _id: groupId },
      {
        $set: { TempLesson: LessonTemp },
      },
      {
        useFindAndModify: false,
      }
    );
    console.log(h);
    return h;
  } catch (error) {
    console.log(error);
  }
};

/**A temporary record that hold yet to be modified data.
 *  After finalizing the changes will be reflected onto the NewLesson
 * @param {Lesson} lesson
 * @param {sting} groupId
 *  */

lesson.getTempLesson = async (groupId) => {
  try {
    let lT = await Group.findOne(
      { _id: groupId },
      {
        TempLesson: 1,
      }
    );
    return lT;
  } catch (error) {
    console.log(error);
  }
};

lesson.pushATempLessonToNew = async (groupId) => {
  try {
    //first get the templesson
    let { TempLesson } = await Group.findOne(
      { _id: groupId },
      { TempLesson: 1 }
    );

    let h = await Group.findOneAndUpdate(
      { _id: groupId },
      {
        $set: { NewLesson: TempLesson },
      },
      {
        useFindAndModify: false,
      }
    );
    console.log(h);
    return h;
  } catch (error) {
    console.log(error);
  }
};
