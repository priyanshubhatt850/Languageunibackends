/**
 * Aggregate Service - Business Logic for Dashboard & Admin Endpoints
 * Handles all data aggregation and complex queries
 */

const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const InstructorProfile = require('../models/InstructorProfile');
const InstructorRating = require('../models/InstructorRating');
const Notification = require('../models/Notification');
const StudentCourseLevelProgress = require('../models/StudentCourseLevelProgress');
const CourseLevel = require('../models/CourseLevel');
const StudyMaterial = require('../models/StudyMaterial');
const Language = require('../models/Language');
const InstructorWalletTransaction = require('../models/InstructorWalletTransaction');

/**
 * Get admin dashboard data
 * Combines: users, courses, enrollments, instructors, notifications
 */
const getAdminDashboard = async (userId) => {
  const [users, courses, enrollments, instructorProfiles, notifications] = await Promise.all([
    User.find().select('full_name email role avatar_url createdAt').sort('-createdAt'),
    Course.find().select('title description status createdAt').sort('-createdAt').limit(10),
    Enrollment.find().select('user_id course_id payment_status payment_amount certificate_issued createdAt'),
    InstructorProfile.find().select('user_id verification_status rating students_count createdAt').sort('-createdAt'),
    Notification.find({ user_id: userId }).select('title message read createdAt').sort('-createdAt').limit(10)
  ]);

  // Aggregate calculations
  const dashboard = {
    stats: {
      total_users: users.length,
      total_students: users.filter(u => u.role === 'student' || !u.role).length,
      total_instructors: users.filter(u => u.role === 'instructor').length,
      total_courses: courses.length,
      total_enrollments: enrollments.length,
      pending_instructors: instructorProfiles.filter(p => p.verification_status === 'pending').length,
      total_revenue: enrollments
        .filter(e => e.payment_status === 'completed')
        .reduce((sum, e) => sum + (e.payment_amount || 0), 0),
      completed_enrollments: enrollments.filter(e => e.payment_status === 'completed').length
    },
    recent_users: users.slice(0, 5),
    recent_courses: courses,
    recent_enrollments: enrollments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5),
    instructor_profiles: instructorProfiles.slice(0, 5),
    notifications
  };

  return dashboard;
};

/**
 * Get admin students with their enrollments and progress
 */
const getAdminStudents = async (page = 1, limit = 10, search = '') => {
  const searchQuery = search ? {
    $or: [
      { full_name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ]
  } : {};

  const skip = (page - 1) * limit;

  const [students, total] = await Promise.all([
    User.find({
      role: { $in: ['student', null, undefined] },
      ...searchQuery
    })
      .select('full_name email avatar_url createdAt')
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit)),
    User.countDocuments({
      role: { $in: ['student', null, undefined] },
      ...searchQuery
    })
  ]);

  // Get related data for all students in one query
  const studentIds = students.map(s => s._id);
  const [enrollments, progress] = await Promise.all([
    Enrollment.find({ user_id: { $in: studentIds } }),
    StudentCourseLevelProgress.find({ user_id: { $in: studentIds } })
  ]);

  // Attach related data to each student
  const enrichedStudents = students.map(student => ({
    ...student.toObject(),
    enrollment_count: enrollments.filter(e => e.user_id.toString() === student._id.toString()).length,
    certificates_count: enrollments.filter(e => 
      e.user_id.toString() === student._id.toString() && e.certificate_issued
    ).length,
    courses_in_progress: progress.filter(p => p.user_id.toString() === student._id.toString()).length
  }));

  return {
    students: enrichedStudents,
    pagination: {
      current_page: parseInt(page),
      total_pages: Math.ceil(total / limit),
      total_items: total,
      items_per_page: parseInt(limit)
    }
  };
};

/**
 * Get admin instructors with their profiles and statistics
 */
const getAdminInstructors = async (page = 1, limit = 10, status = 'all') => {
  const skip = (page - 1) * limit;
  const statusFilter = status !== 'all' ? { verification_status: status } : {};

  const [instructorProfiles, total] = await Promise.all([
    InstructorProfile.find(statusFilter)
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit)),
    InstructorProfile.countDocuments(statusFilter)
  ]);

  // Get related data for all instructors
  const instructorIds = instructorProfiles.map(p => p.user_id);
  const [users, ratings, courses] = await Promise.all([
    User.find({ _id: { $in: instructorIds } }).select('full_name email avatar_url'),
    InstructorRating.find({ instructor_id: { $in: instructorIds } }),
    Course.find({ instructor_id: { $in: instructorIds } })
  ]);

  // Create lookup maps
  const userMap = new Map(users.map(u => [u._id.toString(), u]));
  const ratingMap = new Map();
  ratings.forEach(r => {
    if (!ratingMap.has(r.instructor_id.toString())) {
      ratingMap.set(r.instructor_id.toString(), []);
    }
    ratingMap.get(r.instructor_id.toString()).push(r);
  });

  // Enrich instructor data
  const enrichedInstructors = instructorProfiles.map(profile => {
    const user = userMap.get(profile.user_id.toString());
    const profileRatings = ratingMap.get(profile.user_id.toString()) || [];
    const instructorCourses = courses.filter(c => c.instructor_id.toString() === profile.user_id.toString());

    return {
      ...profile.toObject(),
      user_info: {
        full_name: user?.full_name || 'N/A',
        email: user?.email || 'N/A',
        avatar_url: user?.avatar_url
      },
      rating: profileRatings.length > 0
        ? (profileRatings.reduce((sum, r) => sum + r.rating, 0) / profileRatings.length).toFixed(1)
        : 0,
      total_ratings: profileRatings.length,
      courses_count: instructorCourses.length,
      total_students: profile.students_count || 0
    };
  });

  return {
    instructors: enrichedInstructors,
    pagination: {
      current_page: parseInt(page),
      total_pages: Math.ceil(total / limit),
      total_items: total,
      items_per_page: parseInt(limit)
    }
  };
};

/**
 * Get course detail with levels, materials, and enrollments
 */
const getCourseDetail = async (courseId) => {
  const [course, levels, materials, enrollments] = await Promise.all([
    Course.findById(courseId),
    CourseLevel.find({ course_id: courseId }),
    StudyMaterial.find({ course_id: courseId }),
    Enrollment.find({ course_id: courseId })
  ]);

  if (!course) {
    throw new Error('Course not found');
  }

  return {
    course: course.toObject(),
    levels,
    materials,
    stats: {
      total_levels: levels.length,
      total_materials: materials.length,
      total_enrollments: enrollments.length,
      completed_enrollments: enrollments.filter(e => e.completion_date).length
    }
  };
};

/**
 * Get language overview with courses and levels
 */
const getLanguageOverview = async (languageId) => {
  const [language, courses, courseLevels, enrollments] = await Promise.all([
    Language.findById(languageId),
    Course.find({ language_id: languageId }),
    CourseLevel.find({ language_id: languageId }),
    Enrollment.find()
  ]);

  if (!language) {
    throw new Error('Language not found');
  }

  const courseIds = courses.map(c => c._id);
  const languageEnrollments = enrollments.filter(e => courseIds.includes(e.course_id));

  return {
    language: language.toObject(),
    courses: courses.map(c => c.toObject()),
    levels: courseLevels,
    stats: {
      total_courses: courses.length,
      total_levels: courseLevels.length,
      total_enrollments: languageEnrollments.length,
      average_rating: courses.reduce((sum, c) => sum + (c.rating || 0), 0) / courses.length || 0
    }
  };
};

/**
 * Get instructor dashboard with courses, students, and earnings
 */
const getInstructorDashboard = async (instructorId) => {
  const [profile, courses, enrollments, transactions] = await Promise.all([
    InstructorProfile.findOne({ user_id: instructorId }),
    Course.find({ instructor_id: instructorId }),
    Enrollment.find(),
    InstructorWalletTransaction.find({ instructor_id: instructorId })
  ]);

  const courseIds = courses.map(c => c._id);
  const courseEnrollments = enrollments.filter(e => courseIds.includes(e.course_id));

  return {
    profile: profile?.toObject() || null,
    courses,
    stats: {
      total_courses: courses.length,
      total_students: courseEnrollments.length,
      total_enrollments: courseEnrollments.length,
      total_earnings: transactions
        .filter(t => t.transaction_type === 'credit')
        .reduce((sum, t) => sum + (t.amount || 0), 0),
      pending_earnings: transactions
        .filter(t => t.status === 'pending')
        .reduce((sum, t) => sum + (t.amount || 0), 0),
      average_rating: profile?.rating || 0
    }
  };
};

/**
 * Get student progress with courses and certificates
 */
const getStudentProgress = async (studentId) => {
  const [enrollments, progress] = await Promise.all([
    Enrollment.find({ user_id: studentId }),
    StudentCourseLevelProgress.find({ user_id: studentId })
  ]);

  const courseIds = enrollments.map(e => e.course_id);
  const courses = await Course.find({ _id: { $in: courseIds } });

  const enrichedEnrollments = enrollments.map(enrollment => {
    const course = courses.find(c => c._id === enrollment.course_id);
    const levelProgress = progress.filter(p => p.enrollment_id.toString() === enrollment._id.toString());

    return {
      ...enrollment.toObject(),
      course_title: course?.title || 'N/A',
      progress_percentage: levelProgress.length > 0
        ? (levelProgress.filter(p => p.completion_percentage === 100).length / levelProgress.length * 100).toFixed(0)
        : 0
    };
  });

  return {
    enrollments: enrichedEnrollments,
    stats: {
      total_courses: enrollments.length,
      in_progress: enrollments.filter(e => !e.completion_date).length,
      completed: enrollments.filter(e => e.certificate_issued).length,
      total_certificates: enrollments.filter(e => e.certificate_issued).length
    }
  };
};

module.exports = {
  getAdminDashboard,
  getAdminStudents,
  getAdminInstructors,
  getCourseDetail,
  getLanguageOverview,
  getInstructorDashboard,
  getStudentProgress
};
