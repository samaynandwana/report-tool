const UpdateService = require('../services/updateService');
const FeedbackService = require('../services/feedbackService');

class UpdateController {
  static async getAllUpdates(req, res, next) {
    try {
      const { userId, role } = req.query; // For filtering by user or role
      const updates = await UpdateService.getAllUpdates({ userId, role });
      res.json(updates);
    } catch (error) {
      next(error);
    }
  }

  static async getUpdateById(req, res, next) {
    try {
      const update = await UpdateService.getUpdateById(req.params.id);
      if (!update) {
        return res.status(404).json({ message: 'Update not found' });
      }
      res.json(update);
    } catch (error) {
      next(error);
    }
  }

  static async createUpdate(req, res, next) {
    try {
      const updateData = {
        user_id: req.body.userId, // Should come from authenticated user
        content: req.body.content,
        week_start: req.body.weekStart,
        week_end: req.body.weekEnd,
      };

      const newUpdate = await UpdateService.createUpdate(updateData);
      res.status(201).json(newUpdate);
    } catch (error) {
      next(error);
    }
  }

  static async updateUpdate(req, res, next) {
    try {
      const updateData = {
        content: req.body.content,
        is_finalized: req.body.isFinalized,
      };

      const updated = await UpdateService.updateUpdate(req.params.id, updateData);
      if (!updated) {
        return res.status(404).json({ message: 'Update not found' });
      }
      res.json(updated);
    } catch (error) {
      next(error);
    }
  }

  static async submitFeedback(req, res, next) {
    try {
      const feedbackData = {
        update_id: req.params.id,
        manager_id: req.body.managerId, // Should come from authenticated user
        rating: req.body.rating,
        comment: req.body.comment,
        feedback_type: req.body.feedbackType,
        is_exceptional: req.body.isExceptional || false,
      };

      const feedback = await FeedbackService.createFeedback(feedbackData);
      res.status(201).json(feedback);
    } catch (error) {
      next(error);
    }
  }

  static async getUpdateFeedback(req, res, next) {
    try {
      const feedback = await FeedbackService.getFeedbackByUpdateId(req.params.id);
      res.json(feedback);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UpdateController; 