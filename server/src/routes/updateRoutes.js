const express = require('express');
const router = express.Router();
const updateController = require('../controllers/updateController');

router.get('/', updateController.getAllUpdates);
router.post('/', updateController.createUpdate);
router.post('/:id/feedback', updateController.submitFeedback);

// Additional useful routes
router.get('/:id', updateController.getUpdateById);
router.put('/:id', updateController.updateUpdate);
router.get('/:id/feedback', updateController.getUpdateFeedback);

module.exports = router; 