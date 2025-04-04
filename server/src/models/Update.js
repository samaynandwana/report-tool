const { Model, DataTypes } = require('sequelize');

class Update extends Model {
  static init(sequelize) {
    super.init({
      user_id: DataTypes.INTEGER,
      content: DataTypes.TEXT,
      week_start: DataTypes.DATE,
      week_end: DataTypes.DATE,
      is_finalized: DataTypes.BOOLEAN,
      submitted_at: DataTypes.DATE
    }, { sequelize });
    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id' });
    this.hasMany(models.Feedback, { as: 'Feedbacks' });
  }
}

module.exports = Update; 