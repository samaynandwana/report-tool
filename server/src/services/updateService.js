const { Update, User, Feedback } = require('../models');

class UpdateService {
  static async getAllUpdates({ userId, role }) {
    const query = {
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email', 'role']
        }
      ],
      order: [['created_at', 'DESC']]
    };

    if (userId) {
      query.where = { user_id: userId };
    }

    return Update.findAll(query);
  }

  static async getUpdateById(id) {
    return Update.findByPk(id, {
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email', 'role']
        },
        {
          model: Feedback,
          include: [
            {
              model: User,
              as: 'manager',
              attributes: ['id', 'name', 'email']
            }
          ]
        }
      ]
    });
  }

  static async createUpdate(updateData) {
    return Update.create(updateData);
  }

  static async updateUpdate(id, updateData) {
    const update = await Update.findByPk(id);
    if (!update) return null;

    if (updateData.is_finalized) {
      updateData.submitted_at = new Date();
    }

    return update.update(updateData);
  }
}

module.exports = UpdateService; 