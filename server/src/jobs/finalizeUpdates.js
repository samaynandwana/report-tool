const { Update } = require('../models');
const { Op } = require('sequelize');
const { endOfWeek } = require('date-fns');

async function finalizeExpiredUpdates() {
  const now = new Date();
  
  try {
    await Update.update(
      { is_finalized: true },
      {
        where: {
          week_end: {
            [Op.lt]: now
          },
          is_finalized: false
        }
      }
    );
  } catch (error) {
    console.error('Error finalizing updates:', error);
  }
}

module.exports = finalizeExpiredUpdates; 