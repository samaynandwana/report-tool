const { Feedback, User } = require('../models');

class FeedbackService {
  static async createFeedback(feedbackData) {
    return Feedback.create(feedbackData);
  }

  static async getFeedbackByUpdateId(updateId) {
    return Feedback.findAll({
      where: { update_id: updateId },
      include: [
        {
          model: User,
          as: 'manager',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['created_at', 'DESC']]
    });
  }
}

module.exports = FeedbackService; 