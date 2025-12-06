const app = require('./app');
const config = require('./config/env');
const connectDB = require('./config/db');

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
});

// Connect to Database
connectDB().then(() => {
    const server = app.listen(config.port, () => {
        console.log(`App running on port ${config.port} in ${config.env} mode`);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
        console.log('UNHANDLED REJECTION! 💥 Shutting down...');
        console.log(err.name, err.message);
        server.close(() => {
            process.exit(1);
        });
    });
});
