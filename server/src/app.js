const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const AppError = require('./utils/AppError');
const errorHandler = require('./middlewares/errorHandler');
const authRouter = require('./routes/auth.routes');
const fileRouter = require('./routes/file.routes');
const shareRouter = require('./routes/share.routes');

const app = express();

// Security Middleware
app.use(helmet());

// CORS
app.use(cors());

// Compression
app.use(compression());

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/auth', authRouter);
app.use('/files', fileRouter);
app.use('/', shareRouter);




app.get('/', (req, res) => {
    res.status(200).json({ status: 'success', message: 'File Sharing API is running' });
});

// 404 Handler
app.use((req, res, next) => {
    next(new AppError(404, `Can't find ${req.originalUrl} on this server!`));
});

// Global Error Handler
app.use(errorHandler);

module.exports = app;
