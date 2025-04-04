const { Sequelize } = require('sequelize');
const sequelize = require('../config/database');

// Import models
const User = require('./User');
const Update = require('./Update');
const Feedback = require('./Feedback');

// Initialize models
const models = {
  User: User.init(sequelize),
  Update: Update.init(sequelize),
  Feedback: Feedback.init(sequelize),
};

// Run associations if they exist
Object.values(models)
  .filter(model => typeof model.associate === 'function')
  .forEach(model => model.associate(models));

module.exports = {
  sequelize,
  ...models
}; 