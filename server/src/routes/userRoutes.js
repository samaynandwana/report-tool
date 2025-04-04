const express = require('express');
const router = express.Router();
const { User } = require('../models');

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'role'],
      order: [
        ['role', 'ASC'],
        ['name', 'ASC']
      ]
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

router.get('/employees', async (req, res) => {
  try {
    const { manager_id } = req.query;
    const employees = await User.findAll({
      where: {
        manager_id,
        role: 'employee'
      },
      attributes: ['id', 'name', 'email']
    });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
});

module.exports = router; 