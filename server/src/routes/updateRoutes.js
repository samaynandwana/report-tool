const express = require('express');
const router = express.Router();
const updateController = require('../controllers/updateController');
const { Update, Feedback, User } = require('../models');
const { Op } = require('sequelize');
const { startOfWeek } = require('date-fns');

router.get('/', async (req, res) => {
  try {
    const { user_id, status } = req.query;
    
    const updates = await Update.findAll({
      where: {
        user_id,
        ...(status === 'draft' ? { is_finalized: false } : 
           status === 'submitted' ? { is_finalized: true } : {})
      },
      include: [{
        model: Feedback,
        as: 'Feedbacks',
        include: [{
          model: User,
          as: 'manager',
          attributes: ['name']
        }]
      }],
      order: [['week_start', 'DESC']]
    });
    
    res.json(updates);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch updates' });
  }
});

router.post('/', async (req, res) => {
  try {
    const update = await Update.create(req.body);
    res.status(201).json(update);
  } catch (error) {
    console.error('Error creating update:', error);
    res.status(500).json({ error: 'Failed to create update' });
  }
});

router.post('/:id/feedback', updateController.submitFeedback);

// Additional useful routes
router.get('/:id', updateController.getUpdateById);
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const update = await Update.findByPk(id);
    
    if (!update) {
      return res.status(404).json({ error: 'Update not found' });
    }

    // Don't allow editing if already finalized
    if (update.is_finalized && !req.body.is_finalized) {
      return res.status(400).json({ error: 'Cannot edit a finalized update' });
    }

    await update.update(req.body);
    res.json(update);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update' });
  }
});
router.get('/:id/feedback', updateController.getUpdateFeedback);

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const update = await Update.findByPk(id);
    
    if (!update) {
      return res.status(404).json({ error: 'Update not found' });
    }

    await update.destroy();
    res.json({ message: 'Update deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete update' });
  }
});

// Add this temporary route to clean up current week updates
router.delete('/cleanup/current-week/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const currentWeekStart = startOfWeek(new Date());
    
    await Update.destroy({
      where: {
        user_id: userId,
        week_start: {
          [Op.gte]: currentWeekStart
        }
      }
    });
    
    res.json({ message: 'Current week updates cleaned up' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to cleanup updates' });
  }
});

module.exports = router; 