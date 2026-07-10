/**
 * Aggregated API Routes - Dashboard & Admin Endpoints
 * Combines multiple related data in single API calls
 * Reduces network requests and improves performance
 * 
 * Architecture:
 * - Routes: Request routing and middleware application
 * - Controllers: HTTP request/response handling
 * - Services: Business logic and data aggregation
 */

const express = require('express');
const router = express.Router();
const verifyAuth = require('../middleware/auth');
const aggregateController = require('../controllers/aggregateController');

// Admin Dashboard
router.get('/admin-dashboard', verifyAuth, aggregateController.getAdminDashboard);

// Admin Students Management
router.get('/admin-students', verifyAuth, aggregateController.getAdminStudents);

// Admin Instructors Management
router.get('/admin-instructors', verifyAuth, aggregateController.getAdminInstructors);

// Course Details
router.get('/course-detail/:courseId', verifyAuth, aggregateController.getCourseDetail);

// Language Overview
router.get('/language-overview/:languageId', verifyAuth, aggregateController.getLanguageOverview);

// Instructor Dashboard
router.get('/instructor-dashboard/:instructorId', verifyAuth, aggregateController.getInstructorDashboard);

// Student Progress
router.get('/student-progress/:studentId', verifyAuth, aggregateController.getStudentProgress);

module.exports = router;
