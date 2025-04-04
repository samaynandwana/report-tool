const pool = require('../config/database');

const healthController = {
  async check(req, res, next) {
    try {
      const dbResult = await pool.query('SELECT NOW()');
      
      res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        database: {
          connected: true,
          timestamp: dbResult.rows[0].now
        }
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = healthController; 