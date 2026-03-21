/**
 * Aggregated API Routes - Dashboard & Admin Endpoints
 * Combines multiple related data in single API calls
 * Reduces network requests and improves performance
 */

const express = require('express');
const router = express.Router();
const verifyAuth = require('../middleware/auth');

/**
 * GET /api/aggregate/admin-dashboard
 * Returns all data needed for admin dashboard
 * Combines: users, courses, enrollments, instructors, notifications
 */
router.get('/admin-dashboard', verifyAuth, async (req, res) => {
  try {
    const User = require('../models/User');
    const Course = require('../models/Course');
    const Enrollment = require('../models/Enrollment');
    const InstructorProfile = require('../models/InstructorProfile');
    const Notification = require('../models/Notification');

    const [users, courses, enrollments, instructorProfiles, notifications] = await Promise.all([
      User.find().select('full_name email role avatar_url createdAt').sort('-createdAt'),
      Course.find().select('title description status createdAt').sort('-createdAt').limit(10),
      Enrollment.find().select('user_id course_id payment_status payment_amount certificate_issued createdAt'),
      InstructorProfile.find().select('user_id verification_status rating students_count createdAt').sort('-createdAt'),
      Notification.find({ user_id: req.user._id }).select('title message read createdAt').sort('-createdAt').limit(10)
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

    res.json({
      success: true,
      data: dashboard
    });
  } catch (error) {
    console.error('Admin dashboard aggregation error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch dashboard data'
    });
  }
});

/**
 * GET /api/aggregate/admin-students
 * Returns students with their enrollments and progress
 * Query params: page=1, limit=10, search=query
 */
router.get('/admin-students', verifyAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const User = require('../models/User');
    const Enrollment = require('../models/Enrollment');
    const StudentCourseLevelProgress = require('../models/StudentCourseLevelProgress');

    // Build search query
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

    res.json({
      success: true,
      data: {
        students: enrichedStudents,
        pagination: {
          current_page: parseInt(page),
          total_pages: Math.ceil(total / limit),
          total_items: total,
          items_per_page: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Admin students aggregation error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch students'
    });
  }
});

/**
 * GET /api/aggregate/admin-instructors
 * Returns instructors with their profiles and statistics
 * Query params: page=1, limit=10, status=all|pending|approved|rejected
 */
router.get('/admin-instructors', verifyAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status = 'all' } = req.query;
    const User = require('../models/User');
    const InstructorProfile = require('../models/InstructorProfile');
    const InstructorRating = require('../models/InstructorRating');
    const Course = require('../models/Course');

    const skip = (page - 1) * limit;

    // Build status filter
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

    res.json({
      success: true,
      data: {
        instructors: enrichedInstructors,
        pagination: {
          current_page: parseInt(page),
          total_pages: Math.ceil(total / limit),
          total_items: total,
          items_per_page: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Admin instructors aggregation error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch instructors'
    });
  }
});

/**
 * GET /api/aggregate/course-detail/:courseId
 * Returns complete course data with levels, materials, and enrollments
 */
router.get('/course-detail/:courseId', verifyAuth, async (req, res) => {
  try {
    const { courseId } = req.params;
    const Course = require('../models/Course');
    const CourseLevel = require('../models/CourseLevel');
    const StudyMaterial = require('../models/StudyMaterial');
    const Enrollment = require('../models/Enrollment');

    const [course, levels, materials, enrollments] = await Promise.all([
      Course.findById(courseId),
      CourseLevel.find({ course_id: courseId }),
      StudyMaterial.find({ course_id: courseId }),
      Enrollment.find({ course_id: courseId })
    ]);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    res.json({
      success: true,
      data: {
        course: course.toObject(),
        levels,
        materials,
        stats: {
          total_levels: levels.length,
          total_materials: materials.length,
          total_enrollments: enrollments.length,
          completed_enrollments: enrollments.filter(e => e.completion_date).length
        }
      }
    });
  } catch (error) {
    console.error('Course detail aggregation error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch course details'
    });
  }
});

/**
 * GET /api/aggregate/language-overview/:languageId
 * Returns language with all courses and levels
 */
router.get('/language-overview/:languageId', verifyAuth, async (req, res) => {
  try {
    const { languageId } = req.params;
    const Language = require('../models/Language');
    const Course = require('../models/Course');
    const CourseLevel = require('../models/CourseLevel');
    const Enrollment = require('../models/Enrollment');

    const [language, courses, courseLevels, enrollments] = await Promise.all([
      Language.findById(languageId),
      Course.find({ language_id: languageId }),
      CourseLevel.find({ language_id: languageId }),
      Enrollment.find()
    ]);

    if (!language) {
      return res.status(404).json({
        success: false,
        message: 'Language not found'
      });
    }

    const courseIds = courses.map(c => c._id);
    const languageEnrollments = enrollments.filter(e => courseIds.includes(e.course_id));

    res.json({
      success: true,
      data: {
        language: language.toObject(),
        courses: courses.map(c => c.toObject()),
        levels: courseLevels,
        stats: {
          total_courses: courses.length,
          total_levels: courseLevels.length,
          total_enrollments: languageEnrollments.length,
          average_rating: courses.reduce((sum, c) => sum + (c.rating || 0), 0) / courses.length || 0
        }
      }
    });
  } catch (error) {
    console.error('Language overview aggregation error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch language overview'
    });
  }
});

/**
 * GET /api/aggregate/instructor-dashboard/:instructorId
 * Returns instructor dashboard data with courses, students, earnings
 */
router.get('/instructor-dashboard/:instructorId', verifyAuth, async (req, res) => {
  try {
    const { instructorId } = req.params;
    const InstructorProfile = require('../models/InstructorProfile');
    const Course = require('../models/Course');
    const Enrollment = require('../models/Enrollment');
    const InstructorWalletTransaction = require('../models/InstructorWalletTransaction');

    const [profile, courses, enrollments, transactions] = await Promise.all([
      InstructorProfile.findOne({ user_id: instructorId }),
      Course.find({ instructor_id: instructorId }),
      Enrollment.find(),
      InstructorWalletTransaction.find({ instructor_id: instructorId })
    ]);

    const courseIds = courses.map(c => c._id);
    const courseEnrollments = enrollments.filter(e => courseIds.includes(e.course_id));

    res.json({
      success: true,
      data: {
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
      }
    });
  } catch (error) {
    console.error('Instructor dashboard aggregation error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch instructor dashboard'
    });
  }
});

/**
 * GET /api/aggregate/student-progress/:studentId
 * Returns student's courses, progress, and certificates
 */
router.get('/student-progress/:studentId', verifyAuth, async (req, res) => {
  try {
    const { studentId } = req.params;
    const Enrollment = require('../models/Enrollment');
    const StudentCourseLevelProgress = require('../models/StudentCourseLevelProgress');
    const Course = require('../models/Course');

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

    res.json({
      success: true,
      data: {
        enrollments: enrichedEnrollments,
        stats: {
          total_courses: enrollments.length,
          in_progress: enrollments.filter(e => !e.completion_date).length,
          completed: enrollments.filter(e => e.certificate_issued).length,
          total_certificates: enrollments.filter(e => e.certificate_issued).length
        }
      }
    });
  } catch (error) {
    console.error('Student progress aggregation error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch student progress'
    });
  }
});

module.exports = router;
