require('dotenv').config();
const express = require('express');
const cors = require('cors');
const healthRoutes = require('./routes/healthRoutes');
const updateRoutes = require('./routes/updateRoutes');
const errorHandler = require('./middleware/errorHandler');
const { sequelize } = require('./models');
const userRoutes = require('./routes/userRoutes');

const app = express();
const port = process.env.PORT || 8000;
const host = process.env.HOST || 'localhost';

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/users', userRoutes);
app.use('/api/updates', updateRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// Initialize database and start server
async function initializeApp() {
  try {
    // Sync database
    await sequelize.sync();
    console.log('Database synced successfully');

    // Start server
    app.listen(port, host, () => {
      console.log(`Server running at http://${host}:${port}`);
    });
  } catch (error) {
    console.error('Failed to initialize app:', error);
    process.exit(1);
  }
}

initializeApp();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  // In production, you might want to exit the process
  // process.exit(1);
}); 