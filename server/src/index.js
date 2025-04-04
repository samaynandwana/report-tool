require('dotenv').config();
const express = require('express');
const cors = require('cors');
const healthRoutes = require('./routes/healthRoutes');
const updateRoutes = require('./routes/updateRoutes');
const errorHandler = require('./middleware/errorHandler');
const sequelize = require('./config/database');
const models = require('./models');

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
app.use('/api/updates', updateRoutes);

// Error handling
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

app.use(errorHandler);

// Sync database and start server
sequelize.sync().then(() => {
  app.listen(port, host, () => {
    console.log(`Server running at http://${host}:${port}`);
  });
}).catch(err => {
  console.error('Failed to sync database:', err);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  // In production, you might want to exit the process
  // process.exit(1);
}); 