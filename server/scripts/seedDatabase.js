const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Log the configuration being used
console.log('Seeding database with config:', {
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  host: process.env.DB_HOST
});

const { sequelize, User, Update, Feedback } = require('../src/models/index.js');
const { addDays, subDays, startOfWeek, endOfWeek } = require('date-fns');

async function seedDatabase() {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('Database connection established');

    // Sync database (force: true will drop existing tables)
    await sequelize.sync({ force: true });
    console.log('Database synced');

    // Create users
    const users = await User.bulkCreate([
      {
        name: 'John Developer',
        email: 'john@example.com',
        role: 'employee',
        manager_id: null // Will update after creating manager
      },
      {
        name: 'Sarah Engineer',
        email: 'sarah@example.com',
        role: 'employee',
        manager_id: null
      },
      {
        name: 'Jane Manager',
        email: 'jane@example.com',
        role: 'manager'
      },
      {
        name: 'Mike Admin',
        email: 'mike@example.com',
        role: 'admin'
      }
    ]);

    // Update employee manager_ids
    await User.update(
      { manager_id: users[2].id }, // Jane Manager's id
      { where: { role: 'employee' } }
    );

    // Create updates for the past 4 weeks
    const updates = [];
    for (const user of users.filter(u => u.role === 'employee')) {
      for (let i = 0; i < 4; i++) {
        const baseDate = subDays(new Date(), i * 7);
        const weekStart = startOfWeek(baseDate, { weekStartsOn: 1 });
        const weekEnd = endOfWeek(baseDate, { weekStartsOn: 1 });
        
        updates.push({
          user_id: user.id,
          content: generateUpdateContent(i),
          week_start: weekStart,
          week_end: weekEnd,
          is_finalized: i > 0, // Only the current week is not finalized
          submitted_at: i > 0 ? addDays(weekEnd, 1) : null
        });
      }
    }

    const createdUpdates = await Update.bulkCreate(updates);

    // Create feedback for finalized updates
    const feedback = [];
    for (const update of createdUpdates.filter(u => u.is_finalized)) {
      feedback.push({
        update_id: update.id,
        manager_id: users[2].id, // Jane Manager
        rating: Math.floor(Math.random() * 3) + 3, // Random rating between 3-5
        comment: generateFeedbackComment(),
        feedback_type: 'weekly',
        is_exceptional: Math.random() < 0.2 // 20% chance of being exceptional
      });
    }

    await Feedback.bulkCreate(feedback);

    console.log('Sample data created successfully');
    console.log(`Created:
      - ${users.length} users
      - ${updates.length} updates
      - ${feedback.length} feedback entries`);

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await sequelize.close();
  }
}

function generateUpdateContent(weekIndex) {
  const updates = [
    `This week I completed the user authentication system implementation and started working on the API documentation. Made good progress on the frontend dashboard components and fixed several UI bugs reported by the QA team. Planning to start the email notification system next week.`,
    
    `Finished implementing the email notification system and wrote comprehensive tests. Collaborated with the design team on new dashboard wireframes. Started research on performance optimization techniques for the database queries.`,
    
    `Major achievements this week: Optimized database queries resulting in 40% faster load times, completed the new dashboard UI implementation, and helped onboard two new team members. Next week focusing on the analytics module.`,
    
    `Successfully deployed the analytics module to staging. Fixed critical security vulnerabilities identified in the dependency audit. Created documentation for the new features and conducted a knowledge sharing session with the team.`
  ];

  return updates[weekIndex % updates.length];
}

function generateFeedbackComment() {
  const comments = [
    "Great work this week! The documentation is particularly thorough and helpful.",
    "Excellent progress on the technical tasks. Your mentoring of new team members is appreciated.",
    "Strong delivery and good attention to detail. Consider adding more context to your updates.",
    "Impressive work on the performance optimizations. Would love to see you share these learnings with the team.",
    "Good job on meeting all deadlines. Your proactive communication helps keep everyone aligned."
  ];

  return comments[Math.floor(Math.random() * comments.length)];
}

// Run the seed function
seedDatabase().then(() => {
  console.log('Seeding complete');
}).catch(err => {
  console.error('Seeding failed:', err);
}); 