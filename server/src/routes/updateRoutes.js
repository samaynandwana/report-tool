const express = require('express');
const router = express.Router();
const updateController = require('../controllers/updateController');
const { Update, Feedback, User } = require('../models');

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
router.put('/:id', updateController.updateUpdate);
router.get('/:id/feedback', updateController.getUpdateFeedback);

module.exports = router; 