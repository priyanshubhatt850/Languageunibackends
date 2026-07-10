const Enrollment = require('../models/Enrollment');
const ExerciseAttempt = require('../models/ExerciseAttempt');
const StudentCourseLevelProgress = require('../models/StudentCourseLevelProgress');

async function ensureIndexes() {
  await Enrollment.collection.createIndex({ user_id: 1, course_id: 1 }, { unique: true, background: true, name: 'unique_user_course' }).catch(() => {});
  await ExerciseAttempt.collection.createIndex({ user_id: 1, exercise_id: 1 }, { background: true, name: 'user_exercise_lookup' }).catch(() => {});
  await StudentCourseLevelProgress.collection.createIndex({ user_id: 1, course_level_id: 1 }, { unique: true, background: true, name: 'unique_user_level_progress' }).catch(() => {});
  console.log('Database indexes ensured');
}

module.exports = { ensureIndexes };
