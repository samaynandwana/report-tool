const pool = require('../config/database');

class BaseModel {
  constructor(tableName) {
    this.pool = pool;
    this.tableName = tableName;
  }

  async findAll() {
    const { rows } = await this.pool.query(
      `SELECT * FROM ${this.tableName}`
    );
    return rows;
  }

  async findById(id) {
    const { rows } = await this.pool.query(
      `SELECT * FROM ${this.tableName} WHERE id = $1`,
      [id]
    );
    return rows[0];
  }
}

module.exports = BaseModel; 