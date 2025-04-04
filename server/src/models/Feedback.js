const { Model, DataTypes } = require('sequelize');

class Feedback extends Model {
  static init(sequelize) {
    super.init({
      update_id: DataTypes.INTEGER,
      manager_id: DataTypes.INTEGER,
      rating: DataTypes.INTEGER,
      comment: DataTypes.TEXT,
      feedback_type: DataTypes.STRING,
      is_exceptional: DataTypes.BOOLEAN
    }, { sequelize });
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Update, { foreignKey: 'update_id' });
    this.belongsTo(models.User, { as: 'manager', foreignKey: 'manager_id' });
  }
}

module.exports = Feedback; 