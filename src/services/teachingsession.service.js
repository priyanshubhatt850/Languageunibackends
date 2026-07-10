const BaseService = require('./BaseService');
const TeachingSession = require('../models/TeachingSession');
const InstructorWalletTransaction = require('../models/InstructorWalletTransaction');

class TeachingSessionService extends BaseService {
  constructor() {
    super(TeachingSession);
  }

  async getActiveSession(instructorId) {
    return TeachingSession.findOne({
      instructor_id: instructorId,
      start_time: { $exists: true },
      end_time: null
    }).lean();
  }

  async startClass(data) {
    await TeachingSession.updateMany(
      { instructor_id: data.instructor_id, end_time: null },
      { $set: { end_time: new Date() } }
    );

    return TeachingSession.create({
      ...data,
      start_time: new Date(),
      session_date: new Date().toISOString(),
      hours_taught: 0,
      amount_earned: 0,
      status: 'pending'
    });
  }

  async endClass(id) {
    const session = await TeachingSession.findById(id);
    if (!session) throw new Error('Teaching session not found');
    if (session.end_time) return session;

    const endTime = new Date();
    const startTime = session.start_time || session.createdAt || new Date();
    const elapsedMs = endTime - startTime;
    const hoursWorked = Math.max(elapsedMs / 3600000, 0.01);
    const amount = hoursWorked * (session.hourly_rate || 0);

    session.end_time = endTime;
    session.hours_taught = hoursWorked;
    session.amount_earned = amount;
    await session.save();

    try {
      await InstructorWalletTransaction.create({
        instructor_id: session.instructor_id,
        amount: amount,
        type: 'credit',
        source: 'teaching_session',
        related_entity_id: session._id.toString(),
        description: `Earnings for teaching session on ${new Date(startTime).toLocaleDateString()}`
      });
    } catch (txErr) {
      console.error('Wallet transaction logging failed:', txErr);
    }

    return session;
  }
}

module.exports = new TeachingSessionService();
