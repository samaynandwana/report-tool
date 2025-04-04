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
    await sequelize.sync({ force: true }); // Careful: this drops existing tables

    // Create users with manager relationships
    const users = await User.bulkCreate([
      {
        name: 'Jane Manager',
        email: 'jane@example.com',
        role: 'manager',
      },
      {
        name: 'Mike Admin',
        email: 'mike@example.com',
        role: 'admin',
      },
      {
        name: 'Sarah Manager',
        email: 'sarah@example.com',
        role: 'manager',
      },
      {
        name: 'John Developer',
        email: 'john@example.com',
        role: 'employee',
        manager_id: 1, // Jane is manager
      },
      {
        name: 'Tom Designer',
        email: 'tom@example.com',
        role: 'employee',
        manager_id: 1, // Jane is manager
      },
      {
        name: 'Alice Engineer',
        email: 'alice@example.com',
        role: 'employee',
        manager_id: 3, // Sarah is manager
      },
      {
        name: 'Bob Developer',
        email: 'bob@example.com',
        role: 'employee',
        manager_id: 3, // Sarah is manager
      }
    ]);

    // Create updates for employees and managers
    for (const user of users.filter(u => u.role === 'employee' || u.role === 'manager')) {
      const updates = [];
      // Create 4 weeks of updates
      for (let i = 0; i < 4; i++) {
        const weekStart = startOfWeek(subDays(new Date(), i * 7));
        const weekEnd = endOfWeek(weekStart);
        
        // Check if this is the current week
        const isCurrentWeek = i === 0;
        
        updates.push({
          user_id: user.id,
          content: generateUpdateContent(i), // This will be empty for current week
          week_start: weekStart,
          week_end: weekEnd,
          is_finalized: !isCurrentWeek,
          submitted_at: !isCurrentWeek ? weekEnd : null
        });
      }
      await Update.bulkCreate(updates);
    }

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

function generateUpdateContent(weekIndex) {
  // Only generate content for past weeks
  if (weekIndex > 0) {
    const updates = [
      `This week I completed the user authentication system implementation and started working on the API documentation. Made good progress on the frontend dashboard components and fixed several UI bugs reported by the QA team. Planning to start the email notification system next week.`,
      
      `Finished implementing the email notification system and wrote comprehensive tests. Collaborated with the design team on new dashboard wireframes. Started research on performance optimization techniques for the database queries.`,
      
      `Major achievements this week: Optimized database queries resulting in 40% faster load times, completed the new dashboard UI implementation, and helped onboard two new team members. Next week focusing on the analytics module.`,
      
      `Successfully deployed the analytics module to staging. Fixed critical security vulnerabilities identified in the dependency audit. Created documentation for the new features and conducted a knowledge sharing session with the team.`
    ];

    return updates[weekIndex % updates.length];
  }
  
  // Return empty string for current week
  return '';
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