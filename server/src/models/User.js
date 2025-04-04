const { Model, DataTypes } = require('sequelize');

class User extends Model {
  static init(sequelize) {
    super.init({
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      role: DataTypes.STRING,
      manager_id: DataTypes.INTEGER
    }, { sequelize });
    return this;
  }

  static associate(models) {
    this.hasMany(models.Update, { foreignKey: 'user_id' });
    this.hasMany(models.Feedback, { foreignKey: 'manager_id' });
  }
}

module.exports = User; 