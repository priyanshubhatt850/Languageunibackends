/**
 * Aggregate Controller - Handles HTTP requests for Dashboard & Admin Endpoints
 * Manages request validation, error handling, and response formatting
 */

const aggregateService = require('../services/aggregateService');

/**
 * GET /api/aggregate/admin-dashboard
 * Returns all data needed for admin dashboard
 */
const getAdminDashboard = async (req, res) => {
  try {
    const dashboard = await aggregateService.getAdminDashboard(req.user._id);
    
    res.json({
      success: true,
      data: dashboard
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch dashboard data'
    });
  }
};

/**
 * GET /api/aggregate/admin-students
 * Returns students with their enrollments and progress
 * Query params: page=1, limit=10, search=query
 */
const getAdminStudents = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    
    const result = await aggregateService.getAdminStudents(page, limit, search);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Admin students error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch students'
    });
  }
};

/**
 * GET /api/aggregate/admin-instructors
 * Returns instructors with their profiles and statistics
 * Query params: page=1, limit=10, status=all|pending|approved|rejected
 */
const getAdminInstructors = async (req, res) => {
  try {
    const { page = 1, limit = 10, status = 'all' } = req.query;
    
    const result = await aggregateService.getAdminInstructors(page, limit, status);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Admin instructors error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch instructors'
    });
  }
};

/**
 * GET /api/aggregate/course-detail/:courseId
 * Returns complete course data with levels, materials, and enrollments
 */
const getCourseDetail = async (req, res) => {
  try {
    const { courseId } = req.params;
    
    const result = await aggregateService.getCourseDetail(courseId);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Course detail error:', error);
    
    if (error.message === 'Course not found') {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch course details'
    });
  }
};

/**
 * GET /api/aggregate/language-overview/:languageId
 * Returns language with all courses and levels
 */
const getLanguageOverview = async (req, res) => {
  try {
    const { languageId } = req.params;
    
    const result = await aggregateService.getLanguageOverview(languageId);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Language overview error:', error);
    
    if (error.message === 'Language not found') {
      return res.status(404).json({
        success: false,
        message: 'Language not found'
      });
    }
    
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch language overview'
    });
  }
};

/**
 * GET /api/aggregate/instructor-dashboard/:instructorId
 * Returns instructor dashboard data with courses, students, earnings
 */
const getInstructorDashboard = async (req, res) => {
  try {
    const { instructorId } = req.params;
    
    const result = await aggregateService.getInstructorDashboard(instructorId);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Instructor dashboard error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch instructor dashboard'
    });
  }
};

/**
 * GET /api/aggregate/student-progress/:studentId
 * Returns student's courses, progress, and certificates
 */
const getStudentProgress = async (req, res) => {
  try {
    const { studentId } = req.params;
    
    const result = await aggregateService.getStudentProgress(studentId);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Student progress error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch student progress'
    });
  }
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
