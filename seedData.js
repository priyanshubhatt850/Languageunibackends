require("dotenv-flow").config();
const mongoose = require("mongoose");
const { env } = require("./src/constants");

// Models
const User = require("./src/models/User");
const Language = require("./src/models/Language");
const CourseLevel = require("./src/models/CourseLevel");
const Enrollment = require("./src/models/Enrollment");
const InstructorProfile = require("./src/models/InstructorProfile");
const UserPoints = require("./src/models/UserPoints");
const Badge = require("./src/models/Badge");
const UserBadge = require("./src/models/UserBadge");
const TeachingSession = require("./src/models/TeachingSession");
const InstructorWalletTransaction = require("./src/models/InstructorWalletTransaction");

async function seed() {
  try {
    console.log("Connecting to Database:", env.DB_URL);
    await mongoose.connect(env.DB_URL);
    console.log("MongoDB connection successful!");

    // 1. Clear Collections
    console.log("Clearing collections...");
    await Promise.all([
      User.deleteMany({}),
      Language.deleteMany({}),
      CourseLevel.deleteMany({}),
      Enrollment.deleteMany({}),
      InstructorProfile.deleteMany({}),
      UserPoints.deleteMany({}),
      Badge.deleteMany({}),
      UserBadge.deleteMany({}),
      TeachingSession.deleteMany({}),
      InstructorWalletTransaction.deleteMany({})
    ]);

    // 2. Seed Users
    console.log("Seeding users...");
    // Password will be automatically hashed by pre-save hooks on User.js
    const admin = await User.create({
      email: "admin@example.com",
      password: "password123",
      role: "admin",
      full_name: "System Admin",
      profileCompleted: true,
      onboarding_completed: true
    });

    const inst1 = await User.create({
      email: "john.doe@example.com",
      password: "password123",
      role: "instructor",
      full_name: "John Doe",
      profileCompleted: true,
      onboarding_completed: true
    });

    const inst2 = await User.create({
      email: "jean.pierre@example.com",
      password: "password123",
      role: "instructor",
      full_name: "Jean-Pierre",
      profileCompleted: true,
      onboarding_completed: true
    });

    const inst3 = await User.create({
      email: "yuki.tanaka@example.com",
      password: "password123",
      role: "instructor",
      full_name: "Yuki Tanaka",
      profileCompleted: true,
      onboarding_completed: true
    });

    const students = [];
    const studentNames = ["Liam Carter", "Emma Watson", "Noah Jenkins", "Olivia Martinez", "Sophia Davis"];
    const streakCounts = [5, 12, 20, 0, 3];
    
    for (let i = 0; i < 5; i++) {
      const student = await User.create({
        email: `student${i + 1}@example.com`,
        password: "password123",
        role: "student",
        full_name: studentNames[i],
        profileCompleted: true,
        onboarding_completed: true,
        streak_count: streakCounts[i],
        last_active_date: new Date().toISOString().split('T')[0]
      });
      students.push(student);
    }

    // 3. Seed Instructor Profiles
    console.log("Seeding instructor profiles...");
    const profile1 = await InstructorProfile.create({
      user_id: inst1._id,
      display_name: "John Doe",
      bio: "Expert English lecturer with 10+ years experience teaching ESL and Business English.",
      hourly_rate: 40,
      total_hours_taught: 120,
      average_rating: 4.8,
      verification_status: "approved"
    });

    const profile2 = await InstructorProfile.create({
      user_id: inst2._id,
      display_name: "Jean-Pierre",
      bio: "Native French tutor specializing in Business communication, conversational practices, and grammar.",
      hourly_rate: 50,
      total_hours_taught: 85,
      average_rating: 4.9,
      verification_status: "approved"
    });

    const profile3 = await InstructorProfile.create({
      user_id: inst3._id,
      display_name: "Yuki Tanaka",
      bio: "Experienced Japanese instructor, JLPT test prep specialist focusing on N5 to N2 certifications.",
      hourly_rate: 45,
      total_hours_taught: 64,
      average_rating: 4.7,
      verification_status: "approved"
    });

    // 4. Seed Languages
    console.log("Seeding languages...");
    const langEn = await Language.create({
      name: "English",
      flag: "🇬🇧",
      code: "en",
      is_active: true,
      display_order: 1,
      instructor_count: 1,
      learner_count: 4
    });

    const langFr = await Language.create({
      name: "French",
      flag: "🇫🇷",
      code: "fr",
      is_active: true,
      display_order: 2,
      instructor_count: 1,
      learner_count: 1
    });

    const langJa = await Language.create({
      name: "Japanese",
      flag: "🇯🇵",
      code: "ja",
      is_active: true,
      display_order: 3,
      instructor_count: 1,
      learner_count: 1
    });

    // 5. Seed Course Levels (Courses)
    console.log("Seeding course levels...");
    const courseEnA1 = await CourseLevel.create({
      language_id: langEn._id,
      level_name: "A1 Beginner",
      level_type: "standard",
      description: "Start your English journey here. Master basic greetings, daily verbs, and simple sentence structures.",
      learning_goals: ["Introduce yourself and others", "Understand simple phrases", "Write brief notes"],
      price: 99,
      duration_hours: 20,
      instructor_id: inst1._id,
      instructor_hourly_rate: 40,
      status: "published",
      enrolled_count: 2,
      rating: 4.7,
      display_order: 1
    });

    const courseEnA2 = await CourseLevel.create({
      language_id: langEn._id,
      level_name: "A2 Elementary",
      level_type: "standard",
      description: "Build confidence. Talk about your routine, describe past events, and ask for information in hotels or restaurants.",
      learning_goals: ["Describe routine tasks", "Share past experiences", "Make simple requests"],
      price: 149,
      duration_hours: 25,
      instructor_id: inst1._id,
      instructor_hourly_rate: 40,
      status: "published",
      enrolled_count: 1,
      rating: 4.6,
      display_order: 2
    });

    const courseFrA1 = await CourseLevel.create({
      language_id: langFr._id,
      level_name: "A1 Beginner",
      level_type: "standard",
      description: "Learn French from scratch. Master French pronunciation, introduce yourself, and learn basic vocabulary.",
      learning_goals: ["Basic greetings & alphabet", "Count numbers up to 100", "Order food in cafes"],
      price: 119,
      duration_hours: 22,
      instructor_id: inst2._id,
      instructor_hourly_rate: 50,
      status: "published",
      enrolled_count: 1,
      rating: 4.9,
      display_order: 1
    });

    const courseJaN5 = await CourseLevel.create({
      language_id: langJa._id,
      level_name: "N5 Beginner",
      level_type: "standard",
      description: "Master Hiragana, Katakana, and basic Kanji. Start speaking simple Japanese phrases right away.",
      learning_goals: ["Read & write Hiragana/Katakana", "Understand basic grammar structures", "100 common Kanji"],
      price: 129,
      duration_hours: 30,
      instructor_id: inst3._id,
      instructor_hourly_rate: 45,
      status: "published",
      enrolled_count: 1,
      rating: 4.8,
      display_order: 1
    });

    // 6. Seed Enrollments
    console.log("Seeding student enrollments...");
    // Student 1 enrolled in English A1 and French A1
    await Enrollment.create({
      user_id: students[0]._id,
      course_id: courseEnA1._id,
      status: "active",
      progress_percentage: 45,
      payment_status: "completed",
      payment_amount: 99
    });
    await Enrollment.create({
      user_id: students[0]._id,
      course_id: courseFrA1._id,
      status: "active",
      progress_percentage: 10,
      payment_status: "completed",
      payment_amount: 119
    });

    // Student 2 enrolled in Japanese N5
    await Enrollment.create({
      user_id: students[1]._id,
      course_id: courseJaN5._id,
      status: "active",
      progress_percentage: 80,
      payment_status: "completed",
      payment_amount: 129
    });

    // Student 3 enrolled in English A1 (Completed with certificate!)
    await Enrollment.create({
      user_id: students[2]._id,
      course_id: courseEnA1._id,
      status: "completed",
      progress_percentage: 100,
      completion_date: new Date(),
      certificate_issued: true,
      payment_status: "completed",
      payment_amount: 99
    });

    // Student 4 enrolled in English A2
    await Enrollment.create({
      user_id: students[3]._id,
      course_id: courseEnA2._id,
      status: "active",
      progress_percentage: 15,
      payment_status: "completed",
      payment_amount: 149
    });

    // 7. Seed User Points (Leaderboard)
    console.log("Seeding user points leaderboard...");
    const pointsData = [450, 800, 1200, 150, 320];
    for (let i = 0; i < 5; i++) {
      await UserPoints.create({
        user_id: students[i]._id,
        points: pointsData[i],
        total_points_earned: pointsData[i]
      });
    }

    // 8. Seed Badges & User Badges
    console.log("Seeding gamified achievements and badges...");
    const badge1 = await Badge.create({
      name: "First Step",
      description: "Completed your first language lesson module.",
      icon: "🚀",
      points_required: 50
    });

    const badge2 = await Badge.create({
      name: "Streak Master",
      description: "Maintained a 7-day consecutive active learning streak.",
      icon: "🔥",
      points_required: 150
    });

    const badge3 = await Badge.create({
      name: "Course Graduate",
      description: "Successfully graduated a full language level course.",
      icon: "🎓",
      points_required: 300
    });

    // Assign some badges
    await UserBadge.create({ user_id: students[0]._id, badge_id: badge1._id });
    await UserBadge.create({ user_id: students[1]._id, badge_id: badge1._id });
    await UserBadge.create({ user_id: students[1]._id, badge_id: badge2._id });
    await UserBadge.create({ user_id: students[2]._id, badge_id: badge1._id });
    await UserBadge.create({ user_id: students[2]._id, badge_id: badge2._id });
    await UserBadge.create({ user_id: students[2]._id, badge_id: badge3._id });

    // 9. Seed some historical Teaching Sessions
    console.log("Seeding teaching sessions logs...");
    await TeachingSession.create({
      instructor_id: inst1._id,
      student_id: students[0]._id,
      course_level_id: courseEnA1._id,
      session_date: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
      hours_taught: 2,
      hourly_rate: 40,
      amount_earned: 80,
      status: "approved",
      approved_by: "System",
      approved_date: new Date().toISOString()
    });

    await TeachingSession.create({
      instructor_id: inst2._id,
      student_id: students[0]._id,
      course_level_id: courseFrA1._id,
      session_date: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
      hours_taught: 1.5,
      hourly_rate: 50,
      amount_earned: 75,
      status: "pending"
    });

    console.log("\n=======================================================");
    console.log("SEEDED ALL PROJECT DATA SUCCESSFULLY!");
    console.log("-------------------------------------------------------");
    console.log("Admin Credentials:      admin@example.com / password123");
    console.log("Instructor Credentials:  john.doe@example.com / password123");
    console.log("Student Credentials:     student2@example.com / password123 (12 Day Streak)");
    console.log("Student Credentials:     student3@example.com / password123 (20 Day Streak + Graduate)");
    console.log("=======================================================");

    process.exit(0);
  } catch (error) {
    console.error("Database seeding failed:", error);
    process.exit(1);
  }
}

seed();
