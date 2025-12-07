const app = require('./app');
const connectDB = require('./config/db');

// Connect to Database
connectDB();

module.exports = app;
